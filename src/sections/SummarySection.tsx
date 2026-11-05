import Section from '../components/Section'
import SkillBadge from '../components/SkillBadge'
import type { Skill } from '../types'

interface SummarySectionProps {
  summary: string
  skills: Skill[]
}

export default function SummarySection({
  summary,
  skills,
}: SummarySectionProps) {
  const text = summary.trim()
  if (!text && skills.length === 0) return null

  // Group by category, preserving the display_order the API already applied.
  const groups = new Map<string, Skill[]>()
  for (const skill of skills) {
    const bucket = groups.get(skill.category)
    if (bucket) bucket.push(skill)
    else groups.set(skill.category, [skill])
  }

  return (
    <Section id="summary" title="Summary">
      {text ? (
        <p className="max-w-3xl text-base leading-relaxed text-ink-300">
          {text}
        </p>
      ) : null}

      {groups.size > 0 ? (
        <div className="mt-10">
          <h3 className="text-sm font-semibold tracking-wide text-ink-100 uppercase">
            Technical Skills
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {Array.from(groups, ([category, items]) => (
              <div key={category}>
                <h4 className="mb-3 text-xs font-medium tracking-wider text-accent-400 uppercase">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {items.map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  )
}
