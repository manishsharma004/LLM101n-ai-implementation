import { useCallback, useEffect, useRef, useState } from 'react'
import type { PyodideInterface } from 'pyodide'
import { getPyodide, onPyodideProgress, resetPyodideLoad, type LoadPhase } from './pyodide'

export function usePyodide() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [phase, setPhase] = useState<LoadPhase>('loading')
  const [message, setMessage] = useState('Loading Pyodide (~15 MB first visit)…')
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const mounted = useRef(true)

  const retry = useCallback(() => {
    resetPyodideLoad()
    setError(null)
    setPyodide(null)
    setPhase('loading')
    setMessage('Retrying Pyodide…')
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    mounted.current = true
    const unsub = onPyodideProgress((msg) => {
      if (mounted.current) setMessage(msg)
    })
    getPyodide()
      .then((py) => {
        if (!mounted.current) return
        setPyodide(py)
        setPhase('ready')
      })
      .catch((err: unknown) => {
        if (!mounted.current) return
        setPhase('error')
        setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      mounted.current = false
      unsub()
    }
  }, [attempt])

  return { pyodide, phase, message, error, retry }
}
