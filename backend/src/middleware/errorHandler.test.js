import { describe, it, expect, vi, beforeEach } from 'vitest'
import { errorHandler } from './errorHandler.js'

// Build a minimal mock response object
const makeRes = () => {
  const res = {
    _status: null,
    _body: null,
    status(code) { this._status = code; return this },
    json(body) { this._body = body; return this }
  }
  return res
}

const makeReq = () => ({})
const makeNext = () => vi.fn()

describe('errorHandler middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = makeReq()
    res = makeRes()
    next = makeNext()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('handles Mongoose duplicate key error (code 11000)', () => {
    const err = { code: 11000, keyValue: { email: 'test@example.com' }, stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(400)
    expect(res._body).toEqual({ message: 'email already exists' })
  })

  it('handles Mongoose duplicate key with different field names', () => {
    const err = { code: 11000, keyValue: { username: 'alice' }, stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('username already exists')
  })

  it('handles Mongoose ValidationError with first message', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' }
      },
      stack: ''
    }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(400)
    // Should use the first error message
    expect(res._body.message).toBe('Name is required')
  })

  it('handles Mongoose ValidationError with single error', () => {
    const err = {
      name: 'ValidationError',
      errors: { password: { message: 'Password must be at least 8 characters' } },
      stack: ''
    }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(400)
    expect(res._body.message).toBe('Password must be at least 8 characters')
  })

  it('handles JsonWebTokenError', () => {
    const err = { name: 'JsonWebTokenError', message: 'invalid token', stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(401)
    expect(res._body).toEqual({ message: 'Invalid token' })
  })

  it('uses err.statusCode when set', () => {
    const err = { statusCode: 422, message: 'Unprocessable Entity', stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(422)
    expect(res._body).toEqual({ message: 'Unprocessable Entity' })
  })

  it('defaults to 500 when no statusCode is set', () => {
    const err = { message: 'Something went wrong', stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(500)
    expect(res._body).toEqual({ message: 'Something went wrong' })
  })

  it('uses "Internal Server Error" when no message is provided', () => {
    const err = { stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(500)
    expect(res._body).toEqual({ message: 'Internal Server Error' })
  })

  it('logs the error stack to console.error', () => {
    const err = { stack: 'Error: boom\n  at fn (file.js:1)', message: 'boom' }
    errorHandler(err, req, res, next)
    expect(console.error).toHaveBeenCalledWith(err.stack)
  })

  // Regression: duplicate key wins over statusCode
  it('code 11000 takes priority over statusCode field', () => {
    const err = { code: 11000, statusCode: 500, keyValue: { email: 'x@y.com' }, stack: '' }
    errorHandler(err, req, res, next)
    expect(res._status).toBe(400)
  })
})