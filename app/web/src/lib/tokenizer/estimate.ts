import { Tiktoken } from 'js-tiktoken/lite'
import cl100k_base from 'js-tiktoken/ranks/cl100k_base'
import type { EstimationResult } from '@/types'

let tokenizer: Tiktoken | null = null

function getTokenizer(): Tiktoken {
  if (!tokenizer) {
    tokenizer = new Tiktoken(cl100k_base)
  }
  return tokenizer
}

export function estimateTokens(text: string): number {
  try {
    return getTokenizer().encode(text).length
  } catch {
    return Math.ceil(text.length / 4)
  }
}

export function estimateSavings(originalText: string, optimizedText: string): EstimationResult {
  const originalChars = originalText.length
  const optimizedChars = optimizedText.length
  const originalTokens = estimateTokens(originalText)
  const optimizedTokens = estimateTokens(optimizedText)
  const savingsPercentage = originalTokens > 0
    ? Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)
    : 0

  return {
    originalChars,
    originalTokens,
    optimizedChars,
    optimizedTokens,
    savingsPercentage,
  }
}
