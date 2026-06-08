'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  FiShield, FiGrid, FiUpload,
  FiActivity, FiLogOut, FiLock
} from 'react-icons/fi'

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Upload', href: '/upload', icon: FiUpload },
  { label: 'Security', href: '/security', icon: FiLock },
  { label: 'Audit log', href: '/security', icon: FiActivity },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '0 8px', marginBottom: 32 }}>
        <div style={{ width: 28, height: 28, background: '#111827', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiShield size={13} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>PQC Storage</span>
      </Link>

      {/* Nav links */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>
          Navigation
        </div>
        {links.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 9, textDecoration: 'none',
              fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? '#111827' : '#6b7280',
              background: active ? '#f3f4f6' : 'transparent',
              transition: 'background 0.1s, color 0.1s'
            }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* User section */}
      {user && (
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 9, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6b7280', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <FiLogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  )
}