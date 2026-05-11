import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <span className={cn('font-mono font-bold tracking-tight text-accent', sizeClasses[size], className)}>
      {`[RatMD]`}
    </span>
  )
}
