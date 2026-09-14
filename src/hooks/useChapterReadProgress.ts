import { useEffect, useState } from 'react'

/** Rough scroll-based progress for the chapter progress bar. */
export function useChapterReadProgress(containerSelector: string, enabled: boolean) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const el = document.querySelector(containerSelector)
    if (!el) return

    function onScroll() {
      const total = el!.scrollHeight - window.innerHeight
      if (total <= 0) {
        setPct(100)
        return
      }
      const scrolled = window.scrollY - (el as HTMLElement).offsetTop + 120
      setPct(Math.min(100, Math.max(0, Math.round((scrolled / total) * 100))))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [containerSelector, enabled])

  return pct
}
