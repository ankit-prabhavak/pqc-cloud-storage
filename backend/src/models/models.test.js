/**
 * Model schema validation tests.
 * Uses mongoose's built-in validateSync() — no database connection needed.
 */
import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'

// Import models (they register schemas with mongoose)
import User from './User.js'
import File from './File.js'
import FileVersion from './FileVersion.js'
import Log from './Log.js'
import Session from './Session.js'
import AuditLog from './AuditLog.js'

// ── User model ────────────────────────────────────────────────────────────────
describe('User schema', () => {
  const validUserData = () => ({
    name: 'Alice',
    email: 'alice@example.com',
    password: 'securepassword'
  })

  it('validates successfully with all required fields', () => {
    const user = new User(validUserData())
    const err = user.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires name', () => {
    const user = new User({ email: 'a@b.com', password: 'pass1234' })
    const err = user.validateSync()
    expect(err?.errors?.name).toBeDefined()
  })

  it('requires email', () => {
    const user = new User({ name: 'A', password: 'pass1234' })
    const err = user.validateSync()
    expect(err?.errors?.email).toBeDefined()
  })

  it('requires password', () => {
    const user = new User({ name: 'A', email: 'a@b.com' })
    const err = user.validateSync()
    expect(err?.errors?.password).toBeDefined()
  })

  it('defaults isVerified to false', () => {
    const user = new User(validUserData())
    expect(user.isVerified).toBe(false)
  })

  it('defaults isActive to true', () => {
    const user = new User(validUserData())
    expect(user.isActive).toBe(true)
  })

  it('defaults twoFactorEnabled to false', () => {
    const user = new User(validUserData())
    expect(user.twoFactorEnabled).toBe(false)
  })

  it('defaults encryptionPreference to "hybrid"', () => {
    const user = new User(validUserData())
    expect(user.encryptionPreference).toBe('hybrid')
  })

  it('rejects invalid encryptionPreference values', () => {
    const user = new User({ ...validUserData(), encryptionPreference: 'rsa' })
    const err = user.validateSync()
    expect(err?.errors?.encryptionPreference).toBeDefined()
  })

  it('accepts "aes-only" encryptionPreference', () => {
    const user = new User({ ...validUserData(), encryptionPreference: 'aes-only' })
    const err = user.validateSync()
    expect(err?.errors?.encryptionPreference).toBeUndefined()
  })

  it('defaults totalFilesUploaded to 0', () => {
    const user = new User(validUserData())
    expect(user.totalFilesUploaded).toBe(0)
  })

  it('defaults totalStorageUsed to 0', () => {
    const user = new User(validUserData())
    expect(user.totalStorageUsed).toBe(0)
  })

  it('password field has select: false', () => {
    const pathObj = User.schema.path('password')
    expect(pathObj.options.select).toBe(false)
  })

  it('refreshToken field has select: false', () => {
    const pathObj = User.schema.path('refreshToken')
    expect(pathObj.options.select).toBe(false)
  })
})

