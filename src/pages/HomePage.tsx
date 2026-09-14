import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  chaptersInPhase,
  curriculumPhases,
  difficultyForChapter,
} from '../content/curriculumPhases'
import { ProgressPanel } from '../components/ProgressPanel'
import { StorytellerPanel } from '../components/StorytellerPanel'
import { TopUtilityBar } from '../components/layout/TopUtilityBar'
import { isChapterComplete } from '../lib/progress'

function moduleStatus(chapterId: string): 'done' | 'progress' | 'todo' {
  if (isChapterComplete(chapterId)) return 'done'
  return 'todo'
}

export function HomePage() {
  const [, tick] = useState(0)
  useEffect(() => {
    const onUpdate = () => tick((n) => n + 1)
    window.addEventListener('llm101n-progress', onUpdate)
    return () => window.removeEventListener('llm101n-progress', onUpdate)
  }, [])

  return (
    <div className="workspace-page dashboard-page">
      <TopUtilityBar crumbs={[{ label: 'Home', to: '/' }, { label: 'Course modules' }]} />
      <header className="dashboard-hero">
        <h1>LLM101n: Build a Multimodal Storyteller</h1>
        <p className="subtitle">
          Track progress across 17 chapters in four phases. Each module includes theory, diagrams, and Pyodide labs.
        </p>
      </header>

      <StorytellerPanel />

      <div className="phase-roadmap">
        {curriculumPhases.map((phase, idx) => (
          <section key={phase.id} className={`phase-column phase-theme-${phase.theme}`}>
            {idx > 0 ? <span className="phase-connector" aria-hidden /> : null}
            <header className="phase-column-head">
              <span className="phase-badge">Phase {phase.number}</span>
              <h2>{phase.title}</h2>
              <p className="muted">{phase.subtitle}</p>
            </header>
            <ul className="module-cards">
              {chaptersInPhase(phase.id).map((ch) => {
                const status = moduleStatus(ch.id)
                return (
                  <li key={ch.id}>
                    <article className={`module-card status-${status}`}>
                      <div className="module-card-top">
                        <span className={`status-tag ${status}`}>
                          {status === 'done' ? 'Completed' : status === 'progress' ? 'In progress' : 'Not started'}
                        </span>
                        <span className="difficulty-tag">{difficultyForChapter(ch)}</span>
                      </div>
                      <h3>
                        <span className="module-num">Ch{String(ch.number).padStart(2, '0')}</span>
                        {ch.title}
                      </h3>
                      <p className="muted module-meta">{ch.readingTime} read</p>
                      <p className="module-blurb">{ch.subtitle}</p>
                      <div className="module-actions">
                        <Link to={`/chapter/${ch.slug}`} className="primary module-cta">
                          {status === 'done' ? 'Review' : 'Start lab'}
                        </Link>
                        <Link to={`/chapter/${ch.slug}/focus`} className="btn-text">
                          IDE
                        </Link>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="dashboard-secondary">
        <ProgressPanel />
        <p className="muted dashboard-links">
          <Link to="/learning-plan">Six-phase Karpathy learning plan</Link>
          {' · '}
          <Link to="/appendix">Appendix resources</Link>
          {' · '}
          <a href="./architecture/llm101n-runtime.architecture.html" target="_blank" rel="noreferrer">
            Runtime architecture
          </a>
        </p>
      </section>
    </div>
  )
}
