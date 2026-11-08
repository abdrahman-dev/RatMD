import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { formatBytes } from '@/lib/utils'
import { ACCEPTED_MIME_TYPES } from '@/lib/constants'
import type { FileWithPreview } from '@/types'

interface UploadZoneProps {
  file: FileWithPreview | null
  isDragOver: boolean
  error: string | null
  onFile: (file: File) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onReset: () => void
}

export function UploadZone({
  file,
  isDragOver,
  error,
  onFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onReset,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFile(selectedFile)
      }
      e.target.value = ''
    },
    [onFile],
  )

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text font-mono truncate">{file.name}</p>
          <p className="text-xs text-text-dim font-mono">{formatBytes(file.size)}</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-text-dimmer hover:text-danger transition-colors font-mono cursor-pointer"
        >
          remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 p-8 sm:p-12 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer group',
          isDragOver
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-accent/50 hover:bg-surface/50',
          error && 'border-danger/50 bg-danger/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-text-dim group-hover:text-accent transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm text-text font-mono">
            {isDragOver ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
          </p>
          <p className="text-xs text-text-dimmer font-mono">.pdf up to 10MB</p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger font-mono">{error}</p>
      )}
    </div>
  )
}
