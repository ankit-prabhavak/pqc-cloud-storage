'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FiShield, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Upload', href: '/upload' },
    { label: 'Security', href: '/security' },
  ]

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href={user ? '/dashboard' : '/'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#111827', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiShield size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>PQC Storage</span>
        </Link>

        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
              color: pathname === item.href ? '#111827' : '#6b7280',
              background: pathname === item.href ? '#f3f4f6' : 'transparent',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{user.name}</span>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6b7280' }}
          >
            <FiLogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </nav>
  )
}