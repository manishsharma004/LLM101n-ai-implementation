import { Link } from 'react-router-dom'
import { useCourseUiPrefs } from '../../hooks/useCourseUiPrefs'

type Crumb = { label: string; to?: string }

type Props = {
  crumbs: Crumb[]
  chapterTitle?: string
  chapterProgress?: number
}

export function TopUtilityBar({ crumbs, chapterTitle, chapterProgress }: Props) {
  const { beginnerMode, toggleBeginnerMode, completionPct, streak } = useCourseUiPrefs()

  return (
    <header className="top-utility-bar">
      <div className="utility-left">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="crumb">
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              {i < crumbs.length - 1 ? <span className="crumb-sep">›</span> : null}
            </span>
          ))}
        </nav>
        {chapterTitle ? (
          <div className="chapter-progress-row">
            <span className="chapter-progress-label">{chapterTitle}</span>
            <div className="progress-track" role="progressbar" aria-valuenow={chapterProgress ?? 0} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${chapterProgress ?? 0}%` }} />
            </div>
            <span className="progress-pct">{chapterProgress ?? 0}%</span>
          </div>
        ) : null}
      </div>
      <div className="utility-right">
        <div className="stat-pill" title="Chapters marked complete">
          <span className="stat-label">Course</span>
          <span className="stat-value">{completionPct}%</span>
        </div>
        <div className="stat-pill streak" title="Consecutive study days">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{streak}d</span>
        </div>
        <label className="beginner-toggle">
          <span>Beginner mode</span>
          <button
            type="button"
            role="switch"
            className={`toggle-switch ${beginnerMode ? 'on' : ''}`}
            aria-checked={beginnerMode}
            onClick={toggleBeginnerMode}
          />
        </label>
      </div>
    </header>
  )
}
