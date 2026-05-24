import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface Palette {
  bg: string
  greenR: number
  greenG: number
  greenB: number
  dimR: number
  dimG: number
  dimB: number
}

function getPalette(): Palette {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light') {
    return {
      bg: '#F7F5F0',
      greenR: 26,
      greenG: 122,
      greenB: 5,
      dimR: 0,
      dimG: 0,
      dimB: 0,
    }
  }
  return {
    bg: '#080B09',
    greenR: 57,
    greenG: 255,
    greenB: 20,
    dimR: 255,
    dimG: 255,
    dimB: 255,
  }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let width = window.innerWidth
    let height = window.innerHeight
    let scanY = -16
    let scanActive = false
    let scanTimer = 0
    let scanInterval = 200 + Math.floor(Math.random() * 100)
    const paletteRef = { current: getPalette() }

    const particles: Particle[] = []

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
    }

    function initParticles() {
      const p = paletteRef.current
      particles.length = 0
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(0.15 + Math.random() * 0.5),
          radius: 1.5 + Math.random() * 1,
          color: `rgba(${p.greenR},${p.greenG},${p.greenB},${0.5 + Math.random() * 0.3})`,
        })
      }
      for (let i = 0; i < 18; i++) {
        const a = 0.12 + Math.random() * 0.1
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 1 + Math.random() * 0.8,
          color: `rgba(${p.dimR},${p.dimG},${p.dimB},${a})`,
        })
      }
    }

    function draw() {
      const p = paletteRef.current
      ctx!.fillStyle = p.bg
      ctx!.fillRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0) particle.x += width
        if (particle.x > width) particle.x -= width
        if (particle.y < 0) particle.y += height
        if (particle.y > height) particle.y -= height

        ctx!.beginPath()
        ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx!.fillStyle = particle.color
        ctx!.fill()
      }

      scanTimer++
      if (!scanActive && scanTimer >= scanInterval) {
        scanActive = true
        scanY = 0
        scanTimer = 0
        scanInterval = 200 + Math.floor(Math.random() * 100)
      }

      if (scanActive) {
        scanY += 0.9
        const grad = ctx!.createLinearGradient(0, scanY - 8, 0, scanY + 8)
        grad.addColorStop(0, `rgba(${p.greenR},${p.greenG},${p.greenB},0)`)
        grad.addColorStop(0.5, `rgba(${p.greenR},${p.greenG},${p.greenB},0.12)`)
        grad.addColorStop(1, `rgba(${p.greenR},${p.greenG},${p.greenB},0)`)
        ctx!.fillStyle = grad
        ctx!.fillRect(0, scanY - 8, width, 16)
        ctx!.fillStyle = `rgba(${p.greenR},${p.greenG},${p.greenB},0.18)`
        ctx!.fillRect(0, scanY, width, 1)
        if (scanY > height + 8) scanActive = false
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    draw()

    const observer = new MutationObserver(() => {
      paletteRef.current = getPalette()
      initParticles()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
