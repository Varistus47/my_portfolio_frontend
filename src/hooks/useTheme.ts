import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'

/**
 * Light/dark theme state.
 *
 * The class on <html> is the single source of truth, and the inline script in
 * index.html sets it before first paint so there is no flash of the wrong
 * theme. This module keeps a shared value plus a listener set, so two toggles
 * rendered at once (nav and admin) can never drift apart.
 */

function readInitial(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* private browsing can throw on storage access */
  }
  // Fall back to whatever the inline script already applied.
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('light')
      ? 'light'
      : 'dark'
  }
  return 'dark'
}

let current: Theme = readInitial()
const listeners = new Set<(theme: Theme) => void>()

function apply(theme: Theme): void {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  // Tells the browser to theme scrollbars, form controls and the caret.
  root.style.colorScheme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore - the choice just will not survive a reload */
  }
}

export function setTheme(theme: Theme): void {
  current = theme
  apply(theme)
  for (const listener of listeners) listener(theme)
}

export function useTheme() {
  const [theme, setLocal] = useState<Theme>(current)

  useEffect(() => {
    listeners.add(setLocal)
    // Re-sync in case another instance changed it before this one mounted.
    setLocal(current)
    return () => {
      listeners.delete(setLocal)
    }
  }, [])

  const toggle = useCallback(() => {
    setTheme(current === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggle, setTheme }
}