// ── File model ────────────────────────────────────────────────────────────────
describe('File schema', () => {
  const validFileData = () => ({
    userId: new mongoose.Types.ObjectId(),
    fileName: 'uuid-filename',
    originalName: 'my-document.pdf',
    cloudUrl: 'userid/uuid-key',
    encryptedAESKey: 'encrypted-key-data',
    iv: 'iv-value',
    tag: 'gcm-tag',
    fileSize: 1024
  })

  it('validates successfully with all required fields', () => {
    const file = new File(validFileData())
    const err = file.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires userId', () => {
    const data = validFileData()
    delete data.userId
    const file = new File(data)
    const err = file.validateSync()
    expect(err?.errors?.userId).toBeDefined()
  })

  it('requires fileName', () => {
    const data = validFileData()
    delete data.fileName
    const file = new File(data)
    const err = file.validateSync()
    expect(err?.errors?.fileName).toBeDefined()
  })

  it('requires originalName', () => {
    const data = validFileData()
    delete data.originalName
    const file = new File(data)
    const err = file.validateSync()
    expect(err?.errors?.originalName).toBeDefined()
  })

  it('requires cloudUrl', () => {
    const data = validFileData()
    delete data.cloudUrl
    const file = new File(data)
    const err = file.validateSync()
    expect(err?.errors?.cloudUrl).toBeDefined()
  })

  it('requires fileSize', () => {
    const data = validFileData()
    delete data.fileSize
    const file = new File(data)
    const err = file.validateSync()
    expect(err?.errors?.fileSize).toBeDefined()
  })

  it('defaults encryptionType to "hybrid"', () => {
    const file = new File(validFileData())
    expect(file.encryptionType).toBe('hybrid')
  })

  it('rejects invalid encryptionType', () => {
    const file = new File({ ...validFileData(), encryptionType: 'rsa' })
    const err = file.validateSync()
    expect(err?.errors?.encryptionType).toBeDefined()
  })

  it('defaults isDeleted to false', () => {
    const file = new File(validFileData())
    expect(file.isDeleted).toBe(false)
  })

  it('defaults isShared to false', () => {
    const file = new File(validFileData())
    expect(file.isShared).toBe(false)
  })

  it('defaults downloadCount to 0', () => {
    const file = new File(validFileData())
    expect(file.downloadCount).toBe(0)
  })

  it('defaults mimeType to "application/octet-stream"', () => {
    const file = new File(validFileData())
    expect(file.mimeType).toBe('application/octet-stream')
  })
})

// ── FileVersion model ─────────────────────────────────────────────────────────
describe('FileVersion schema', () => {
  const validVersionData = () => ({
    fileId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    versionNumber: 1,
    cloudUrl: 'some/key',
    encryptedAESKey: 'enc-key',
    iv: 'iv-val',
    tag: 'tag-val',
    fileHash: 'sha256hash',
    fileSize: 512
  })

  it('validates successfully with all required fields', () => {
    const ver = new FileVersion(validVersionData())
    const err = ver.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires fileId', () => {
    const data = validVersionData()
    delete data.fileId
    const ver = new FileVersion(data)
    const err = ver.validateSync()
    expect(err?.errors?.fileId).toBeDefined()
  })

  it('requires versionNumber', () => {
    const data = validVersionData()
    delete data.versionNumber
    const ver = new FileVersion(data)
    const err = ver.validateSync()
    expect(err?.errors?.versionNumber).toBeDefined()
  })

  it('requires fileHash', () => {
    const data = validVersionData()
    delete data.fileHash
    const ver = new FileVersion(data)
    const err = ver.validateSync()
    expect(err?.errors?.fileHash).toBeDefined()
  })

  it('defaults encryptionType to "hybrid"', () => {
    const ver = new FileVersion(validVersionData())
    expect(ver.encryptionType).toBe('hybrid')
  })

  it('defaults keyRotated to false', () => {
    const ver = new FileVersion(validVersionData())
    expect(ver.keyRotated).toBe(false)
  })
})

// ── Log model ─────────────────────────────────────────────────────────────────
describe('Log schema', () => {
  const validLogData = () => ({
    userId: new mongoose.Types.ObjectId(),
    action: 'login'
  })

  it('validates successfully with required fields', () => {
    const log = new Log(validLogData())
    const err = log.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires userId', () => {
    const log = new Log({ action: 'login' })
    const err = log.validateSync()
    expect(err?.errors?.userId).toBeDefined()
  })

  it('requires action', () => {
    const log = new Log({ userId: new mongoose.Types.ObjectId() })
    const err = log.validateSync()
    expect(err?.errors?.action).toBeDefined()
  })

  it('rejects an invalid action value', () => {
    const log = new Log({ userId: new mongoose.Types.ObjectId(), action: 'invalid_action' })
    const err = log.validateSync()
    expect(err?.errors?.action).toBeDefined()
  })

  it('accepts all valid action values', () => {
    const validActions = ['upload', 'download', 'delete', 'share', 'login', 'logout', 'register', 'otp_sent', 'otp_verified']
    for (const action of validActions) {
      const log = new Log({ userId: new mongoose.Types.ObjectId(), action })
      const err = log.validateSync()
      expect(err?.errors?.action, `action "${action}" should be valid`).toBeUndefined()
    }
  })

  it('timestamp defaults to a Date', () => {
    const log = new Log(validLogData())
    expect(log.timestamp).toBeInstanceOf(Date)
  })
})

