import { useMemo } from 'react'
import { estimateTokens } from '@/lib/tokenizer/estimate'
import { formatNumber } from '@/lib/utils'

interface UseTokenEstimateReturn {
  originalTokens: number
  originalFormatted: string
}

export function useTokenEstimate(text: string): UseTokenEstimateReturn {
  return useMemo(() => {
    const originalTokens = estimateTokens(text)
    return {
      originalTokens,
      originalFormatted: formatNumber(originalTokens),
    }
  }, [text])
}
