import { motion } from 'framer-motion'
import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { Card } from '@/components/ui/Card'

const mockData = {
  original: {
    label: 'Raw PDF text',
    tokens: 3842,
    chars: 15368,
  },
  optimized: {
    label: 'Optimized Markdown',
    tokens: 921,
    chars: 3684,
  },
}

export function TokenSavingsSection() {
  const savingsPercent = Math.round(
    ((mockData.original.tokens - mockData.optimized.tokens) / mockData.original.tokens) * 100,
  )

  return (
    <Section id="token-savings">
      <div className="text-center mb-12">
        <AnimatedElement>
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            Token savings that matter
          </h2>
          <p className="text-text-dim font-mono text-sm">
            Real reduction. Lower costs. Faster LLM processing.
          </p>
        </AnimatedElement>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Before */}
        <AnimatedElement direction="left">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-text-dim">Before</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-dimmer">
                PDF
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-text">
                {mockData.original.tokens.toLocaleString()}
              </p>
              <p className="text-xs font-mono text-text-dimmer mt-1">tokens</p>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full w-full rounded-full bg-text-dimmer" />
            </div>
          </Card>
        </AnimatedElement>

        {/* After */}
        <AnimatedElement direction="right">
          <Card className="p-6 space-y-4 border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-text-dim">After</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                -{savingsPercent}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-accent">
                {mockData.optimized.tokens.toLocaleString()}
              </p>
              <p className="text-xs font-mono text-text-dimmer mt-1">tokens</p>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                whileInView={{ width: `${(mockData.optimized.tokens / mockData.original.tokens) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </Card>
        </AnimatedElement>
      </div>

      <AnimatedElement delay={0.2}>
        <p className="text-center text-xs font-mono text-text-dimmer mt-8">
          Based on typical PDF documents. Your savings may vary.
        </p>
      </AnimatedElement>
    </Section>
  )
}
