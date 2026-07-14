'use client'

/**
 * AuthModal — shared login/register overlay.
 *
 * Usage:
 *   const [modal, setModal] = useState<'login' | 'register' | null>(null)
 *   <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={setModal} />
 *
 * - On successful login/register the modal closes and AuthContext redirects
 *   to /dashboard (auth logic is unchanged).
 * - `onSwitch` lets the modal swap between login ↔ register in-place without
 *   closing/reopening.
 * - Direct navigation to /login or /register renders the full-page version
 *   in app/(auth)/ which is still intact.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import {
  FiShield, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiX,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'motion/react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthModalMode = 'login' | 'register'

interface AuthModalProps {
  mode: AuthModalMode | null
  onClose: () => void
  onSwitch: (mode: AuthModalMode) => void
}

// ─── Styled submit button — burgundy + violet hover glow ─────────────────────

function AuthButton({ loading, label }: { loading: boolean; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '11px 0',
        borderRadius: 10,
        border: 'none',
        fontSize: 14,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        // Burgundy-to-violet gradient on hover, flat burgundy at rest
        background: hovered
          ? 'linear-gradient(135deg, #7A1F31 0%, #6B3FA0 100%)'
          : 'var(--burgundy)',
        color: 'var(--text)',
        boxShadow: hovered
          ? '0 0 24px rgba(107,63,160,0.35), 0 0 8px rgba(122,31,49,0.3)'
          : '0 0 16px rgba(122,31,49,0.2)',
        transition: 'background 0.25s, box-shadow 0.25s',
      }}
    >
      {loading ? (
        <span>{label.includes('Sign') ? 'Signing in...' : 'Creating account...'}</span>
      ) : (
        <>{label} <FiArrowRight size={15} /></>
      )}
    </button>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────

function AuthInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = true,
  children,
}: {
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  children?: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%',
          padding: '10px 14px',
          paddingRight: children ? 44 : 14,
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: 9,
          fontSize: 13,
          color: 'var(--text)',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-body)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--burgundy)'
          e.target.style.boxShadow = '0 0 0 3px rgba(122,31,49,0.15)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.boxShadow = 'none'
        }}
      />
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block',
      marginBottom: 6,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    }}>
      {children}
    </label>
  )
}

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitch, onClose }: { onSwitch: (m: AuthModalMode) => void; onClose: () => void }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      onClose() // AuthContext already pushes to /dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Heading */}
      <div style={{ marginBottom: 4 }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          fontFamily: 'var(--font-display)',
          margin: 0,
          marginBottom: 6,
        }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onSwitch('register')}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: 'var(--burgundy-bright)', fontWeight: 600, fontSize: 13,
            }}
          >
            Create one
          </button>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(61,19,28,0.5)',
          border: '1px solid rgba(122,31,49,0.4)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <Label>Email address</Label>
        <AuthInput
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
      </div>

      {/* Password */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <Label>Password</Label>
          <Link href="/forgot-password" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>
        <AuthInput
          type={showPw ? 'text' : 'password'}
          placeholder="Enter your password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        >
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 0,
            }}
          >
            {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </AuthInput>
      </div>

      <AuthButton loading={loading} label="Sign in" />

      {/* Divider + badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          SECURED WITH
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {['AES-256-GCM', 'ML-KEM', 'OTP Auth'].map(b => (
          <div key={b} style={{
            padding: '6px 8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 7,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{b}</span>
          </div>
        ))}
      </div>
    </form>
  )
}

// ─── Register form ────────────────────────────────────────────────────────────

function RegisterForm({ onSwitch, onClose }: { onSwitch: (m: AuthModalMode) => void; onClose: () => void }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
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
      onClose()
      router.push(`/verify-otp?userId=${res.data.userId}&email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Heading */}
      <div style={{ marginBottom: 4 }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          fontFamily: 'var(--font-display)',
          margin: 0,
          marginBottom: 6,
        }}>
          Create your account
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onSwitch('login')}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: 'var(--burgundy-bright)', fontWeight: 600, fontSize: 13,
            }}
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(61,19,28,0.5)',
          border: '1px solid rgba(122,31,49,0.4)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <Label>Full name</Label>
        <AuthInput
          placeholder="Your full name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email address</Label>
        <AuthInput
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <AuthInput
          type={showPw ? 'text' : 'password'}
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        >
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 0,
            }}
          >
            {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </AuthInput>

        {form.password.length > 0 && (
          <div style={{
            marginTop: 8, padding: '10px 12px',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {passwordChecks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: c.pass ? 'rgba(122,31,49,0.2)' : 'var(--surface)',
                  border: `1px solid ${c.pass ? 'rgba(156,47,68,0.4)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FiCheck size={9} style={{ color: c.pass ? 'var(--burgundy-bright)' : 'var(--text-muted)' }} />
                </div>
                <span style={{ fontSize: 11, color: c.pass ? 'var(--text)' : 'var(--text-muted)', fontWeight: c.pass ? 600 : 400 }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AuthButton loading={loading} label="Create account" />

      {/* OTP note */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          After registering you'll receive a 6-digit OTP to verify your email before accessing your account.
        </p>
      </div>

      {/* Encryption feature checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
        {[
          { title: 'AES-256-GCM', desc: 'On-device file encryption' },
          { title: 'ML-KEM key wrap', desc: 'NIST FIPS 203 quantum-safe' },
          { title: 'Zero plaintext', desc: 'We never see your files' },
        ].map(item => (
          <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(61,19,28,0.6)',
              border: '1px solid rgba(122,31,49,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiCheck size={9} style={{ color: 'var(--burgundy-bright)' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{item.title}</strong>
              {' · '}{item.desc}
            </span>
          </div>
        ))}
      </div>
    </form>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

export default function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!mode) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [mode, onClose])

  return (
    <AnimatePresence>
      {mode && (
        <>
          {/* ── Backdrop ───────────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(4, 3, 5, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* ── Modal panel ────────────────────────────────────────────── */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 201,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              pointerEvents: 'none', // let backdrop click-through work
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--surface)',
                borderRadius: 18,
                padding: '32px 28px',
                // Burgundy-to-violet gradient border glow
                boxShadow: `
                  0 0 0 1px rgba(107, 63, 160, 0.25),
                  0 0 0 1.5px rgba(122, 31, 49, 0.3),
                  0 0 40px rgba(107, 63, 160, 0.12),
                  0 0 24px rgba(122, 31, 49, 0.18),
                  0 24px 64px rgba(0, 0, 0, 0.6)
                `,
                // Subtle inner border treated as a gradient ring
                outline: 'none',
              }}
            >
              {/* Decorative violet–burgundy glow inside top of modal */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 160,
                  borderRadius: '18px 18px 0 0',
                  background: 'linear-gradient(135deg, rgba(122,31,49,0.08) 0%, rgba(107,63,160,0.06) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'border-color 0.15s, color 0.15s',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--burgundy)'
                  el.style.color = 'var(--text)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--border)'
                  el.style.color = 'var(--text-muted)'
                }}
              >
                <FiX size={14} />
              </button>

              {/* Logo mark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--burgundy)',
                  borderRadius: 7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(156,47,68,0.3)',
                }}>
                  <FiShield size={13} color="var(--text)" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                  PQC Storage
                </span>
              </div>

              {/* Form — swaps in-place with AnimatePresence */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'login' ? -12 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === 'login' ? 12 : -12 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    {mode === 'login' ? (
                      <LoginForm onSwitch={onSwitch} onClose={onClose} />
                    ) : (
                      <RegisterForm onSwitch={onSwitch} onClose={onClose} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
