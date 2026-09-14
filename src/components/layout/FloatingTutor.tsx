import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getChapterBySlug } from '../../content/chapters'
import { SearchAssistPanel } from '../SearchAssistPanel'

const TUTOR_OPEN_KEY = 'llm101n-tutor-open'

function readTutorOpen(): boolean {
  try {
    return localStorage.getItem(TUTOR_OPEN_KEY) === '1'
  } catch {
    return false
  }
}

export function FloatingTutor() {
  const [open, setOpen] = useState(readTutorOpen)
  const [minimized, setMinimized] = useState(false)
  const location = useLocation()

  const slugMatch = location.pathname.match(/\/chapter\/([^/]+)/)
  const chapter = slugMatch ? getChapterBySlug(slugMatch[1]) : undefined
  const onChapterLab = Boolean(slugMatch)
  const defaultQuestion = chapter?.tutorSeeds[0] ?? 'Explain transformers and autoregressive decoding for a Storyteller LM.'

  useEffect(() => {
    try {
      localStorage.setItem(TUTOR_OPEN_KEY, open ? '1' : '0')
    } catch {
      /* private mode */
    }
  }, [open])

  if (!open) {
    return (
      <button
        type="button"
        className={`tutor-fab${onChapterLab ? ' tutor-fab--lab' : ''}`}
        onClick={() => setOpen(true)}
      >
        Search AI tutor
      </button>
    )
  }

  return (
    <div className={`floating-tutor${onChapterLab ? ' floating-tutor--lab' : ''} ${minimized ? 'minimized' : ''}`}>
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
