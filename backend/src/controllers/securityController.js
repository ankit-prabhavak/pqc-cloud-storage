import crypto from 'crypto'
import Session from '../models/Session.js'
import File from '../models/File.js'
import FileVersion from '../models/FileVersion.js'
import AuditLog from '../models/AuditLog.js'
import User from '../models/User.js'
import { calculateSecurityScore } from '../utils/securityScore.js'
import { generateFileHash } from '../utils/fileIntegrity.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import r2Client from '../config/r2.js'

const BUCKET = process.env.R2_BUCKET_NAME

// GET /api/security/sessions — all active sessions
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ lastUsed: -1 })

    res.json({ sessions })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/security/sessions/:sessionId — revoke a session
export const revokeSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    session.isActive = false
    await session.save()

    await AuditLog.create({
      userId: req.user._id,
      action: 'session_revoked',
      ipAddress: req.ip,
      metadata: { revokedSessionId: session._id, deviceInfo: session.deviceInfo }
    })

    res.json({ message: 'Session revoked successfully' })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/security/sessions — revoke all sessions except current
export const revokeAllSessions = async (req, res, next) => {
  try {
    const currentToken = req.cookies?.refreshToken

    await Session.updateMany(
      { userId: req.user._id, refreshToken: { $ne: currentToken } },
      { isActive: false }
    )

    await AuditLog.create({
      userId: req.user._id,
      action: 'session_revoked',
      ipAddress: req.ip,
      metadata: { revokedAll: true }
    })

    res.json({ message: 'All other sessions revoked' })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/score/:fileId — quantum security score
export const getFileSecurityScore = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      userId: req.user._id,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const result = calculateSecurityScore(file)

    res.json({
      fileId: file._id,
      fileName: file.originalName,
      ...result,
      encryptionType: file.encryptionType,
      algorithm: file.encryptionType === 'hybrid'
        ? 'AES-256-GCM + ML-KEM (CRYSTALS-Kyber)'
        : 'AES-256-GCM only'
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/score — scores for all files
export const getAllSecurityScores = async (req, res, next) => {
  try {
    const files = await File.find({ userId: req.user._id, isDeleted: false })

    const scores = files.map(file => ({
      fileId: file._id,
      fileName: file.originalName,
      ...calculateSecurityScore(file)
    }))

    const avgScore = scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0

    res.json({ scores, averageScore: avgScore, totalFiles: scores.length })
  } catch (error) {
    next(error)
  }
}

// POST /api/security/integrity/:fileId — verify file not tampered
export const checkFileIntegrity = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      userId: req.user._id,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (!file.fileHash) {
      return res.status(400).json({ message: 'No integrity hash stored for this file' })
    }

    // Fetch encrypted file from R2
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl })
    const response = await r2Client.send(command)

    const chunks = []
    for await (const chunk of response.Body) {
      chunks.push(chunk)
    }
    const fileBuffer = Buffer.concat(chunks)

    // Hash the encrypted blob and compare
    const currentHash = generateFileHash(fileBuffer)
    const isIntact = currentHash === file.fileHash

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'integrity_check',
      ipAddress: req.ip,
      metadata: { isIntact, storedHash: file.fileHash, currentHash }
    })

    res.json({
      fileId: file._id,
      fileName: file.originalName,
      isIntact,
      message: isIntact
        ? 'File integrity verified — no tampering detected'
        : '⚠️ File hash mismatch — possible tampering detected',
      storedHash: file.fileHash,
      currentHash
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/audit — cryptographic audit trail
export const getAuditTrail = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = { userId: req.user._id }
    if (action) query.action = action

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('fileId', 'originalName')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query)
    ])

    res.json({
      logs,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/audit/verify — verify audit chain not tampered
export const verifyAuditChain = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({ userId: req.user._id }).sort({ timestamp: 1 })

    let isChainValid = true
    const brokenAt = []

    for (const log of logs) {
      const data = `${log.userId}${log.action}${log.timestamp}${log.previousHash}${JSON.stringify(log.metadata)}`
      const expectedHash = crypto.createHash('sha256').update(data).digest('hex')

      if (log.entryHash !== expectedHash) {
        isChainValid = false
        brokenAt.push({ logId: log._id, timestamp: log.timestamp, action: log.action })
      }
    }

    res.json({
      isChainValid,
      totalEntries: logs.length,
      message: isChainValid
        ? 'Audit chain is intact — no tampering detected'
        : '⚠️ Audit chain compromised',
      brokenAt: brokenAt.length ? brokenAt : undefined
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/versions/:fileId — file version history
export const getFileVersions = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      userId: req.user._id
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const versions = await FileVersion.find({ fileId: file._id })
      .sort({ versionNumber: -1 })

    res.json({ fileId: file._id, fileName: file.originalName, versions })
  } catch (error) {
    next(error)
  }
}

// GET /api/security/dashboard — security overview
export const getSecurityDashboard = async (req, res, next) => {
  try {
    const [
      files,
      totalSessions,
      recentAudit,
      user
    ] = await Promise.all([
      File.find({ userId: req.user._id, isDeleted: false }),
      Session.countDocuments({ userId: req.user._id, isActive: true }),
      AuditLog.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(5),
      User.findById(req.user._id)
    ])

    const scores = files.map(f => calculateSecurityScore(f).score)
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    const hybridCount = files.filter(f => f.encryptionType === 'hybrid').length
    const aesOnlyCount = files.filter(f => f.encryptionType === 'aes-only').length

    res.json({
      overview: {
        averageSecurityScore: avgScore,
        totalFiles: files.length,
        quantumSafeFiles: hybridCount,
        classicalOnlyFiles: aesOnlyCount,
        activeSessions: totalSessions,
        twoFactorEnabled: user.twoFactorEnabled,
        encryptionPreference: user.encryptionPreference
      },
      pqcStatus: {
        algorithm: 'ML-KEM-768 (CRYSTALS-Kyber)',
        nistStandard: 'FIPS 203 (2024)',
        keySize: '1184 bytes (public), 2400 bytes (private)',
        securityLevel: 'Category 3 — 192-bit equivalent',
        quantumResistant: true
      },
      recentActivity: recentAudit
    })
  } catch (error) {
    next(error)
  }
}