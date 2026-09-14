import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChapterInteractive } from '../components/chapter/ChapterInteractive'
import { LabPanel } from '../components/LabPanel'
import { TopUtilityBar } from '../components/layout/TopUtilityBar'
import { getChapterBySlug } from '../content/chapters'
import { MobileWorkspaceTabs } from '../components/layout/MobileWorkspaceTabs'
import { useHorizontalSplit } from '../hooks/useHorizontalSplit'
import { useMobileWorkspace } from '../hooks/useMediaQuery'
import { touchStudyStreak } from '../lib/courseStats'

export function LabFocusPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapterBySlug(slug) : undefined

  useEffect(() => {
    if (chapter) touchStudyStreak()
  }, [chapter?.id])

  const isMobile = useMobileWorkspace()
  const [mobileTab, setMobileTab] = useState<'inspector' | 'ide'>('ide')
  const { containerRef, gridTemplateColumns, onPointerDown } = useHorizontalSplit(
    'llm101n-lab-focus-split-v1',
    0.52,
  )

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
      {isMobile ? (
        <MobileWorkspaceTabs
          tabs={[
            { id: 'inspector', label: 'Inspector' },
            { id: 'ide', label: 'Code Lab' },
          ]}
          active={mobileTab}
          onChange={(id) => setMobileTab(id as 'inspector' | 'ide')}
          ariaLabel="Lab workspace"
        />
      ) : null}

      <div
        ref={containerRef}
        className={`lab-focus-split workspace-hsplit ${isMobile ? 'workspace-hsplit--stacked' : ''}`}
        style={isMobile ? undefined : { gridTemplateColumns }}
      >
        <section
          className="tensor-inspector panel-surface workspace-hsplit-pane"
          hidden={isMobile && mobileTab !== 'inspector'}
        >
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
        {!isMobile ? (
          <div
            className="workspace-hsplit-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize inspector and IDE"
            title="Drag to resize panels"
            onPointerDown={onPointerDown}
          />
        ) : null}
        <section
          className="lab-focus-editor lab-dock panel-surface workspace-hsplit-pane"
          hidden={isMobile && mobileTab !== 'ide'}
        >
          <LabPanel labIds={chapter.labIds} variant="ide" />
        </section>
      </div>
    </div>
  )
}
