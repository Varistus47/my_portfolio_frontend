import { useId, useRef, useState } from 'react'

import { ApiError } from '../../api'

interface FileDropProps {
  label: string
  /** e.g. "image/png,image/jpeg" or "application/pdf" */
  accept: string
  hint?: string
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
}

/**
 * File picker that uploads immediately and reports the outcome inline.
 *
 * The actual multipart request lives in api.ts, which deliberately does not
 * set Content-Type so the browser can generate the boundary.
 */
export default function FileDrop({
  label,
  accept,
  hint,
  onUpload,
  disabled = false,
}: FileDropProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const handleFile = async (file: File) => {
    setBusy(true)
    setMessage(null)
    setFailed(false)
    try {
      await onUpload(file)
      setMessage(`Uploaded ${file.name}`)
    } catch (error: unknown) {
      setFailed(true)
      setMessage(
        error instanceof ApiError ? error.message : 'Upload failed.',
      )
    } finally {
      setBusy(false)
      // Reset so picking the same file again still fires onChange.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-medium tracking-wide text-ink-300 uppercase"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled || busy}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
        }}
        className="w-full cursor-pointer rounded-lg border border-ink-800 bg-ink-850 text-sm text-ink-300 transition file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-ink-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-100 hover:border-ink-700 disabled:opacity-50"
      />
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
      {busy ? (
        <p className="mt-1.5 text-xs text-accent-400">Uploading…</p>
      ) : null}
      {message ? (
        <p
          className={`mt-1.5 text-xs ${failed ? "text-danger" : "text-success"}`}
          role={failed ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
