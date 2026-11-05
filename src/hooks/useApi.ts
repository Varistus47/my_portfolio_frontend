import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '../api'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
  setData: (next: T) => void
}

/**
 * Runs `fetcher` on mount and whenever `reload()` is called.
 *
 * `fetcher` must be stable (wrap it in useCallback, or define it at module
 * scope) or this will refetch on every render.
 */
export function useApi<T>(fetcher: () => Promise<T>): ApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(
          err instanceof ApiError ? err.message : 'Something went wrong.',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, tick])

  return { data, loading, error, reload, setData }
}
