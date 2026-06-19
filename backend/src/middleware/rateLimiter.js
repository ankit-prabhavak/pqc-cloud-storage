import rateLimit from 'express-rate-limit'

// Auth routes — strict
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

// OTP — very strict
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Too many OTP requests. Wait a minute.' }
})

// Upload — 10 per hour
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Upload limit reached. Try again later.' }
})

// Download — prevent bulk exfiltration
export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: 'Download limit reached. Try again later.' }
})

// General API — applied globally
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Slow down.' }
})