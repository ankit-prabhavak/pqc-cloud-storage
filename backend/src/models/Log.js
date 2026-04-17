import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
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
    enum: ['upload', 'download', 'delete', 'share', 'login', 'logout', 'register', 'otp_sent', 'otp_verified'],
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Log = mongoose.model('Log', logSchema)
export default Log