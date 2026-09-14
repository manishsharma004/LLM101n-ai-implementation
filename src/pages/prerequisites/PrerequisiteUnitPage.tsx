import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LabPanel } from '../../components/LabPanel'
import { TopUtilityBar } from '../../components/layout/TopUtilityBar'
import { getPrereqUnitBySlug, prerequisiteUnits } from '../../content/prerequisites/units'
import { touchStudyStreak } from '../../lib/courseStats'
import {
  isPrereqUnitComplete,
  setPrereqUnitComplete,
} from '../../lib/prerequisiteProgress'
import { BpeTokenizerMobile } from '../../components/mobile/BpeTokenizerMobile'
import { MicrogradDagMobile } from '../../components/mobile/MicrogradDagMobile'
import { MobileWorkspaceTabs } from '../../components/layout/MobileWorkspaceTabs'
import { prereqMobileTabs, type PrereqMobileTabId } from '../../content/mobilePrereqTabs'
import { useHorizontalSplit } from '../../hooks/useHorizontalSplit'
import { useMobileWorkspace } from '../../hooks/useMediaQuery'

export function PrerequisiteUnitPage() {
  const { slug } = useParams()
  const unit = slug ? getPrereqUnitBySlug(slug) : undefined
  const [done, setDone] = useState(() => (unit ? isPrereqUnitComplete(unit.id) : false))
  const isMobile = useMobileWorkspace()
  const [mobileTab, setMobileTab] = useState<PrereqMobileTabId>('theory')
  const { containerRef, gridTemplateColumns, onPointerDown } = useHorizontalSplit(
    'llm101n-prereq-split-v1',
    0.42,
  )

  useEffect(() => {
    if (unit) touchStudyStreak()
  }, [unit?.id])

  useEffect(() => {
    if (unit) setDone(isPrereqUnitComplete(unit.id))
  }, [unit?.id])

  if (!unit) {
    return (
      <div className="page">
        <p>Prerequisite unit not found.</p>
        <Link to="/prerequisites">Back to prerequisites</Link>
      </div>
    )
  }

  const idx = prerequisiteUnits.findIndex((u) => u.id === unit.id)
  const prev = idx > 0 ? prerequisiteUnits[idx - 1] : undefined
  const next = idx < prerequisiteUnits.length - 1 ? prerequisiteUnits[idx + 1] : undefined

  function toggleComplete() {
    const next = !done
    setPrereqUnitComplete(unit!.id, next)
    setDone(next)
  }

  return (
    <div className="workspace-page prereq-unit-page">
      <TopUtilityBar
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Prerequisites', to: '/prerequisites' },
          { label: `Unit ${unit.unitLabel}` },
        ]}
        chapterTitle={`Unit ${unit.unitLabel}: ${unit.shortTitle}`}
      />

      <header className="prereq-unit-header">
        <Link to="/prerequisites" className="back-to-course">← Back to prerequisites path</Link>
        <p className="eyebrow">Unit {unit.unitLabel} · {unit.estimatedHours}</p>
        <h1>{unit.title}</h1>
        <p className="subtitle">{unit.coreGoal}</p>
        {unit.relatedChapterSlug ? (
          <p className="muted">
            Main course chapter:{' '}
            <Link to={`/chapter/${unit.relatedChapterSlug}`}>Open full chapter</Link>
          </p>
        ) : null}
      </header>

      {isMobile && unit.labId ? (
        <MobileWorkspaceTabs
          tabs={prereqMobileTabs(unit.slug, Boolean(unit.labId))}
          active={mobileTab}
          onChange={(id) => setMobileTab(id as PrereqMobileTabId)}
          ariaLabel="Prerequisite unit"
        />
      ) : null}

      <div
        ref={containerRef}
        className={`chapter-split prereq-split workspace-hsplit ${isMobile ? 'workspace-hsplit--stacked' : ''}`}
        style={isMobile ? undefined : { gridTemplateColumns }}
      >
        <article
          className="chapter-split-theory panel-surface workspace-hsplit-pane"
          hidden={isMobile && unit.labId != null && mobileTab !== 'theory'}
        >
          {unit.sections.map((section) => (
            <section key={section.id} className="part">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.keyTerms?.length ? (
                <dl className="terms">
                  {section.keyTerms.map((t) => (
                    <div key={t.term}>
                      <dt>{t.term}</dt>
                      <dd>{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {section.code ? (
                <figure className="code-block">
                  <figcaption>
                    {section.code.caption ? `${section.code.caption} · ` : null}
                    <span className="code-lang">{section.code.language}</span>
                  </figcaption>
                  <pre><code>{section.code.body}</code></pre>
                </figure>
              ) : null}
              {section.checkYourself?.map((c, i) => (
                <details key={i} className="check">
                  <summary>{c.prompt}</summary>
                  <p>{c.reveal}</p>
                </details>
              ))}
              {section.callout ? (
                <aside className={`callout ${section.callout.tone}`}>{section.callout.body}</aside>
              ) : null}
              {section.bullets?.length ? (
                <ul className="section-summary">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <label className="prereq-complete-check">
            <input type="checkbox" checked={done} onChange={toggleComplete} />
            Mark unit {unit.unitLabel} complete
          </label>

          <nav className="chapter-nav">
            {prev ? (
              <Link to={`/prerequisites/${prev.slug}`}>← Unit {prev.unitLabel}</Link>
            ) : (
              <Link to="/prerequisites">Prerequisites hub</Link>
            )}
            {next ? (
              <Link to={`/prerequisites/${next.slug}`}>Unit {next.unitLabel} →</Link>
            ) : (
              <Link to="/">Enter main course →</Link>
            )}
          </nav>
        </article>

        {isMobile && mobileTab === 'graph' && unit.slug === 'autograd-micrograd' ? (
          <div className="workspace-hsplit-pane mobile-rich-pane">
            <MicrogradDagMobile />
          </div>
        ) : null}

        {isMobile && mobileTab === 'bpe' && unit.slug === 'bpe-tokenization' ? (
          <div className="workspace-hsplit-pane mobile-rich-pane">
            <BpeTokenizerMobile />
          </div>
        ) : null}

        {unit.labId ? (
          <>
            {!isMobile ? (
              <div
                className="workspace-hsplit-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize lesson and lab"
                title="Drag to resize panels"
                onPointerDown={onPointerDown}
              />
            ) : null}
          <aside
            className="chapter-split-lab lab-dock panel-surface workspace-hsplit-pane"
            hidden={isMobile && mobileTab !== 'lab'}
          >
            <h2>Interactive code</h2>
            <LabPanel labIds={[unit.labId]} variant="ide" />
          </aside>
          </>
        ) : null}
      </div>
    </div>
  )
}
