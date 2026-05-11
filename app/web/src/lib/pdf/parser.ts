import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

export interface ParserResult {
  text: string
  rawText: string
  markdown: string
  pageCount: number
  title: string
}

interface TextLine {
  text: string
  fontSize: number
  y: number
}

function extractLines(items: { str: string; transform: number[] }[]): TextLine[] {
  const LINE_TOLERANCE = 5
  const groups = new Map<number, { text: string; fontSize: number }>()

  for (const item of items) {
    const str = item.str
    if (!str) continue
    const rawY = item.transform[5]
    const fontSize = Math.abs(item.transform[0])
    const yKey = Math.round(rawY / LINE_TOLERANCE) * LINE_TOLERANCE

    const existing = groups.get(yKey)
    if (existing) {
      existing.text += str
      existing.fontSize = Math.max(existing.fontSize, fontSize)
    } else {
      groups.set(yKey, { text: str, fontSize })
    }
  }

  return Array.from(groups.entries())
    .map(([y, data]) => ({ text: data.text, fontSize: data.fontSize, y }))
    .sort((a, b) => b.y - a.y)
}

function headingLevel(fontSize: number, avg: number): number {
  const ratio = fontSize / avg
  if (ratio > 2.0) return 1
  if (ratio > 1.5) return 2
  if (ratio > 1.15) return 3
  return 0
}

export async function parsePDF(file: File): Promise<ParserResult> {
  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: buffer }).promise
  const pageCount = pdf.numPages
  const fileName = file.name.replace(/\.pdf$/i, '')

  const allSizes: number[] = []
  const pageTexts: string[] = []
  const pageRawTexts: string[] = []
  const pageMds: string[] = []

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const items = content.items as { str: string; transform: number[] }[]

    const raw = items.map((item) => item.str).filter(Boolean).join(' ')
    pageRawTexts.push(raw)

    const lines = extractLines(items)
    const plain = lines.map((l) => l.text).join('\n')
    pageTexts.push(plain)

    for (const l of lines) {
      if (l.text.trim()) allSizes.push(l.fontSize)
    }

    const avg = allSizes.length > 0
      ? allSizes.reduce((a, b) => a + b, 0) / allSizes.length
      : 12

    const md = lines.map((l) => {
      const t = l.text.trim()
      if (!t) return ''
      const level = headingLevel(l.fontSize, avg)
      return level > 0 ? `${'#'.repeat(level)} ${t}` : t
    }).filter(Boolean).join('\n')

    pageMds.push(md)
  }

  return {
    text: pageTexts.join('\n\n'),
    rawText: pageRawTexts.join('\n\n'),
    markdown: pageMds.join('\n\n'),
    pageCount,
    title: fileName,
  }
}
