import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

import ThemeToggle from './ThemeToggle'

/**
 * The public navigation.
 *
 * There is deliberately NO /admin entry here, and none in the footer either.
 * The admin page is reachable only by typing its URL.
 */
const SECTION_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const

interface NavProps {
  /** Shown as the brand. Falls back to nothing rather than a hardcoded name. */
  fullName: string
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Nav({ fullName }: NavProps) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const location = useLocation()
  const onHome = location.pathname === '/'

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location])

  // Scroll-spy: highlight the section currently in view (home page only).
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    for (const link of SECTION_LINKS) {
      const element = document.getElementById(link.id)
      if (element) observer.observe(element)
    }
    return () => {
      observer.disconnect()
    }
  }, [onHome, location.key])

  const brand = fullName.trim()

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          to="/"
          className="font-semibold tracking-tight text-ink-100 transition hover:text-accent-400"
        >
          {brand ? (
            <>
              <span className="hidden sm:inline">{brand}</span>
              <span className="sm:hidden">{initials(brand)}</span>
            </>
          ) : (
            <span className="text-ink-400">Portfolio</span>
          )}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={`/#${link.id}`}
                className={`rounded-md px-3 py-2 text-sm transition hover:text-accent-400 ${
                  onHome && activeId === link.id
                    ? 'text-accent-400'
                    : 'text-ink-300'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/projects"
              className={`ml-2 rounded-md border px-3 py-2 text-sm transition ${
                location.pathname === '/projects'
                  ? 'border-accent-500 text-accent-400'
                  : 'border-ink-800 text-ink-300 hover:border-ink-700 hover:text-accent-400'
              }`}
            >
              All Projects
            </Link>
          </li>
          <li className="ml-1">
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile controls. The theme toggle sits OUTSIDE the collapsible menu
            so it is one tap away on a phone, not hidden behind the hamburger. */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-ink-800 text-ink-300 transition hover:border-accent-500 hover:text-accent-400"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-ink-800 bg-ink-950 md:hidden"
        >
          <ul className="mx-auto max-w-5xl px-4 py-2 sm:px-6">
            {SECTION_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/#${link.id}`}
                  className="block rounded-md px-2 py-3 text-sm text-ink-300 transition hover:text-accent-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/projects"
                className="block rounded-md px-2 py-3 text-sm text-ink-300 transition hover:text-accent-400"
              >
                All Projects
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
