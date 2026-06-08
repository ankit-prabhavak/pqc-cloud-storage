'use client'

import { FiFile, FiDownload, FiTrash2, FiClock, FiShield } from 'react-icons/fi'
import { FileItem } from '@/types'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface Props {
  file: FileItem
  onDownload: (id: string, name: string) => void
  onDelete: (id: string) => void
  deleting: boolean
}

export default function FileCard({ file, onDownload, onDelete, deleting }: Props) {
  const isHybrid = file.encryptionType === 'hybrid'
  const score = file.securityScore?.score ?? 0

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 14,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      transition: 'border-color 0.15s, box-shadow 0.15s'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#f0f0f0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* File icon and name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FiFile size={18} color="#6b7280" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.originalName}
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0', fontFamily: 'DM Mono, monospace' }}>
            {formatBytes(file.fileSize)}
          </p>
        </div>
      </div>

      {/* Encryption badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
          fontFamily: 'DM Mono, monospace',
          background: isHybrid ? '#f0fdf4' : '#f9fafb',
          color: isHybrid ? '#15803d' : '#6b7280',
          border: `1px solid ${isHybrid ? '#bbf7d0' : '#f0f0f0'}`
        }}>
          {isHybrid ? 'ML-KEM + AES' : 'AES-256'}
        </span>

        {/* Security score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiShield size={11} color={score >= 90 ? '#15803d' : score >= 70 ? '#b45309' : '#dc2626'} />
          <span style={{
            fontSize: 12, fontWeight: 700,
            fontFamily: 'DM Mono, monospace',
            color: score >= 90 ? '#15803d' : score >= 70 ? '#b45309' : '#dc2626'
          }}>
            {score}/100
          </span>
        </div>
      </div>

      {/* Expiry warning */}
      {file.expiresAt && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
          <FiClock size={12} color="#b45309" />
          <span style={{ fontSize: 11, color: '#b45309', fontWeight: 500 }}>
            Expires {timeAgo(file.expiresAt)}
          </span>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f9fafb' }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(file.createdAt)}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onDownload(file.id, file.originalName)}
            style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #f0f0f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Download"
          >
            <FiDownload size={13} color="#6b7280" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            disabled={deleting}
            style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #fecaca', background: '#fef2f2', cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete"
          >
            <FiTrash2 size={13} color="#dc2626" />
          </button>
        </div>
      </div>
    </div>
  )
}