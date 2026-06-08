'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import { FiShield, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(form.password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(form.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      router.push(`/verify-otp?userId=${res.data.userId}&email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); .mono { font-family: 'DM Mono', monospace; }`}</style>

      {/* Left panel */}
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
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ width: '100%', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Full name</label>
            <input
              type="text"
              placeholder="Ankit Prabhavak"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email address</label>
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
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
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

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {passwordChecks.map(check => (
                  <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: check.pass ? '#f0fdf4' : '#f3f4f6', border: `1px solid ${check.pass ? '#bbf7d0' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiCheck size={9} color={check.pass ? '#15803d' : '#d1d5db'} />
                    </div>
                    <span style={{ fontSize: 12, color: check.pass ? '#15803d' : '#9ca3af' }}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#6b7280' : '#111827', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'background 0.15s' }}
          >
            {loading ? 'Creating account...' : (
              <>Create account <FiArrowRight size={15} /></>
            )}
          </button>
        </form>

        {/* OTP note */}
        <div style={{ width: '100%', marginTop: 20, padding: '12px 16px', background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
            After registering you will receive a 6-digit OTP to verify your email address before accessing your account.
          </p>
        </div>
      </div>

      {/* Right panel — info */}
      <div style={{ flex: 1, background: '#111827', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px' }} className="hidden lg:flex">
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b5563', marginBottom: 16 }}>
            What happens to your files
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
            Encrypted before they leave your device
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>
            Every file goes through AES-256-GCM encryption. Keys are protected with ML-KEM — the NIST FIPS 203 standard. We never see your files in plaintext.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { title: 'AES-256-GCM', desc: 'File encryption — same strength used by banks and governments' },
            { title: 'ML-KEM key wrapping', desc: 'NIST FIPS 203 — quantum-resistant key encapsulation' },
            { title: 'Zero plaintext storage', desc: 'Cloudflare R2 only receives encrypted blobs' },
            { title: 'Cryptographic audit trail', desc: 'SHA-256 chained logs for every action' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1f2937', border: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <FiCheck size={10} color="#9ca3af" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', marginBottom: 2, fontFamily: 'DM Mono, monospace' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #1f2937' }}>
          <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'DM Mono, monospace' }}>
            NIST FIPS 203 · AES-256-GCM · SHA-256 · MIT License
          </p>
        </div>
      </div>
    </main>
  )
}