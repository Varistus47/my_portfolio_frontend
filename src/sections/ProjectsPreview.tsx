import { Link } from 'react-router'

import ProjectCard from '../components/ProjectCard'
import Section from '../components/Section'
import type { Project } from '../types'

interface ProjectsPreviewProps {
  projects: Project[]
}

export default function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  if (projects.length === 0) return null

  // Featured projects lead; if none are flagged, fall back to the first few so
  // the home page is never empty while /projects has content.
  const featured = projects.filter((project) => project.featured)
  const shown = (featured.length > 0 ? featured : projects).slice(0, 3)
  const hasMore = projects.length > shown.length

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="A few things I have built. The full list is on the projects page."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition hover:text-accent-300"
          >
            View all {projects.length} projects
            <span aria-hidden="true">{'→'}</span>
          </Link>
        </div>
      ) : null}
    </Section>
  )
}
