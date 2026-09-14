import type { LoadPhase } from '../lib/pyodide'
import { pyodideVersion } from '../lib/pyodide'

type Props = {
  phase: LoadPhase
  message: string
  error: string | null
  onRetry?: () => void
  compact?: boolean
}

export function RuntimeBanner({ phase, message, error, onRetry, compact }: Props) {
  const state = phase === 'error' ? 'error' : phase === 'ready' ? 'ready' : 'loading'
  return (
    <div className={`runtime-banner runtime-banner--${state}${compact ? ' runtime-banner--compact' : ''}`} role="status">
      <div className="runtime-text">
        {state === 'error' && (
          <span>Pyodide failed: {error ?? 'unknown error'}</span>
        )}
        {state === 'ready' && (
          <span>Python {pyodideVersion} ready — training runs in your browser.</span>
        )}
        {state === 'loading' && <span>{message}</span>}
      </div>
      {state === 'error' && onRetry && (
        <button type="button" className="btn-sm" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}
