'use client'

import Link from 'next/link'
import { FiShield, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

// ─── Team members ─────────────────────────────────────────────────────────────

const team = [
  { name: 'Member 1', role: 'Lead Engineer', linkedin: 'https://www.linkedin.com/' },
  { name: 'Member 2', role: 'Crypto Architect', linkedin: 'https://www.linkedin.com/' },
  { name: 'Member 3', role: 'Backend Developer', linkedin: 'https://www.linkedin.com/' },
  { name: 'Member 4', role: 'Frontend Developer', linkedin: 'https://www.linkedin.com/' },
  { name: 'Member 5', role: 'Security Researcher', linkedin: 'https://www.linkedin.com/' },
  { name: 'Member 6', role: 'QA & DevOps', linkedin: 'https://www.linkedin.com/' },
]

// ─── Grid pattern inline style ────────────────────────────────────────────────

const gridBg: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right,  rgba(42, 34, 36, 0.5) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(42, 34, 36, 0.5) 1px, transparent 1px)
  `,
  backgroundSize: '48px 48px',
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function FooterSection() {
  return (
    <footer
      className="relative overflow-hidden border-t border-border"
      style={{ background: 'var(--bg)', ...gridBg }}
    >
      {/* Subtle bottom vignette so grid fades out toward bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(11,10,12,0.55) 0%, transparent 25%, transparent 75%, rgba(11,10,12,0.85) 100%)',
        }}
      />

      {/* ── WORDMARK ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-16 pb-8 px-4 overflow-hidden">
        {/* Decorative burgundy bloom behind wordmark */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(122,31,49,0.12) 0%, transparent 65%)',
            filter: 'blur(1px)',
          }}
        />

        {/*
          The wordmark is NOT inside max-w-[1100px] — it's allowed to breathe
          wider and bleed toward edges. `letter-spacing: -0.04em` condenses it
          so "QUANTUM VAULT" fills most of the viewport at large font size.
        */}
        <div className="text-center select-none" aria-label="Quantum Vault">
          <span
            className="font-display font-black text-text block leading-none"
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 10rem)',
              letterSpacing: '-0.04em',
              opacity: 0.92,
              // Very subtle burgundy glow on the text itself
              textShadow: '0 0 80px rgba(156, 47, 68, 0.25)',
            }}
          >
            MARKQC
          </span>
        </div>
      </div>

      {/* ── MAIN COLUMNS ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 pb-12">
        {/* Thin separator below wordmark */}
        <div
          className="mb-12"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)',
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* ── Brand + Socials ─────────────────────────────────────────── */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center border"
                style={{
                  background: 'var(--burgundy)',
                  borderColor: 'rgba(156,47,68,0.3)',
                }}
              >
                <FiShield size={14} className="text-text" />
              </div>
              <span className="font-bold text-sm font-display text-text">
                PQC Storage
              </span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-[220px] font-body">
              Post-quantum secure cloud storage built on NIST standardized cryptography.
            </p>

            <div className="flex gap-3">
              {[
                {
                  icon: FiGithub,
                  href: 'https://github.com/ankit-prabhavak/pqc-cloud-storage',
                  label: 'GitHub Repository',
                },
                { icon: FiTwitter, href: '#', label: 'Twitter Profile' },
                { icon: FiLinkedin, href: 'https://www.linkedin.com/', label: 'LinkedIn Profile' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="rounded-lg border border-border flex items-center justify-center text-text-muted transition-colors"
                  style={{
                    width: 34,
                    height: 34,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--burgundy)'
                    el.style.color = 'var(--text)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--border)'
                    el.style.color = 'var(--text-muted)'
                  }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Security column ─────────────────────────────────────────── */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
              Security
            </div>
            <div className="flex flex-col gap-2.5 text-[13px] text-text-muted font-mono">
              {[
                'AES-256-GCM',
                'ML-KEM (Kyber)',
                'NIST FIPS 203',
                'Tamper detection',
                'Integrity hashing',
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* ── Project column ──────────────────────────────────────────── */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
              Project
            </div>
            <div className="flex flex-col gap-2.5 text-[13px] text-text-muted font-body">
              {[
                'GitHub repo',
                'Research paper',
                'API docs',
                'Contributing',
                'License (MIT)',
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* ── Team column ─────────────────────────────────────────────── */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">
              Team
            </div>
            <div className="flex flex-col gap-2.5">
              {team.map((member) => (
                <a
                  key={member.name}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  title={`${member.name} — ${member.role}`}
                  className="flex items-center gap-2 group transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <FiLinkedin
                    size={12}
                    className="flex-shrink-0 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <span
                    className="text-[13px] font-body transition-colors group-hover:text-text"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {member.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div
          className="pt-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4"
          style={{
            borderTop: '1px solid var(--border)',
          }}
        >
          {/* Copyright */}
          <span className="text-[13px] text-text-muted font-mono">
            © 2026 PQC Cloud Storage · Final Year Project
          </span>

          {/* Tech-spec tags */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {['AES-256-GCM', 'ML-KEM FIPS 203', 'Zero plaintext'].map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs text-text-muted font-mono"
              >
                <FiShield size={11} style={{ color: 'var(--burgundy-bright)' }} />
                {label}
              </span>
            ))}
          </div>

          {/* Credit */}
          <span className="text-[12px] text-text-muted font-mono opacity-60">
            Built with ML-KEM + AES · NIST FIPS 203
          </span>
        </div>
      </div>
    </footer>
  )
}
