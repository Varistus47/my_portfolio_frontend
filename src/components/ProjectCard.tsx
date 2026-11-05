import { fileUrl } from '../api'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  /** The /projects page shows the long description; the home preview does not. */
  detailed?: boolean
}

export default function ProjectCard({
  project,
  detailed = false,
}: ProjectCardProps) {
  const image = fileUrl(project.image_url)
  const dates = [project.start_date, project.end_date]
    .filter(Boolean)
    .join(' – ')
  const body = detailed
    ? project.description || project.short_description
    : project.short_description || project.description

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink-800 bg-ink-900/50 transition hover:border-ink-700">
      {image ? (
        <img
          src={image}
          alt={`${project.title} screenshot`}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-ink-100">{project.title}</h3>
          {project.featured ? (
            <span className="shrink-0 rounded-full border border-accent-500/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-accent-400 uppercase">
              Featured
            </span>
          ) : null}
        </div>

        {dates ? (
          <p className="mt-1 text-xs text-ink-400">{dates}</p>
        ) : null}

        {body ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{body}</p>
        ) : null}

        {project.tech_stack.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-ink-850 px-2 py-1 text-xs text-ink-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        {project.github_url || project.live_url ? (
          <div className="mt-5 flex flex-wrap items-center gap-4 pt-1 text-sm">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-400 transition hover:text-accent-300"
              >
                Code {'↗'}
              </a>
            ) : null}
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-400 transition hover:text-accent-300"
              >
                Live demo {'↗'}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
