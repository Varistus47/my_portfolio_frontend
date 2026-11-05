interface SpinnerProps {
  label?: string
}

export default function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 py-16 text-ink-400"
      role="status"
      aria-live="polite"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-ink-700 border-t-accent-400" />
      <span className="text-sm">{label}…</span>
    </div>
  )
}
