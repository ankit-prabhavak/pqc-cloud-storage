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
    <main className="min-h-screen bg-bg flex text-text font-body">
      {/* Left panel — form */}
      <div className="w-full max-w-[520px] mx-auto px-10 py-12 flex flex-col justify-center bg-bg border-r border-border/20">

        {/* Logo */}
        <div className="w-full mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-text hover:text-burgundy-bright transition-colors">
            <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center border border-burgundy-bright/20">
              <FiShield size={15} className="text-text" />
            </div>
            <span className="font-bold text-sm font-display text-text">PQC Storage</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text font-display mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link href="/register" className="text-burgundy-bright hover:underline font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Verified banner */}
        {verified && (
          <div className="w-full p-3.5 bg-burgundy-dim border border-burgundy/30 rounded-lg mb-5 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-burgundy/40 border border-burgundy/20 flex items-center justify-center flex-shrink-0">
              <FiCheck size={11} className="text-text" />
            </div>
            <p className="text-xs text-text-muted margin-0">Email verified successfully. You can now sign in.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full p-3.5 bg-burgundy-dim/40 border border-burgundy/30 rounded-lg mb-5">
            <p className="text-xs text-text-muted margin-0">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block font-mono">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder-text-muted/40 outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block font-mono">Password</label>
              <Link href="/forgot-password" className="text-xs text-text-muted hover:text-text transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder-text-muted/40 outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-muted hover:text-text p-0 transition-colors"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-burgundy hover:bg-burgundy-bright text-text font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(122,31,49,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? 'Signing in...' : (<>Sign in <FiArrowRight size={15} /></>)}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">secured with</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {/* Security badges */}
        <div className="w-full grid grid-cols-3 gap-2">
          {['AES-256-GCM', 'ML-KEM', 'OTP Auth'].map(badge => (
            <div key={badge} className="py-2 px-2 bg-surface border border-border rounded-lg text-center">
              <span className="text-[10px] font-semibold text-text font-mono tracking-wide">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-center px-14 py-16 bg-[#0B0A0C] border-l border-border">
        {/* Glow orbs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(122,31,49,0.12)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(61,19,28,0.18)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="mb-12 relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
            Your files are waiting
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text leading-snug mb-4 font-display">
            End-to-end encrypted. Always.
          </h2>
          <p className="text-sm text-text-muted leading-relaxed font-body">
            Your files are encrypted with AES-256-GCM and keys protected by ML-KEM before anything reaches our servers. Not even we can read them.
          </p>
        </div>

        {/* Mini security score card */}
        <div className="bg-surface-raised border border-border rounded-2xl p-6 mb-8 relative z-10 shadow-lg shadow-black/40">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-text">Security Score</span>
            <span className="text-xl font-bold text-burgundy-bright font-mono">95/100</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden mb-4">
            <div className="w-[95%] h-full bg-burgundy-bright rounded-full" />
          </div>
          {[
            { label: 'Hybrid encryption active', points: '+40' },
            { label: 'OTP verification enabled', points: '+25' },
            { label: 'Download limit set', points: '+20' },
            { label: 'Expiry configured', points: '+10' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center mb-2.5 last:mb-0">
              <span className="text-xs text-text-muted">{row.label}</span>
              <span className="text-xs font-semibold text-text font-mono">{row.points}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border relative z-10">
          <p className="text-[11px] text-text-muted font-mono tracking-wide">
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
