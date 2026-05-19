import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-mono font-medium rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',

          // Variants
          variant === 'primary' && 'bg-accent text-background hover:bg-accent-dim active:bg-accent-dim',
          variant === 'secondary' && 'bg-surface text-text hover:bg-surface-light border border-border',
          variant === 'ghost' && 'text-text-dim hover:text-text hover:bg-surface/50',
          variant === 'outline' && 'border border-border text-text hover:border-accent hover:text-accent bg-transparent',

          // Sizes
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-8 py-3.5 text-base',

          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
