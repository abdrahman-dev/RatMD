import { LogoIcon } from './LogoIcon'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  variant?: 'full' | 'icon' | 'mono'
  size?: number | string
  className?: string
}

export function Logo({ variant = 'full', size = 28, className }: LogoProps) {
  if (variant === 'icon') {
    return <LogoIcon size={size} className={className} />
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoIcon size={typeof size === 'number' ? size : 50} />
      <span className="font-mono font-bold tracking-tight leading-none select-none">
        <span className={variant === 'mono' ? 'text-current' : 'text-text'}>Rat</span>
        <span className={variant === 'mono' ? 'text-current' : 'text-accent'}>MD</span>
      </span>
    </span>
  )
}
