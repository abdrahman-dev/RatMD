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
        'rounded-lg',
        variant === 'default' && 'bg-surface border border-border',
        variant === 'elevated' && 'bg-surface border border-border shadow-lg shadow-black/20',
        variant === 'bordered' && 'bg-transparent border border-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
