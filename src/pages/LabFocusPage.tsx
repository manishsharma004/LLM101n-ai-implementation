import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChapterInteractive } from '../components/chapter/ChapterInteractive'
import { LabPanel } from '../components/LabPanel'
import { TopUtilityBar } from '../components/layout/TopUtilityBar'
import { getChapterBySlug } from '../content/chapters'
import { touchStudyStreak } from '../lib/courseStats'

export function LabFocusPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapterBySlug(slug) : undefined

  useEffect(() => {
    if (chapter) touchStudyStreak()
  }, [chapter?.id])

  if (!chapter) {
    return (
      <div className="page">
        <p>Chapter not found.</p>
        <Link to="/">Home</Link>
      </div>
    )
  }

  return (
    <div className="workspace-page lab-focus-page">
      <TopUtilityBar
        crumbs={[
          { label: 'Home', to: '/' },
          { label: chapter.title, to: `/chapter/${chapter.slug}` },
          { label: 'Lab workspace' },
        ]}
      />
      <div className="lab-focus-toolbar">
        <h1>Interactive IDE — {chapter.title}</h1>
        <div className="lab-focus-actions">
          <span className="lab-tool-btn muted">Run</span>
          <span className="lab-tool-btn muted">Debug</span>
          <Link to={`/chapter/${chapter.slug}`} className="lab-tool-btn stop">
            Back to lesson
          </Link>
        </div>
      </div>
      <div className="lab-focus-split">
        <section className="tensor-inspector panel-surface">
          <h2>Tensor & attention inspector</h2>
          <p className="muted">
            Chapter interactives visualize shapes, masks, and precision—run code on the right to connect numbers to diagrams.
          </p>
          <ChapterInteractive chapterNumber={chapter.number} />
          <div className="tensor-placeholder">
            <div className="tensor-grid" aria-hidden />
            <p className="muted">Heatmaps and loss curves appear in chapter figures and lab console output.</p>
          </div>
        </section>
        <section className="lab-focus-editor panel-surface">
          <LabPanel labIds={chapter.labIds} variant="ide" />
        </section>
      </div>
    </div>
  )
}
