import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { RatMDIcon } from '@/components/brand/RatMDLogo'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function Footer() {
  const { theme, toggle } = useTheme()

  return (
    <footer className="h-12 border-t border-border bg-bg/90 backdrop-blur-sm flex items-center">
      <div className="max-w-[1100px] mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-text-dim">
          <Link to={ROUTES.home} className="flex items-center">
            <RatMDIcon className="h-6 w-auto" />
          </Link>
          <span className="text-text-dimmer">v0.1.0</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-text-dim">
          <a
            href="https://github.com/abdrahman-dev/RatMD"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors duration-150"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <button
            onClick={toggle}
            className="hover:text-text transition-colors duration-150"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <span className="flex items-center gap-1">
            <span className="text-success">●</span>
            <span>browser</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
