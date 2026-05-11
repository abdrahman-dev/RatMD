import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { HOW_IT_WORKS } from '@/lib/constants'

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <div className="text-center mb-12">
        <AnimatedElement>
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            How it works
          </h2>
          <p className="text-text-dim font-mono text-sm">
            Five steps from PDF to optimized Markdown
          </p>
        </AnimatedElement>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-8">
          {HOW_IT_WORKS.map((step: { number: number; title: string; description: string }, i: number) => (
            <AnimatedElement key={step.number} delay={i * 0.08} direction="left">
              <div className="relative flex items-start gap-6 pl-0 sm:pl-14">
                {/* Number */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border font-mono text-sm text-text-dim shrink-0">
                  {step.number}
                </div>

                <div className="pt-2.5">
                  <h3 className="text-base font-semibold text-text font-sans mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-dim font-mono">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </div>
    </Section>
  )
}
