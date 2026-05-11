import { create } from 'zustand'
import type { ConversionResult, FileWithPreview } from '@/types'
import { convertPDF } from '@/services/parser'
import { estimateSavings } from '@/lib/tokenizer/estimate'
import { generateId } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

interface AppState {
  // File
  file: FileWithPreview | null
  setFile: (file: FileWithPreview | null) => void

  // Conversion
  conversion: ConversionResult | null
  isConverting: boolean
  error: string | null
  convert: (file: FileWithPreview) => Promise<void>
  reset: () => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  file: null,
  conversion: null,
  isConverting: false,
  error: null,
  sidebarOpen: false,

  setFile: (file) => set({ file, conversion: null, error: null }),

  convert: async (fileWithPreview) => {
    set({ isConverting: true, error: null })
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

  reset: () => set({ file: null, conversion: null, error: null, isConverting: false }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

export function useAppInfo() {
  return { name: APP_NAME }
}
