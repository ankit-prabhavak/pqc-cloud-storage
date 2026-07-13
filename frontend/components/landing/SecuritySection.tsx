'use client'

import { FiCheck, FiFile, FiShield } from 'react-icons/fi'
import { Cpu, ShieldCheck, Fingerprint, TimerOff, EyeOff } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const standards = [
  {
    algo: "AES-256-GCM",
    std: "FIPS 197",
    purpose: "File encryption",
  },
  {
    algo: "ML-KEM-768",
    std: "FIPS 203",
    purpose: "Key encapsulation (PQC)",
  },
  {
    algo: "SHA-256",
    std: "FIPS 180-4",
    purpose: "Integrity hashing",
  },
  {
    algo: "bcrypt (cost 12)",
    std: "RFC 2898",
    purpose: "Password hashing",
  },
  {
    algo: "JWT (RS256)",
    std: "RFC 7519",
    purpose: "Stateless authentication",
  },
]

const scoreRows = [
  {
    icon: Cpu,
    label: "ML-KEM post-quantum key wrapping",
    pts: 40,
    max: 40,
    color: "#9C2F44",
    bg: "rgba(156, 47, 68, 0.15)",
    pips: 4,
  },
  {
    icon: ShieldCheck,
    label: "AES-GCM authentication tag",
    pts: 20,
    max: 20,
    color: "#9C2F44",
    bg: "rgba(156, 47, 68, 0.15)",
    pips: 3,
  },
  {
    icon: Fingerprint,
    label: "SHA-256 integrity hash",
    pts: 20,
    max: 20,
    color: "#A69C9A",
    bg: "rgba(166, 156, 154, 0.15)",
    pips: 3,
  },
  {
    icon: TimerOff,
    label: "Self-destruct timer configured",
    pts: 10,
    max: 10,
    color: "#7A1F31",
    bg: "rgba(122, 31, 49, 0.15)",
    pips: 2,
  },
  {
    icon: EyeOff,
    label: "Private — no public share link",
    pts: 10,
    max: 10,
    color: "#7A1F31",
    bg: "rgba(122, 31, 49, 0.15)",
    pips: 2,
  },
]

export default function SecuritySection() {
  return (
    <section id="security" className="max-w-[1100px] mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3 font-mono">
            Security standards
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text leading-tight mb-5 font-display">
            Only NIST standardized cryptography
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-8 font-body">
            We do not use experimental or unvetted algorithms. Every primitive in this stack has been standardized by NIST — the same body that standardized AES in 2001 and published ML-KEM in August 2024.
          </p>

          <div className="flex flex-col gap-4">
            {standards.map((item, idx) => (
              <ScrollReveal
                key={item.algo}
                variant="fade-up"
                delay={idx * 0.08}
                className="flex items-start gap-3.5 py-2 border-b border-border/50 last:border-none"
              >
                <div className="w-5 h-5 rounded-full bg-burgundy-dim border border-burgundy/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheck size={11} className="text-burgundy-bright" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text font-mono">
                      {item.algo}
                    </span>
                    <span className="text-[10px] text-text-muted bg-surface-raised px-1.5 py-0.5 rounded border border-border">
                      {item.std}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5 font-body">
                    {item.purpose}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Score card */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* File header + score ring */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center">
                <FiFile size={16} className="text-text-muted" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text font-mono">
                  research_paper_final.pdf
                </div>
                <div className="text-[11px] text-text-muted mt-0.5 font-mono">
                  2.4 MB · Uploaded just now
                </div>
              </div>
            </div>

            {/* SVG ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="transform -rotate-90"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="var(--burgundy-bright)"
                  strokeWidth="5"
                  strokeDasharray="163.4"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-text font-mono leading-none">
                  100
                </span>
                <span className="text-[9px] text-text-muted font-semibold tracking-wider mt-0.5 uppercase font-mono">
                  SCORE
                </span>
              </div>
            </div>
          </div>

          {/* Check rows */}
          <div className="p-6 pt-1 flex flex-col">
            {scoreRows.map((row, i, arr) => (
              <div
                key={row.label}
                className={`py-3.5 flex items-center gap-3.5 border-b border-border/40 ${i === arr.length - 1 ? 'border-none' : ''
                  }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: row.bg }}
                >
                  <row.icon size={13} color={row.color} />
                </div>
                <div className="flex-1 text-sm text-text font-body">
                  {row.label}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className={`width-[18px] h-1 rounded-sm ${j < row.pips ? 'bg-burgundy-bright' : 'bg-border'
                          }`}
                        style={{ width: '18px' }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-text font-mono min-w-[20px] text-right">
                    {row.pts}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mx-6 mb-5 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <div className="text-[11px] text-text-muted font-mono">Total score</div>
              <div>
                <span className="text-2xl font-bold text-text font-mono tracking-tight">
                  100
                </span>
                <span className="text-xs text-text-muted font-mono"> / 100</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-burgundy text-text text-xs font-semibold px-3 py-2 rounded-lg tracking-wide border border-burgundy-bright/20 font-mono">
              <FiShield size={12} />
              Quantum-Safe
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
