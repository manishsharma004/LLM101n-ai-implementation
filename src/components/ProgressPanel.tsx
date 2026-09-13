import { useState } from 'react'
import { exportProgress, importProgress } from '../lib/progress'

export function ProgressPanel() {
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  function copyExport() {
    const json = exportProgress()
    void navigator.clipboard.writeText(json).then(
      () => setMessage('Progress JSON copied to clipboard.'),
      () => {
        setImportText(json)
        setMessage('Copy failed — export shown in the import box.')
      },
    )
  }

  function applyImport() {
    const result = importProgress(importText)
    if (result.ok) {
      setMessage('Progress imported. Reload the page to refresh checkmarks.')
      setImportText('')
    } else {
      setMessage(result.error)
    }
  }

  return (
    <section className="panel progress-panel">
      <h2>Your progress</h2>
      <p className="muted">
        Mark chapters complete on each chapter page. Progress stays in this browser (localStorage). Export before switching devices.
      </p>
      <div className="lab-actions">
        <button type="button" onClick={copyExport}>Export progress (JSON)</button>
        <button type="button" onClick={applyImport} disabled={!importText.trim()}>Import progress</button>
      </div>
      <label className="progress-import">
        <span className="output-label">Paste export JSON to import</span>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={4}
          placeholder='{"version":1,"completedChapterIds":["ch01"],...}'
        />
      </label>
      {message ? <p className="lab-hint">{message}</p> : null}
    </section>
  )
}
