import { useEffect, useRef, useState } from 'react'
import type * as Monaco from 'monaco-editor'
import { getMonaco } from '../lib/editor/monaco'

export type MonacoEditorProps = {
  value: string
  onChange: (value: string) => void
  language?: string
  minLines?: number
  ariaLabel?: string
}

export function MonacoEditor({
  value,
  onChange,
  language = 'python',
  minLines = 8,
  ariaLabel = 'Python code editor',
}: MonacoEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const modelRef = useRef<Monaco.editor.ITextModel | null>(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)

  onChangeRef.current = onChange
  const minHeight = `${Math.max(minLines, value.split('\n').length + 1) * 1.45 + 1}rem`

  useEffect(() => {
    let disposed = false
    void (async () => {
      const monaco = await getMonaco()
      if (disposed || !hostRef.current) return
      const model = monaco.editor.createModel(value, language)
      modelRef.current = model
      const editor = monaco.editor.create(hostRef.current, {
        model,
        theme: 'llm101n-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        fontSize: 13,
        fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, monospace',
        tabSize: 4,
        padding: { top: 8, bottom: 8 },
        ariaLabel,
      })
      editorRef.current = editor
      editor.onDidChangeModelContent(() => onChangeRef.current(model.getValue()))
      setReady(true)
    })()
    return () => {
      disposed = true
      editorRef.current?.dispose()
      editorRef.current = null
      modelRef.current?.dispose()
      modelRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const model = modelRef.current
    if (!model || model.getValue() === value) return
    model.setValue(value)
  }, [value])

  return (
    <div
      className={`monaco-editor-host${ready ? ' monaco-editor-host--ready' : ''}`}
      style={{ minHeight }}
      ref={hostRef}
    />
  )
}
