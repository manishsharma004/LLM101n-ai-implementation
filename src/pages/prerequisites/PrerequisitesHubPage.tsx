import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { prerequisiteUnits } from '../../content/prerequisites/units'
import { TopUtilityBar } from '../../components/layout/TopUtilityBar'
import {
  isPrereqUnitComplete,
  prereqCompletionCount,
} from '../../lib/prerequisiteProgress'

export function PrerequisitesHubPage() {
  const [, tick] = useState(0)
  const { done, total } = prereqCompletionCount(prerequisiteUnits.length)

  useEffect(() => {
    const refresh = () => tick((n) => n + 1)
    window.addEventListener('llm101n-prerequisite-progress', refresh)
    return () => window.removeEventListener('llm101n-prerequisite-progress', refresh)
  }, [])

  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="workspace-page prerequisites-hub">
      <TopUtilityBar
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Prerequisites' },
        ]}
      />

      <header className="prereq-hub-header">
        <Link to="/" className="back-to-course">← Back to Main Course</Link>
        <div className="prereq-hub-progress-card panel-surface">
          <div className="prereq-hub-ring" aria-hidden>
            <span className="prereq-hub-ring-value">{pct}%</span>
          </div>
          <div className="prereq-hub-progress-copy">
            <p className="subpath-progress-label">
              <strong>{done}</strong> of <strong>{total}</strong> units completed
            </p>
            <div className="subpath-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="subpath-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </header>

      <ul className="prereq-unit-grid prereq-unit-list">
        {prerequisiteUnits.map((unit) => {
          const complete = isPrereqUnitComplete(unit.id)
          return (
            <li key={unit.id}>
            <article className={`prereq-unit-card prereq-unit-row ${complete ? 'complete' : ''}`}>
              <div className="prereq-card-icon" aria-hidden>{unit.iconGlyph}</div>
              <p className="prereq-unit-label">Unit {unit.unitLabel}</p>
              <h2>{unit.title}</h2>
              <p className="muted prereq-hours">Estimated completion: {unit.estimatedHours}</p>
              <div className="prereq-card-meta">
                <span className="prereq-badge">{unit.difficulty}</span>
                {unit.labId ? (
                  <span className="prereq-code-tag">&lt;/&gt; Interactive code</span>
                ) : (
                  <span className="prereq-code-tag muted">Reading + diagrams</span>
                )}
              </div>
              <Link to={`/prerequisites/${unit.slug}`} className="primary prereq-start-btn">
                {complete ? 'Review unit' : 'Start unit'}
              </Link>
            </article>
            </li>
          )
        })}
      </ul>

      <div className="prereq-hub-footer-cta">
        <Link to="/prerequisites/graduation" className="primary prereq-graduate-btn">
          {done >= total ? 'Graduation quiz' : 'Graduation quiz (complete units)'}
        </Link>
        <Link to="/chapter/bigram-language-model" className="btn-text prereq-chapter-one-link">
          Start Chapter 1 →
        </Link>
      </div>
    </div>
  )
}
