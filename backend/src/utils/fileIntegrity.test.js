import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import { generateFileHash, verifyFileHash, generateHMAC } from './fileIntegrity.js'

// Helper: compute SHA-256 independently for cross-checking
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex')

describe('generateFileHash', () => {
  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = generateFileHash(Buffer.from('hello world'))
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('produces the correct SHA-256 hash', () => {
    const data = Buffer.from('test data')
    const expected = sha256(data)
    expect(generateFileHash(data)).toBe(expected)
  })

  it('returns the same hash for identical buffers', () => {
    const buf = Buffer.from('consistent content')
    expect(generateFileHash(buf)).toBe(generateFileHash(buf))
  })

  it('returns different hashes for different content', () => {
    const h1 = generateFileHash(Buffer.from('file A'))
    const h2 = generateFileHash(Buffer.from('file B'))
    expect(h1).not.toBe(h2)
  })

  it('handles an empty buffer', () => {
    const hash = generateFileHash(Buffer.alloc(0))
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    // Known SHA-256 of empty string
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('handles binary data', () => {
    const buf = Buffer.from([0x00, 0xff, 0x80, 0x40])
    const hash = generateFileHash(buf)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('a single byte difference changes the hash', () => {
    const buf1 = Buffer.from('hello')
    const buf2 = Buffer.from('helo')
    expect(generateFileHash(buf1)).not.toBe(generateFileHash(buf2))
  })
})

describe('verifyFileHash', () => {
  it('returns true when the buffer matches the stored hash', () => {
    const buf = Buffer.from('original content')
    const hash = generateFileHash(buf)
    expect(verifyFileHash(buf, hash)).toBe(true)
  })

  it('returns false when the buffer has been tampered', () => {
    const original = Buffer.from('original content')
    const tampered = Buffer.from('tampered content')
    const hash = generateFileHash(original)
    expect(verifyFileHash(tampered, hash)).toBe(false)
  })

  it('returns false for an incorrect hash string', () => {
    const buf = Buffer.from('some data')
    expect(verifyFileHash(buf, 'deadbeef')).toBe(false)
  })

  it('returns false for an empty stored hash', () => {
    const buf = Buffer.from('data')
    expect(verifyFileHash(buf, '')).toBe(false)
  })

  // Regression: ensure strict equality (no partial match)
  it('returns false when hash is the correct length but wrong value', () => {
    const buf = Buffer.from('data')
    const wrongHash = 'a'.repeat(64)
    expect(verifyFileHash(buf, wrongHash)).toBe(false)
  })
})

describe('generateHMAC', () => {
  it('returns a 64-character hex string', () => {
    const hmac = generateHMAC('my data', 'secret')
    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('produces consistent output for same inputs', () => {
    const h1 = generateHMAC('data', 'key')
    const h2 = generateHMAC('data', 'key')
    expect(h1).toBe(h2)
  })

  it('produces different output for different secrets', () => {
    const h1 = generateHMAC('data', 'secret1')
    const h2 = generateHMAC('data', 'secret2')
    expect(h1).not.toBe(h2)
  })

  it('produces different output for different data', () => {
    const h1 = generateHMAC('data1', 'secret')
    const h2 = generateHMAC('data2', 'secret')
    expect(h1).not.toBe(h2)
  })

  it('matches the result of a manual crypto.createHmac call', () => {
    const data = 'verify this'
    const secret = 'my-secret'
    const expected = crypto.createHmac('sha256', secret).update(data).digest('hex')
    expect(generateHMAC(data, secret)).toBe(expected)
  })
})