'use client'

/**
 * ScrollReveal — Framer Motion scroll-triggered reveal primitive.
 *
 * Usage:
 *   <ScrollReveal variant="fade-up">
 *     <p>Content</p>
 *   </ScrollReveal>
 *
 *   <ScrollReveal variant="text-reveal" staggerWords>
 *     Some headline text
 *   </ScrollReveal>
 *
 * Works with the existing Lenis/frame-loop sync — uses Framer Motion's
 * useInView (which reads scroll from the Motion scroll engine, not a
 * competing rAF loop), so no extra listener is needed.
 */

import { useRef, ReactNode } from 'react'
import {
  motion,
  useInView,
  Variants,
  HTMLMotionProps,
} from 'motion/react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type RevealVariant = 'fade-up' | 'fade-scale' | 'text-reveal'

interface ScrollRevealProps {
  /** Animation variant to apply */
  variant?: RevealVariant
  /** Children to reveal */
  children: ReactNode
  /** Delay before the animation starts (seconds). Default 0. */
  delay?: number
  /** Duration of the animation (seconds). Default 0.6. */
  duration?: number
  /** Threshold — fraction of element visible before triggering. Default 0.15. */
  threshold?: number
  /** Only trigger once. Default true. */
  once?: boolean
  /** Extra class names on the wrapper */
  className?: string
  /** For text-reveal: stagger each word individually */
  staggerWords?: boolean
  /** Word stagger delay in seconds. Default 0.04. */
  wordStagger?: number
}

// ─── Variant motion configs ───────────────────────────────────────────────────

const variants: Record<RevealVariant, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-scale': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  // Used as fallback when children is not a string
  'text-reveal': {
    hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
  },
}

// Per-word variant for text-reveal stagger
const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    clipPath: 'inset(100% 0 0 0)', 
    y: '25%' 
  },
  visible: { 
    opacity: 1, 
    clipPath: 'inset(0% 0% 0% 0%)', 
    y: '0%' 
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScrollReveal({
  variant = 'fade-up',
  children,
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  once = true,
  className = '',
  staggerWords = true, // Default to true for text-reveal word stagger
  wordStagger = 0.04, // Default to 40ms stagger
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  // ── Text-reveal with per-word stagger ──────────────────────────────────────
  if (variant === 'text-reveal' && staggerWords && typeof children === 'string') {
    const words = children.split(' ')
    return (
      <span ref={ref} className={`inline ${className}`} aria-label={children}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block mr-[0.25em]"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={wordVariants}
            transition={{
              duration,
              delay: delay + i * wordStagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </span>
    )
  }

  // ── Default: whole-element reveal ──────────────────────────────────────────
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
