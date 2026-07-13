'use client'

/**
 * NavGradient — Subtle burgundy-tinted radial gradient that sits directly
 * below the sticky navbar on authenticated/app pages.
 *
 * Usage (wrap page content BELOW the <Navbar />):
 *   <NavGradient>
 *     <div>...page content...</div>
 *   </NavGradient>
 *
 * This sits above the Aurora WebGL layer (pointer-events:none, z-index:1)
 * so Aurora still shows through underneath. It fades from a muted burgundy
 * tone at the top to fully transparent over ~500px — similar to the
 * nav-accent gradient on AWS console pages.
 */

import { ReactNode } from 'react'

interface NavGradientProps {
  children: ReactNode
  className?: string
}

export default function NavGradient({ children, className = '' }: NavGradientProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Gradient overlay — positioned absolute so it doesn't push content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '520px',
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'radial-gradient(ellipse 80% 400px at 50% -60px, rgba(122, 31, 49, 0.18) 0%, rgba(122, 31, 49, 0.06) 40%, transparent 75%)',
          // Additional linear layer for the "bleed from top" feel
        }}
      />
      {/* Thin top border accent line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          pointerEvents: 'none',
          zIndex: 2,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(156, 47, 68, 0.35) 30%, rgba(156, 47, 68, 0.35) 70%, transparent 100%)',
        }}
      />
      {/* Page content sits above gradient via relative stacking */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
