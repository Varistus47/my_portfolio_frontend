import { useEffect, useRef, useState } from 'react'

interface ConfirmButtonProps {
  onConfirm: () => void
  label?: string
  confirmLabel?: string
  disabled?: boolean
}

/**
 * Two-click delete. Avoids `window.confirm`, which is blocking and ugly, while
 * still making an accidental single click harmless. Reverts after 4 seconds.
 */
export default function ConfirmButton({
  onConfirm,
  label = 'Delete',
  confirmLabel = 'Click again to confirm',
  disabled = false,
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const handleClick = () => {
    if (armed) {
      if (timer.current) clearTimeout(timer.current)
      setArmed(false)
      onConfirm()
      return
    }
    setArmed(true)
    timer.current = setTimeout(() => setArmed(false), 4000)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
        armed
          ? 'border-danger-strong bg-danger-soft text-danger'
          : 'border-ink-800 text-ink-400 hover:border-danger hover:text-danger'
      }`}
    >
      {armed ? confirmLabel : label}
    </button>
  )
}
