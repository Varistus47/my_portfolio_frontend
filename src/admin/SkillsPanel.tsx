import {
  createSkill,
  deleteSkill,
  listSkills,
  updateSkill,
} from '../api'
import { SKILL_CATEGORY_SUGGESTIONS } from '../types'
import type { Skill, SkillInput } from '../types'
import CrudPanel from './widgets/CrudPanel'
import type { CrudApi } from './widgets/CrudPanel'
import { NumberField, SelectField, TextField } from './widgets/Field'

// Module scope on purpose: CrudPanel's reload() depends on this object, so a
// new literal each render would refetch forever.
const api: CrudApi<Skill, SkillInput> = {
  list: listSkills,
  create: createSkill,
  update: updateSkill,
  remove: deleteSkill,
}

const emptyDraft = (): SkillInput => ({
  name: '',
  category: 'Languages',
  level: 3,
})

const toDraft = (row: Skill): SkillInput => ({
  name: row.name,
  category: row.category,
  level: row.level,
  display_order: row.display_order,
})

export default function SkillsPanel() {
  return (
    <CrudPanel<Skill, SkillInput>
      title="Technical Skills"
      description="Grouped by category on the home page. Level drives the dots on each badge."
      addLabel="Add skill"
      emptyMessage="No skills yet. Add your first one."
      api={api}
      emptyDraft={emptyDraft}
      toDraft={toDraft}
      renderForm={(draft, update) => (
        <>
          <TextField
            label="Skill"
            value={draft.name}
            onChange={(name) => update({ name })}
            placeholder="Python"
            required
          />
          <SelectField
            label="Category"
            value={draft.category}
            onChange={(category) => update({ category })}
            options={SKILL_CATEGORY_SUGGESTIONS}
            freeform
            hint="Pick one or type a new category."
          />
          <NumberField
            label="Level (1-5)"
            value={draft.level}
            onChange={(level) => update({ level })}
            min={1}
            max={5}
          />
        </>
      )}
      renderSummary={(row) => (
        <>
          <p className="text-sm font-medium text-ink-100">{row.name}</p>
          <p className="mt-0.5 text-xs text-ink-400">
            {row.category} {'·'} level {row.level}/5
          </p>
        </>
      )}
    />
  )
}
