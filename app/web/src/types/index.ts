export type ConversionStatus = 'idle' | 'uploading' | 'parsing' | 'complete' | 'error'

export interface FileWithPreview {
  file: File
  name: string
  size: number
  preview?: string
}

export interface EstimationResult {
  originalChars: number
  originalTokens: number
  optimizedChars: number
  optimizedTokens: number
  savingsPercentage: number
}

export interface ConversionResult {
  id: string
  fileName: string
  markdown: string
  estimation: EstimationResult
  status: ConversionStatus
  error?: string
  timestamp: number
}

export interface AuthUser {
  name: string
  email: string
  avatar: string
  ratRank: string
  totalTokensSaved: number
  totalConversions: number
  bio: string
  github: string
  linkedin: string
  hasLlmKey?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface ConversionHistoryItem {
  _id: string
  userId: string
  filename: string
  originalTokens: number
  optimizedTokens: number
  savingsPercent: number
  createdAt: string
}
