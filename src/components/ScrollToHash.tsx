import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Makes `/#about` work from another route.
 *
 * Clicking a section anchor while on /projects navigates to / first; the
 * target element does not exist until that render completes, so the scroll has
 * to happen after it. Without this, such links land at the top of the page.
 */
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const id = hash.slice(1)
    // rAF twice: once for this paint, once for the content that mounts after
    // the API data resolves.
    let frame = 0
    let attempts = 0
    const tryScroll = () => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (attempts < 40) {
        attempts += 1
        frame = requestAnimationFrame(tryScroll)
      }
    }
    frame = requestAnimationFrame(tryScroll)

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [hash, pathname])

  return null
}
