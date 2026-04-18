import mongoose from 'mongoose'

const fileVersionSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  cloudUrl: {
    type: String,
    required: true
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
  fileHash: {
    type: String,
    required: true  // SHA-256 hash of original file
  },
  fileSize: {
    type: Number,
    required: true
  },
  encryptionType: {
    type: String,
    enum: ['aes-only', 'hybrid'],
    default: 'hybrid'
  },
  keyRotated: {
    type: Boolean,
    default: false  // true if this version has a rotated key
  }
}, { timestamps: true })

const FileVersion = mongoose.model('FileVersion', fileVersionSchema)
export default FileVersion