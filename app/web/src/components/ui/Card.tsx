import { cn } from '@/lib/utils/cn'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
}

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-none',
        variant === 'default' && 'bg-surface border border-border hover:border-border-light transition-colors duration-150',
        variant === 'elevated' && 'bg-surface border border-border hover:border-border-light transition-colors duration-150',
        variant === 'bordered' && 'bg-transparent border border-border hover:border-border-light transition-colors duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
