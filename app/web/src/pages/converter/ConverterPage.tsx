import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { UploadZone } from '@/features/upload/UploadZone'
import { ParserPanel } from '@/features/parser/ParserPanel'
import { MarkdownPreview } from '@/features/markdown-preview/MarkdownPreview'
import { TokenEstimator } from '@/features/token-estimator/TokenEstimator'
import { ExportActions } from '@/features/export/ExportActions'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useAppStore } from '@/app/store/app-store'
import { useAuthStore } from '@/app/store/auth-store'
import { client } from '@/lib/api/client'
import { CONVERSIONS, PROFILE } from '@/lib/api/endpoints'
import { ROUTES } from '@/lib/constants'
import { sha256Hex } from '@/lib/utils'

export function ConverterPage() {
  const upload = useFileUpload()
  const { conversion, isConverting, error, convert, isEnhancing, enhanceCached, enhanceNotice, setIsEnhancing, setEnhanceCached, setEnhanceNotice, updateMarkdown } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const [saveBannerDismissed, setSaveBannerDismissed] = useState(false)
  const [hasLlmKey, setHasLlmKey] = useState(false)
  const hasSavedRef = useRef<string | null>(null)

  const handleConvert = useCallback(async () => {
    if (!upload.file) return
    await convert(upload.file)
  }, [upload.file, convert])

  const handleReset = useCallback(() => {
    upload.reset()
    useAppStore.getState().reset()
    setSaveBannerDismissed(false)
    hasSavedRef.current = null
  }, [upload])

  useEffect(() => {
    if (!isAuthenticated) {
      setHasLlmKey(false)
      return
    }
    let cancelled = false
    async function loadHasLlmKey() {
      try {
        const res = await client.get<{ success: boolean; profile: { hasLlmKey: boolean } }>(PROFILE.me)
        if (!cancelled && typeof res.profile?.hasLlmKey === 'boolean') {
          setHasLlmKey(res.profile.hasLlmKey)
        }
      } catch {
        if (!cancelled) setHasLlmKey(false)
      }
    }
    void loadHasLlmKey()
    return () => { cancelled = true }
  }, [isAuthenticated])

  const handleEnhance = useCallback(async () => {
    if (!conversion) return
    setIsEnhancing(true)
    setEnhanceNotice(null)
    setEnhanceCached(false)
    try {
      const res = await client.post<{
        success: boolean
        enhanced: boolean
        markdown: string
        cached?: boolean
        reason?: string
        usage?: { model: string; inputTokens: number; outputTokens: number }
      }>(CONVERSIONS.enhance, {
        markdown: conversion.markdown,
        filename: conversion.fileName,
      })
      if (res.enhanced) {
        updateMarkdown(res.markdown)
        setEnhanceCached(Boolean(res.cached))
        setEnhanceNotice(null)
      } else {
        setEnhanceNotice(res.reason ?? 'Enhancement failed. Original kept.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Enhancement failed'
      // 400 means no key on file — surface clearly
      setEnhanceNotice(msg)
    } finally {
      setIsEnhancing(false)
    }
  }, [conversion, setIsEnhancing, setEnhanceCached, setEnhanceNotice, updateMarkdown])

  useEffect(() => {
    if (!isAuthenticated || !conversion) return
    const key = `${conversion.fileName}-${conversion.timestamp}`
    if (hasSavedRef.current === key) return
    hasSavedRef.current = key

    void (async () => {
      let contentHash: string | undefined
      try {
        contentHash = await sha256Hex(conversion.markdown)
      } catch {
        contentHash = undefined
      }
      client.post(CONVERSIONS.save, {
        filename: conversion.fileName,
        originalTokens: conversion.estimation.originalTokens,
        optimizedTokens: conversion.estimation.optimizedTokens,
        savingsPercent: conversion.estimation.savingsPercentage,
        ...(contentHash ? { contentHash } : {}),
      }).catch(() => {
        // Silently fail — conversion result is already shown
      })
    })()
  }, [isAuthenticated, conversion])

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
                {!isAuthenticated && !saveBannerDismissed && (
                  <div className="bg-surface border border-border px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-dim font-mono">
                      Sign in to track your savings
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={ROUTES.login}
                        className="text-xs text-accent font-mono hover:underline"
                      >
                        Sign In
                      </Link>
                      <button
                        onClick={() => setSaveBannerDismissed(true)}
                        className="text-xs text-text-dimmer font-mono hover:text-text-dim cursor-pointer"
                        aria-label="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                <TokenEstimator
                  originalTokens={conversion.estimation.originalTokens}
                  optimizedTokens={conversion.estimation.optimizedTokens}
                  savingsPercentage={conversion.estimation.savingsPercentage}
                  originalChars={conversion.estimation.originalChars}
                  optimizedChars={conversion.estimation.optimizedChars}
                />
                {isAuthenticated && hasLlmKey ? (
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={handleEnhance}
                      isLoading={isEnhancing}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                    </Button>
                    {enhanceCached && (
                      <p className="text-[10px] font-mono text-text-dimmer text-center">from cache</p>
                    )}
                    {enhanceNotice && (
                      <p className="text-xs font-mono text-text-dim bg-surface border border-border px-3 py-2 text-center">
                        {enhanceNotice}
                      </p>
                    )}
                  </div>
                ) : isAuthenticated && !hasLlmKey ? (
                  <div className="bg-surface border border-border px-3 py-2 text-center">
                    <p className="text-xs font-mono text-text-dim">
                      Add your{' '}
                      <Link to={ROUTES.profile} className="text-accent hover:underline">
                        OpenRouter key in Profile
                      </Link>{' '}
                      to enable AI enhancement.
                    </p>
                    {enhanceNotice && (
                      <p className="text-xs font-mono text-text-dim mt-2">{enhanceNotice}</p>
                    )}
                  </div>
                ) : null}
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
