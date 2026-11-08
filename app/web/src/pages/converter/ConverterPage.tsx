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
  const [saveFailed, setSaveFailed] = useState(false)
  const [isRetryingSave, setIsRetryingSave] = useState(false)
  const hasSavedRef = useRef<string | null>(null)

  const handleConvert = useCallback(async () => {
    if (!upload.file) return
    await convert(upload.file)
  }, [upload.file, convert])

  const handleReset = useCallback(() => {
    upload.reset()
    useAppStore.getState().reset()
    setSaveBannerDismissed(false)
    setSaveFailed(false)
    setIsRetryingSave(false)
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

  const saveToHistory = useCallback(async () => {
    if (!conversion) return
    let contentHash: string | undefined
    try {
      contentHash = await sha256Hex(conversion.markdown)
    } catch {
      contentHash = undefined
    }
    try {
      await client.post(CONVERSIONS.save, {
        filename: conversion.fileName,
        originalTokens: conversion.estimation.originalTokens,
        optimizedTokens: conversion.estimation.optimizedTokens,
        savingsPercent: conversion.estimation.savingsPercentage,
        ...(contentHash ? { contentHash } : {}),
      })
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
  }, [conversion])

  const handleRetrySave = useCallback(async () => {
    setIsRetryingSave(true)
    try {
      await saveToHistory()
    } finally {
      setIsRetryingSave(false)
    }
  }, [saveToHistory])

  useEffect(() => {
    if (!isAuthenticated || !conversion) return
    const key = `${conversion.fileName}-${conversion.timestamp}`
    if (hasSavedRef.current === key) return
    hasSavedRef.current = key
    setSaveFailed(false)
    void saveToHistory()
  }, [isAuthenticated, conversion, saveToHistory])

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
                        className="text-xs text-text-dimmer hover:text-text-dim cursor-pointer inline-flex p-1"
                        aria-label="Dismiss"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
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
                {saveFailed && (
                  <div className="flex items-center gap-2 p-3 rounded bg-danger/5 border border-danger/20" role="alert">
                    <span className="text-danger text-sm font-mono">!</span>
                    <span className="text-sm text-danger font-mono flex-1">Converted, but saving to history failed</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetrySave}
                      disabled={isRetryingSave}
                    >
                      {isRetryingSave ? 'Retrying…' : 'Retry'}
                    </Button>
                  </div>
                )}
                {isAuthenticated && hasLlmKey ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleEnhance}
                        disabled={isEnhancing}
                      >
                        {isEnhancing ? 'Enhancing…' : 'Enhance with AI'}
                      </Button>
                      {enhanceCached && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] font-mono text-text-dimmer shrink-0"
                        >
                          from cache
                        </motion.span>
                      )}
                    </div>
                    {enhanceNotice && (
                      <p className="text-xs font-mono text-text-dimmer text-center">
                        {enhanceNotice}
                      </p>
                    )}
                  </div>
                ) : isAuthenticated && !hasLlmKey ? (
                  <p className="text-xs font-mono text-text-dimmer text-center leading-relaxed">
                    Add your{' '}
                    <Link to={ROUTES.profile} className="text-text-dim hover:text-accent underline underline-offset-4 decoration-border transition-colors">
                      OpenRouter key in Profile
                    </Link>{' '}
                    to enable AI enhancement.
                  </p>
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
