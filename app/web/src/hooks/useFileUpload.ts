import { useCallback, useState } from 'react'
import { MAX_FILE_SIZE, ACCEPTED_MIME_TYPES } from '@/lib/constants'
import type { FileWithPreview } from '@/types'

interface UseFileUploadReturn {
  file: FileWithPreview | null
  error: string | null
  isDragOver: boolean
  handleFile: (file: File) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  reset: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<FileWithPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return 'Please upload a PDF file.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    }
    if (file.size === 0) {
      return 'File is empty.'
    }
    return null
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setFile(null)
        return
      }
      setFile({
        file,
        name: file.name,
        size: file.size,
      })
    },
    [validateFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFile(droppedFile)
      }
    },
    [handleFile],
  )

  const reset = useCallback(() => {
    setFile(null)
    setError(null)
    setIsDragOver(false)
  }, [])

  return {
    file,
    error,
    isDragOver,
    handleFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    reset,
  }
}
