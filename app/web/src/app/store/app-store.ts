import { create } from 'zustand'
import type { ConversionResult, FileWithPreview } from '@/types'
import { convertPDF } from '@/services/parser'
import { estimateSavings } from '@/lib/tokenizer/estimate'
import { generateId } from '@/lib/utils'

interface AppState {
  // Conversion
  conversion: ConversionResult | null
  isConverting: boolean
  error: string | null
  convert: (file: FileWithPreview) => Promise<void>
  reset: () => void

  // Enhancement
  isEnhancing: boolean
  enhanceCached: boolean
  enhanceNotice: string | null
  setIsEnhancing: (v: boolean) => void
  setEnhanceCached: (v: boolean) => void
  setEnhanceNotice: (msg: string | null) => void
  updateMarkdown: (markdown: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  conversion: null,
  isConverting: false,
  error: null,
  isEnhancing: false,
  enhanceCached: false,
  enhanceNotice: null,

  convert: async (fileWithPreview) => {
    set({ isConverting: true, error: null, enhanceCached: false, enhanceNotice: null })
    try {
      const result = await convertPDF(fileWithPreview.file)
      const originalText = result.rawText
      const optimizedMarkdown = result.markdown
      const estimation = estimateSavings(originalText, optimizedMarkdown)

      const conversion: ConversionResult = {
        id: generateId(),
        fileName: fileWithPreview.name,
        markdown: optimizedMarkdown,
        estimation,
        status: 'complete',
        timestamp: Date.now(),
      }

      set({ conversion, isConverting: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Conversion failed'
      set({ error: message, isConverting: false })
    }
  },

  reset: () => set({ conversion: null, error: null, isConverting: false, isEnhancing: false, enhanceCached: false, enhanceNotice: null }),

  setIsEnhancing: (v) => set({ isEnhancing: v }),
  setEnhanceCached: (v) => set({ enhanceCached: v }),
  setEnhanceNotice: (msg) => set({ enhanceNotice: msg }),
  updateMarkdown: (markdown) => set((s) => s.conversion ? { conversion: { ...s.conversion, markdown } } : {}),
}))
