import { useEffect, useState, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParserPanelProps {
  isConverting: boolean
  error: string | null
}

const parsingStages = [
  { label: 'Reading PDF', duration: 400 },
  { label: 'Extracting text content', duration: 300 },
  { label: 'Analyzing document structure', duration: 300 },
  { label: 'Removing noise (headers/footers)', duration: 300 },
  { label: 'Generating Markdown', duration: 200 },
]

export function ParserPanel({ isConverting, error }: ParserPanelProps) {
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [currentStage, setCurrentStage] = useState(-1)

  useEffect(() => {
    if (!isConverting) {
      startTransition(() => {
        setCurrentStage(-1)
        setCompletedStages([])
      })
      return
    }

    let cancelled = false

    const runStages = async () => {
      for (let i = 0; i < parsingStages.length; i++) {
        if (cancelled) return
        setCurrentStage(i)
        await new Promise((r) => setTimeout(r, parsingStages[i].duration))
        if (!cancelled) {
          setCompletedStages((prev) => [...prev, i])
        }
      }
    }

    runStages()

    return () => {
      cancelled = true
    }
  }, [isConverting])

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 rounded bg-danger/5 border border-danger/20">
        <span className="text-danger text-sm font-mono">!</span>
        <span className="text-sm text-danger font-mono">{error}</span>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isConverting && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface border border-border overflow-y-auto"
          style={{ borderRadius: '4px', maxHeight: '180px' }}
        >
          <div className="p-3 space-y-1">
            {parsingStages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-mono text-text-dimmer shrink-0">
                  [{i + 1}/{parsingStages.length}]
                </span>
                <span className="text-xs font-mono text-text-dim">
                  {stage.label}
                </span>
                {completedStages.includes(i) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-mono text-accent"
                  >
                    ✓
                  </motion.span>
                )}
                {i === currentStage && !completedStages.includes(i) && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-xs font-mono text-accent"
                  >
                    ...
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
