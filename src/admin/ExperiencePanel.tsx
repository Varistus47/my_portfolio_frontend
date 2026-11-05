import {
  createExperience,
  deleteExperience,
  listExperience,
  updateExperience,
} from '../api'
import { EMPLOYMENT_TYPE_SUGGESTIONS } from '../types'
import type { Experience, ExperienceInput } from '../types'
import CrudPanel from './widgets/CrudPanel'
import type { CrudApi } from './widgets/CrudPanel'
import {
  CheckboxField,
  SelectField,
  TagsField,
  TextAreaField,
  TextField,
} from './widgets/Field'

const api: CrudApi<Experience, ExperienceInput> = {
  list: listExperience,
  create: createExperience,
  update: updateExperience,
  remove: deleteExperience,
}

const emptyDraft = (): ExperienceInput => ({
  company: '',
  role: '',
  location: '',
  employment_type: 'Full-time',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  tech_stack: [],
})

const toDraft = (row: Experience): ExperienceInput => ({
  company: row.company,
  role: row.role,
  location: row.location,
  employment_type: row.employment_type,
  start_date: row.start_date,
  end_date: row.end_date,
  is_current: row.is_current,
  description: row.description,
  tech_stack: row.tech_stack,
  display_order: row.display_order,
})

export default function ExperiencePanel() {
  return (
    <CrudPanel<Experience, ExperienceInput>
      title="Work Experience"
      description="Shown as a timeline on the home page, newest first by default."
      addLabel="Add role"
      emptyMessage="No work experience yet."
      api={api}
      emptyDraft={emptyDraft}
      toDraft={toDraft}
      renderForm={(draft, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Company"
              value={draft.company}
              onChange={(company) => update({ company })}
              placeholder="Acme Corp"
              required
            />
            <TextField
              label="Role"
              value={draft.role}
              onChange={(role) => update({ role })}
              placeholder="Software Engineer"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Location"
              value={draft.location}
              onChange={(location) => update({ location })}
              placeholder="Chennai, India"
            />
            <SelectField
              label="Employment type"
              value={draft.employment_type}
              onChange={(employment_type) => update({ employment_type })}
              options={EMPLOYMENT_TYPE_SUGGESTIONS}
              freeform
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Start"
              value={draft.start_date}
              onChange={(start_date) => update({ start_date })}
              placeholder="Jul 2025"
            />
            <TextField
              label="End"
              value={draft.end_date}
              onChange={(end_date) => update({ end_date })}
              placeholder="Mar 2026"
              hint={
                draft.is_current
                  ? 'Ignored while "current role" is checked.'
                  : undefined
              }
            />
          </div>
          <CheckboxField
            label="This is my current role"
            checked={draft.is_current}
            onChange={(is_current) => update({ is_current })}
            hint='Shows a "Current" badge and displays the end date as "Present".'
          />
          <TextAreaField
            label="Responsibilities & achievements"
            value={draft.description}
            onChange={(description) => update({ description })}
            hint="One bullet per line."
            rows={5}
          />
          <TagsField
            label="Tech used"
            value={draft.tech_stack}
            onChange={(tech_stack) => update({ tech_stack })}
          />
        </>
      )}
      renderSummary={(row) => (
        <>
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-100">
            {row.role || row.company}
            {row.is_current ? (
              <span className="rounded-full border border-accent-500/50 px-1.5 py-0.5 text-[10px] tracking-wide text-accent-400 uppercase">
                Current
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {[
              row.role ? row.company : null,
              [row.start_date, row.is_current ? 'Present' : row.end_date]
                .filter(Boolean)
                .join(' – '),
              row.employment_type,
            ]
              .filter(Boolean)
              .join('  ·  ')}
          </p>
        </>
      )}
    />
  )
}
