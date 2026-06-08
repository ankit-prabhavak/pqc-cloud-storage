'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FiShield, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi'
import { Suspense } from 'react'


function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (searchParams.get('verified') === 'true') setVerified(true)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Left panel — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 40px', maxWidth: 520, margin: '0 auto' }} className="w-full">

        {/* Logo */}
        <div style={{ width: '100%', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#111827', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={15} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>PQC Storage</span>
          </Link>
        </div>

        {/* Heading */}
        <div style={{ width: '100%', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Verified banner */}
        {verified && (
          <div style={{ width: '100%', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiCheck size={11} color="#15803d" />
            </div>
            <p style={{ fontSize: 13, color: '#15803d', margin: 0 }}>Email verified successfully. You can now sign in.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ width: '100%', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#111827'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#6b7280' : '#111827', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'background 0.15s' }}
          >
            {loading ? 'Signing in...' : (<>Sign in <FiArrowRight size={15} /></>)}
          </button>
        </form>

        {/* Divider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>secured with</span>
          <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
        </div>

        {/* Security badges */}
        <div style={{ width: '100%', display: 'flex', gap: 8 }}>
          {['AES-256-GCM', 'ML-KEM', 'OTP Auth'].map(badge => (
            <div key={badge} style={{ flex: 1, padding: '8px 10px', background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'DM Mono, monospace' }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#111827', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px' }} className="hidden lg:flex">

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b5563', marginBottom: 16 }}>
            Your files are waiting
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
            End-to-end encrypted. Always.
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>
            Your files are encrypted with AES-256-GCM and keys protected by ML-KEM before anything reaches our servers. Not even we can read them.
          </p>
        </div>

        {/* Mini security score card */}
        <div style={{ background: '#1a2234', border: '1px solid #1f2937', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>Security Score</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#4ade80', fontFamily: 'DM Mono, monospace' }}>95/100</span>
          </div>
          <div style={{ height: 6, background: '#374151', borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 999 }} />
          </div>
          {[
            { label: 'Hybrid encryption active', points: '+40' },
            { label: 'OTP verification enabled', points: '+25' },
            { label: 'Download limit set', points: '+20' },
            { label: 'Expiry configured', points: '+10' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#4ade80', fontFamily: 'DM Mono, monospace' }}>{row.points}</span>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid #1f2937' }}>
          <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'DM Mono, monospace' }}>
            NIST FIPS 203 · AES-256-GCM · SHA-256 · MIT License
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 28, height: 28, border: '2px solid #e5e7eb', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <LoginPage />
    </Suspense>
  )
}
