import type { ReactNode } from 'react'

interface TimelineItemProps {
  title: string
  subtitle?: string
  meta?: string
  dates?: string
  /** One bullet per newline. */
  description?: string
  tags?: string[]
  badge?: ReactNode
}

export default function TimelineItem({
  title,
  subtitle,
  meta,
  dates,
  description,
  tags,
  badge,
}: TimelineItemProps) {
  const bullets = (description ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <li className="relative border-l border-ink-800 pb-9 pl-6 last:pb-0">
      {/* Dot on the rail */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent-500 ring-4 ring-ink-950"
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-semibold text-ink-100">{title}</h3>
        {badge}
      </div>

      {subtitle ? (
        <p className="mt-0.5 text-sm text-accent-400">{subtitle}</p>
      ) : null}

      {dates || meta ? (
        <p className="mt-1 text-xs text-ink-400">
          {[dates, meta].filter(Boolean).join('  ·  ')}
        </p>
      ) : null}

      {bullets.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink-300">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 shrink-0 text-accent-500">
                <span className="block size-1 rounded-full bg-current" />
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {tags && tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-ink-850 px-2 py-1 text-xs text-ink-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}
