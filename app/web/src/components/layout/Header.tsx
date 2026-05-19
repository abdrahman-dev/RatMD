import { useState, useEffect, startTransition, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { LogoIcon } from '@/components/ui/logo'
import { NAV_LINKS, ROUTES } from '@/lib/constants'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/app/store/auth-store'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false)
    })
  }, [location])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleLogout = useCallback(async () => {
    setDropdownOpen(false)
    await logout()
    navigate(ROUTES.home)
  }, [logout, navigate])

  const internalLinks = NAV_LINKS.filter((l) => !l.external)

  const avatarInitial = user?.name?.charAt(0).toUpperCase() ?? 'R'

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-surface/85 backdrop-blur-[12px] border-b border-border"
      style={{ zIndex: 9999, willChange: 'transform' }}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to={ROUTES.home} className="flex items-center gap-2.5 group shrink-0">
          <LogoIcon size={24} />
          <span className="font-mono font-bold text-base">
            <span className="text-text">Rat</span>
            <span className="text-accent">MD</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-dim hover:text-accent transition-colors duration-200"
                  aria-label={link.label}
                >
                  <GitHubIcon />
                </a>
              )
            }

            const isActive = location.pathname === link.href

            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  'px-3 py-1.5 text-sm font-mono rounded-lg transition-colors duration-200',
                  isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-text-dim hover:text-text hover:bg-surface-light',
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            onClick={toggle}
            className="p-2 text-text-dim hover:text-accent transition-colors duration-200 ml-1"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative ml-1">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 ml-1 pl-2 pr-2.5 py-1 border border-border hover:border-accent transition-colors duration-200"
                style={{ borderRadius: '4px' }}
                aria-label="User menu"
              >
                <span
                  className="w-6 h-6 flex items-center justify-center bg-accent/10 text-accent text-xs font-mono font-bold"
                  style={{ borderRadius: '4px' }}
                >
                  {avatarInitial}
                </span>
                <span className="text-xs font-mono text-text-dim hidden lg:inline">
                  {user?.ratRank}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border z-50"
                    style={{ borderRadius: '4px' }}
                  >
                    <div className="py-1">
                      <Link
                        to={ROUTES.dashboard}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm font-mono text-text-dim hover:text-text hover:bg-surface-light transition-colors min-h-[44px] flex items-center"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={ROUTES.profile}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm font-mono text-text-dim hover:text-text hover:bg-surface-light transition-colors min-h-[44px] flex items-center"
                      >
                        Profile
                      </Link>
                      <Link
                        to={ROUTES.converter}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm font-mono text-text-dim hover:text-text hover:bg-surface-light transition-colors min-h-[44px] flex items-center"
                      >
                        Converter
                      </Link>
                      <hr className="border-border-light my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-mono text-danger hover:bg-surface-light transition-colors cursor-pointer min-h-[44px] flex items-center"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to={ROUTES.login}
              className="ml-1 px-3 py-1.5 text-sm font-mono text-accent border border-accent hover:bg-accent hover:text-background transition-colors duration-200"
              style={{ borderRadius: '4px' }}
            >
              Sign In
            </Link>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 text-text-dim hover:text-accent transition-colors duration-200"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
          <a
            href="https://github.com/anomalyco/ratmd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-text-dim hover:text-accent transition-colors duration-200"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <button
            onClick={toggle}
            className="p-2 text-text-dim hover:text-accent transition-colors duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 400 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden bg-surface/95 backdrop-blur-md border-b border-border"
          >
            <div className="max-w-[1100px] mx-auto px-6 py-3 flex flex-col gap-1">
              {internalLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-3 py-3 text-sm font-mono rounded-lg transition-colors duration-200 min-h-[44px] flex items-center',
                      isActive
                        ? 'text-accent bg-accent/10'
                        : 'text-text-dim hover:text-text hover:bg-surface-light',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-3 border-t border-border mt-1 min-h-[44px]">
                    <span
                      className="w-6 h-6 flex items-center justify-center bg-accent/10 text-accent text-xs font-mono font-bold"
                      style={{ borderRadius: '4px' }}
                    >
                      {avatarInitial}
                    </span>
                    <span className="text-xs font-mono text-text-dim">{user?.ratRank}</span>
                  </div>
                  <Link
                    to={ROUTES.dashboard}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 text-sm font-mono text-text-dim hover:text-text hover:bg-surface-light transition-colors min-h-[44px] flex items-center"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.profile}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 text-sm font-mono text-text-dim hover:text-text hover:bg-surface-light transition-colors min-h-[44px] flex items-center"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false)
                      await logout()
                      navigate(ROUTES.home)
                    }}
                    className="text-left px-3 py-3 text-sm font-mono text-danger hover:bg-surface-light transition-colors cursor-pointer min-h-[44px] flex items-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.login}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-mono text-accent hover:text-text transition-colors border-t border-border mt-1 min-h-[44px] flex items-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
