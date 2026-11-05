import {
  createProject,
  deleteProject,
  deleteProjectImage,
  fileUrl,
  listProjects,
  updateProject,
  uploadProjectImage,
} from '../api'
import type { Project, ProjectInput } from '../types'
import CrudPanel from './widgets/CrudPanel'
import type { CrudApi } from './widgets/CrudPanel'
import FileDrop from './widgets/FileDrop'
import {
  CheckboxField,
  TagsField,
  TextAreaField,
  TextField,
} from './widgets/Field'

const api: CrudApi<Project, ProjectInput> = {
  list: listProjects,
  create: createProject,
  update: updateProject,
  remove: deleteProject,
}

const emptyDraft = (): ProjectInput => ({
  title: '',
  short_description: '',
  description: '',
  tech_stack: [],
  github_url: '',
  live_url: '',
  featured: false,
  start_date: '',
  end_date: '',
})

const toDraft = (row: Project): ProjectInput => ({
  title: row.title,
  short_description: row.short_description,
  description: row.description,
  tech_stack: row.tech_stack,
  github_url: row.github_url,
  live_url: row.live_url,
  featured: row.featured,
  start_date: row.start_date,
  end_date: row.end_date,
  display_order: row.display_order,
})

export default function ProjectsPanel() {
  return (
    <CrudPanel<Project, ProjectInput>
      title="Projects"
      description="Featured projects appear on the home page; all of them appear on /projects."
      addLabel="Add project"
      emptyMessage="No projects yet. Add your first one."
      api={api}
      emptyDraft={emptyDraft}
      toDraft={toDraft}
      renderForm={(draft, update) => (
        <>
          <TextField
            label="Title"
            value={draft.title}
            onChange={(title) => update({ title })}
            placeholder="Task Queue Service"
            required
          />
          <TextAreaField
            label="Short description"
            value={draft.short_description}
            onChange={(short_description) => update({ short_description })}
            hint="One or two lines. This is the card text on the home page."
            rows={2}
          />
          <TextAreaField
            label="Full description"
            value={draft.description}
            onChange={(description) => update({ description })}
            hint="Shown on the projects page."
            rows={5}
          />
          <TagsField
            label="Tech stack"
            value={draft.tech_stack}
            onChange={(tech_stack) => update({ tech_stack })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="GitHub URL"
              type="url"
              value={draft.github_url}
              onChange={(github_url) => update({ github_url })}
              placeholder="https://github.com/you/project"
            />
            <TextField
              label="Live demo URL"
              type="url"
              value={draft.live_url}
              onChange={(live_url) => update({ live_url })}
              placeholder="https://project.example.com"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Start"
              value={draft.start_date}
              onChange={(start_date) => update({ start_date })}
              placeholder="Jan 2025"
            />
            <TextField
              label="End"
              value={draft.end_date}
              onChange={(end_date) => update({ end_date })}
              placeholder="Present"
            />
          </div>
          <CheckboxField
            label="Feature on the home page"
            checked={draft.featured}
            onChange={(featured) => update({ featured })}
          />
        </>
      )}
      renderSummary={(row) => (
        <>
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-100">
            {row.title}
            {row.featured ? (
              <span className="rounded-full border border-accent-500/50 px-1.5 py-0.5 text-[10px] tracking-wide text-accent-400 uppercase">
                Featured
              </span>
            ) : null}
          </p>
          {row.short_description ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-ink-400">
              {row.short_description}
            </p>
          ) : null}
          {row.tech_stack.length > 0 ? (
            <p className="mt-1 text-xs text-ink-400">
              {row.tech_stack.join(' · ')}
            </p>
          ) : null}
        </>
      )}
      renderRowExtras={(row, reload) => {
        const image = fileUrl(row.image_url)
        return (
          <div className="mt-3 border-t border-ink-800 pt-3">
            <div className="flex flex-wrap items-end gap-4">
              {image ? (
                <div className="shrink-0">
                  <img
                    src={image}
                    alt={`${row.title} preview`}
                    className="h-16 w-28 rounded-md border border-ink-800 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      void deleteProjectImage(row.id).then(reload)
                    }}
                    className="mt-1.5 text-xs text-ink-400 transition hover:text-danger"
                  >
                    Remove image
                  </button>
                </div>
              ) : null}
              <div className="min-w-56 flex-1">
                <FileDrop
                  label={image ? 'Replace image' : 'Project image'}
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  hint="PNG, JPG, WEBP or AVIF. Max 8 MB."
                  onUpload={async (file) => {
                    await uploadProjectImage(row.id, file)
                    reload()
                  }}
                />
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}
