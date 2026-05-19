import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { AnimatedElement } from '@/components/animations/AnimatedElement'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { UploadZone } from '@/features/upload/UploadZone'
import { ParserPanel } from '@/features/parser/ParserPanel'
import { MarkdownPreview } from '@/features/markdown-preview/MarkdownPreview'
import { TokenEstimator } from '@/features/token-estimator/TokenEstimator'
import { ExportActions } from '@/features/export/ExportActions'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useAppStore } from '@/app/store/app-store'

export function DemoSection() {
  const upload = useFileUpload()
  const { conversion, isConverting, error, convert } = useAppStore()

  const handleConvert = useCallback(async () => {
    if (!upload.file) return
    await convert(upload.file)
  }, [upload.file, convert])

  const handleReset = useCallback(() => {
    upload.reset()
    useAppStore.getState().reset()
  }, [upload])

  return (
    <Section id="demo" background="surface">
      <div className="text-center mb-12">
        <AnimatedElement direction="right">
          <h2 className="text-2xl sm:text-3xl font-bold text-text font-sans mb-3">
            See it in action
          </h2>
          <p className="text-text-dim font-mono text-sm">
            Upload a PDF and watch it transform into optimized Markdown
          </p>
        </AnimatedElement>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left column — upload & controls */}
        <AnimatedElement direction="left" className="space-y-4">
          <UploadZone
            file={upload.file}
            isDragOver={upload.isDragOver}
            error={upload.error}
            onFile={upload.handleFile}
            onDragOver={upload.handleDragOver}
            onDragLeave={upload.handleDragLeave}
            onDrop={upload.handleDrop}
            onReset={handleReset}
          />

          {upload.file && !isConverting && !conversion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleConvert}
              >
                Convert to Markdown
              </Button>
            </motion.div>
          )}

          <ParserPanel
            isConverting={isConverting}
            error={error}
          />

          {conversion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <TokenEstimator
                originalTokens={conversion.estimation.originalTokens}
                optimizedTokens={conversion.estimation.optimizedTokens}
                savingsPercentage={conversion.estimation.savingsPercentage}
                originalChars={conversion.estimation.originalChars}
                optimizedChars={conversion.estimation.optimizedChars}
              />
              <ExportActions
                content={conversion.markdown}
                fileName={conversion.fileName}
              />
              <button
                onClick={handleReset}
                className="text-xs text-text-dimmer hover:text-text font-mono transition-colors cursor-pointer"
              >
                Convert another file
              </button>
            </motion.div>
          )}
        </AnimatedElement>

        {/* Right column — preview */}
        <AnimatedElement direction="right">
          <MarkdownPreview
            content={conversion?.markdown ?? '# Markdown output will appear here...\n\nUpload a PDF and click convert to see the result.'}
          />
        </AnimatedElement>
      </div>
    </Section>
  )
}
