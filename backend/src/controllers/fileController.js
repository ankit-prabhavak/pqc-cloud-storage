import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import r2Client from '../config/r2.js'
import File from '../models/File.js'
import Log from '../models/Log.js'

const BUCKET = process.env.R2_BUCKET_NAME
const CRYPTO_URL = process.env.CRYPTO_SERVICE_URL

// POST /api/files/upload
import { generateFileHash } from '../utils/fileIntegrity.js'
import FileVersion from '../models/FileVersion.js'
import AuditLog from '../models/AuditLog.js'

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }

    const fileBuffer = req.file.buffer
    const originalName = req.file.originalname
    const mimeType = req.file.mimetype
    const fileSize = req.file.size

    // SHA-256 hash of original file BEFORE encryption
    const fileHash = generateFileHash(fileBuffer)

    let encryptedBuffer, encryptedAESKey, iv, tag

    try {
      const cryptoResponse = await axios.post(
        `${CRYPTO_URL}/encrypt`,
        { file: fileBuffer.toString('base64') },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      )
      encryptedBuffer = Buffer.from(cryptoResponse.data.encrypted_file, 'base64')
      encryptedAESKey = cryptoResponse.data.encrypted_key
      iv = cryptoResponse.data.iv
      tag = cryptoResponse.data.tag
    } catch {
      encryptedBuffer = fileBuffer
      encryptedAESKey = 'mock-key-phase1'
      iv = 'mock-iv-phase1'
      tag = 'mock-tag-phase1'
    }

    const storageKey = `${req.user._id}/${uuidv4()}`

    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
      Body: encryptedBuffer,
      ContentType: 'application/octet-stream'
    }))

    const { downloadLimit, expiresAt, tags } = req.body

    const file = await File.create({
      userId: req.user._id,
      fileName: uuidv4(),
      originalName,
      cloudUrl: storageKey,
      encryptedAESKey,
      iv,
      tag,
      fileHash,          // ← new
      fileSize,
      mimeType,
      downloadLimit: downloadLimit ? parseInt(downloadLimit) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      tags: tags ? JSON.parse(tags) : []
    })

    // Version 1 create karo
    await FileVersion.create({
      fileId: file._id,
      userId: req.user._id,
      versionNumber: 1,
      cloudUrl: storageKey,
      encryptedAESKey,
      iv,
      tag,
      fileHash,
      fileSize,
      encryptionType: file.encryptionType
    })

    // Update user storage stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalFilesUploaded: 1,
        totalStorageUsed: fileSize
      }
    })

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'upload',
      ipAddress: req.ip,
      metadata: {
        fileName: originalName,
        fileSize,
        encryptionType: file.encryptionType,
        fileHash
      }
    })

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        fileHash,
        encryptionType: file.encryptionType,
        securityScore: calculateSecurityScore(file),
        createdAt: file.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}
// GET /api/files
export const getFiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, tag } = req.query

    const query = { userId: req.user._id, isDeleted: false }

    if (search) {
      query.$text = { $search: search }
    }

    if (tag) {
      query.tags = tag
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [files, total] = await Promise.all([
      File.find(query)
        .select('-cloudUrl -encryptedAESKey -iv -tag')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      File.countDocuments(query)
    ])

    res.json({
      files,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/files/download/:id
export const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (file.downloadLimit !== null && file.downloadCount >= file.downloadLimit) {
      return res.status(403).json({ message: 'Download limit reached. File is no longer accessible.' })
    }

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl })
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 })

    file.downloadCount += 1
    await file.save()

    await Log.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'download',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      url: presignedUrl,
      fileName: file.originalName,
      mimeType: file.mimeType
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/files/:id  (soft delete)
export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Soft delete — R2 se bhi hatao
    await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl }))

    file.isDeleted = true
    file.deletedAt = new Date()
    await file.save()

    await Log.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'delete',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// POST /api/files/share/:id
export const shareFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const shareToken = uuidv4()
    const shareExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    file.isShared = true
    file.shareToken = shareToken
    file.shareExpiresAt = shareExpiresAt
    await file.save()

    await Log.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'share',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      message: 'Share link generated',
      shareUrl: `${process.env.CLIENT_URL}/share/${shareToken}`,
      expiresAt: shareExpiresAt
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/files/shared/:token  (no auth needed)
export const accessSharedFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      shareToken: req.params.token,
      isShared: true,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'Shared file not found or link is invalid' })
    }

    if (new Date() > file.shareExpiresAt) {
      return res.status(410).json({ message: 'Share link has expired' })
    }

    if (file.downloadLimit !== null && file.downloadCount >= file.downloadLimit) {
      return res.status(403).json({ message: 'Download limit reached' })
    }

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl })
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 })

    file.downloadCount += 1
    await file.save()

    res.json({
      url: presignedUrl,
      fileName: file.originalName,
      mimeType: file.mimeType
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/files/logs
export const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [logs, total] = await Promise.all([
      Log.find({ userId: req.user._id })
        .populate('fileId', 'originalName')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Log.countDocuments({ userId: req.user._id })
    ])

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/files/stats
export const getStats = async (req, res, next) => {
  try {
    const [totalFiles, totalSize, recentLogs] = await Promise.all([
      File.countDocuments({ userId: req.user._id, isDeleted: false }),
      File.aggregate([
        { $match: { userId: req.user._id, isDeleted: false } },
        { $group: { _id: null, total: { $sum: '$fileSize' } } }
      ]),
      Log.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(5)
        .populate('fileId', 'originalName')
    ])

    res.json({
      totalFiles,
      totalStorageUsed: totalSize[0]?.total || 0,
      recentActivity: recentLogs
    })
  } catch (error) {
    next(error)
  }
}