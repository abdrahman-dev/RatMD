import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { UploadZone } from '@/features/upload/UploadZone'
import { ParserPanel } from '@/features/parser/ParserPanel'
import { MarkdownPreview } from '@/features/markdown-preview/MarkdownPreview'
import { TokenEstimator } from '@/features/token-estimator/TokenEstimator'
import { ExportActions } from '@/features/export/ExportActions'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useAppStore } from '@/app/store/app-store'

export function ConverterPage() {
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
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text font-sans mb-2">Converter</h1>
          <p className="text-sm text-text-dim font-mono">
            Upload a PDF and convert it to optimized Markdown
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar — controls */}
          <div className="lg:col-span-2 space-y-4">
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
                  className="w-full text-center text-xs text-text-dimmer hover:text-text font-mono transition-colors cursor-pointer"
                >
                  Convert another file
                </button>
              </motion.div>
            )}
          </div>

          {/* Main — preview */}
          <div className="lg:col-span-3">
            <MarkdownPreview
              content={conversion?.markdown ?? '# Ready to convert\n\nUpload a PDF file on the left and click "Convert to Markdown" to see the optimized output here.\n\nRatMD will strip noise, preserve structure, and minimize token count.'}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
