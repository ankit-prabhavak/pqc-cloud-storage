'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import api from '@/lib/axios'
import {
  FiShield, FiUpload, FiFile, FiX, FiCheck,
  FiLock, FiClock, FiArrowRight, FiAlertCircle
} from 'react-icons/fi'

import Navbar from '@/components/ui/Navbar'
import { encryptFile } from '@/lib/crypto'
import { useAuth } from '@/context/AuthContext'
import NavGradient from '@/components/ui/NavGradient'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [encryptionType, setEncryptionType] = useState<'hybrid' | 'aes-only'>('hybrid')
  const [downloadLimit, setDownloadLimit] = useState('')
  const [expiresIn, setExpiresIn] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0])
      setError('')
      setDone(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => setError('File too large. Maximum size is 100MB.')
  })

  const { keypair } = useAuth()

  const handleUpload = async () => {
  if (!file) return
  if (!keypair) {
    setError('Encryption keys not available. Please log out and log in again.')
    return
  }

  setError('')
  setUploading(true)
  setProgress(0)

  try {
    // Step 1 — encrypt in browser
    setProgress(15)
    const payload = await encryptFile(file, keypair.publicKey, encryptionType)
    setProgress(40)

    // Step 2 — build form data with encrypted payload
    const body: any = {
      encryptedFile: payload.encryptedFile,
      mlkemCiphertext: payload.mlkemCiphertext,
      iv: payload.iv,
      tag: payload.tag,
      encryptionType: payload.encryptionType,
      originalName: file.name,
      fileSize: String(file.size),
      mimeType: file.type || 'application/octet-stream'
    }

    if (downloadLimit) body.downloadLimit = downloadLimit
    if (expiresIn) {
      const expiresAt = new Date(Date.now() + parseInt(expiresIn) * 60 * 60 * 1000)
      body.expiresAt = expiresAt.toISOString()
    }

    setProgress(60)

    // Step 3 — upload to backend
    const res = await api.post('/files/upload', body)

    setProgress(100)
    setResult(res.data.file)
    setDone(true)

  } catch (err: any) {
    setError(err.response?.data?.message || 'Upload failed.')
    setProgress(0)
  } finally {
    setUploading(false)
  }
}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "var(--font-body), 'Inter', sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Navbar */}
      {/* <nav style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#111827', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>PQC Storage</span>
          </Link>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Dashboard', href: '/dashboard', active: false },
              { label: 'Upload', href: '/upload', active: true },
              { label: 'Security', href: '/security', active: false },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                color: item.active ? '#111827' : '#6b7280',
                background: item.active ? '#f3f4f6' : 'transparent',
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to dashboard
        </Link>
      </nav> */}

      <Navbar />

      <NavGradient>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Upload a file
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Your file will be encrypted before being stored. The encryption pipeline takes under a second.
          </p>
        </div>

        {/* Success state */}
        {done && result ? (
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 52, height: 52, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <FiCheck size={22} color="#15803d" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>File encrypted and uploaded</h2>
              <p style={{ fontSize: 14, color: '#6b7280' }}>Your file is now stored securely on Cloudflare R2.</p>
            </div>

            {/* File details */}
            <div style={{ background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'File name', value: result.originalName },
                  { label: 'File size', value: formatBytes(result.fileSize) },
                  { label: 'Encryption', value: result.encryptionType === 'hybrid' ? 'AES-256-GCM + ML-KEM' : 'AES-256-GCM' },
                  { label: 'Security score', value: `${result.securityScore?.score ?? '—'}/100` },
                  { label: 'Integrity hash', value: result.fileHash ? result.fileHash.slice(0, 16) + '...' : '—' },
                  { label: 'Uploaded', value: 'Just now' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: '#111827', fontWeight: 500, fontFamily: item.label === 'Integrity hash' || item.label === 'Encryption' ? 'DM Mono, monospace' : 'inherit' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setFile(null); setDone(false); setResult(null); setProgress(0) }}
                style={{ flex: 1, padding: '11px', border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
              >
                Upload another
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: '#111827', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
              >
                Go to dashboard <FiArrowRight size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Drop zone */}
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#111827' : file ? '#bbf7d0' : '#e5e7eb'}`,
                borderRadius: 16, padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                background: isDragActive ? '#f9fafb' : file ? '#f0fdf4' : '#fff'
              }}
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <div style={{ width: 48, height: 48, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <FiFile size={22} color="#15803d" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{file.name}</p>
                  <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{formatBytes(file.size)}</p>
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', fontSize: 12, color: '#6b7280', cursor: 'pointer' }}
                  >
                    <FiX size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ width: 48, height: 48, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <FiUpload size={22} color="#9ca3af" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                    {isDragActive ? 'Drop it here' : 'Drop a file or click to browse'}
                  </p>
                  <p style={{ fontSize: 13, color: '#9ca3af' }}>Any file type up to 10 MB</p>
                </div>
              )}
            </div>

            {/* Encryption settings */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Encryption settings</h3>

              {/* Encryption type toggle */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 10 }}>Encryption mode</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { value: 'hybrid', label: 'Hybrid', sub: 'AES-256-GCM + ML-KEM', recommended: true },
                    { value: 'aes-only', label: 'AES only', sub: 'AES-256-GCM', recommended: false },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setEncryptionType(opt.value as any)}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: `1.5px solid ${encryptionType === opt.value ? '#111827' : '#e5e7eb'}`,
                        background: encryptionType === opt.value ? '#f9fafb' : '#fff',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{opt.label}</span>
                        {opt.recommended && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 6px', borderRadius: 4 }}>Recommended</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'DM Mono, monospace' }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Self destruct options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                    <FiClock size={13} /> Download limit
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5 (optional)"
                    value={downloadLimit}
                    onChange={e => setDownloadLimit(e.target.value)}
                    min="1"
                    style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13, color: '#111827', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#111827'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>File deletes after this many downloads</p>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                    <FiLock size={13} /> Expires in
                  </label>
                  <select
                    value={expiresIn}
                    onChange={e => setExpiresIn(e.target.value)}
                    style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13, color: expiresIn ? '#111827' : '#9ca3af', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#111827'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Never (optional)</option>
                    <option value="1">1 hour</option>
                    <option value="24">24 hours</option>
                    <option value="72">3 days</option>
                    <option value="168">7 days</option>
                    <option value="720">30 days</option>
                  </select>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>File auto-deletes after this time</p>
                </div>
              </div>
            </div>

            {/* Encryption pipeline info */}
            <div style={{ background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <FiShield size={16} color="#6b7280" style={{ marginTop: 1, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                    What happens to your file
                  </p>
                  <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                    {encryptionType === 'hybrid'
                      ? 'A fresh AES-256 key is generated → file encrypted with AES-GCM → key wrapped with ML-KEM → encrypted file stored in Cloudflare R2 → wrapped key and metadata saved in MongoDB.'
                      : 'A fresh AES-256 key is generated → file encrypted with AES-GCM → encrypted file stored in Cloudflare R2 → key and metadata saved in MongoDB.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <FiAlertCircle size={15} color="#dc2626" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Progress bar */}
            {uploading && (
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    {progress < 40 ? 'Encrypting in browser...' : progress < 80 ? 'Uploading to R2...' : progress < 100 ? 'Saving metadata...' : 'Complete'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'DM Mono, monospace' }}>{progress}%</span>
                </div>
                <div style={{ height: 5, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#111827', borderRadius: 999, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600,
                cursor: !file || uploading ? 'not-allowed' : 'pointer',
                background: !file || uploading ? '#f3f4f6' : '#111827',
                color: !file || uploading ? '#9ca3af' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s'
              }}
            >
              {uploading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <><FiUpload size={15} /> Encrypt and upload</>
              )}
            </button>

          </div>
        )}
      </div>
      </NavGradient>
    </div>
  )
}