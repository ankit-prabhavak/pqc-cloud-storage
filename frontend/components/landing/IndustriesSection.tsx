'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import Starfield from '@/components/ui/Starfield'
import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndustryCardProps {
  videoUrl: string
  label: string
  caption: string
  /** Vertical offset in px — creates the stagger effect */
  offset?: number
  /** Animation delay for the card entrance */
  delay?: number
}

// ─── IndustryCard ─────────────────────────────────────────────────────────────

export function IndustryCard({ videoUrl, label, caption, offset = 0, delay = 0 }: IndustryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 + offset }}
      whileInView={{ opacity: 1, y: offset }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ flexShrink: 0, scrollSnapAlign: 'start' }}
    >
      <div
        className="group relative overflow-hidden rounded-2xl border border-border flex flex-col justify-end cursor-default"
        style={{
          height: 440,
          width: 320,
          background: 'rgba(21, 18, 21, 0.9)',
          boxShadow: '0 8px 30px rgba(156, 47, 68, 0.12)',
          transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(156, 47, 68, 0.7)'
          el.style.boxShadow = '0 0 0 1px rgba(156,47,68,0.25), 0 20px 60px rgba(122,31,49,0.35), 0 0 80px rgba(122,31,49,0.18)'
          el.style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.boxShadow = '0 8px 30px rgba(156, 47, 68, 0.12)'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 -z-10"
          style={{ opacity: 0.22 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLVideoElement).style.opacity = '0.45' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).style.opacity = '0.22' }}
        >
          {isIntersecting && <source src={videoUrl} type="video/mp4" />}
        </video>

        {/* Gradient overlay — deep bottom vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(to top, #0B0A0C 0%, rgba(11,10,12,0.6) 50%, transparent 100%)',
          }}
        />

        {/* Burgundy accent glow on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(122,31,49,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-6">
          <span
            className="text-[10px] font-bold tracking-widest uppercase font-mono mb-3 inline-block px-2.5 py-1 rounded"
            style={{
              color: 'var(--burgundy-bright)',
              background: 'rgba(61, 19, 28, 0.7)',
              border: '1px solid rgba(156, 47, 68, 0.3)',
            }}
          >
            {label}
          </span>
          <h3 className="text-sm font-medium leading-relaxed font-display" style={{ color: 'var(--text)' }}>
            {caption}
          </h3>
        </div>

        {/* Default soft outer glow (always on, subtle) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: '0 8px 30px rgba(156, 47, 68, 0.12)' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Industry data ────────────────────────────────────────────────────────────

const industries = [
  {
    label: 'Healthcare',
    caption: 'Patient records encrypted before they ever leave the clinic',
    videoUrl: 'https://videos.pexels.com/video-files/30141965/12925604_1920_1080_24fps.mp4',
  },
  {
    label: 'Finance & Banking',
    caption: 'Transaction and account data safe against future decryption',
    videoUrl: 'https://videos.pexels.com/video-files/5981353/5981353-uhd_2732_1440_25fps.mp4',
  },
  {
    label: 'Legal',
    caption: 'Privileged documents, quantum-safe from discovery to archive',
    videoUrl: 'https://videos.pexels.com/video-files/8731459/8731459-hd_1920_1080_25fps.mp4',
  },
  {
    label: 'Government & Defense',
    caption: 'Classified files protected past the RSA-breaking horizon',
    videoUrl: 'https://videos.pexels.com/video-files/28454582/12388284_2560_1440_50fps.mp4',
  },
  {
    label: 'Research & Academia',
    caption: 'Unpublished research and IP, encrypted at the source',
    videoUrl: 'https://videos.pexels.com/video-files/8632602/8632602-uhd_2560_1440_25fps.mp4',
  },
]

// Stagger offsets — alternating high/low (sitting 32px higher/lower than neighbors)
const staggerOffsets = [-16, 16, -16, 16, -16]
// Card entrance delays
const cardDelays  = [0, 0.08, 0.16, 0.24, 0.32]

// ─── Main component ───────────────────────────────────────────────────────────

export default function IndustriesSection() {
  return (
    <section
      id="industries"
      className="relative overflow-hidden border-t border-border py-32 px-6"
      style={{ background: '#0B0A0C' }}
    >
      {/* Starfield */}
      <Starfield count={120} />

      {/* Soft radial center-bloom — gives depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,31,49,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-20">
          <ScrollReveal variant="fade-up" delay={0} duration={0.5}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-muted mb-4 font-mono">
              Use Cases
            </p>
          </ScrollReveal>

          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-6 font-display">
            <ScrollReveal variant="text-reveal" delay={0.05} duration={0.55}>
              Built for every
            </ScrollReveal>
            <br />
            <span style={{ color: 'var(--burgundy-bright)' }}>
              <ScrollReveal variant="text-reveal" delay={0.25} duration={0.55}>
                industry.
              </ScrollReveal>
            </span>
          </h2>

          <ScrollReveal variant="fade-up" delay={0.5} duration={0.5}>
            <p className="text-base max-w-[500px] leading-relaxed font-body" style={{ color: 'var(--text-muted)' }}>
              Any industry handling long-term, high-value secrets requires protection today
              against harvest-now-decrypt-later attacks.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Horizontal scroll container ───────────────────────────── */}
        {/*
          data-lenis-prevent stops Lenis from hijacking horizontal
          touch/trackpad scroll inside this container.
        */}
        <div
          data-lenis-prevent
          className="flex gap-8 overflow-x-auto pb-10 pt-6"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            // Extra bottom/top padding to accommodate stagger vertical offsets
            paddingBottom: '40px',
            paddingTop: '40px',
          }}
        >
          {industries.map((ind, idx) => (
            <IndustryCard
              key={idx}
              label={ind.label}
              caption={ind.caption}
              videoUrl={ind.videoUrl}
              offset={staggerOffsets[idx]}
              delay={cardDelays[idx]}
            />
          ))}
        </div>

        {/* ── Closing CTA ───────────────────────────────────────────── */}
        <ScrollReveal variant="fade-up" delay={0.2} duration={0.5}>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
              Want to see more?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm font-body transition-all duration-200"
              style={{
                background: 'var(--burgundy)',
                color: 'var(--text)',
                border: '1px solid rgba(156,47,68,0.5)',
                boxShadow: '0 0 20px rgba(122,31,49,0.25)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--burgundy-bright)'
                el.style.boxShadow = '0 0 30px rgba(156,47,68,0.45)'
                el.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--burgundy)'
                el.style.boxShadow = '0 0 20px rgba(122,31,49,0.25)'
                el.style.transform = 'scale(1)'
              }}
            >
              Get started free <FiArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
