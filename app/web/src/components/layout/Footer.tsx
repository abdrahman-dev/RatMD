import { Container } from '@/components/ui/Container'
import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/85 backdrop-blur-[12px] py-6 mt-auto">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to={ROUTES.home} className="flex items-center gap-2">
            <span className="text-text font-mono text-sm font-bold">
              <span className="text-text">Rat</span>
              <span className="text-accent">MD</span>
            </span>
            <span className="text-text-dimmer text-xs font-mono">
              <span className="text-accent">// v0.1.0</span>
              <span className="text-text-dimmer"> — mvp</span>
              <span className="ml-2 text-success">●</span>
              <span className="text-text-dimmer ml-1">browser</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-text-dimmer font-mono">
            <span>PDF → Markdown · Optimized for AI</span>
            <a
              href="https://github.com/anomalyco/ratmd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
