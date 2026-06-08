import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock jsonwebtoken ─────────────────────────────────────────────────────────
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}))

// ── Mock User model ───────────────────────────────────────────────────────────
vi.mock('../models/User.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import protect from './auth.js'

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeRes = () => {
  const res = {
    _status: null,
    _body: null,
    status(code) { this._status = code; return this },
    json(body)   { this._body = body; return this }
  }
  return res
}

describe('protect middleware', () => {
  let req, res, next

  beforeEach(() => {
    req  = { cookies: {}, headers: {} }
    res  = makeRes()
    next = vi.fn()
    vi.clearAllMocks()
    process.env.JWT_ACCESS_SECRET = 'test-access-secret'
  })

  // ── No token cases ─────────────────────────────────────────────────────────

  it('returns 401 when no token in cookie or header', async () => {
    await protect(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Not authorized, please login')
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when Authorization header is present but not Bearer', async () => {
    req.headers.authorization = 'Basic abc123'
    await protect(req, res, next)
    expect(res._status).toBe(401)
  })

  // ── Token verification ─────────────────────────────────────────────────────

  it('reads token from cookies.accessToken', async () => {
    req.cookies.accessToken = 'valid.token.here'
    jwt.verify.mockReturnValue({ id: 'user123' })
    User.findById.mockResolvedValue({ _id: 'user123', isActive: true, isVerified: true })

    await protect(req, res, next)
    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', 'test-access-secret')
    expect(next).toHaveBeenCalled()
  })

  it('reads token from Authorization Bearer header when no cookie', async () => {
    req.headers.authorization = 'Bearer header.token.here'
    jwt.verify.mockReturnValue({ id: 'user456' })
    User.findById.mockResolvedValue({ _id: 'user456', isActive: true, isVerified: true })

    await protect(req, res, next)
    expect(jwt.verify).toHaveBeenCalledWith('header.token.here', 'test-access-secret')
    expect(next).toHaveBeenCalled()
  })

  it('cookie token takes priority over Authorization header', async () => {
    req.cookies.accessToken = 'cookie.token'
    req.headers.authorization = 'Bearer header.token'
    jwt.verify.mockReturnValue({ id: 'u1' })
    User.findById.mockResolvedValue({ _id: 'u1', isActive: true, isVerified: true })

    await protect(req, res, next)
    expect(jwt.verify).toHaveBeenCalledWith('cookie.token', 'test-access-secret')
  })

  // ── User checks ────────────────────────────────────────────────────────────

  it('returns 401 when user is not found in DB', async () => {
    req.cookies.accessToken = 'some.token'
    jwt.verify.mockReturnValue({ id: 'ghost' })
    User.findById.mockResolvedValue(null)

    await protect(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('User not found or deactivated')
  })

  it('returns 401 when user.isActive is false', async () => {
    req.cookies.accessToken = 'token'
    jwt.verify.mockReturnValue({ id: 'deactivated' })
    User.findById.mockResolvedValue({ _id: 'deactivated', isActive: false, isVerified: true })

    await protect(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('User not found or deactivated')
  })

  it('returns 403 when user.isVerified is false', async () => {
    req.cookies.accessToken = 'token'
    jwt.verify.mockReturnValue({ id: 'unverified' })
    User.findById.mockResolvedValue({ _id: 'unverified', isActive: true, isVerified: false })

    await protect(req, res, next)
    expect(res._status).toBe(403)
    expect(res._body.message).toBe('Please verify your email first')
  })

  it('attaches user to req and calls next() for valid token and active verified user', async () => {
    const mockUser = { _id: 'u1', isActive: true, isVerified: true, name: 'Alice' }
    req.cookies.accessToken = 'good.token'
    jwt.verify.mockReturnValue({ id: 'u1' })
    User.findById.mockResolvedValue(mockUser)

    await protect(req, res, next)
    expect(req.user).toBe(mockUser)
    expect(next).toHaveBeenCalledOnce()
  })

  // ── JWT errors ─────────────────────────────────────────────────────────────

  it('returns 401 with "Token expired" message for TokenExpiredError', async () => {
    req.cookies.accessToken = 'expired.token'
    const expiredError = new Error('jwt expired')
    expiredError.name = 'TokenExpiredError'
    jwt.verify.mockImplementation(() => { throw expiredError })

    await protect(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Token expired, please refresh')
  })

  it('returns 401 with "Token invalid" for generic JWT errors', async () => {
    req.cookies.accessToken = 'bad.token'
    const jwtError = new Error('invalid signature')
    jwtError.name = 'JsonWebTokenError'
    jwt.verify.mockImplementation(() => { throw jwtError })

    await protect(req, res, next)
    expect(res._status).toBe(401)
    expect(res._body.message).toBe('Token invalid')
  })

  it('returns 401 with "Token invalid" for unexpected errors in verification', async () => {
    req.cookies.accessToken = 'weird.token'
    jwt.verify.mockImplementation(() => { throw new Error('unknown error') })

    await protect(req, res, next)
    expect(res._status).toBe(401)
  })
})