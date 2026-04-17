import express from 'express'
import multer from 'multer'
import protect from '../middleware/auth.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  shareFile,
  accessSharedFile,
  getLogs,
  getStats
} from '../controllers/fileController.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
})

// Public route — no auth
router.get('/shared/:token', accessSharedFile)

// All routes below require login
router.use(protect)

router.get('/stats', getStats)
router.get('/logs', getLogs)
router.post('/upload', uploadLimiter, upload.single('file'), uploadFile)
router.get('/', getFiles)
router.get('/download/:id', downloadFile)
router.delete('/:id', deleteFile)
router.post('/share/:id', shareFile)

export default router