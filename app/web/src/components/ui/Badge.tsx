import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium',
        variant === 'default' && 'bg-surface text-text-dim border border-border',
        variant === 'accent' && 'bg-accent/10 text-accent border border-accent/20',
        variant === 'success' && 'bg-success/10 text-success border border-success/20',
        variant === 'warning' && 'bg-warning/10 text-warning border border-warning/20',
        className,
      )}
    >
      {children}
    </span>
  )
}
