'use client'

import { useEffect, useRef, memo } from 'react'

interface StarfieldProps {
  /** Number of stars. Default 120. */
  count?: number
  className?: string
}

const Starfield = memo(function Starfield({ count = 120, className = '' }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // Generate stars
    const stars = Array.from({ length: count }, () => {
      const isBurgundy = Math.random() > 0.85
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.4, // 0.4px to 1.3px
        // Twinkle properties
        alpha: Math.random(),
        speed: 0.003 + Math.random() * 0.007, // Slow subtle twinkle
        color: isBurgundy ? '156, 47, 68' : '245, 241, 238',
      }
    })

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      // re-distribute stars
      stars.forEach((star) => {
        star.x = Math.random() * width
        star.y = Math.random() * height
      })
    }

    window.addEventListener('resize', handleResize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < count; i++) {
        const s = stars[i]
        s.alpha += s.speed
        if (s.alpha <= 0.05 || s.alpha >= 0.95) {
          s.speed = -s.speed
        }
        // clamp alpha
        const alpha = Math.max(0.05, Math.min(0.95, s.alpha))
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
})

export default Starfield
