import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'

const streaks = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 8.5) % 100}%`,
  top: `${(i * 13) % 100}%`,
  width: `${18 + (i % 5) * 4}%`,
  rotation: 20 + (i % 7) * 5,
  duration: 22 + (i % 4) * 6,
  delay: i * 1.2,
}))

export function HeroSection() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      {/* Animated light streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {streaks.map((s) => (
          <motion.div
            key={s.id}
            className="absolute h-px"
            style={{
              left: s.left,
              top: s.top,
              width: s.width,
              rotate: `${s.rotation}deg`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            }}
            animate={{
              x: [0, 40, 0, -40, 0],
              y: [0, -20, 0, 20, 0],
              opacity: [0, 0.5, 0.2, 0.6, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Secondary thicker streaks */}
        {streaks.slice(0, 4).map((_, i) => (
          <motion.div
            key={`thick-${i}`}
            className="absolute h-[2px]"
            style={{
              left: `${(i * 25 + 5) % 100}%`,
              top: `${(i * 30 + 10) % 100}%`,
              width: `${25 + i * 5}%`,
              rotate: `${35 + i * 8}deg`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            }}
            animate={{
              x: [0, -30, 0, 30, 0],
              opacity: [0, 0.3, 0.1, 0.4, 0],
            }}
            transition={{
              duration: 30 + i * 5,
              delay: i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-surface"
          >
            <motion.span
              className="w-1.5 h-1.5 block"
              style={{ backgroundColor: 'var(--color-accent)', boxShadow: '0 0 6px var(--color-accent)' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
            <span className="text-xs font-mono">
              <span className="text-accent">v0.1.0</span>
              <span className="text-text-dim"> — MVP</span>
            </span>
          </motion.div>

          {/* Visual metaphor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-mono text-text-dim"
          >
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text font-sans leading-tight"
          >
            Stop feeding your AI<br />
            <span
              className="text-accent"
              style={{ textShadow: '0 0 40px var(--color-accent-glow)' }}
            >
              clean AI-ready
            </span><br />
            junk.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-text-dim max-w-xl font-mono"
          >
            Drop a PDF. Get clean Markdown. Save tokens. Done.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto"
          >
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.converter)}>
              Try it free
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(ROUTES.docs)}>
              See the docs
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-10 gap-y-1 pt-8 text-xs font-mono text-text-dimmer"
          >
            <span>runs in your browser</span>
            <span className="w-1 h-1 bg-border" />
            <span>zero data collected</span>
            <span className="w-1 h-1 bg-border" />
            <span>LLM-ready output</span>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
