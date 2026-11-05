import { useEffect } from 'react'
import { Link } from 'react-router'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found'
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium tracking-widest text-accent-400 uppercase">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-ink-100 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-400">
        That page does not exist.
      </p>
      <Link
        to="/"
        className="mt-7 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-400"
      >
        Back to home
      </Link>
    </div>
  )
}
