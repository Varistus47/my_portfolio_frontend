import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { ApiError } from '../../api'
import ErrorBox from '../../components/ErrorBox'
import Spinner from '../../components/Spinner'
import type { Orderable } from '../../types'
import ConfirmButton from './ConfirmButton'

export interface CrudApi<TRow extends Orderable, TInput> {
  list: () => Promise<TRow[]>
  create: (payload: TInput) => Promise<TRow>
  update: (id: number, payload: TInput) => Promise<TRow>
  remove: (id: number) => Promise<void>
}

interface CrudPanelProps<TRow extends Orderable, TInput> {
  title: string
  description?: string
  api: CrudApi<TRow, TInput>
  /** A blank payload for the "add new" form. */
  emptyDraft: () => TInput
  /** Turn an existing row into an editable payload. */
  toDraft: (row: TRow) => TInput
  /** Render the form fields for a draft. */
  renderForm: (draft: TInput, update: (patch: Partial<TInput>) => void) => ReactNode
  /** One-line summary shown in the list. */
  renderSummary: (row: TRow) => ReactNode
  /** Extra controls under a row (e.g. the project image uploader). */
  renderRowExtras?: (row: TRow, reload: () => void) => ReactNode
  addLabel?: string
  emptyMessage?: string
}

export default function CrudPanel<TRow extends Orderable, TInput>({
  title,
  description,
  api,
  emptyDraft,
  toDraft,
  renderForm,
  renderSummary,
  renderRowExtras,
  addLabel = 'Add new',
  emptyMessage = 'Nothing here yet.',
}: CrudPanelProps<TRow, TInput>) {
  const [rows, setRows] = useState<TRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // null = closed, 'new' = add form, number = editing that row
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [draft, setDraft] = useState<TInput | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .list()
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Could not load.')
      })
      .finally(() => setLoading(false))
  }, [api])

  useEffect(() => {
    reload()
  }, [reload])

  const updateDraft = (patch: Partial<TInput>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current))
  }

  const openNew = () => {
    setSaveError(null)
    setDraft(emptyDraft())
    setEditing('new')
  }

  const openEdit = (row: TRow) => {
    setSaveError(null)
    setDraft(toDraft(row))
    setEditing(row.id)
  }

  const cancel = () => {
    setEditing(null)
    setDraft(null)
    setSaveError(null)
  }

  const save = async () => {
    if (!draft || editing === null) return
    setBusy(true)
    setSaveError(null)
    try {
      if (editing === 'new') await api.create(draft)
      else await api.update(editing, draft)
      cancel()
      reload() // refetch, so the list always reflects the database
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    setBusy(true)
    setSaveError(null)
    try {
      await api.remove(id)
      if (editing === id) cancel()
      reload()
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not delete.')
    } finally {
      setBusy(false)
    }
  }

  /** Swap two rows' display_order so the public page order changes. */
  const move = async (index: number, direction: -1 | 1) => {
    const current = rows[index]
    const target = rows[index + direction]
    if (!current || !target) return
    setBusy(true)
    setSaveError(null)
    try {
      await api.update(current.id, {
        ...toDraft(current),
        display_order: target.display_order,
      })
      await api.update(target.id, {
        ...toDraft(target),
        display_order: current.display_order,
      })
      reload()
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not reorder.')
    } finally {
      setBusy(false)
    }
  }

  const formBlock = draft ? (
    <div className="rounded-xl border border-accent-500/40 bg-ink-900/70 p-4">
      <div className="space-y-4">{renderForm(draft, updateDraft)}</div>
      {saveError ? (
        <p className="mt-3 text-xs text-danger" role="alert">
          {saveError}
        </p>
      ) : null}
      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="rounded-md bg-accent-500 px-4 py-1.5 text-xs font-semibold text-ink-950 transition hover:bg-accent-400 disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={busy}
          className="rounded-md border border-ink-800 px-4 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : null

  return (
    <section>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink-100">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-ink-400">{description}</p>
          ) : null}
        </div>
        {editing === null ? (
          <button
            type="button"
            onClick={openNew}
            className="rounded-md bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-ink-950 transition hover:bg-accent-400"
          >
            {addLabel}
          </button>
        ) : null}
      </header>

      {editing === 'new' ? <div className="mb-5">{formBlock}</div> : null}

      {loading ? <Spinner label="Loading" /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}

      {!loading && !error && rows.length === 0 ? (
        <p className="rounded-lg border border-ink-800 bg-ink-900/50 px-4 py-6 text-center text-sm text-ink-400">
          {emptyMessage}
        </p>
      ) : null}

      {rows.length > 0 ? (
        <ul className="space-y-2">
          {rows.map((row, index) => (
            <li key={row.id}>
              {editing === row.id ? (
                formBlock
              ) : (
                <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">{renderSummary(row)}</div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => void move(index, -1)}
                        disabled={busy || index === 0}
                        aria-label="Move up"
                        className="rounded-md border border-ink-800 px-2 py-1 text-xs text-ink-400 transition hover:text-accent-400 disabled:opacity-30"
                      >
                        {'↑'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void move(index, 1)}
                        disabled={busy || index === rows.length - 1}
                        aria-label="Move down"
                        className="rounded-md border border-ink-800 px-2 py-1 text-xs text-ink-400 transition hover:text-accent-400 disabled:opacity-30"
                      >
                        {'↓'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        disabled={busy}
                        className="rounded-md border border-ink-800 px-2.5 py-1 text-xs font-medium text-ink-300 transition hover:border-accent-500 hover:text-accent-400 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <ConfirmButton
                        disabled={busy}
                        onConfirm={() => void remove(row.id)}
                      />
                    </div>
                  </div>
                  {renderRowExtras ? renderRowExtras(row, reload) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {saveError && editing === null ? (
        <p className="mt-3 text-xs text-danger" role="alert">
          {saveError}
        </p>
      ) : null}
    </section>
  )
}
