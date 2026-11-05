interface ContactRowProps {
  label: string
  value: string
  /** Omit for plain text (e.g. the address). */
  href?: string
  external?: boolean
  icon: string
}

/**
 * Renders nothing when the value is empty, so clearing a field in admin leaves
 * no dead chip behind on the public page.
 */
export default function ContactRow({
  label,
  value,
  href,
  external = false,
  icon,
}: ContactRowProps) {
  const text = value.trim()
  if (!text) return null

  const content = (
    <>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-850 text-accent-400"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs tracking-wide text-ink-400 uppercase">
          {label}
        </span>
        <span className="block truncate text-sm text-ink-200">{text}</span>
      </span>
    </>
  )

  if (!href) {
    return (
      <li className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/50 px-3 py-3">
        {content}
      </li>
    )
  }

  return (
    <li>
      <a
        href={href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        aria-label={`${label}: ${text}`}
        className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/50 px-3 py-3 transition hover:border-accent-500/60"
      >
        {content}
      </a>
    </li>
  )
}
