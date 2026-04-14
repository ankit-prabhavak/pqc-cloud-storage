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
    required: true
  },
  action: {
    type: String,
    enum: ['upload', 'download', 'delete'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Log = mongoose.model('Log', logSchema)
export default Log