import { useState } from 'react'
import { Link } from 'react-router'

import ThemeToggle from '../components/ThemeToggle'
import EducationPanel from './EducationPanel'
import ExperiencePanel from './ExperiencePanel'
import ProfilePanel from './ProfilePanel'
import ProjectsPanel from './ProjectsPanel'
import SkillsPanel from './SkillsPanel'

const TABS = [
  'Profile',
  'Skills',
  'Projects',
  'Education',
  'Experience',
] as const

type Tab = (typeof TABS)[number]

interface AdminShellProps {
  onLogout: () => void
}

export default function AdminShell({ onLogout }: AdminShellProps) {
  const [tab, setTab] = useState<Tab>('Profile')

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink-100">
            Portfolio Admin
          </h1>
          <p className="mt-1 text-xs text-ink-400">
            Changes save to the database and appear on the site immediately.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin renders outside the public nav, so it carries its own
              toggle rather than inheriting one. */}
          <ThemeToggle compact />
          <Link
            to="/"
            className="rounded-md border border-ink-800 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-accent-500 hover:text-accent-400"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-ink-800 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-danger hover:text-danger"
          >
            Log out
          </button>
        </div>
      </header>

      <nav
        className="mt-8 flex flex-wrap gap-1 border-b border-ink-800"
        aria-label="Admin sections"
      >
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            aria-current={tab === item ? 'page' : undefined}
            className={`-mb-px rounded-t-md border-b-2 px-3.5 py-2 text-sm font-medium transition ${
              tab === item
                ? 'border-accent-500 text-accent-400'
                : 'border-transparent text-ink-400 hover:text-ink-200'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === 'Profile' ? <ProfilePanel /> : null}
        {tab === 'Skills' ? <SkillsPanel /> : null}
        {tab === 'Projects' ? <ProjectsPanel /> : null}
        {tab === 'Education' ? <EducationPanel /> : null}
        {tab === 'Experience' ? <ExperiencePanel /> : null}
      </div>
    </div>
  )
}
