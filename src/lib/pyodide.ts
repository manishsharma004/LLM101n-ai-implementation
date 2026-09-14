import { loadPyodide, version as pyodideVersion, type PyodideInterface } from 'pyodide'
import { mountCorpusOnPyodide } from './tinystoriesCorpus'

let pyodidePromise: Promise<PyodideInterface> | null = null

export type LoadPhase = 'idle' | 'loading' | 'ready' | 'error'

type ProgressListener = (message: string) => void

const listeners = new Set<ProgressListener>()

function emit(message: string) {
  for (const listener of listeners) listener(message)
}

export function onPyodideProgress(listener: ProgressListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetPyodideLoad(): void {
  pyodidePromise = null
}

export function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    emit('Downloading CPython (Pyodide)…')
    pyodidePromise = loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
    })
      .then(async (py) => {
        emit('Mounting TinyStories sample for labs…')
        await mountCorpusOnPyodide(py)
        emit('Python ready.')
        return py
      })
      .catch((err) => {
        pyodidePromise = null
        throw err
      })
  }
  return pyodidePromise
}

export { pyodideVersion }
