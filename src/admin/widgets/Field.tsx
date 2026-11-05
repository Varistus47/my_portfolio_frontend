import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const baseInput =
  'w-full rounded-lg border border-ink-800 bg-ink-850 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-400 transition focus:border-accent-500 focus:outline-none'

interface LabelProps {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}

function Wrapper({ label, hint, children, htmlFor }: LabelProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium tracking-wide text-ink-300 uppercase"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password'
  id?: string
  required?: boolean
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
  id,
  required,
}: TextFieldProps) {
  return (
    <Wrapper label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={baseInput}
      />
    </Wrapper>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  hint?: string
  id?: string
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  id,
}: TextAreaFieldProps) {
  return (
    <Wrapper label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${baseInput} resize-y leading-relaxed`}
      />
    </Wrapper>
  )
}

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  hint?: string
  id?: string
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  hint,
  id,
}: NumberFieldProps) {
  return (
    <Wrapper label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange(Number.isFinite(next) ? next : 0)
        }}
        className={baseInput}
      />
    </Wrapper>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  /** Allows values outside `options` (uses a datalist instead of a select). */
  freeform?: boolean
  hint?: string
  id?: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  freeform = false,
  hint,
  id,
}: SelectFieldProps) {
  const listId = `${id ?? label.replace(/\s+/g, '-')}-options`

  if (freeform) {
    return (
      <Wrapper label={label} hint={hint} htmlFor={id}>
        <input
          id={id}
          list={listId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={baseInput}
        />
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </Wrapper>
    )
  }

  return (
    <Wrapper label={label} hint={hint} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={baseInput}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Wrapper>
  )
}

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  id?: string
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
  id,
}: CheckboxFieldProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-200">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 rounded border-ink-700 bg-ink-850 accent-accent-500"
        />
        {label}
      </label>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  )
}

interface TagsFieldProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hint?: string
  id?: string
}

/**
 * Comma-separated input backed by a string[] (matches the API shape).
 *
 * Keeps the raw text in local state. Deriving the input's value from
 * `value.join(', ')` would strip the comma the moment you typed it (the empty
 * trailing segment is filtered out), making a second tag impossible to enter.
 */
export function TagsField({
  label,
  value,
  onChange,
  hint = 'Separate with commas, e.g. React, FastAPI, SQLite',
  id,
}: TagsFieldProps) {
  const joined = value.join(', ')
  const [draft, setDraft] = useState(joined)

  // Re-sync only when the parent swapped in a genuinely different record
  // (e.g. Edit clicked). Comparing normalised forms means a half-typed
  // "React," is left alone, since it normalises to the same "React".
  const normalisedDraft = draft
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')

  useEffect(() => {
    if (joined !== normalisedDraft) setDraft(joined)
    // normalisedDraft is intentionally omitted: including it would re-run on
    // every keystroke and undo the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined])

  return (
    <Wrapper label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(event) => {
          const text = event.target.value
          setDraft(text)
          onChange(
            text
              .split(',')
              .map((part) => part.trim())
              .filter(Boolean),
          )
        }}
        className={baseInput}
      />
    </Wrapper>
  )
}
