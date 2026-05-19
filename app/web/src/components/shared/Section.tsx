import { cn } from '@/lib/utils/cn'
import { Container } from '@/components/ui/Container'
import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  background?: 'default' | 'surface' | 'accent-subtle'
}

export function Section({ children, id, background = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 sm:py-20 lg:py-24',
        background === 'surface' && 'bg-surface/30',
        background === 'accent-subtle' && 'bg-accent-subtle',
      )}
    >
      <Container>{children}</Container>
    </section>
  )
}
