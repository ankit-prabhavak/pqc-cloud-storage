import express from 'express'
import protect from '../middleware/auth.js'
import {
  getSessions,
  revokeSession,
  revokeAllSessions,
  getFileSecurityScore,
  getAllSecurityScores,
  checkFileIntegrity,
  getAuditTrail,
  verifyAuditChain,
  getFileVersions,
  getSecurityDashboard
} from '../controllers/securityController.js'

const router = express.Router()

router.use(protect)

router.get('/dashboard', getSecurityDashboard)
router.get('/sessions', getSessions)
router.delete('/sessions/all', revokeAllSessions)
router.delete('/sessions/:sessionId', revokeSession)
router.get('/score', getAllSecurityScores)
router.get('/score/:fileId', getFileSecurityScore)
router.post('/integrity/:fileId', checkFileIntegrity)
router.get('/audit', getAuditTrail)
router.get('/audit/verify', verifyAuditChain)
router.get('/versions/:fileId', getFileVersions)

export default router