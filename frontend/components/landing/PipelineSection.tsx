'use client'

import { motion } from 'motion/react'
import { FiUpload, FiLock, FiKey, FiDatabase } from 'react-icons/fi'

const steps = [
  {
    num: "01",
    title: "You upload",
    desc: "Select any file. We accept any file type up to 100 MB. Nothing is transmitted yet.",
    icon: FiUpload,
  },
  {
    num: "02",
    title: "AES-256 encrypts",
    desc: "A fresh 256-bit key is generated. Your file is encrypted in-browser using AES-256-GCM with an auth tag.",
    icon: FiLock,
  },
  {
    num: "03",
    title: "ML-KEM wraps key",
    desc: "The AES key is encapsulated with ML-KEM. The raw key never touches the server.",
    icon: FiKey,
  },
  {
    num: "04",
    title: "Stored securely",
    desc: "The encrypted file and the wrapped key are stored separately. Even a full server compromise yields nothing readable.",
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
            4 steps. Zero trust required.
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={cardVariants}
              className="p-8 relative flex flex-col justify-between"
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
