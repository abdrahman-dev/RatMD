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

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export interface FeatureItem {
  title: string
  description: string
  icon: string
}

export interface StepItem {
  number: number
  title: string
  description: string
}
