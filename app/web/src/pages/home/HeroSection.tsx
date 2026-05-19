import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LogoIcon } from '@/components/ui/logo'
import { ROUTES } from '@/lib/constants'

const floatingWords = [
  'tokens', 'RAG', 'context', '.pdf', 'embed', 'chunk',
  'llm', 'markdown', 'vector', 'parse', 'optimize', 'clean',
]

function FloatingText({ word, index }: { word: string; index: number }) {
  const startX = (index * 8.3) % 100
  const duration = 6 + (index % 5) * 0.8
  const delay = index * 0.7

  return (
    <motion.span
      className="absolute font-mono text-xs text-text-dimmer pointer-events-none select-none"
      style={{
        left: `${startX}%`,
        bottom: '-20px',
      }}
      initial={{ y: 60, opacity: 0 }}
      animate={{
        y: -60,
        opacity: [0, 0.15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {word}
    </motion.span>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-subtle via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-surface rounded-full blur-[120px] pointer-events-none" />

      {/* Floating text fragments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingWords.map((word, i) => (
          <FloatingText key={word} word={word} index={i} />
        ))}
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full block"
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
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              PDF
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <LogoIcon size={32} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              .md
            </motion.span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text font-sans leading-tight"
          >
            Turn bloated PDFs into{' '}
            <span
              className="text-accent"
              style={{ textShadow: '0 0 40px var(--color-accent-glow)' }}
            >
              clean AI-ready
            </span>{' '}
            Markdown.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-text-dim max-w-xl font-mono"
          >
            Save up to <span className="text-accent font-bold">20% tokens</span> instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto"
          >
            <Link to={ROUTES.converter}>
              <Button variant="primary" size="lg">
                Try RatMD
              </Button>
            </Link>
            <Link to={ROUTES.docs}>
              <Button variant="outline" size="lg">
                CLI Docs
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-10 gap-y-1 pt-8 text-xs font-mono text-text-dimmer"
          >
            <span>local-first</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>privacy focused</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>RAG-ready</span>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
