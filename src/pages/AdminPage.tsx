import { useCallback, useEffect, useState } from 'react'

import { clearToken, getToken, onTokenChange } from '../adminAuth'
import AdminGate from '../admin/AdminGate'
import AdminShell from '../admin/AdminShell'
import { checkSession } from '../api'
import Spinner from '../components/Spinner'

type Status = 'checking' | 'locked' | 'unlocked'

export default function AdminPage() {
  const [status, setStatus] = useState<Status>('checking')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Admin'

    // Keep this page out of search results. The admin route is unlinked, but a
    // crawler that guesses the URL should not index it either.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex,nofollow'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])

  // Restore a session on refresh: a stored token is only trusted once the
  // backend confirms it is still valid.
  useEffect(() => {
    let cancelled = false
    if (!getToken()) {
      setStatus('locked')
      return
    }
    checkSession()
      .then(() => {
        if (!cancelled) setStatus('unlocked')
      })
      .catch(() => {
        if (cancelled) return
        clearToken()
        setStatus('locked')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // api.ts clears the token on any 401, so an expired session mid-use drops
  // straight back to the gate with an explanation.
  useEffect(
    () =>
      onTokenChange(() => {
        if (!getToken()) {
          setStatus((current) => {
            if (current === 'unlocked') {
              setNotice('Your session expired. Please sign in again.')
              return 'locked'
            }
            return current
          })
        }
      }),
    [],
  )

  const handleLogout = useCallback(() => {
    setNotice(null)
    clearToken()
    setStatus('locked')
  }, [])

  const handleAuthenticated = useCallback(() => {
    setNotice(null)
    setStatus('unlocked')
  }, [])

  if (status === 'checking') {
    return <Spinner label="Checking session" />
  }

  if (status === 'locked') {
    return <AdminGate onAuthenticated={handleAuthenticated} notice={notice} />
  }

  return <AdminShell onLogout={handleLogout} />
}
