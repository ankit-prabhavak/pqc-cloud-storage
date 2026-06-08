import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import generateOTP from './generateOTP.js'

describe('generateOTP', () => {
  it('returns an object with otp and expiresAt properties', () => {
    const result = generateOTP()
    expect(result).toHaveProperty('otp')
    expect(result).toHaveProperty('expiresAt')
  })

  it('otp is a 6-digit numeric string', () => {
    const { otp } = generateOTP()
    expect(typeof otp).toBe('string')
    expect(otp).toMatch(/^\d{6}$/)
  })

  it('otp is within the range 100000–999999', () => {
    const { otp } = generateOTP()
    const num = parseInt(otp, 10)
    expect(num).toBeGreaterThanOrEqual(100000)
    expect(num).toBeLessThanOrEqual(999999)
  })

  it('expiresAt is a Date object', () => {
    const { expiresAt } = generateOTP()
    expect(expiresAt).toBeInstanceOf(Date)
  })

  it('expiresAt is approximately 10 minutes in the future', () => {
    const before = Date.now()
    const { expiresAt } = generateOTP()
    const after = Date.now()

    const tenMinMs = 10 * 60 * 1000
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + tenMinMs - 100)
    expect(expiresAt.getTime()).toBeLessThanOrEqual(after + tenMinMs + 100)
  })

  it('generates different OTPs on consecutive calls', () => {
    // Probabilistic: chance of 10 consecutive matches is astronomically low
    const otps = Array.from({ length: 10 }, () => generateOTP().otp)
    const unique = new Set(otps)
    expect(unique.size).toBeGreaterThan(1)
  })

  it('expiresAt is strictly in the future', () => {
    const { expiresAt } = generateOTP()
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now())
  })

  // Boundary/regression: OTP must never be less than 6 digits (no leading-zero loss)
  it('otp string length is always exactly 6', () => {
    for (let i = 0; i < 20; i++) {
      const { otp } = generateOTP()
      expect(otp.length).toBe(6)
    }
  })
})
