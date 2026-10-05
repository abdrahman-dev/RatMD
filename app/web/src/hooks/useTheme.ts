import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ratmd-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem(STORAGE_KEY, next)
}

// Module-level store so every consumer shares one theme value. Header and Footer
// each call useTheme(); per-component state let their icons drift out of sync.
let theme: Theme = getInitialTheme()
const listeners = new Set<() => void>()

applyTheme(theme)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useTheme() {
  const current = useSyncExternalStore(
    subscribe,
    () => theme,
    () => 'dark' as Theme,
  )

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    theme = next
    applyTheme(next)
    listeners.forEach((listener) => listener())
  }, [])

  return { theme: current, toggle }
}