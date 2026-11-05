import { useState } from 'react'

import { ApiError, login } from '../api'
import { setToken } from '../adminAuth'
import ThemeToggle from '../components/ThemeToggle'

interface AdminGateProps {
  onAuthenticated: () => void
  /** Set when a previously valid session was rejected mid-use. */
  notice?: string | null
}

export default function AdminGate({
  onAuthenticated,
  notice,
}: AdminGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!password) return
    setBusy(true)
    setError(null)
    try {
      const result = await login(password)
      setToken(result.token)
      setPassword('')
      onAuthenticated()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Incorrect password.')
      } else if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Could not sign in.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-ink-100">Admin</h1>
            <p className="mt-1.5 text-sm text-ink-400">
              Enter the admin password to manage your portfolio content.
            </p>
          </div>
          <ThemeToggle compact />
        </div>

        {notice ? (
          <p
            className="mt-4 rounded-lg border border-warn/40 bg-warn-soft px-3 py-2 text-xs text-warn"
            role="status"
          >
            {notice}
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium tracking-wide text-ink-300 uppercase"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-ink-800 bg-ink-850 px-3 py-2.5 text-sm text-ink-100 transition focus:border-accent-500 focus:outline-none"
            />
          </div>

          {error ? (
            <p className="text-xs text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-400 disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
