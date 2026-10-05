/**
 * Markdown conversion utilities.
 */

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
