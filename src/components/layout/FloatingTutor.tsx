import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getChapterBySlug } from '../../content/chapters'
import { SearchAssistPanel } from '../SearchAssistPanel'

export function FloatingTutor() {
  const [open, setOpen] = useState(true)
  const [minimized, setMinimized] = useState(false)
  const location = useLocation()

  const slugMatch = location.pathname.match(/\/chapter\/([^/]+)/)
  const chapter = slugMatch ? getChapterBySlug(slugMatch[1]) : undefined
  const defaultQuestion = chapter?.tutorSeeds[0] ?? 'Explain transformers and autoregressive decoding for a Storyteller LM.'

  if (!open) {
    return (
      <button type="button" className="tutor-fab" onClick={() => setOpen(true)}>
        Search AI tutor
      </button>
    )
  }

  return (
    <div className={`floating-tutor ${minimized ? 'minimized' : ''}`}>
      <div className="floating-tutor-head">
        <strong>Search AI tutor</strong>
        <div className="floating-tutor-actions">
          <button type="button" className="btn-icon" onClick={() => setMinimized((m) => !m)} aria-label="Minimize">
            {minimized ? '▢' : '—'}
          </button>
          <button type="button" className="btn-icon" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </div>
      </div>
      {!minimized ? (
        <SearchAssistPanel
          variant="floating"
          chapterTitle={chapter?.title}
          defaultQuestion={defaultQuestion}
          suggestedQuestions={chapter?.tutorSeeds ?? []}
        />
      ) : null}
    </div>
  )
}
