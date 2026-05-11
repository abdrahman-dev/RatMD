import { useEffect, useState, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParserPanelProps {
  isConverting: boolean
  error: string | null
}

const parsingStages = [
  { label: 'Extracting text content', duration: 400 },
  { label: 'Analyzing document structure', duration: 300 },
  { label: 'Removing noise (headers/footers)', duration: 300 },
  { label: 'Generating Markdown', duration: 300 },
  { label: 'Optimizing token usage', duration: 200 },
]

export function ParserPanel({ isConverting, error }: ParserPanelProps) {
  const [currentStage, setCurrentStage] = useState(-1)

  useEffect(() => {
    if (!isConverting) {
      startTransition(() => {
        setCurrentStage(-1)
      })
      return
    }

    let cancelled = false

    const runStages = async () => {
      for (let i = 0; i < parsingStages.length; i++) {
        if (cancelled) return
        setCurrentStage(i)
        await new Promise((r) => setTimeout(r, parsingStages[i].duration))
      }
    }

    runStages()

    return () => {
      cancelled = true
    }
  }, [isConverting])

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/5 border border-danger/20">
        <span className="text-danger text-sm font-mono">!</span>
        <span className="text-sm text-danger font-mono">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {isConverting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {parsingStages.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    i < currentStage
                      ? 'border-accent bg-accent/20'
                      : i === currentStage
                        ? 'border-accent border-t-transparent animate-spin'
                        : 'border-border'
                  }`}
                >
                  {i < currentStage && (
                    <span className="text-[8px] text-accent">&#10003;</span>
                  )}
                </div>
                <span
                  className={`text-sm font-mono transition-colors duration-300 ${
                    i <= currentStage ? 'text-text' : 'text-text-dimmer'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
