import { useMemo, useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { extractHeadings } from '@/lib/markdown/converter'

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle')
  const headings = useMemo(() => extractHeadings(content), [content])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied('copied')
      setTimeout(() => setCopied('idle'), 2000)
    } catch {
      setCopied('failed')
      setTimeout(() => setCopied('idle'), 2000)
    }
  }, [content])

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text">Output</span>
          <Badge variant="default" className="text-[10px]">
            .md
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {headings.length > 0 && (
            <span className="text-[10px] text-text-dimmer font-mono">
              {headings.length} sections
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-xs text-text-dim hover:text-accent transition-colors font-mono cursor-pointer"
          >
            {copied === 'copied' ? 'copied' : copied === 'failed' ? 'failed' : 'copy'}
          </button>
        </div>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto font-mono text-sm leading-relaxed">
        <pre className="whitespace-pre-wrap text-text">{content}</pre>
      </div>
    </div>
  )
}
