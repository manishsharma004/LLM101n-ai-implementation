import { useEffect, useRef, useState } from 'react'
import { useLabEditorHeight } from '../hooks/useLabEditorHeight'
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
  const { bodyRef, editorHeight, onPointerDown } = useLabEditorHeight()

  if (ide) {
    return (
      <section className="lab py-lab py-lab--ide" aria-label="Python lab">
        <div className="lab-ide-shell">
          <div className="lab-ide-meta">
            <span className="lab-ide-title">Pyodide editor</span>
            {running ? (
              <span className="lab-status running">Running…</span>
            ) : ready ? (
              <span className="lab-status ready">Ready</span>
            ) : (
              <span className="lab-status">Loading…</span>
            )}
          </div>
          <RuntimeBanner
            phase={phase}
            message={message}
            error={error}
            onRetry={retry}
            compact
          />
          <div ref={bodyRef} className="lab-ide-body">
            <div className="lab-editor-pane" style={{ height: editorHeight }}>
              <MonacoEditor
                value={code}
                onChange={setCode}
                language="python"
                minLines={editorMinLines}
                ariaLabel="Python lab code"
                constrained
              />
            </div>
            <div
              className="lab-vsplit-handle"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize editor and console"
              title="Drag to resize editor and console"
              onPointerDown={onPointerDown}
            />
            <div className="lab-actions lab-actions--pinned">
              <button type="button" className="primary btn-run-code" disabled={!ready || running} onClick={run}>
                {running ? 'Running…' : ready ? 'Run code' : 'Loading Python…'}
              </button>
              <button type="button" disabled={running} onClick={reset}>Reset</button>
            </div>
            <div className="lab-console lab-console--scroll lab-console--grow">
              <div className="output-label">Execution console</div>
              <pre className="output">{output || (ready ? '[Pyodide] Edit code and press Run code.' : '[Pyodide] Loading runtime…')}</pre>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="panel lab py-lab">
      <h3>{title}</h3>
      {description ? <p className="muted">{description}</p> : null}
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} />
      <p className="lab-hint">{hint}</p>
      <MonacoEditor value={code} onChange={setCode} language="python" minLines={editorMinLines} ariaLabel="Python lab code" />
      <div className="lab-actions">
        <button type="button" className="primary" disabled={!ready || running} onClick={run}>
          {running ? 'Running…' : ready ? runLabel : 'Loading Python…'}
        </button>
        <button type="button" disabled={running} onClick={reset}>Reset starter code</button>
      </div>
      <div className="output-block">
        <div className="output-label">Output</div>
        <pre className="output">{output || '(no output)'}</pre>
      </div>
    </section>
  )
}
