import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const MIN_LEFT = 240
const MIN_RIGHT = 320
const HANDLE = 6

function readStored(key: string): number | null {
  try {
    const v = localStorage.getItem(key)
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) && n > 0 && n < 1 ? n : null
  } catch {
    return null
  }
}

/** `rightRatio` = right column width / total inner width (excluding handle). */
export function useHorizontalSplit(storageKey: string, defaultRightRatio = 0.42) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rightRatio, setRightRatio] = useState(defaultRightRatio)
  const ratioRef = useRef(rightRatio)
  ratioRef.current = rightRatio

  useEffect(() => {
    const stored = readStored(storageKey)
    if (stored != null) setRightRatio(stored)
  }, [storageKey])

  const leftFr = 1 - rightRatio
  const gridTemplateColumns = `minmax(${MIN_LEFT}px, ${leftFr}fr) ${HANDLE}px minmax(${MIN_RIGHT}px, ${rightRatio}fr)`

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = containerRef.current
      if (!el) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      function clampRatio(next: number) {
        const inner = rect.width - HANDLE
        const minRight = MIN_RIGHT / inner
        const maxRight = 1 - MIN_LEFT / inner
        return Math.min(Math.max(next, minRight), maxRight)
      }

      function onMove(ev: PointerEvent) {
        const inner = rect.width - HANDLE
        const rightPx = rect.right - ev.clientX
        setRightRatio(clampRatio(rightPx / inner))
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        try {
          localStorage.setItem(storageKey, String(ratioRef.current))
        } catch {
          /* ignore */
        }
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [storageKey],
  )

  return { containerRef, gridTemplateColumns, onPointerDown }
}
