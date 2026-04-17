import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Log from '../models/Log.js'
import generateOTP from '../utils/generateOTP.js'
import { sendOTPEmail } from '../utils/sendEmail.js'
import { generateAccessToken, generateRefreshToken, setCookies, clearCookies } from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const { otp, expiresAt } = generateOTP()
    const hashedOTP = await bcrypt.hash(otp, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: { code: hashedOTP, expiresAt, attempts: 0 }
    })

    await sendOTPEmail(email, name, otp)

    await Log.create({
      userId: user._id,
      action: 'register',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(201).json({
      message: 'Registration successful. OTP sent to your email.',
      userId: user._id
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body

    if (!userId || !otp) {
      return res.status(400).json({ message: 'userId and OTP are required' })
    }

    const user = await User.findById(userId).select('+otp.code +otp.expiresAt +otp.attempts')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.otp.attempts >= 5) {
      return res.status(429).json({ message: 'Too many wrong attempts. Register again.' })
    }

    if (!user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' })
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' })
    }

    const isMatch = await bcrypt.compare(otp, user.otp.code)

    if (!isMatch) {
      user.otp.attempts += 1
      await user.save()
      return res.status(400).json({ message: `Wrong OTP. ${5 - user.otp.attempts} attempts left.` })
    }

    // OTP correct — verify user and clear OTP
    user.isVerified = true
    user.otp = { code: null, expiresAt: null, attempts: 0 }
    
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()

    const accessToken = generateAccessToken(user._id)
    setCookies(res, accessToken, refreshToken)

    await Log.create({
      userId: user._id,
      action: 'otp_verified',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      message: 'Email verified successfully',
      accessToken,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/resend-otp
export const resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    const { otp, expiresAt } = generateOTP()
    const hashedOTP = await bcrypt.hash(otp, 10)

    user.otp = { code: hashedOTP, expiresAt, attempts: 0 }
    await user.save()

    await sendOTPEmail(user.email, user.name, otp)

    await Log.create({
      userId: user._id,
      action: 'otp_sent',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({ message: 'New OTP sent to your email' })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password +refreshToken')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified. Please verify your OTP.',
        userId: user._id
      })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact support.' })
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save()

    setCookies(res, accessToken, refreshToken)

    await Log.create({
      userId: user._id,
      action: 'login',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      message: 'Login successful',
      accessToken,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken

    if (!token) {
      return res.status(401).json({ message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    user.refreshToken = newRefreshToken
    await user.save()

    setCookies(res, newAccessToken, newRefreshToken)

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      user.refreshToken = null
      await user.save()
    }

    clearCookies(res)

    await Log.create({
      userId: req.user._id,
      action: 'logout',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, isVerified: req.user.isVerified }
  })
}

// PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    user.password = await bcrypt.hash(newPassword, 12)
    user.passwordChangedAt = new Date()
    user.refreshToken = null
    await user.save()

    clearCookies(res)

    res.json({ message: 'Password changed successfully. Please login again.' })
  } catch (error) {
    next(error)
  }
}