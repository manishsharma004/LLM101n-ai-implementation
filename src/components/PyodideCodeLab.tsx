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
}

export function PyodideCodeLab({ title, description, starterCode }: Props) {
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

  return (
    <section className="panel lab py-lab">
      <h3>{title}</h3>
      {description ? <p className="muted">{description}</p> : null}
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} />
      <p className="lab-hint">
        Edit the Python below (micrograd + training loop), then <strong>Run training</strong>.
      </p>
      <MonacoEditor value={code} onChange={setCode} language="python" minLines={14} ariaLabel="Micrograd Python" />
      <div className="lab-actions">
        <button type="button" className="primary" disabled={!ready || running} onClick={run}>
          {running ? 'Running…' : ready ? 'Run training' : 'Loading Python…'}
        </button>
        <button type="button" disabled={running} onClick={reset}>Reset starter code</button>
      </div>
      {output ? (
        <div className="output-block">
          <div className="output-label">Output</div>
          <pre className="output">{output}</pre>
        </div>
      ) : null}
    </section>
  )
}
