import type { ReactNode } from 'react'
import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { Card } from '@/components/ui/Card'
import { FEATURES } from '@/lib/constants'

const iconSvg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    {children}
  </svg>
)

const iconMap: Record<string, ReactNode> = {
  brain: iconSvg(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /><path d="M9 4v-1M15 4V3M9 21v-1M15 21v-1M4 9H3M4 15H3M21 9h-1M21 15h-1" /></>),
  lock: iconSvg(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  shield: iconSvg(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  terminal: iconSvg(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>),
  zap: iconSvg(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  database: iconSvg(<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></>),
}

export function FeaturesSection() {
  return (
    <Section id="features" background="surface">
      <div className="text-center mb-12">
        <AnimatedElement direction="right">
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            Built by devs, for devs
          </h2>
          <p className="text-text-dim font-mono text-sm">
            No fluff. Just the stuff that matters.
          </p>
        </AnimatedElement>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature: { title: string; description: string; icon: string }, i: number) => (
          <AnimatedElement key={feature.title} delay={i * 0.05} direction={i % 2 === 0 ? 'left' : 'right'}>
            <Card className="p-5 h-full hover:border-accent/30 hover:bg-accent-subtle transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-text-dim mt-0.5 shrink-0">
                  {iconMap[feature.icon] ?? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  )}
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
