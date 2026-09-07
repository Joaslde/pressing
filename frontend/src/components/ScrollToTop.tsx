import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router doesn't reset scroll position on navigation by default, so
 * without this a new page can render already scrolled to wherever the
 * previous page's scroll position was (e.g. landing on the footer of a
 * short page after navigating from further down a long one). Mounted once
 * at the app root, above <Routes>.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
