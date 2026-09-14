import { Link } from 'react-router-dom'
import { TopUtilityBar } from '../components/layout/TopUtilityBar'
import { getChapterBySlug } from '../content/chapters'
import {
  getResourceById,
  learningPhases,
  roadmapResources,
} from '../content/learningRoadmap'

export function LearningPlanPage() {
  return (
    <div className="workspace-page">
      <TopUtilityBar crumbs={[{ label: 'Home', to: '/' }, { label: 'Learning plan' }]} />
    <article className="page learning-plan panel-surface">
      <header>
        <p className="eyebrow">Learning plan</p>
        <h1>Six-phase roadmap</h1>
        <p className="subtitle">
          Beginner → multimodal Storyteller → multi-GPU pipelines, organized around{' '}
          <strong>11 primary resources</strong> (Karpathy videos + repos + this browser course).
        </p>
        <p className="muted">
          Do phases in order. Each step links to chapters and Pyodide labs here; videos and repos are for
          deep dives on your machine (PyTorch/CUDA).
        </p>
      </header>

      <section className="panel resource-index">
        <h2>Primary resources (11)</h2>
        <ol className="resource-list">
          {roadmapResources.map((r) => (
            <li key={r.id}>
              <span className={`resource-kind ${r.kind}`}>{r.kind}</span>
              <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              {r.author ? <span className="muted"> — {r.author}</span> : null}
            </li>
          ))}
        </ol>
      </section>

      {learningPhases.map((phase) => (
        <section key={phase.id} className="part phase-block">
          <h2>
            Phase {phase.number}: {phase.title}
          </h2>
          <p>{phase.summary}</p>
          <p className="phase-primary muted">
            <strong>Primary:</strong>{' '}
            {phase.primaryResourceIds.map((id, i) => {
              const res = getResourceById(id)
              if (!res) return null
              return (
                <span key={id}>
                  {i > 0 ? ' · ' : null}
                  <a href={res.url} target="_blank" rel="noreferrer">{res.title}</a>
                </span>
              )
            })}
          </p>

          {phase.steps.map((step) => (
            <div key={step.id} className="roadmap-step">
              <h3>{step.title}</h3>
              <ul>
                {step.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {step.chapterSlugs?.length ? (
                <p className="roadmap-links">
                  <span className="link-label">In this app:</span>
                  {step.chapterSlugs.map((slug, i) => {
                    const ch = getChapterBySlug(slug)
                    if (!ch) return null
                    return (
                      <span key={slug}>
                        {i > 0 ? ', ' : ' '}
                        <Link to={`/chapter/${slug}`}>
                          Ch{String(ch.number).padStart(2, '0')} {ch.title}
                        </Link>
                      </span>
                    )
                  })}
                </p>
              ) : null}
              {step.labHints?.length ? (
                <p className="muted roadmap-labs">
                  Labs: {step.labHints.join(', ')} (on linked chapter pages)
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ))}

      <section className="panel">
        <h2>How this maps to LLM101n chapters 01–17</h2>
        <p className="muted">
          Phases 1–4 ≈ ch01–06 · Phase 5 ≈ ch04–05, 17 · Phase 6 ≈ ch07–16. Use{' '}
          <Link to="/">full syllabus</Link> for appendix topics (RoPE, MoE, dtypes).
        </p>
      </section>

      <p>
        <Link to="/">← Back to Storyteller home</Link>
      </p>
    </article>
    </div>
  )
}
