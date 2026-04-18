import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // max 100requests per window
  message: { message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
})

export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 3,
  message: { message: 'Too many OTP requests, please wait a minute' }
})

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 50,
  message: { message: 'Upload limit reached, try again later' }
})