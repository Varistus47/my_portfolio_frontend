import Section from '../components/Section'
import TimelineItem from '../components/TimelineItem'
import type { Experience } from '../types'

interface ExperienceSectionProps {
  experience: Experience[]
}

function dateRange(entry: Experience): string {
  const end = entry.is_current ? 'Present' : entry.end_date
  return [entry.start_date, end].filter(Boolean).join(' – ')
}

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  if (experience.length === 0) return null

  return (
    <Section id="experience" title="Work Experience">
      <ul className="max-w-3xl">
        {experience.map((entry) => (
          <TimelineItem
            key={entry.id}
            title={entry.role || entry.company}
            subtitle={entry.role ? entry.company : undefined}
            dates={dateRange(entry)}
            meta={[entry.location, entry.employment_type]
              .filter(Boolean)
              .join(' · ')}
            description={entry.description}
            tags={entry.tech_stack}
            badge={
              entry.is_current ? (
                <span className="rounded-full border border-accent-500/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-accent-400 uppercase">
                  Current
                </span>
              ) : null
            }
          />
        ))}
      </ul>
    </Section>
  )
}
