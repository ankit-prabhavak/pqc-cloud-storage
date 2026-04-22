import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import FormData from 'form-data'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import r2Client from '../config/r2.js'
import File from '../models/File.js'
import Log from '../models/Log.js'
import AuditLog from '../models/AuditLog.js'
import FileVersion from '../models/FileVersion.js'
import User from '../models/User.js'
import { generateFileHash } from '../utils/fileIntegrity.js'
import { calculateSecurityScore } from '../utils/securityScore.js'

const BUCKET = process.env.R2_BUCKET_NAME
const CRYPTO_URL = process.env.CRYPTO_SERVICE_URL

// ─── helper: call crypto service encrypt ─────────────────────────────────────
const callCryptoEncrypt = async (fileBuffer, originalName, encryptionType = 'hybrid') => {
  const form = new FormData()
  form.append('file', fileBuffer, {
    filename: originalName,
    contentType: 'application/octet-stream'
  })
  form.append('encryption_type', encryptionType)

  const response = await axios.post(`${CRYPTO_URL}/encrypt`, form, {
    headers: form.getHeaders(),
    timeout: 60000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  return response.data
  // returns { encrypted_file, aes_key_encrypted, iv, tag, encryption_type, original_size, encrypted_size }
}

// ─── helper: call crypto service decrypt ─────────────────────────────────────
const callCryptoDecrypt = async (encryptedFile, aesKeyEncrypted, iv, tag, encryptionType) => {
  const response = await axios.post(
    `${CRYPTO_URL}/decrypt`,
    {
      encrypted_file: encryptedFile,
      aes_key_encrypted: aesKeyEncrypted,
      iv,
      tag,
      encryption_type: encryptionType
    },
    {
      responseType: 'arraybuffer',  // raw bytes wapas aayenge
      timeout: 60000
    }
  )
  return Buffer.from(response.data)
}

// ─── POST /api/files/upload ───────────────────────────────────────────────────
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }

    const fileBuffer   = req.file.buffer
    const originalName = req.file.originalname
    const mimeType     = req.file.mimetype
    const fileSize     = req.file.size

    // SHA-256 of original file — stored for integrity check later
    const fileHash = generateFileHash(fileBuffer)

    // Encryption type — user preference ya default hybrid
    const encryptionType = req.body.encryptionType || req.user.encryptionPreference || 'hybrid'

    let encrypted_file, aes_key_encrypted, iv, tag, cryptoEncryptionType

    try {
      const cryptoRes = await callCryptoEncrypt(fileBuffer, originalName, encryptionType)
      encrypted_file      = cryptoRes.encrypted_file
      aes_key_encrypted   = cryptoRes.aes_key_encrypted
      iv                  = cryptoRes.iv
      tag                 = cryptoRes.tag
      cryptoEncryptionType = cryptoRes.encryption_type

      console.log(`[CRYPTO] File encrypted — type: ${cryptoEncryptionType}, original: ${cryptoRes.original_size}B, encrypted: ${cryptoRes.encrypted_size}B`)
    } catch (cryptoError) {
      console.error('[CRYPTO] Service unavailable:', cryptoError.message)
      return res.status(503).json({
        message: 'Crypto service unavailable. Please start the Python service on port 8000.',
        hint: 'cd crypto-service && uvicorn main:app --reload --port 8000'
      })
    }
     
    // encrypted bytes R2 mein store karo
const storageKey = `${req.user._id}/${uuidv4()}`
const encryptedBuffer = Buffer.from(encrypted_file, 'base64')

if (process.env.R2_BUCKET_NAME && process.env.R2_BUCKET_NAME !== 'pqc-files-placeholder') {
  await r2Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
    Body: encryptedBuffer,
    ContentType: 'application/octet-stream'
  }))
} else {
  console.log(`[R2 SKIP] R2 not configured — skipping cloud storage`)
}
    // // encrypted bytes R2 mein store karo
    // const storageKey = `${req.user._id}/${uuidv4()}`
    // const encryptedBuffer = Buffer.from(encrypted_file, 'base64')

    // await r2Client.send(new PutObjectCommand({
    //   Bucket: BUCKET,
    //   Key: storageKey,
    //   Body: encryptedBuffer,
    //   ContentType: 'application/octet-stream'
    // }))

    const { downloadLimit, expiresAt, tags } = req.body

    const file = await File.create({
      userId: req.user._id,
      fileName: uuidv4(),
      originalName,
      cloudUrl: storageKey,
      encryptionType: cryptoEncryptionType,
      encryptedAESKey: aes_key_encrypted,
      iv,
      tag,
      fileHash,
      fileSize,
      mimeType,
      downloadLimit: downloadLimit ? parseInt(downloadLimit) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      tags: tags ? JSON.parse(tags) : []
    })

    // Version 1 banao
    await FileVersion.create({
      fileId: file._id,
      userId: req.user._id,
      versionNumber: 1,
      cloudUrl: storageKey,
      encryptedAESKey: aes_key_encrypted,
      iv,
      tag,
      fileHash,
      fileSize,
      encryptionType: cryptoEncryptionType
    })

    // User storage stats update karo
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalFilesUploaded: 1, totalStorageUsed: fileSize }
    })

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'upload',
      ipAddress: req.ip,
      metadata: { originalName, fileSize, encryptionType: cryptoEncryptionType, fileHash }
    })

    const securityScore = calculateSecurityScore(file)

    res.status(201).json({
      message: 'File uploaded and encrypted successfully',
      file: {
        id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        encryptionType: file.encryptionType,
        fileHash,
        securityScore,
        createdAt: file.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/files ───────────────────────────────────────────────────────────
export const getFiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, tag } = req.query
    const query = { userId: req.user._id, isDeleted: false }

    if (search) query.$text = { $search: search }
    if (tag) query.tags = tag

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [files, total] = await Promise.all([
      File.find(query)
        .select('-cloudUrl -encryptedAESKey -iv -tag')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      File.countDocuments(query)
    ])

    // Har file ka security score add karo
    const filesWithScore = files.map(file => ({
      ...file.toObject(),
      securityScore: calculateSecurityScore(file)
    }))

    res.json({
      files: filesWithScore,
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

// ─── GET /api/files/download/:id ─────────────────────────────────────────────
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
      return res.status(403).json({ message: 'Download limit reached' })
    }

    // R2 se encrypted file fetch karo
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl })
    const r2Response = await r2Client.send(command)

    const chunks = []
    for await (const chunk of r2Response.Body) chunks.push(chunk)
    const encryptedBuffer = Buffer.concat(chunks)

    // Crypto service se decrypt karo
    let decryptedBuffer
    try {
      decryptedBuffer = await callCryptoDecrypt(
        encryptedBuffer.toString('base64'),
        file.encryptedAESKey,
        file.iv,
        file.tag,
        file.encryptionType
      )
      console.log(`[CRYPTO] File decrypted — ${file.originalName}, ${decryptedBuffer.length}B`)
    } catch (cryptoError) {
      console.error('[CRYPTO] Decrypt failed:', cryptoError.message)

      // Agar crypto service down hai toh presigned URL fallback
      if (cryptoError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          message: 'Crypto service unavailable for decryption',
          hint: 'cd crypto-service && uvicorn main:app --reload --port 8000'
        })
      }

      return res.status(400).json({
        message: 'Decryption failed — file may have been tampered with'
      })
    }

    file.downloadCount += 1
    await file.save()

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'download',
      ipAddress: req.ip,
      metadata: { originalName: file.originalName, fileSize: file.fileSize }
    })

    // Decrypted file seedha response mein bhejo
    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': decryptedBuffer.length
    })

    res.send(decryptedBuffer)
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/files/:id ────────────────────────────────────────────────────
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

    await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl }))

    file.isDeleted = true
    file.deletedAt = new Date()
    await file.save()

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalStorageUsed: -file.fileSize }
    })

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'delete',
      ipAddress: req.ip,
      metadata: { originalName: file.originalName }
    })

    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/files/share/:id ────────────────────────────────────────────────
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
    const hours = parseInt(req.body.expiresInHours) || 24
    const shareExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000)

    file.isShared = true
    file.shareToken = shareToken
    file.shareExpiresAt = shareExpiresAt
    await file.save()

    await AuditLog.create({
      userId: req.user._id,
      fileId: file._id,
      action: 'share',
      ipAddress: req.ip,
      metadata: { shareToken, expiresAt: shareExpiresAt }
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

// ─── GET /api/files/shared/:token (no auth) ───────────────────────────────────
export const accessSharedFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      shareToken: req.params.token,
      isShared: true,
      isDeleted: false
    })

    if (!file) {
      return res.status(404).json({ message: 'Shared link invalid or file not found' })
    }

    if (new Date() > file.shareExpiresAt) {
      return res.status(410).json({ message: 'Share link has expired' })
    }

    if (file.downloadLimit !== null && file.downloadCount >= file.downloadLimit) {
      return res.status(403).json({ message: 'Download limit reached' })
    }

    // R2 se fetch karo
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: file.cloudUrl })
    const r2Response = await r2Client.send(command)

    const chunks = []
    for await (const chunk of r2Response.Body) chunks.push(chunk)
    const encryptedBuffer = Buffer.concat(chunks)

    // Decrypt karo
    const decryptedBuffer = await callCryptoDecrypt(
      encryptedBuffer.toString('base64'),
      file.encryptedAESKey,
      file.iv,
      file.tag,
      file.encryptionType
    )

    file.downloadCount += 1
    await file.save()

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': decryptedBuffer.length
    })

    res.send(decryptedBuffer)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/files/logs ─────────────────────────────────────────────────────
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
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/files/stats ─────────────────────────────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const [totalFiles, sizeResult, recentLogs] = await Promise.all([
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
      totalStorageUsed: sizeResult[0]?.total || 0,
      recentActivity: recentLogs
    })
  } catch (error) {
    next(error)
  }
}