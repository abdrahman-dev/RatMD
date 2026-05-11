/**
 * Parser service abstraction.
 * Future: swap this with actual API calls to backend.
 * MVP: delegates to lib/pdf/parser directly (client-side).
 */

import { parsePDF } from '@/lib/pdf/parser'
import type { ParserResult } from '@/lib/pdf/parser'

export type { ParserResult }

export async function convertPDF(file: File): Promise<ParserResult> {
  return parsePDF(file)
}
