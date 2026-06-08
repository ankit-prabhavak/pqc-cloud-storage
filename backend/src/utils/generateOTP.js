import crypto from 'crypto'

const generateOTP = () => {
  // 6 digit cryptographically secure OTP
  const otp = crypto.randomInt(100000, 999999).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  return { otp, expiresAt }
}

export default generateOTP