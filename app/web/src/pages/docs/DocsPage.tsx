import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/shared/Section'
import { ROUTES } from '@/lib/constants'

const cliCommands = [
  { cmd: 'ratmd convert file.pdf', desc: 'Convert a single PDF to Markdown' },
  { cmd: 'ratmd convert file.pdf --output result.md', desc: 'Specify output file path' },
  { cmd: 'ratmd convert file.pdf --no-clean', desc: 'Skip noise removal (headers/footers)' },
  { cmd: 'ratmd stats file.pdf', desc: 'Analyze token count and potential savings' },
  { cmd: 'ratmd batch ./pdfs/', desc: 'Batch convert all PDFs in a directory' },
  { cmd: 'ratmd batch ./pdfs/ --out ./output/', desc: 'Batch convert with custom output dir' },
]

const webGuide = [
  {
    title: '1. Upload',
    desc: 'Navigate to the <a href="' + ROUTES.converter + '" class="text-accent hover:underline">Converter</a> page. Drag & drop a PDF file or click to browse. Max file size is 10MB.',
  },
  {
    title: '2. Convert',
    desc: 'Click "Convert to Markdown". The parser extracts text, removes noise, and generates clean Markdown optimized for token efficiency.',
  },
  {
    title: '3. Review',
    desc: 'Preview the output in the Markdown panel. Check the token savings indicator — typically 60–80% reduction.',
  },
  {
    title: '4. Export',
    desc: 'Download the .md file or copy to clipboard. Ready to feed into any LLM, RAG pipeline, or documentation system.',
  },
]

export function DocsPage() {
  return (
    <Container className="py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-text font-sans mb-2">Documentation</h1>
          <p className="text-sm text-text-dim font-mono">
            How to use RatMD — CLI reference & web guide
          </p>
        </div>

        {/* Web Guide */}
        <Section id="web-guide" className="!p-0 !pb-10">
          <h2 className="text-lg font-bold text-text font-sans mb-6">Web App</h2>
          <div className="space-y-4">
            {webGuide.map((step) => (
              <Card key={step.title} className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono text-text-dim mt-0.5 shrink-0">
                    {'>'}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-text font-sans mb-1">
                      {step.title}
                    </h3>
                    <p
                      className="text-sm text-text-dim font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step.desc }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* CLI Reference */}
        <Section id="cli-ref" className="!p-0 !pb-10">
          <h2 className="text-lg font-bold text-text font-sans mb-6">CLI Reference</h2>
          <Card variant="elevated" className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-text-dimmer/60" />
              <span className="text-xs font-mono text-text-dimmer ml-2">Usage: ratmd &lt;command&gt; [options]</span>
            </div>
            <div className="divide-y divide-border">
              {cliCommands.map((item) => (
                <div key={item.cmd} className="p-4 flex items-start gap-3 hover:bg-surface/50 transition-colors">
                  <span className="text-text-dim font-mono text-sm shrink-0 mt-0.5">$</span>
                  <div>
                    <code className="block text-sm font-mono text-text break-all">{item.cmd}</code>
                    <span className="text-xs font-mono text-text-dimmer"># {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* Token Estimation */}
        <Section id="token-estimation" className="!p-0">
          <h2 className="text-lg font-bold text-text font-sans mb-6">Token Estimation</h2>
          <Card className="p-5 text-sm font-mono text-text-dim leading-relaxed space-y-3">
            <p>
              RatMD uses <span className="text-text">js-tiktoken</span> with the OpenAI
              <span className="text-text"> cl100k_base</span> encoding for accurate token counting.
              This is the same tokenizer used by GPT-4 and GPT-3.5-turbo models.
            </p>
            <p>
              The token savings percentage shown compares the estimated tokens in the raw extracted
              text versus the optimized Markdown output after noise removal and structural cleanup.
            </p>
            <p>
              For other LLM providers with different tokenizers, the absolute counts will vary,
              but the relative savings percentage remains directionally accurate.
            </p>
          </Card>
        </Section>
      </div>
    </Container>
  )
}
