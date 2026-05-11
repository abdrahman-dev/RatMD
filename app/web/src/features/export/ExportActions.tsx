import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { downloadMarkdown, copyToClipboard } from '@/services/export'

interface ExportActionsProps {
  content: string
  fileName: string
}

export function ExportActions({ content, fileName }: ExportActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = useCallback(() => {
    downloadMarkdown(content, fileName)
  }, [content, fileName])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(content)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [content])

  return (
    <div className="flex items-center gap-2">
      <Button variant="primary" size="sm" onClick={handleDownload}>
        Download .md
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  )
}
