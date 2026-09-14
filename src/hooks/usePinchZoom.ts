import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type Point = { x: number; y: number }

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function usePinchZoom(minScale = 0.75, maxScale = 2.75) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, Point>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  const clampScale = useCallback((s: number) => Math.min(maxScale, Math.max(minScale, s)), [maxScale, minScale])

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = surfaceRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 1) {
      panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    }
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()]
      pinchStart.current = { dist: distance(pts[0], pts[1]), scale }
      panStart.current = null
    }
  }, [offset.x, offset.y, scale])

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.current.size === 2 && pinchStart.current) {
        const pts = [...pointers.current.values()]
        const dist = distance(pts[0], pts[1])
        const ratio = dist / pinchStart.current.dist
        setScale(clampScale(pinchStart.current.scale * ratio))
        return
      }

      if (pointers.current.size === 1 && panStart.current) {
        setOffset({
          x: panStart.current.ox + (e.clientX - panStart.current.x),
          y: panStart.current.oy + (e.clientY - panStart.current.y),
        })
      }
    },
    [clampScale],
  )

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) panStart.current = null
  }, [])

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  return {
    surfaceRef,
    scale,
    offset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
  }
}
