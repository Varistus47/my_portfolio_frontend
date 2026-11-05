import type { ReactNode } from 'react'

import { useReveal } from '../hooks/useReveal'

interface SectionProps {
  id: string
  title: string
  /** Optional line under the heading. */
  subtitle?: string
  children: ReactNode
  /** Extra classes on the inner wrapper. */
  className?: string
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
}: SectionProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <div ref={ref} className={`reveal ${className}`}>
        <header className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-100 sm:text-3xl">
            {title}
          </h2>
          <div className="mt-3 h-px w-16 bg-accent-500" />
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-sm text-ink-400">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  )
}
