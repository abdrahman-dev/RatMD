import { motion } from 'framer-motion'
import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { Card } from '@/components/ui/Card'

const cliCommands = [
  { cmd: 'ratmd convert file.pdf', desc: 'Convert PDF to Markdown' },
  { cmd: 'ratmd convert file.pdf --output result.md', desc: 'Specify output file' },
  { cmd: 'ratmd stats file.pdf', desc: 'Show token statistics' },
  { cmd: 'ratmd batch ./pdfs/', desc: 'Batch convert all PDFs in directory' },
]

export function CLIPreviewSection() {
  return (
    <Section id="cli" background="surface">
      <div className="text-center mb-12">
        <AnimatedElement direction="left">
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            CLI-first workflow
          </h2>
          <p className="text-text-dim font-mono text-sm">
            Use from your terminal. Pipe into LLMs directly.
          </p>
        </AnimatedElement>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-text-dimmer/60" />
            <span className="text-xs font-mono text-text-dimmer ml-2">terminal</span>
          </div>

          {/* Commands */}
          <div className="p-4 space-y-3">
            {cliCommands.map((item) => (
              <AnimatedElement key={item.cmd} delay={0.1}>
                <div className="flex items-start gap-3">
                  <span className="text-text-dim font-mono text-sm shrink-0">$</span>
                  <div>
                    <code className="block text-sm font-mono text-text break-all">
                      {item.cmd}
                    </code>
                    <span className="text-xs font-mono text-text-dimmer">
                      # {item.desc}
                    </span>
                  </div>
                </div>
              </AnimatedElement>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-accent font-mono text-sm"
            >
              █
            </motion.span>
          </div>
        </Card>
      </div>

      <AnimatedElement delay={0.3}>
        <p className="text-center text-xs font-mono text-text-dimmer mt-6">
          CLI tools coming soon. Web version available now.
        </p>
      </AnimatedElement>
    </Section>
  )
}
