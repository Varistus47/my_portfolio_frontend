import type { Skill } from '../types'

interface SkillBadgeProps {
  skill: Skill
}

const MAX_LEVEL = 5

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-2 transition hover:border-ink-700">
      <span className="text-sm text-ink-200">{skill.name}</span>
      <span
        className="ml-auto flex shrink-0 items-center gap-1"
        role="img"
        aria-label={`Proficiency ${skill.level} of ${MAX_LEVEL}`}
      >
        {Array.from({ length: MAX_LEVEL }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`size-1.5 rounded-full ${
              index < skill.level ? 'bg-accent-400' : 'bg-ink-800'
            }`}
          />
        ))}
      </span>
    </li>
  )
}
