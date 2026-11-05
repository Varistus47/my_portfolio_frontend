import {
  createEducation,
  deleteEducation,
  listEducation,
  updateEducation,
} from '../api'
import type { Education, EducationInput } from '../types'
import CrudPanel from './widgets/CrudPanel'
import type { CrudApi } from './widgets/CrudPanel'
import { TextAreaField, TextField } from './widgets/Field'

const api: CrudApi<Education, EducationInput> = {
  list: listEducation,
  create: createEducation,
  update: updateEducation,
  remove: deleteEducation,
}

const emptyDraft = (): EducationInput => ({
  institution: '',
  degree: '',
  field: '',
  location: '',
  start_date: '',
  end_date: '',
  grade: '',
  description: '',
})

const toDraft = (row: Education): EducationInput => ({
  institution: row.institution,
  degree: row.degree,
  field: row.field,
  location: row.location,
  start_date: row.start_date,
  end_date: row.end_date,
  grade: row.grade,
  description: row.description,
  display_order: row.display_order,
})

export default function EducationPanel() {
  return (
    <CrudPanel<Education, EducationInput>
      title="Education"
      description="Shown as a timeline on the home page."
      addLabel="Add education"
      emptyMessage="No education entries yet."
      api={api}
      emptyDraft={emptyDraft}
      toDraft={toDraft}
      renderForm={(draft, update) => (
        <>
          <TextField
            label="Institution"
            value={draft.institution}
            onChange={(institution) => update({ institution })}
            placeholder="Anna University"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Degree"
              value={draft.degree}
              onChange={(degree) => update({ degree })}
              placeholder="B.E."
            />
            <TextField
              label="Field of study"
              value={draft.field}
              onChange={(field) => update({ field })}
              placeholder="Computer Science"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Start"
              value={draft.start_date}
              onChange={(start_date) => update({ start_date })}
              placeholder="2021"
            />
            <TextField
              label="End"
              value={draft.end_date}
              onChange={(end_date) => update({ end_date })}
              placeholder="2025"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Location"
              value={draft.location}
              onChange={(location) => update({ location })}
              placeholder="Chennai, India"
            />
            <TextField
              label="Grade"
              value={draft.grade}
              onChange={(grade) => update({ grade })}
              placeholder="8.5 / 10 CGPA"
            />
          </div>
          <TextAreaField
            label="Details"
            value={draft.description}
            onChange={(description) => update({ description })}
            hint="One bullet per line."
            rows={4}
          />
        </>
      )}
      renderSummary={(row) => (
        <>
          <p className="text-sm font-medium text-ink-100">
            {[row.degree, row.field].filter(Boolean).join(', ') ||
              row.institution}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {[
              row.degree || row.field ? row.institution : null,
              [row.start_date, row.end_date].filter(Boolean).join(' – '),
              row.grade,
            ]
              .filter(Boolean)
              .join('  ·  ')}
          </p>
        </>
      )}
    />
  )
}
