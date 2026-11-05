import { useEffect, useRef } from 'react'

/**
 * Adds `reveal-visible` the first time the element scrolls into view.
 *
 * Returns a ref to attach to an element that also carries the `reveal` class.
 * If IntersectionObserver is unavailable the element is revealed immediately,
 * so content is never trapped behind a missing API.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('reveal-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  return ref
}
