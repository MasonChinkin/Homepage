import { useState, useEffect } from 'react'
import { breakpoints } from 'src/styles/theme'

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsPhone = (): boolean =>
  useMediaQuery(`(max-width: ${breakpoints.phone})`)

export const useIsMobile = (): boolean =>
  useMediaQuery(`(max-width: ${breakpoints.mobile})`)
