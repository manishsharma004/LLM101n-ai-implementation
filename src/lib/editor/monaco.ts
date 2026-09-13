import type * as Monaco from 'monaco-editor'

let monacoPromise: Promise<typeof Monaco> | null = null

function ensureWorkerEnvironment(): void {
  const g = globalThis as typeof globalThis & { MonacoEnvironment?: { getWorker: (a: string, b: string) => Worker } }
  if (g.MonacoEnvironment) return
  g.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') {
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
          { type: 'module' },
        )
      }
      return new Worker(
        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
        { type: 'module' },
      )
    },
  }
}

export function getMonaco(): Promise<typeof Monaco> {
  if (monacoPromise) return monacoPromise
  monacoPromise = (async () => {
    ensureWorkerEnvironment()
    const monaco = await import('monaco-editor/esm/vs/editor/editor.api.js')
    await import('monaco-editor/esm/vs/basic-languages/python/python.contribution.js')
    monaco.editor.defineTheme('llm101n-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0c1016',
      },
    })
    return monaco
  })()
  return monacoPromise
}
