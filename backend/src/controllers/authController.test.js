import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock all external dependencies ────────────────────────────────────────────

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}))

vi.mock('../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn()
  }
}))

vi.mock('../models/Log.js', () => ({
  default: {
    create: vi.fn().mockResolvedValue({})
  }
}))

vi.mock('../utils/generateOTP.js', () => ({
  default: vi.fn()
}))

vi.mock('../utils/sendEmail.js', () => ({
  sendOTPEmail: vi.fn()
}))

vi.mock('../utils/generateToken.js', () => ({
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
  setCookies: vi.fn(),
  clearCookies: vi.fn()
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}))

// ── Import under test ─────────────────────────────────────────────────────────
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Log from '../models/Log.js'
import generateOTP from '../utils/generateOTP.js'
import { generateAccessToken, generateRefreshToken, setCookies, clearCookies } from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'

import {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword
} from './authController.js'

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeRes = () => {
  const res = {
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this },
    json(body)   { this._body = body; return this }
  }
  return res
}

const makeReq = (overrides = {}) => ({
  body: {},
  ip: '127.0.0.1',
  headers: { 'user-agent': 'test-agent' },
  cookies: {},
  user: null,
  ...overrides
})

describe('register', () => {
  let req, res, next

  beforeEach(() => {
    req  = makeReq({ body: { name: 'Alice', email: 'alice@example.com', password: 'password123' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()

    generateOTP.mockReturnValue({ otp: '123456', expiresAt: new Date(Date.now() + 600000) })
    bcrypt.hash.mockResolvedValue('hashed-value')
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({ _id: 'new-user-id', name: 'Alice', email: 'alice@example.com' })
    Log.create.mockResolvedValue({})
    process.env.NODE_ENV = 'test'
  })

  it('returns 400 when name is missing', async () => {
    req.body = { email: 'alice@example.com', password: 'password123' }
    await register(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('All fields are required')
  })

  it('returns 400 when email is missing', async () => {
    req.body = { name: 'Alice', password: 'password123' }
    await register(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('All fields are required')
  })

  it('returns 400 when password is missing', async () => {
    req.body = { name: 'Alice', email: 'alice@example.com' }
    await register(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('All fields are required')
  })

  it('returns 400 when password is shorter than 8 characters', async () => {
    req.body.password = 'short'
    await register(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Password must be at least 8 characters')
  })

  it('returns 400 when email is already registered', async () => {
    User.findOne.mockResolvedValue({ email: 'alice@example.com' })
    await register(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Email already registered')
  })

  it('returns 201 on successful registration', async () => {
    await register(req, res, next)
    expect(res._status).toBe(201)
    expect(res._body.message).toContain('Registration successful')
    expect(res._body.userId).toBe('new-user-id')
  })

  it('hashes password with bcrypt salt factor 12', async () => {
    await register(req, res, next)
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)
  })

  it('creates a Log entry with action "register"', async () => {
    await register(req, res, next)
    expect(Log.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'register' })
    )
  })

  it('calls next(error) on unexpected DB failure', async () => {
    User.findOne.mockRejectedValue(new Error('DB down'))
    await register(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('accepts password exactly 8 characters long', async () => {
    req.body.password = 'exactly8'
    await register(req, res, next)
    expect(res._status).toBe(201)
  })
})

describe('verifyOTP', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  const mockUser = (overrides = {}) => ({
    _id: 'user-id-1',
    name: 'Alice',
    email: 'alice@example.com',
    otp: {
      code: 'hashed-otp',
      expiresAt: new Date(Date.now() + 600000),
      attempts: 0
    },
    isVerified: false,
    refreshToken: null,
    save: saveMock,
    ...overrides
  })

  beforeEach(() => {
    req  = makeReq({ body: { userId: 'user-id-1', otp: '123456' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    generateAccessToken.mockReturnValue('access-token')
    generateRefreshToken.mockReturnValue('refresh-token')
  })

  it('returns 400 when userId is missing', async () => {
    req.body = { otp: '123456' }
    await verifyOTP(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('userId and OTP are required')
  })

  it('returns 400 when otp is missing', async () => {
    req.body = { userId: 'user-id-1' }
    await verifyOTP(req, res, next)
    expect(res._status).toBe(400)
  })

  it('returns 404 when user is not found', async () => {
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(null) })
    await verifyOTP(req, res, next)
    expect(res._status).toBe(404)
    expect(res._body.message).toBe('User not found')
  })

  it('returns 429 when OTP attempts >= 5', async () => {
    const user = mockUser({ otp: { code: 'h', expiresAt: new Date(Date.now() + 10000), attempts: 5 } })
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await verifyOTP(req, res, next)
    expect(res._status).toBe(429)
    expect(res._body.message).toContain('Too many wrong attempts')
  })

  it('returns 400 when OTP code is null', async () => {
    const user = mockUser({ otp: { code: null, expiresAt: new Date(Date.now() + 10000), attempts: 0 } })
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await verifyOTP(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toContain('No OTP found')
  })

  it('returns 400 when OTP is expired', async () => {
    const user = mockUser({ otp: { code: 'hashed', expiresAt: new Date(Date.now() - 1000), attempts: 0 } })
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await verifyOTP(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toContain('OTP expired')
  })

  it('returns 400 and increments attempts on wrong OTP', async () => {
    const user = mockUser()
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(false)
    await verifyOTP(req, res, next)
    expect(res._status).toBe(400)
    expect(user.otp.attempts).toBe(1)
    expect(saveMock).toHaveBeenCalled()
  })

  it('returns 200 and tokens on correct OTP', async () => {
    const user = mockUser()
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await verifyOTP(req, res, next)
    expect(res._status).toBe(200)
    expect(res._body.accessToken).toBe('access-token')
    expect(res._body.message).toBe('Email verified successfully')
    expect(user.isVerified).toBe(true)
  })

  it('clears otp fields after successful verification', async () => {
    const user = mockUser()
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await verifyOTP(req, res, next)
    expect(user.otp.code).toBeNull()
    expect(user.otp.expiresAt).toBeNull()
    expect(user.otp.attempts).toBe(0)
  })

  it('shows remaining attempts count in message for wrong OTP', async () => {
    const user = mockUser({ otp: { code: 'h', expiresAt: new Date(Date.now() + 10000), attempts: 3 } })
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(false)
    await verifyOTP(req, res, next)
    expect(res._body.message).toContain('1 attempts left')
  })
})

describe('login', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  const mockUser = (overrides = {}) => ({
    _id: 'user-id-1',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed-password',
    isVerified: true,
    isActive: true,
    refreshToken: null,
    save: saveMock,
    ...overrides
  })

  beforeEach(() => {
    req  = makeReq({ body: { email: 'alice@example.com', password: 'password123' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    generateAccessToken.mockReturnValue('new-access-token')
    generateRefreshToken.mockReturnValue('new-refresh-token')
  })

  it('returns 400 when email is missing', async () => {
    req.body = { password: 'password123' }
    await login(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Email and password are required')
  })

  it('returns 400 when password is missing', async () => {
    req.body = { email: 'alice@example.com' }
    await login(req, res, next)
    expect(res._status).toBe(400)
  })

  it('returns 401 when user is not found', async () => {
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(null) })
    await login(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Invalid email or password')
  })

  it('returns 401 when password does not match', async () => {
    const user = mockUser()
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(false)
    await login(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Invalid email or password')
  })

  it('returns 403 when user email is not verified', async () => {
    const user = mockUser({ isVerified: false })
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(res._status).toBe(403)
    expect(res._body.message).toContain('Email not verified')
    expect(res._body.userId).toBe('user-id-1')
  })

  it('returns 403 when account is deactivated', async () => {
    const user = mockUser({ isActive: false })
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(res._status).toBe(403)
    expect(res._body.message).toContain('deactivated')
  })

  it('returns 200 with accessToken on successful login', async () => {
    const user = mockUser()
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(res._status).toBe(200)
    expect(res._body.accessToken).toBe('new-access-token')
    expect(res._body.message).toBe('Login successful')
  })

  it('sets cookies on successful login', async () => {
    const user = mockUser()
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(setCookies).toHaveBeenCalledWith(res, 'new-access-token', 'new-refresh-token')
  })

  it('creates a Log entry with action "login"', async () => {
    const user = mockUser()
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(Log.create).toHaveBeenCalledWith(expect.objectContaining({ action: 'login' }))
  })

  it('saves refresh token to the user document', async () => {
    const user = mockUser()
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(user.refreshToken).toBe('new-refresh-token')
    expect(saveMock).toHaveBeenCalled()
  })
})

describe('refreshToken', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  beforeEach(() => {
    req  = makeReq({ cookies: { refreshToken: 'old-refresh-token' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    process.env.JWT_REFRESH_SECRET = 'refresh-secret'
    generateAccessToken.mockReturnValue('new-access')
    generateRefreshToken.mockReturnValue('new-refresh')
  })

  it('returns 401 when no refresh token cookie is present', async () => {
    req.cookies = {}
    await refreshToken(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('No refresh token')
  })

  it('returns 401 when refresh token is invalid (jwt.verify throws)', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid') })
    await refreshToken(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 when user not found', async () => {
    jwt.verify.mockReturnValue({ id: 'u1' })
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(null) })
    await refreshToken(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Invalid refresh token')
  })

  it('returns 401 when stored token does not match cookie token', async () => {
    jwt.verify.mockReturnValue({ id: 'u1' })
    User.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ _id: 'u1', refreshToken: 'different-token', save: saveMock })
    })
    await refreshToken(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Invalid refresh token')
  })

  it('returns new accessToken on valid refresh', async () => {
    jwt.verify.mockReturnValue({ id: 'u1' })
    const user = { _id: 'u1', refreshToken: 'old-refresh-token', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await refreshToken(req, res, next)
    expect(res._body.accessToken).toBe('new-access')
  })

  it('rotates the refresh token in the user document', async () => {
    jwt.verify.mockReturnValue({ id: 'u1' })
    const user = { _id: 'u1', refreshToken: 'old-refresh-token', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await refreshToken(req, res, next)
    expect(user.refreshToken).toBe('new-refresh')
    expect(saveMock).toHaveBeenCalled()
  })
})

describe('logout', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  beforeEach(() => {
    req  = makeReq({ user: { _id: 'user-id-1' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    Log.create.mockResolvedValue({})
  })

  it('clears refresh token and calls clearCookies', async () => {
    const user = { _id: 'user-id-1', refreshToken: 'rt', save: saveMock }
    User.findById.mockResolvedValue(user)
    await logout(req, res, next)
    expect(user.refreshToken).toBeNull()
    expect(clearCookies).toHaveBeenCalledWith(res)
  })

  it('returns 200 with success message', async () => {
    User.findById.mockResolvedValue({ _id: 'user-id-1', refreshToken: 'rt', save: saveMock })
    await logout(req, res, next)
    expect(res._body.message).toBe('Logged out successfully')
  })

  it('still clears cookies even if user is not found', async () => {
    User.findById.mockResolvedValue(null)
    await logout(req, res, next)
    expect(clearCookies).toHaveBeenCalled()
  })

  it('creates a Log entry with action "logout"', async () => {
    User.findById.mockResolvedValue({ _id: 'user-id-1', refreshToken: 'rt', save: saveMock })
    await logout(req, res, next)
    expect(Log.create).toHaveBeenCalledWith(expect.objectContaining({ action: 'logout' }))
  })
})

describe('getMe', () => {
  it('returns user info from req.user', () => {
    const req = makeReq({
      user: { _id: 'uid', name: 'Bob', email: 'bob@example.com', isVerified: true }
    })
    const res = makeRes()
    getMe(req, res)
    expect(res._body.user).toEqual({
      id: 'uid',
      name: 'Bob',
      email: 'bob@example.com',
      isVerified: true
    })
  })
})

describe('changePassword', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  beforeEach(() => {
    req  = makeReq({
      body: { currentPassword: 'oldpass123', newPassword: 'newpass456' },
      user: { _id: 'user-id-1' }
    })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockResolvedValue('new-hashed-password')
  })

  it('returns 400 when current password is incorrect', async () => {
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(false)
    await changePassword(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Current password is incorrect')
  })

  it('returns 400 when new password is shorter than 8 characters', async () => {
    req.body.newPassword = 'short'
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    bcrypt.compare.mockResolvedValue(true)
    await changePassword(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('New password must be at least 8 characters')
  })

  it('returns 200 with success message on valid change', async () => {
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await changePassword(req, res, next)
    expect(res._body.message).toContain('Password changed successfully')
  })

  it('clears cookies after password change', async () => {
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await changePassword(req, res, next)
    expect(clearCookies).toHaveBeenCalledWith(res)
  })

  it('hashes new password with bcrypt salt factor 12', async () => {
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await changePassword(req, res, next)
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass456', 12)
  })

  it('nullifies refresh token to force re-login', async () => {
    const user = { _id: 'user-id-1', password: 'hashed-old', refreshToken: 'old-rt', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await changePassword(req, res, next)
    expect(user.refreshToken).toBeNull()
  })

  it('accepts new password exactly 8 characters long', async () => {
    req.body.newPassword = 'exactly8'
    const user = { _id: 'user-id-1', password: 'hashed-old', save: saveMock }
    User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(user) })
    await changePassword(req, res, next)
    expect(res._status).toBe(200)
  })
})

describe('resendOTP', () => {
  let req, res, next
  const saveMock = vi.fn().mockResolvedValue(true)

  beforeEach(() => {
    req  = makeReq({ body: { userId: 'user-id-1' } })
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    saveMock.mockResolvedValue(true)
    generateOTP.mockReturnValue({ otp: '654321', expiresAt: new Date(Date.now() + 600000) })
    bcrypt.hash.mockResolvedValue('hashed-otp')
    Log.create.mockResolvedValue({})
    process.env.NODE_ENV = 'test'
  })

  it('returns 404 when user is not found', async () => {
    User.findById.mockResolvedValue(null)
    await resendOTP(req, res, next)
    expect(res._status).toBe(404)
    expect(res._body.message).toBe('User not found')
  })

  it('returns 400 when user is already verified', async () => {
    User.findById.mockResolvedValue({ isVerified: true, save: saveMock })
    await resendOTP(req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Email already verified')
  })

  it('returns 200 and saves new OTP for unverified user', async () => {
    const user = { _id: 'user-id-1', email: 'a@b.com', name: 'A', isVerified: false, save: saveMock }
    User.findById.mockResolvedValue(user)
    await resendOTP(req, res, next)
    expect(res._body.message).toBe('New OTP sent to your email')
    expect(saveMock).toHaveBeenCalled()
  })

  it('creates a Log entry with action "otp_sent"', async () => {
    const user = { _id: 'user-id-1', email: 'a@b.com', name: 'A', isVerified: false, save: saveMock }
    User.findById.mockResolvedValue(user)
    await resendOTP(req, res, next)
    expect(Log.create).toHaveBeenCalledWith(expect.objectContaining({ action: 'otp_sent' }))
  })
})