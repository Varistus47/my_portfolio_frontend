import type { Profile } from '../types'

interface FooterProps {
  profile: Profile | null
}

// Read once at module load rather than during render: calling `new Date()` in
// a render body is impure, and a copyright year does not need to be live.
const YEAR = new Date().getFullYear()

/** No admin link here either - /admin is URL-only by design. */
export default function Footer({ profile }: FooterProps) {
  const name = profile?.full_name?.trim() ?? ''
  const links = [
    { label: 'GitHub', href: profile?.contact.github_url },
    { label: 'LinkedIn', href: profile?.contact.linkedin_url },
    { label: 'LeetCode', href: profile?.contact.leetcode_url },
  ].filter((link) => Boolean(link.href))

  return (
    <footer className="border-t border-ink-800 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-sm text-ink-400 sm:flex-row sm:justify-between sm:px-6">
        <p>
          {name ? `© ${YEAR} ${name}` : `© ${YEAR}`}
        </p>
        {links.length > 0 ? (
          <ul className="flex items-center gap-5">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-accent-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </footer>
  )
}
