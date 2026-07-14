'use client'

import { motion } from 'motion/react'
import { FiUpload, FiLock, FiKey, FiDatabase, FiShield, FiServer } from 'react-icons/fi'
import Starfield from '@/components/ui/Starfield'
import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'You drop a file',
    desc: 'Nothing is sent yet. This happens entirely in your browser — your file never leaves the device unencrypted.',
    icon: FiUpload,
  },
  {
    num: '02',
    title: 'Key generation',
    desc: 'A fresh AES-256 key and initialization vector are generated locally using the Web Crypto API.',
    icon: FiKey,
  },
  {
    num: '03',
    title: 'On-device encryption',
    desc: 'Your file is encrypted with AES-256-GCM entirely on-device before any network call is made.',
    icon: FiLock,
  },
  {
    num: '04',
    title: 'Post-quantum encapsulation',
    desc: 'Your ML-KEM-768 public key wraps the AES key client-side — quantum computers can\'t unravel it.',
    icon: FiShield,
  },
  {
    num: '05',
    title: 'Secure transmission',
    desc: 'Only ciphertext and the wrapped key travel over the network — TLS-protected, never plaintext.',
    icon: FiServer,
  },
  {
    num: '06',
    title: 'Finalized storage',
    desc: 'The file lands in cloud storage; the key envelope and SHA-256 integrity hash go to the database.',
    icon: FiDatabase,
  },
]

// ─── Decorative diagonal light-trail SVG ──────────────────────────────────────

function LightTrail() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
      <svg
        aria-hidden="true"
        className="absolute w-full h-full opacity-25"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="diagonal-trail" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9C2F44" stopOpacity="0" />
            <stop offset="30%" stopColor="#9C2F44" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#7A1F31" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3D131C" stopOpacity="0" />
          </linearGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>
        {/* Soft thick blur trail */}
        <path
          d="M1350,50 C1050,150 650,550 50,650"
          stroke="url(#diagonal-trail)"
          strokeWidth="36"
          filter="url(#blur-glow)"
          className="animate-drift"
        />
        {/* Crisp thin core trail */}
        <path
          d="M1350,50 C1050,150 650,550 50,650"
          stroke="url(#diagonal-trail)"
          strokeWidth="2.5"
          className="animate-drift"
        />
      </svg>
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-24px, 16px) scale(1.02); }
        }
        .animate-drift {
          animation: drift 14s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PipelineSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-b border-border py-32 px-6"
      style={{ background: '#0B0A0C' }}
    >
      {/* Starfield background */}
      <Starfield count={140} />

      {/* Decorative light-trail */}
      <LightTrail />

      {/* Radial vignette to give depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(11,10,12,0.9) 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1080px] mx-auto">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mb-20">
          <ScrollReveal variant="fade-up" delay={0} duration={0.5}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-muted mb-4 font-mono">
              Encryption pipeline
            </p>
          </ScrollReveal>

          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-6 font-display">
            <ScrollReveal variant="text-reveal" delay={0.05} duration={0.55}>
              6 steps.
            </ScrollReveal>{' '}
            <span style={{ color: 'var(--burgundy-bright)' }}>
              <ScrollReveal variant="text-reveal" delay={0.2} duration={0.55}>
                Zero trust required.
              </ScrollReveal>
            </span>
          </h2>

          <ScrollReveal variant="fade-up" delay={0.4} duration={0.5}>
            <p className="text-base text-text-muted max-w-md leading-relaxed font-body">
              Every step runs in your browser. The server only ever sees encrypted bytes.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Step cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <ScrollReveal
              key={step.num}
              variant="fade-up"
              delay={idx * 0.08}
              className="group relative flex flex-col p-8 rounded-2xl border border-border/80 overflow-hidden cursor-default"
              staggerWords={false}
            >
              {/* Card wrapper inside ScrollReveal that handles interactive hover states */}
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(21, 18, 21, 0.75)',
                  backdropFilter: 'blur(8px)',
                }}
              />
              
              {/* Subtle burgundy hover glow sweep */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(156, 47, 68, 0.12) 0%, transparent 70%)',
                  boxShadow: '0 0 0 1px rgba(156, 47, 68, 0.25), 0 20px 50px rgba(122, 31, 49, 0.25), 0 0 60px rgba(122, 31, 49, 0.1)',
                }}
              />

              {/* Step number + divider */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: 'var(--burgundy-bright)' }}
                >
                  {step.num}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 relative z-10 border transition-colors group-hover:border-burgundy-bright/40"
                style={{
                  background: 'rgba(61, 19, 28, 0.6)',
                  borderColor: 'rgba(122, 31, 49, 0.4)',
                }}
              >
                <step.icon size={16} style={{ color: 'var(--burgundy-bright)' }} />
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <h3 className="text-sm font-semibold mb-2 font-display transition-colors group-hover:text-burgundy-bright" style={{ color: 'var(--text)' }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