// ── Session model ─────────────────────────────────────────────────────────────
describe('Session schema', () => {
  const validSessionData = () => ({
    userId: new mongoose.Types.ObjectId(),
    refreshToken: 'some-refresh-token',
    expiresAt: new Date(Date.now() + 86400000)
  })

  it('validates successfully with required fields', () => {
    const session = new Session(validSessionData())
    const err = session.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires userId', () => {
    const data = validSessionData()
    delete data.userId
    const session = new Session(data)
    const err = session.validateSync()
    expect(err?.errors?.userId).toBeDefined()
  })

  it('requires refreshToken', () => {
    const data = validSessionData()
    delete data.refreshToken
    const session = new Session(data)
    const err = session.validateSync()
    expect(err?.errors?.refreshToken).toBeDefined()
  })

  it('requires expiresAt', () => {
    const data = validSessionData()
    delete data.expiresAt
    const session = new Session(data)
    const err = session.validateSync()
    expect(err?.errors?.expiresAt).toBeDefined()
  })

  it('defaults isActive to true', () => {
    const session = new Session(validSessionData())
    expect(session.isActive).toBe(true)
  })
})

// ── AuditLog model ────────────────────────────────────────────────────────────
describe('AuditLog schema', () => {
  const validAuditData = () => ({
    userId: new mongoose.Types.ObjectId(),
    action: 'upload'
  })

  it('validates successfully with required fields', () => {
    const log = new AuditLog(validAuditData())
    const err = log.validateSync()
    expect(err).toBeUndefined()
  })

  it('requires userId', () => {
    const log = new AuditLog({ action: 'upload' })
    const err = log.validateSync()
    expect(err?.errors?.userId).toBeDefined()
  })

  it('requires action', () => {
    const log = new AuditLog({ userId: new mongoose.Types.ObjectId() })
    const err = log.validateSync()
    expect(err?.errors?.action).toBeDefined()
  })

  it('rejects an action not in the enum', () => {
    const log = new AuditLog({ userId: new mongoose.Types.ObjectId(), action: 'NOT_VALID' })
    const err = log.validateSync()
    expect(err?.errors?.action).toBeDefined()
  })

  it('accepts all valid action enum values', () => {
    const validActions = [
      'upload', 'download', 'delete', 'share', 'key_rotation',
      'integrity_check', 'login', 'logout', 'register',
      'otp_verified', 'session_revoked', 'suspicious_login',
      'version_created', 'version_restored', '2fa_enabled',
      '2fa_disabled', '2fa_verified'
    ]
    for (const action of validActions) {
      const log = new AuditLog({ userId: new mongoose.Types.ObjectId(), action })
      const err = log.validateSync()
      expect(err?.errors?.action, `action "${action}" should be valid`).toBeUndefined()
    }
  })

  it('defaults previousHash to "0"', () => {
    const log = new AuditLog(validAuditData())
    expect(log.previousHash).toBe('0')
  })

  it('defaults metadata to empty object', () => {
    const log = new AuditLog(validAuditData())
    expect(log.metadata).toEqual({})
  })

  it('timestamp defaults to a Date', () => {
    const log = new AuditLog(validAuditData())
    expect(log.timestamp).toBeInstanceOf(Date)
  })

  it('fileId defaults to null', () => {
    const log = new AuditLog(validAuditData())
    expect(log.fileId).toBeNull()
  })
})