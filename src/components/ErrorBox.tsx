interface ErrorBoxProps {
  message: string
  onRetry?: () => void
}

export default function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div
      className="rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
      role="alert"
    >
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md border border-danger/50 px-3 py-1 text-xs font-medium text-danger transition hover:border-danger"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
