import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/Badge'

interface TokenEstimatorProps {
  originalTokens: number
  optimizedTokens: number
  savingsPercentage: number
  originalChars?: number
  optimizedChars?: number
  className?: string
}

export function TokenEstimator({
  originalTokens,
  optimizedTokens,
  savingsPercentage,
  originalChars,
  optimizedChars,
  className,
}: TokenEstimatorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const savingsColor = useMemo(() => {
    if (savingsPercentage >= 70) return 'text-accent'
    if (savingsPercentage >= 50) return 'text-success'
    if (savingsPercentage >= 30) return 'text-warning'
    return 'text-text-dim'
  }, [savingsPercentage])

  const barWidthOriginal = 100
  const barWidthOptimized = Math.max(5, 100 - savingsPercentage)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-text">Token Savings</h3>
        <Badge variant="accent">
          -{savingsPercentage}%
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Original */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-dim">Original</span>
            <span className="text-text">{originalTokens.toLocaleString()} tokens</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-text-dimmer transition-all duration-700"
              style={{ width: `${barWidthOriginal}%` }}
            />
          </div>
        </div>

        {/* Optimized */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-dim">Optimized</span>
            <span className={cn('font-medium', savingsColor)}>
              {optimizedTokens.toLocaleString()} tokens
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${barWidthOptimized}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-text-dimmer hover:text-text font-mono transition-colors cursor-pointer"
      >
        {showDetails ? '▲' : '▼'} details
      </button>

      {showDetails && (
        <div className="space-y-1 text-xs font-mono text-text-dimmer pt-1">
          {originalChars !== undefined && <p>Original chars: {originalChars.toLocaleString()}</p>}
          {optimizedChars !== undefined && <p>Optimized chars: {optimizedChars.toLocaleString()}</p>}
          <p>Reduction: {(originalTokens - optimizedTokens).toLocaleString()} tokens</p>
        </div>
      )}
    </div>
  )
}
