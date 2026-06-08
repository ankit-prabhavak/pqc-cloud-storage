'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/axios'
import { Stats, FileItem } from '@/types'
import {
  FiShield, FiUpload, FiFile, FiLogOut, FiGrid,
  FiLock, FiActivity, FiMoreVertical, FiDownload,
  FiTrash2, FiClock, FiAlertCircle
} from 'react-icons/fi'
import Navbar from '@/components/ui/Navbar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'


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

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
// const { user: authUser, logout, loading } = useAuth()

// const user = authUser || {
//   name: 'Guest',
//   encryptionPreference: 'hybrid'
// }
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

 
  
// Temporarily disabled auth redirect
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const [statsRes, filesRes] = await Promise.all([
          api.get('/files/stats'),
          api.get('/files')
        ])
        setStats(statsRes.data)
        setFiles(filesRes.data.files || [])
      } catch {
        // handle silently
      } finally {
        setStatsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleDelete = async (fileId: string) => {
    setDeleting(fileId)
    try {
      await api.delete(`/files/${fileId}`)
      setFiles(prev => prev.filter(f => f.id !== fileId))
    } catch {
      // handle silently
    } finally {
      setDeleting(null)
      setOpenMenu(null)
    }
  }

  const handleDownload = async (fileId: string, name: string) => {
    try {
      const res = await api.get(`/files/download/${fileId}`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // handle silently
    }
    setOpenMenu(null)
  }
  
  // if (loading || !user)
  // if (loading || !user) return <LoadingSpinner />
  if (loading) {
      return <LoadingSpinner />
  }

  if (!user) {
      return null
  }

  // const statCards = [
  //   {
  //     label: 'Total Files',
  //     value: statsLoading ? '—' : String(stats?.totalFiles ?? 0),
  //     icon: <FiFile size={18} color="#6b7280" />,
  //     sub: 'uploaded'
  //   },
  //   {
  //     label: 'Storage Used',
  //     value: statsLoading ? '—' : formatBytes(stats?.totalStorageUsed ?? 0),
  //     icon: <FiGrid size={18} color="#6b7280" />,
  //     sub: 'encrypted on R2'
  //   },
  //   {
  //     label: 'Encryption',
  //     value: user.encryptionPreference === 'hybrid' ? 'Hybrid' : 'AES Only',
  //     icon: <FiLock size={18} color="#6b7280" />,
  //     sub: user.encryptionPreference === 'hybrid' ? 'AES + ML-KEM' : 'AES-256-GCM'
  //   },
  //   {
  //     label: 'Recent Activity',
  //     value: statsLoading ? '—' : String(stats?.recentActivity?.length ?? 0),
  //     icon: <FiActivity size={18} color="#6b7280" />,
  //     sub: 'logged actions'
  //   },
  // ]

  const statCards = [
  {
    label: 'Total Files',
    value: statsLoading ? '—' : String(stats?.totalFiles ?? 0),
    icon: <FiFile size={18} color="#6b7280" />,
    sub: 'uploaded'
  },
  {
    label: 'Storage Used',
    value: statsLoading ? '—' : formatBytes(stats?.totalStorageUsed ?? 0),
    icon: <FiGrid size={18} color="#6b7280" />,
    sub: 'encrypted on R2'
  },
  {
    label: 'Quantum-safe files',
    value: statsLoading ? '—' : String(files.filter(f => f.encryptionType === 'hybrid').length),
    icon: <FiShield size={18} color="#6b7280" />,
    sub: `of ${files.length} files with ML-KEM`
  },
  {
    label: 'Recent Activity',
    value: statsLoading ? '—' : String(stats?.recentActivity?.length ?? 0),
    icon: <FiActivity size={18} color="#6b7280" />,
    sub: 'logged actions'
  },
]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        .file-row:hover { background: #f9fafb !important; }
        .menu-btn:hover { background: #f3f4f6 !important; }
        .action-item:hover { background: #f9fafb !important; }
        .nav-link:hover { color: #111827 !important; }
      `}</style>

      {/* Top navbar */}
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
              { label: 'Dashboard', href: '/dashboard', active: true },
              { label: 'Upload', href: '/upload', active: false },
              { label: 'Security', href: '/security', active: false },
            ].map(item => (
              <Link key={item.href} href={item.href} className="nav-link" style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                color: item.active ? '#111827' : '#6b7280',
                background: item.active ? '#f3f4f6' : 'transparent',
                transition: 'color 0.15s'
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{user.name}</span>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6b7280', transition: 'all 0.15s' }}
          >
            <FiLogOut size={14} /> Sign out
          </button>
        </div>
      </nav> */}

      <Navbar />

      {/* Page content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Good to see you, {user.name.split(' ')[0]}
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              All your files are encrypted and stored securely.
            </p>
          </div>
          <button
            onClick={() => router.push('/upload')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <FiUpload size={14} /> Upload file
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</span>
                <div style={{ width: 32, height: 32, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Files table */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, overflow: 'hidden'}}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Your files</h2>
            <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'DM Mono, monospace' }}>{files.length} files</span>
          </div>

          {files.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FiFile size={20} color="#9ca3af" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>No files yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Upload your first file to get started</p>
              <button
                onClick={() => router.push('/upload')}
                style={{ padding: '9px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Upload file
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 72 }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', padding: '10px 24px', borderBottom: '1px solid #f9fafb' }}>
                {['Name', 'Size', 'Encryption', 'Uploaded', ''].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>

              {files.map(file => (
                <div key={file.id} className="file-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', padding: '14px 24px', borderBottom: '1px solid #f9fafb', alignItems: 'center', transition: 'background 0.1s', position: 'relative' }}>

                  {/* Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 34, height: 34, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiFile size={15} color="#6b7280" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.originalName}
                      </p>
                      {file.expiresAt && (
                        <p style={{ fontSize: 11, color: '#f59e0b', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FiClock size={10} /> Expires {timeAgo(file.expiresAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Size */}
                  <span style={{ fontSize: 13, color: '#6b7280', fontFamily: 'DM Mono, monospace' }}>
                    {formatBytes(file.fileSize)}
                  </span>

                  {/* Encryption */}
                  <div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                      fontFamily: 'DM Mono, monospace',
                      background: file.encryptionType === 'hybrid' ? '#f0fdf4' : '#f9fafb',
                      color: file.encryptionType === 'hybrid' ? '#15803d' : '#6b7280',
                      border: `1px solid ${file.encryptionType === 'hybrid' ? '#bbf7d0' : '#f0f0f0'}`
                    }}>
                      {file.encryptionType === 'hybrid' ? 'Hybrid' : 'AES-256'}
                    </span>
                  </div>

                  {/* Date */}
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{timeAgo(file.createdAt)}</span>

                  {/* Actions */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="menu-btn"
                      onClick={() => setOpenMenu(openMenu === file.id ? null : file.id)}
                      style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #f0f0f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.1s' }}
                    >
                      <FiMoreVertical size={14} color="#6b7280" />
                    </button>

                    {openMenu === file.id && (
                      <div style={{ position: 'absolute', right: 0, top: 34, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 100, minWidth: 150, overflow: 'hidden' }}>
                        <button
                          className="action-item"
                          onClick={() => handleDownload(file.id, file.originalName)}
                          style={{ width: '100%', padding: '10px 14px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#374151', transition: 'background 0.1s' }}
                        >
                          <FiDownload size={13} /> Download
                        </button>
                        <div style={{ height: 1, background: '#f9fafb' }} />
                        <button
                          className="action-item"
                          onClick={() => handleDelete(file.id)}
                          disabled={deleting === file.id}
                          style={{ width: '100%', padding: '10px 14px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#dc2626', transition: 'background 0.1s' }}
                        >
                          <FiTrash2 size={13} /> {deleting === file.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, overflow: 'hidden', marginTop: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Recent activity</h2>
            </div>
            {stats.recentActivity.slice(0, 6).map(log => (
              <div key={log._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 24px', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: 30, height: 30, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiActivity size={13} color="#6b7280" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                    <span style={{ fontWeight: 500 }}>{log.action}</span>
                    {log.fileId && <span style={{ color: '#6b7280' }}> — {log.fileId.originalName}</span>}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, marginTop: 2 }}>{log.ipAddress}</p>
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{timeAgo(log.timestamp)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Click outside to close menu */}
        {openMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpenMenu(null)} />
        )}
      </div>
    </div>
  )
}