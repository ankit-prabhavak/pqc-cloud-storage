// Calculate quantum security score for a file (0-100)
export const calculateSecurityScore = (file) => {
  let score = 0
  const breakdown = []

  // Encryption type (40 points)
  if (file.encryptionType === 'hybrid') {
    score += 40
    breakdown.push({ factor: 'ML-KEM Post-Quantum Encryption', points: 40 })
  } else {
    score += 20
    breakdown.push({ factor: 'AES-256 Encryption (no PQC key wrapping)', points: 20 })
  }

  // File hash present (20 points)
  if (file.fileHash) {
    score += 20
    breakdown.push({ factor: 'Integrity Hash (SHA-256)', points: 20 })
  }

  // Self destruct set (15 points)
  if (file.expiresAt || file.downloadLimit) {
    score += 15
    breakdown.push({ factor: 'Self-Destruct Configured', points: 15 })
  }

  // Not shared publicly (15 points)
  if (!file.isShared) {
    score += 15
    breakdown.push({ factor: 'Not Publicly Shared', points: 15 })
  }

  // GCM auth tag present (10 points)
  if (file.tag && file.tag !== 'mock-tag-phase1') {
    score += 10
    breakdown.push({ factor: 'AES-GCM Authentication Tag', points: 10 })
  }

  const level =
    score >= 90 ? 'Quantum-Safe' :
    score >= 70 ? 'Strong' :
    score >= 50 ? 'Moderate' : 'Weak'

  return { score, level, breakdown }
}