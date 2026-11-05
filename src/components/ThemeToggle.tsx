import { useTheme } from '../hooks/useTheme'

interface ThemeToggleProps {
  /** Tightens the hit area slightly for the admin header. */
  compact?: boolean
}

/**
 * Light/dark switch. Inline SVG rather than an icon package - two icons is not
 * worth a dependency, and these inherit currentColor so they theme for free.
 */
export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const size = compact ? 'size-8' : 'size-10'

  return (
    <button
      type="button"
      onClick={toggle}
      // Both label and pressed state, so a screen reader announces the switch
      // and its current position rather than just "button".
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex ${size} shrink-0 items-center justify-center rounded-md border border-ink-800 text-ink-300 transition hover:border-accent-500 hover:text-accent-400`}
    >
      {isDark ? (
        /* Moon - currently dark, click for light */
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[1.1rem]"
        >
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        /* Sun - currently light, click for dark */
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[1.1rem]"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      )}
    </button>
  )
}
