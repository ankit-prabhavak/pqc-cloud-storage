import crypto from 'crypto'

// SHA-256 hash of file buffer
export const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

// Verify file hash matches stored hash
export const verifyFileHash = (buffer, storedHash) => {
  const currentHash = generateFileHash(buffer)
  return currentHash === storedHash
}

// Generate HMAC for extra tamper protection
export const generateHMAC = (data, secret) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}