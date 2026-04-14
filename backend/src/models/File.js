import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  cloudUrl: {
    type: String,
    required: true
  },
  encryptionType: {
    type: String,
    enum: ['aes-only', 'hybrid'],
    default: 'hybrid'
  },
  encryptedAESKey: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/octet-stream'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  downloadLimit: {
    type: Number,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true
  }
}, { timestamps: true })

fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const File = mongoose.model('File', fileSchema)
export default File