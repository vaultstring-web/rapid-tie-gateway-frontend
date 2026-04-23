import { useState, useEffect } from 'react'
import { theme } from '@/styles/theme'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export const useBreakpoints = () => {
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.mobile})`)
  const isTablet = useMediaQuery(`(min-width: ${theme.breakpoints.mobile}) and (max-width: ${theme.breakpoints.tablet})`)
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.desktop})`)

  return { isMobile, isTablet, isDesktop }
}