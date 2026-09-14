import { useEffect, useState } from 'react'

/** Matches `@media (max-width: 900px)` workspace rules in `index.css`. */
export const MOBILE_WORKSPACE_QUERY = '(max-width: 900px)'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useMobileWorkspace(): boolean {
  return useMediaQuery(MOBILE_WORKSPACE_QUERY)
}
