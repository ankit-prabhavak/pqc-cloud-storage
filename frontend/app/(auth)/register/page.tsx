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
    <main className="min-h-screen bg-bg flex text-text font-body">

      {/* Left panel */}
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
            Create your account
          </h1>
          <p className="text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-burgundy-bright hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full p-3.5 bg-burgundy-dim border border-burgundy/30 rounded-lg mb-5">
            <p className="text-xs text-text-muted margin-0">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block font-mono">Full name</label>
            <input
              type="text"
              placeholder="Ankit Prabhavak"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder-text-muted/40 outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block font-mono">Email address</label>
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
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block font-mono">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
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

            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 bg-surface-raised border border-border rounded-lg p-3">
                {passwordChecks.map(check => (
                  <div key={check.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border ${check.pass ? 'bg-burgundy/20 border-burgundy/40' : 'bg-surface border-border'
                      }`}>
                      <FiCheck size={9} className={check.pass ? 'text-burgundy-bright' : 'text-text-muted'} />
                    </div>
                    <span className={`text-xs ${check.pass ? 'text-text font-semibold' : 'text-text-muted'}`}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-burgundy hover:bg-burgundy-bright text-text font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(122,31,49,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? 'Creating account...' : (
              <>Create account <FiArrowRight size={15} /></>
            )}
          </button>
        </form>

        {/* OTP note */}
        <div className="w-full mt-5 p-3.5 bg-surface border border-border rounded-lg">
          <p className="text-xs text-text-muted leading-relaxed font-body">
            After registering you will receive a 6-digit OTP to verify your email address before accessing your account.
          </p>
        </div>
      </div>

      {/* Right panel — info */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-center px-14 py-16 bg-[#0B0A0C] border-l border-border">
        {/* Radial glow background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(122,31,49,0.12)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(61,19,28,0.18)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="mb-12 relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
            What happens to your files
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text leading-snug mb-4 font-display">
            Encrypted before they leave your device
          </h2>
          <p className="text-sm text-text-muted leading-relaxed font-body">
            Every file goes through AES-256-GCM encryption. Keys are protected with ML-KEM — the NIST FIPS 203 standard. We never see your files in plaintext.
          </p>
        </div>

        <div className="flex flex-col gap-5 relative z-10">
          {[
            { title: 'AES-256-GCM', desc: 'File encryption — same strength used by banks and governments' },
            { title: 'ML-KEM key wrapping', desc: 'NIST FIPS 203 — quantum-resistant key encapsulation' },
            { title: 'Zero plaintext storage', desc: 'Cloudflare R2 only receives encrypted blobs' },
            { title: 'Cryptographic audit trail', desc: 'SHA-256 chained logs for every action' },
          ].map(item => (
            <div key={item.title} className="flex gap-3.5 items-start">
              <div className="w-5 h-5 rounded-full bg-burgundy-dim border border-burgundy/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiCheck size={10} className="text-burgundy-bright" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text font-mono mb-1">{item.title}</div>
                <div className="text-xs text-text-muted leading-relaxed font-body">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border relative z-10">
          <p className="text-[11px] text-text-muted font-mono tracking-wide">
            NIST FIPS 203 · AES-256-GCM · SHA-256 · MIT License
          </p>
        </div>
      </div>
    </main>
  )
}