import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from './MonacoEditor'
import { RuntimeBanner } from './RuntimeBanner'
import { RUNNER_PROGRAM } from '../lib/pyRunner'
import { usePyodide } from '../lib/usePyodide'

type PyCallable = (...args: unknown[]) => unknown

type Props = {
  title: string
  description?: string
  starterCode: string
  runLabel?: string
  hint?: string
  editorMinLines?: number
  variant?: 'default' | 'ide'
}

export function PyodideCodeLab({
  title,
  description,
  starterCode,
  runLabel = 'Run code',
  hint = 'Edit the Python below, then run.',
  editorMinLines = 14,
  variant = 'default',
}: Props) {
  const { pyodide, phase, message, error, retry } = usePyodide()
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const runRef = useRef<PyCallable | null>(null)
  const [runnerReady, setRunnerReady] = useState(false)

  useEffect(() => {
    setCode(starterCode)
  }, [starterCode])

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    setRunnerReady(false)
    void (async () => {
      await pyodide.runPythonAsync(RUNNER_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_snippet') as PyCallable
      setRunnerReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const ready = phase === 'ready' && runnerReady

  async function run() {
    if (!runRef.current) return
    setRunning(true)
    setOutput('')
    try {
      const result = runRef.current(code) as string
      setOutput(result || '(no output)')
    } finally {
      setRunning(false)
    }
  }

  function reset() {
    setCode(starterCode)
    setOutput('')
  }

  const ide = variant === 'ide'

  return (
    <section className={`panel lab py-lab ${ide ? 'py-lab--ide' : ''}`}>
      <div className="lab-header-row">
        <h3>{ide ? 'Pyodide editor' : title}</h3>
        {running ? <span className="lab-status running">Running…</span> : ready ? <span className="lab-status ready">Ready</span> : null}
      </div>
      {!ide && description ? <p className="muted">{description}</p> : null}
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} />
      {!ide ? <p className="lab-hint">{hint}</p> : null}
      <MonacoEditor
        value={code}
        onChange={setCode}
        language="python"
        minLines={ide ? Math.max(editorMinLines, 18) : editorMinLines}
        ariaLabel="Python lab code"
      />
      <div className="lab-actions">
        <button type="button" className="primary btn-run-code" disabled={!ready || running} onClick={run}>
          {running ? 'Running…' : ready ? (ide ? 'Run code' : runLabel) : 'Loading Python…'}
        </button>
        <button type="button" disabled={running} onClick={reset}>Reset</button>
      </div>
      <div className="output-block lab-console">
        <div className="output-label">Execution console</div>
        <pre className="output">{output || (ready ? '[Pyodide] Edit code and press Run code.' : '[Pyodide] Loading runtime…')}</pre>
      </div>
    </section>
  )
}
