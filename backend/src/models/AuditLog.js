import mongoose from 'mongoose'
import crypto from 'crypto'

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  action: {
    type: String,
    enum: [
      'upload', 'download', 'delete', 'share', 'key_rotation',
      'integrity_check', 'login', 'logout', 'register',
      'otp_verified', 'session_revoked', 'suspicious_login',
      'version_created', 'version_restored', '2fa_enabled',
      '2fa_disabled', '2fa_verified'
    ],
    required: true
  },
  ipAddress: String,
  userAgent: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Cryptographic chain — each log entry contains hash of previous entry
  previousHash: {
    type: String,
    default: '0'
  },
  entryHash: {
    type: String  // SHA-256 of this entry's data
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Auto-generate cryptographic hash before saving
auditLogSchema.pre('save', async function (next) {
  if (!this.entryHash) {
    const data = `${this.userId}${this.action}${this.timestamp}${this.previousHash}${JSON.stringify(this.metadata)}`
    this.entryHash = crypto.createHash('sha256').update(data).digest('hex')
  }
  next()
})

const AuditLog = mongoose.model('AuditLog', auditLogSchema)
export default AuditLog