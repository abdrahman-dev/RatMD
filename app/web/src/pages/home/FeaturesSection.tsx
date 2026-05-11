import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { Card } from '@/components/ui/Card'
import { FEATURES } from '@/lib/constants'

const iconMap: Record<string, string> = {
  brain: '{ }',
  lock: '[+]',
  shield: '(!)',
  terminal: '$_',
  zap: '~>',
  database: '(#)',
}

export function FeaturesSection() {
  return (
    <Section id="features" background="surface">
      <div className="text-center mb-12">
        <AnimatedElement>
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            Built for developers
          </h2>
          <p className="text-text-dim font-mono text-sm">
            Every feature designed for AI workflows
          </p>
        </AnimatedElement>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature: { title: string; description: string; icon: string }, i: number) => (
          <AnimatedElement key={feature.title} delay={i * 0.05}>
            <Card className="p-5 h-full hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-lg font-mono text-text-dim mt-0.5 shrink-0">
                  {iconMap[feature.icon] || '<>'}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-text font-sans">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-dim font-mono leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
        ))}
      </div>
    </Section>
  )
}
