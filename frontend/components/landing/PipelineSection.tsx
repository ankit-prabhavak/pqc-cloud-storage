'use client'

import { motion } from 'motion/react'
import { FiUpload, FiLock, FiKey, FiDatabase, FiShield, FiServer } from 'react-icons/fi'

const steps = [
  {
    num: "01",
    title: "You drop a file",
    desc: "Nothing is sent yet, this happens entirely in your browser.",
    icon: FiUpload,
  },
  {
    num: "02",
    title: "Key generation",
    desc: "A fresh AES-256 key and IV are generated locally.",
    icon: FiKey,
  },
  {
    num: "03",
    title: "On-device encryption",
    desc: "Your file is encrypted on-device with AES-256-GCM before any network call.",
    icon: FiLock,
  },
  {
    num: "04",
    title: "Post-quantum encapsulation",
    desc: "Your ML-KEM-768 public key wraps that AES key client-side.",
    icon: FiShield,
  },
  {
    num: "05",
    title: "Secure transmission",
    desc: "Only ciphertext and the wrapped key travel over the network, TLS-protected.",
    icon: FiServer,
  },
  {
    num: "06",
    title: "Finalized storage",
    desc: "The file lands in storage and the key envelope in the database, logged with SHA-256.",
    icon: FiDatabase,
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

export default function PipelineSection() {
  return (
    <section
      id="how-it-works"
      className="bg-surface border-t border-b border-border py-24 px-6"
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3 font-mono">
            Encryption pipeline
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text leading-tight mb-0 font-display">
            6 steps. Zero trust required.
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={cardVariants}
              className="card-premium p-8 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold text-text-muted font-mono">
                    {step.num}
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="w-9 h-9 bg-surface-raised border border-border rounded-lg flex items-center justify-center mb-4">
                  <step.icon size={16} className="text-text" />
                </div>
                <h3 className="text-base font-semibold text-text mb-2 font-display">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
