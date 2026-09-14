import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChapterInteractive } from '../components/chapter/ChapterInteractive'
import { ChapterProgress } from '../components/ChapterProgress'
import { getPrimaryLabId, LabPanel } from '../components/LabPanel'
import { ChapterFigures } from '../components/figures/ChapterFigures'
import { TopUtilityBar } from '../components/layout/TopUtilityBar'
import { appendixFigures, figuresForPart } from '../content/chapterFigures'
import { appendixTopics, getChapterByNumber, getChapterBySlug } from '../content/chapters'
import { phaseForChapterNumber } from '../content/curriculumPhases'
import { useChapterReadProgress } from '../hooks/useChapterReadProgress'
import { getBeginnerMode } from '../lib/beginnerMode'
import { touchStudyStreak } from '../lib/courseStats'
import { SearchAssistPanel } from '../components/SearchAssistPanel'

export function ChapterPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapterBySlug(slug) : undefined
  const [beginnerMode, setBeginnerMode] = useState(() => getBeginnerMode())
  const readPct = useChapterReadProgress('.chapter-split-theory', Boolean(chapter))
  const primaryLab = chapter ? getPrimaryLabId(chapter.labIds) : undefined

  useEffect(() => {
    if (chapter) touchStudyStreak()
  }, [chapter?.id])

  useEffect(() => {
    const onMode = () => setBeginnerMode(getBeginnerMode())
    window.addEventListener('llm101n-beginner-mode', onMode)
    return () => window.removeEventListener('llm101n-beginner-mode', onMode)
  }, [])

  if (!chapter) {
    return (
      <div className="page">
        <p>Chapter not found.</p>
        <Link to="/">Back to syllabus</Link>
      </div>
    )
  }

  const phase = phaseForChapterNumber(chapter.number)

  return (
    <div className="workspace-page chapter-workspace">
      <TopUtilityBar
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'LLM101n', to: '/' },
          { label: `Chapter ${chapter.number}: ${chapter.title}` },
        ]}
        chapterTitle={`Chapter ${chapter.number}: ${chapter.title}`}
        chapterProgress={readPct}
      />

      <div className="chapter-split">
        <article className="chapter-split-theory panel-surface">
          <header className="theory-header">
            <p className="eyebrow">
              Phase {phase?.number ?? '—'} · {chapter.syllabusTopic}
            </p>
            <h1>{chapter.title}</h1>
            <p className="subtitle">{chapter.subtitle}</p>
            <p className="meta">{chapter.readingTime} read</p>
            <p className="premise">{chapter.premise}</p>
          </header>

          <ChapterInteractive chapterNumber={chapter.number} />

          {chapter.parts.map((part) => (
            <section key={part.id} id={`part-${part.id}`} className="part scroll-target">
              <h2>{part.heading}</h2>
              {part.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <ChapterFigures
                figures={[...(part.figures ?? []), ...figuresForPart(chapter.id, part.id)]}
                hideAdvancedMath={beginnerMode}
              />
              {part.keyTerms?.length ? (
                <dl className="terms">
                  {part.keyTerms.map((t) => (
                    <div key={t.term}>
                      <dt>{t.term}</dt>
                      <dd>{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {part.code ? (
                <figure className="code-block">
                  <figcaption>
                    {part.code.caption ? `${part.code.caption} · ` : null}
                    <span className="code-lang">{part.code.language}</span>
                  </figcaption>
                  <pre><code>{part.code.body}</code></pre>
                </figure>
              ) : null}
              {part.checkYourself?.map((c, i) => (
                <details key={i} className="check">
                  <summary>{c.prompt}</summary>
                  <p>{c.reveal}</p>
                </details>
              ))}
              {part.callout ? (
                <aside className={`callout ${part.callout.tone}`}>{part.callout.body}</aside>
              ) : null}
            </section>
          ))}

          <div id="part-chapter-labs" className="scroll-target chapter-labs-block">
            <ChapterProgress chapterId={chapter.id} />
          </div>

          <nav className="chapter-nav">
            {chapter.number > 1 ? (
              <Link to={`/chapter/${getChapterByNumber(chapter.number - 1)?.slug ?? ''}`}>Previous</Link>
            ) : (
              <Link to="/">Syllabus</Link>
            )}
            {primaryLab ? (
              <Link to={`/chapter/${chapter.slug}/focus`} className="link-ide">
                Open lab workspace →
              </Link>
            ) : null}
            {chapter.number < 17 && getChapterByNumber(chapter.number + 1) ? (
              <Link to={`/chapter/${getChapterByNumber(chapter.number + 1)!.slug}`}>Next chapter</Link>
            ) : (
              <Link to="/appendix">Appendix</Link>
            )}
          </nav>
        </article>

        <aside className="chapter-split-lab lab-dock panel-surface" aria-label="Interactive labs">
          <div className="lab-column-head">
            <h2>Interactive code</h2>
            {primaryLab ? (
              <Link to={`/chapter/${chapter.slug}/focus`} className="btn-text">
                Full IDE view
              </Link>
            ) : null}
          </div>
          <LabPanel labIds={chapter.labIds} variant="ide" primaryOnly />
          <p className="muted lab-footnote">Python runs in-browser via Pyodide (~15 MB first load).</p>
        </aside>
      </div>
    </div>
  )
}

export function AppendixPage() {
  return (
    <div className="workspace-page">
      <TopUtilityBar crumbs={[{ label: 'Home', to: '/' }, { label: 'Resources / Appendix' }]} />
      <article className="page panel-surface appendix-page">
        <h1>Appendix</h1>
        <p className="muted">Topics woven through the chapter progression (per karpathy/LLM101n README).</p>
        {appendixTopics.map((topic) => (
          <section key={topic.id} className="part">
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <ChapterFigures
              figures={[
                ...(topic.figures ?? []),
                ...(appendixFigures[topic.id] ?? []),
              ]}
            />
            <ul>
              {topic.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
        <SearchAssistPanel label="Deep dive with search AI" defaultQuestion="Compare GPT-2, Llama, and MoE for a Storyteller LM." />
      </article>
    </div>
  )
}
