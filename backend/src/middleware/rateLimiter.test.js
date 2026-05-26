import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authLimiter, otpLimiter, uploadLimiter } from './rateLimiter.js'

// Build a mock req/res/next triplet
const makeReq = (ip = '127.0.0.1') => ({
  ip,
  headers: {},
  method: 'GET',
  url: '/test',
  socket: { remoteAddress: ip }
})

const makeRes = () => {
  const headers = {}
  const res = {
    _status: null,
    _body: null,
    setHeader(k, v) { headers[k.toLowerCase()] = v },
    getHeader(k)    { return headers[k.toLowerCase()] },
    removeHeader(k) { delete headers[k.toLowerCase()] },
    status(code)    { this._status = code; return this },
    json(body)      { this._body = body; return this },
    send(body)      { this._body = body; return this },
    end()           { return this },
    headersSent: false,
    headers
  }
  return res
}

// Helper: exhaust the limit by calling the middleware N times
const hitLimiterNTimes = async (limiter, n, ip = '127.0.0.1') => {
  const results = []
  for (let i = 0; i < n; i++) {
    const req = makeReq(ip)
    const res = makeRes()
    const next = vi.fn()
    await new Promise(resolve => {
      limiter(req, res, (...args) => { next(...args); resolve() })
      // If next isn't called, the limiter blocked and called res.json — resolve anyway
      setTimeout(resolve, 50)
    })
    results.push({ req, res, next })
  }
  return results
}

describe('authLimiter', () => {
  it('is a function (middleware)', () => {
    expect(typeof authLimiter).toBe('function')
  })

  it('calls next() for a single request (well below 100 limit)', async () => {
    const req  = makeReq('10.0.0.1')
    const res  = makeRes()
    const next = vi.fn()
    await new Promise(resolve => {
      authLimiter(req, res, (...args) => { next(...args); resolve() })
      setTimeout(resolve, 100)
    })
    expect(next).toHaveBeenCalledOnce()
  })
})

describe('otpLimiter', () => {
  it('is a function (middleware)', () => {
    expect(typeof otpLimiter).toBe('function')
  })

  it('calls next() for the first 3 requests from the same IP', async () => {
    // Use a unique IP so previous test runs don't interfere
    const ip = '192.168.100.1'
    for (let i = 0; i < 3; i++) {
      const req  = makeReq(ip)
      const res  = makeRes()
      const next = vi.fn()
      await new Promise(resolve => {
        otpLimiter(req, res, (...args) => { next(...args); resolve() })
        setTimeout(resolve, 100)
      })
      expect(next, `request ${i + 1} should pass`).toHaveBeenCalledOnce()
    }
  })

  it('blocks the 4th request (exceeds max of 3)', async () => {
    const ip = '192.168.100.2'
    // First 3 should pass
    for (let i = 0; i < 3; i++) {
      const req  = makeReq(ip)
      const res  = makeRes()
      const next = vi.fn()
      await new Promise(resolve => {
        otpLimiter(req, res, (...args) => { next(...args); resolve() })
        setTimeout(resolve, 100)
      })
    }
    // 4th should be blocked
    const req  = makeReq(ip)
    const res  = makeRes()
    const next = vi.fn()
    await new Promise(resolve => {
      otpLimiter(req, res, (...args) => { next(...args); resolve() })
      setTimeout(resolve, 100)
    })
    // next should NOT be called (rate limited)
    expect(next).not.toHaveBeenCalled()
    // And the blocked response should carry the error message
    expect(res._body?.message).toBe('Too many OTP requests, please wait a minute')
  })
})

describe('uploadLimiter', () => {
  it('is a function (middleware)', () => {
    expect(typeof uploadLimiter).toBe('function')
  })

  it('calls next() for a single request (well below 50 limit)', async () => {
    const req  = makeReq('10.1.0.1')
    const res  = makeRes()
    const next = vi.fn()
    await new Promise(resolve => {
      uploadLimiter(req, res, (...args) => { next(...args); resolve() })
      setTimeout(resolve, 100)
    })
    expect(next).toHaveBeenCalledOnce()
  })
})