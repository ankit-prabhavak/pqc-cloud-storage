'use client'

import { motion } from 'motion/react'
import { FiLock, FiEye, FiClock, FiKey, FiShield, FiServer } from 'react-icons/fi'

const features = [
  {
    icon: FiLock,
    title: "Hybrid encryption",
    desc: "AES-256-GCM encrypts your files. ML-KEM wraps the key. Fast symmetric encryption guarded by quantum-resistant key encapsulation.",
    tag: "AES + ML-KEM",
  },
  {
    icon: FiEye,
    title: "Zero plaintext storage",
    desc: "Files are encrypted before leaving your device. Cloudflare R2 only receives ciphertext. Even we cannot read your files.",
    tag: "Client-side only",
  },
  {
    icon: FiClock,
    title: "Self-destruct files",
    desc: "Set files to auto-delete after a time limit or download count. MongoDB TTL handles deletion automatically, server-side.",
    tag: "TTL + count limit",
  },
  {
    icon: FiKey,
    title: "Cryptographic audit trail",
    desc: "Every action logged with a SHA-256 chained audit trail. Each entry signs the previous one — tamper-evident by design.",
    tag: "SHA-256 chained",
  },
  {
    icon: FiShield,
    title: "Quantum security score",
    desc: "Every file gets a score based on encryption type, integrity hash, sharing status, and self-destruct settings. Know your risk at a glance.",
    tag: "0–100 scoring",
  },
  {
    icon: FiServer,
    title: "Tamper detection",
    desc: "AES-GCM authentication tag detects any modification to encrypted files. SHA-256 hash provides an additional integrity check.",
    tag: "GCM auth tag",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-[1100px] mx-auto px-6 py-24">
      <div className="mb-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3 font-mono">
          Features
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-text max-w-[480px] leading-tight mb-4 font-display">
          Everything sensitive data demands
        </h2>
        <p className="text-base text-text-muted max-w-[480px] leading-relaxed">
          Built for developers, researchers, and organizations with long-term confidentiality requirements.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="card-premium flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-surface-raised border border-border rounded-xl flex items-center justify-center mb-5">
                <f.icon size={18} className="text-text" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <h3 className="text-base font-semibold text-text font-display">
                  {f.title}
                </h3>
                <span className="text-[10px] font-semibold text-text-muted bg-surface-raised px-2 py-0.5 rounded border border-border whitespace-nowrap font-mono">
                  {f.tag}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
