import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  label: string
  items: FaqItem[]
}

const faqData: FaqCategory[] = [
  {
    label: 'General',
    items: [
      {
        q: 'What is RatMD?',
        a: 'RatMD converts PDFs into clean Markdown optimized for AI systems. It strips headers, footers, page numbers, and layout noise — producing semantic, token-efficient output ready for LLM workflows and RAG pipelines.',
      },
      {
        q: 'How does RatMD work?',
        a: 'Upload a PDF. RatMD extracts the text content using pdf.js, groups it into lines by position, detects headings by font size, and outputs clean Markdown. The entire process runs in your browser — nothing is sent to a server.',
      },
      {
        q: 'Do I need an account?',
        a: 'No account needed to convert PDFs — RatMD works fully in your browser. Sign in to track your conversion history, view your total token savings, and appear on the community leaderboard.',
      },
      {
        q: 'Is RatMD free?',
        a: 'The web app is free to use. The CLI tools and future API will follow an open-source model with optional paid tiers for high-volume usage.',
      },
    ],
  },
  {
    label: 'Token Savings',
    items: [
      {
        q: 'How are tokens calculated?',
        a: 'RatMD uses js-tiktoken with OpenAI\'s cl100k_base encoding — the same tokenizer used by GPT-4 and GPT-3.5-turbo. This gives accurate token counts, not estimates. The original extracted text is compared against the optimized Markdown output to compute savings.',
      },
      {
        q: 'What savings can I expect?',
        a: 'Typical savings range from 40% to 75%, depending on the PDF. Dense academic papers with heavy formatting see the highest savings. Plain text documents see less. The savings come from removing headers, footers, page numbers, redundant whitespace, and layout artifacts that carry no semantic value.',
      },
      {
        q: 'Why do savings vary between PDFs?',
        a: 'PDFs with complex layouts, running headers/footers on every page, and extensive whitespace produce the highest savings. Simple single-column text documents with minimal formatting will show lower savings because there is less noise to remove.',
      },
    ],
  },
  {
    label: 'PDF Compatibility',
    items: [
      {
        q: 'What PDFs work best?',
        a: 'Text-based PDFs with clear structure work best. Academic papers, technical reports, documentation, and digitally-born PDFs produce excellent results. The parser handles multi-column layouts, tables, and mixed formatting well.',
      },
      {
        q: 'What PDFs don\'t work well?',
        a: 'Scanned PDFs (images without embedded text) cannot be processed — they require OCR, which is not yet supported. Heavily encrypted or password-protected PDFs also cannot be parsed. PDFs with unusual encodings or custom fonts may produce garbled text.',
      },
      {
        q: 'Are scanned PDFs supported?',
        a: 'Not yet. Scanned PDFs require optical character recognition (OCR), which is a planned feature. For now, RatMD only works with PDFs that have embedded text layers.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'The web app enforces a 10MB limit, which covers the vast majority of text-based PDFs. Larger files can be processed via the CLI tool or the upcoming API. The limit exists because all parsing happens client-side in the browser.',
      },
    ],
  },
  {
    label: 'Privacy & Security',
    items: [
      {
        q: 'Is my data processed locally?',
        a: 'Yes. Every file you upload stays in your browser. The PDF is read using pdf.js, text is extracted, and the conversion happens entirely in JavaScript on your machine. Nothing is uploaded to any server.',
      },
      {
        q: 'Do you store my files or converted output?',
        a: 'No. RatMD has no backend storage in its current form. Files and converted Markdown exist only in your browser\'s memory during the session. Closing the tab clears everything. Future versions may offer optional cloud storage, but it will always be opt-in.',
      },
    ],
  },
  {
    label: 'CLI & Technical',
    items: [
      {
        q: 'Is there a CLI version?',
        a: 'The CLI is in development. It will support converting single files, batch directory processing, piped input/output, and direct integration with LLM tooling. The CLI will share the same core parsing engine as the web app.',
      },
      {
        q: 'What commands will the CLI support?',
        a: 'The planned command set includes: ratmd convert (single file), ratmd batch (directory), ratmd stats (token analysis), and ratmd watch (file watcher). Output format options will include raw markdown, token-optimized, and JSON.',
      },
    ],
  },
  {
    label: 'Roadmap',
    items: [
      {
        q: 'What features are planned?',
        a: 'The immediate roadmap includes: CLI tools, OCR for scanned PDFs, a public REST API, batch processing improvements, custom output templates, and configurable noise-removal rules. Longer term: team workspaces, persistent conversion history, and API key management.',
      },
      {
        q: 'Will there be an API?',
        a: 'Yes. A REST API is planned for programmatic access. It will support the same conversion pipeline with authentication via API keys, webhook notifications for large files, and usage tracking. The frontend service layer is already structured to support this transition.',
      },
      {
        q: 'Is RatMD open source?',
        a: 'The core parsing library and CLI tools will be open source. The web app frontend is already open source. Specific backend services and enterprise features may follow a source-available model.',
      },
    ],
  },
]

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-mono text-text hover:text-accent transition-colors cursor-pointer"
      >
        <span>{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-dim shrink-0 text-xs"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm font-mono text-text-dim leading-relaxed">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqPage() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Container className="py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-text font-sans mb-2">FAQ</h1>
          <p className="text-sm text-text-dim font-mono">
            Common questions about RatMD
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((category) => (
            <section key={category.label}>
              <h2 className="text-sm font-semibold text-text font-mono uppercase tracking-wider mb-3 px-1">
                {category.label}
              </h2>
              <Card className="divide-y divide-border overflow-hidden">
                {category.items.map((item) => {
                  const key = `${category.label}-${item.q}`
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={!!openMap[key]}
                      onToggle={() => toggle(key)}
                    />
                  )
                })}
              </Card>
            </section>
          ))}
        </div>
      </div>
    </Container>
  )
}
