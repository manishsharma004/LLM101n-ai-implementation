import { useEffect, useState } from 'react'

export function useChapterScrollSpy(partIds: string[], extraIds: string[] = []) {
  const [activePartId, setActivePartId] = useState<string | null>(partIds[0] ?? null)

  useEffect(() => {
    const ids = [...partIds, ...extraIds]
    const elements = ids
      .map((id) => document.getElementById(`part-${id}`))
      .filter((el): el is HTMLElement => el != null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActivePartId(visible[0].target.id.replace(/^part-/, ''))
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [partIds, extraIds])

  function jumpToPart(partId: string) {
    const el = document.getElementById(`part-${partId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActivePartId(partId)
  }

  return { activePartId, jumpToPart }
}
