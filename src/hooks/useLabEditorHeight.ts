import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const STORAGE_KEY = 'llm101n-lab-editor-height-v1'
const MIN_EDITOR = 140
const MIN_CONSOLE = 88
const HANDLE = 8
/** Space for run row + handle below editor in lab-ide-body */
/** Handle + Run row + gaps below the editor pane */
const CHROME_BELOW_EDITOR = 72

function readStored(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

export function useLabEditorHeight() {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState(280)
  const heightRef = useRef(editorHeight)
  heightRef.current = editorHeight

  const clampHeight = useCallback((want: number, bodyH: number) => {
    const max = bodyH - MIN_CONSOLE - HANDLE - CHROME_BELOW_EDITOR
    return Math.min(Math.max(want, MIN_EDITOR), Math.max(MIN_EDITOR, max))
  }, [])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    function syncFromContainer() {
      const h = el!.clientHeight
      if (h < MIN_EDITOR + MIN_CONSOLE + HANDLE + CHROME_BELOW_EDITOR) return
      const stored = readStored()
      const initial = stored ?? Math.round(h * 0.38)
      setEditorHeight(clampHeight(initial, h))
    }

    syncFromContainer()
    const ro = new ResizeObserver(syncFromContainer)
    ro.observe(el)
    return () => ro.disconnect()
  }, [clampHeight])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = bodyRef.current
      if (!el) return
      e.preventDefault()
      const startY = e.clientY
      const startH = heightRef.current
      function onMove(ev: PointerEvent) {
        const bodyH = el!.clientHeight
        const next = clampHeight(startH + (ev.clientY - startY), bodyH)
        setEditorHeight(next)
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        try {
          localStorage.setItem(STORAGE_KEY, String(heightRef.current))
        } catch {
          /* ignore */
        }
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [clampHeight],
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(editorHeight))
    } catch {
      /* ignore */
    }
  }, [editorHeight])

  return { bodyRef, editorHeight, onPointerDown }
}
