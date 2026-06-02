export interface User {
  id: string
  name: string
  email: string
  isVerified: boolean
  encryptionPreference: 'aes-only' | 'hybrid'
  totalFilesUploaded: number
  totalStorageUsed: number
}

export interface FileItem {
  _id: string
  id: string
  originalName: string
  fileSize: number
  mimeType: string
  encryptionType: 'aes-only' | 'hybrid'
  fileHash: string
  securityScore: {
    score: number
    level: string
    breakdown: { factor: string; points: number }[]
  }
  downloadCount: number
  downloadLimit: number | null
  expiresAt: string | null
  isShared: boolean
  createdAt: string
}

export interface Log {
  _id: string
  action: string
  timestamp: string
  fileId?: { originalName: string }
  ipAddress: string
}

export interface Stats {
  totalFiles: number
  totalStorageUsed: number
  recentActivity: Log[]
}

export interface SecurityDashboard {
  overview: {
    averageSecurityScore: number
    totalFiles: number
    quantumSafeFiles: number
    classicalOnlyFiles: number
    activeSessions: number
    encryptionPreference: string
  }
  pqcStatus: {
    algorithm: string
    nistStandard: string
    keySize: string
    securityLevel: string
    quantumResistant: boolean
  }
  recentActivity: Log[]
}