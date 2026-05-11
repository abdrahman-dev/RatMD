/**
 * Markdown conversion utilities.
 * MVP: simple formatting. Future: real PDF-to-MD pipeline.
 */

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .replace(/[-*_]{3,}/g, '')
    .trim()
}

export function countLines(markdown: string): number {
  return markdown.split('\n').length
}

export function extractHeadings(markdown: string): { level: number; text: string }[] {
  return markdown
    .split('\n')
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => {
      const match = line.match(/^(#{1,6})\s(.+)/)
      if (!match) return { level: 0, text: '' }
      return { level: match[1].length, text: match[2] }
    })
}
