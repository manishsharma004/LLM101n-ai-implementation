import type { Chapter } from '../../content/types'
import { ChapterProgress } from '../ChapterProgress'
import { SearchAssistPanel } from '../SearchAssistPanel'
import { ChapterInteractive } from './ChapterInteractive'

type Props = {
  chapter: Chapter
  tutorQuestion: string
  onTutorQuestion: (q: string) => void
  activePartId: string | null
  onJumpToPart: (partId: string) => void
}

export function ChapterRail({ chapter, tutorQuestion, onTutorQuestion, activePartId, onJumpToPart }: Props) {
  return (
    <aside className="chapter-rail panel-rail" aria-label="Chapter tools">
      <p className="rail-title">On this page</p>
      <nav className="rail-toc">
        <ul>
          {chapter.parts.map((part) => (
            <li key={part.id}>
              <button
                type="button"
                className={activePartId === part.id ? 'active' : undefined}
                onClick={() => onJumpToPart(part.id)}
              >
                {part.heading}
              </button>
            </li>
          ))}
          {chapter.labIds.filter((id) => id !== 'storyteller').length > 0 ? (
            <li>
              <button
                type="button"
                className={activePartId === 'chapter-labs' ? 'active' : undefined}
                onClick={() => onJumpToPart('chapter-labs')}
              >
                Labs (Python)
              </button>
            </li>
          ) : null}
        </ul>
      </nav>

      <ChapterInteractive chapterNumber={chapter.number} />

      {chapter.tutorSeeds.length > 0 ? (
        <div className="rail-block">
          <p className="rail-subtitle">Tutor prompts</p>
          <div className="chip-row">
            {chapter.tutorSeeds.map((seed) => (
              <button
                key={seed}
                type="button"
                className="chip"
                onClick={() => onTutorQuestion(seed)}
              >
                {seed.length > 48 ? `${seed.slice(0, 45)}…` : seed}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rail-block rail-search">
        <SearchAssistPanel
          chapterTitle={chapter.title}
          defaultQuestion={tutorQuestion}
          label="Search AI tutor"
        />
      </div>

      <div className="rail-block">
        <ChapterProgress chapterId={chapter.id} />
      </div>

      <p className="muted rail-hint">Labs load Python on first run (~15 MB).</p>
    </aside>
  )
}
