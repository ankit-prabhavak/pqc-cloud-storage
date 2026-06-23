import express from 'express'
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword
} from '../controllers/authController.js'
import protect from '../middleware/auth.js'
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js'
import { saveMlkemPublicKey } from '../controllers/authController.js'
import { saveEncryptedPrivateKey, getEncryptedPrivateKey } from '../controllers/authController.js'



const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/verify-otp', otpLimiter, verifyOTP)
router.post('/resend-otp', otpLimiter, resendOTP)
router.post('/login', authLimiter, login)
router.post('/refresh', refreshToken)
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/change-password', protect, changePassword)
router.post('/mlkem-pubkey', protect, saveMlkemPublicKey)
router.post('/mlkem-privkey', protect, saveEncryptedPrivateKey)      // ADD
router.get('/mlkem-privkey', protect, getEncryptedPrivateKey)        // ADD    

export default router