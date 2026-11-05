import { useCallback, useEffect } from 'react'

import { listProjects } from '../api'
import ErrorBox from '../components/ErrorBox'
import ProjectCard from '../components/ProjectCard'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'

export default function ProjectsPage() {
  const fetchProjects = useCallback(() => listProjects(), [])
  const { data, loading, error, reload } = useApi(fetchProjects)

  useEffect(() => {
    document.title = 'Projects'
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
          Projects
        </h1>
        <div className="mt-3 h-px w-16 bg-accent-500" />
        {data && data.length > 0 ? (
          <p className="mt-4 text-sm text-ink-400">
            {data.length} {data.length === 1 ? 'project' : 'projects'}
          </p>
        ) : null}
      </header>

      {loading ? <Spinner label="Loading projects" /> : null}

      {error ? <ErrorBox message={error} onRetry={reload} /> : null}

      {data && data.length === 0 ? (
        <p className="rounded-lg border border-ink-800 bg-ink-900/50 px-4 py-8 text-center text-sm text-ink-400">
          No projects have been added yet.
        </p>
      ) : null}

      {data && data.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} detailed />
          ))}
        </div>
      ) : null}
    </div>
  )
}
