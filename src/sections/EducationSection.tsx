import Section from '../components/Section'
import TimelineItem from '../components/TimelineItem'
import type { Education } from '../types'

interface EducationSectionProps {
  education: Education[]
}

export default function EducationSection({
  education,
}: EducationSectionProps) {
  if (education.length === 0) return null

  return (
    <Section id="education" title="Education">
      <ul className="max-w-3xl">
        {education.map((entry) => {
          const qualification = [entry.degree, entry.field]
            .filter(Boolean)
            .join(', ')
          return (
            <TimelineItem
              key={entry.id}
              title={qualification || entry.institution}
              subtitle={qualification ? entry.institution : undefined}
              dates={[entry.start_date, entry.end_date]
                .filter(Boolean)
                .join(' – ')}
              meta={[entry.location, entry.grade].filter(Boolean).join(' · ')}
              description={entry.description}
            />
          )
        })}
      </ul>
    </Section>
  )
}
