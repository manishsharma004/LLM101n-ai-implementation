import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChapterRail } from '../components/chapter/ChapterRail'
import { ChapterProgress } from '../components/ChapterProgress'
import { LabPanel } from '../components/LabPanel'
import { SearchAssistPanel } from '../components/SearchAssistPanel'
import { ChapterFigures } from '../components/figures/ChapterFigures'
import { appendixFigures, figuresForPart } from '../content/chapterFigures'
import { appendixTopics, getChapterByNumber, getChapterBySlug } from '../content/chapters'
import { useChapterScrollSpy } from '../hooks/useChapterScrollSpy'

export function ChapterPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapterBySlug(slug) : undefined
  const [tutorQuestion, setTutorQuestion] = useState('')

  const partIds = chapter?.parts.map((p) => p.id) ?? []

  useEffect(() => {
    if (chapter) setTutorQuestion(chapter.tutorSeeds[0] ?? '')
  }, [chapter?.id])
  const { activePartId, jumpToPart } = useChapterScrollSpy(
    partIds,
    chapter?.labIds.some((id) => id !== 'storyteller') ? ['chapter-labs'] : [],
  )

  if (!chapter) {
    return (
      <div className="page">
        <p>Chapter not found.</p>
        <Link to="/">Back to syllabus</Link>
      </div>
    )
  }

  return (
    <div className="chapter-layout">
      <article className="page chapter chapter-main">
        <header>
          <p className="eyebrow">Chapter {chapter.number} · {chapter.syllabusTopic}</p>
          <h1>{chapter.title}</h1>
          <p className="subtitle">{chapter.subtitle}</p>
          <p className="meta">{chapter.readingTime} read · {chapter.premise}</p>
        </header>

        {chapter.parts.map((part) => (
          <section key={part.id} id={`part-${part.id}`} className="part scroll-target">
            <h2>{part.heading}</h2>
            {part.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ChapterFigures figures={[...(part.figures ?? []), ...figuresForPart(chapter.id, part.id)]} />
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
          <LabPanel labIds={chapter.labIds} />
        </div>

        <div className="chapter-inline-tools">
          <SearchAssistPanel
            chapterTitle={chapter.title}
            defaultQuestion={tutorQuestion}
          />
        </div>

        <nav className="chapter-nav">
          {chapter.number > 1 ? (
            <Link to={`/chapter/${getChapterByNumber(chapter.number - 1)?.slug ?? ''}`}>Previous</Link>
          ) : (
            <Link to="/">Syllabus</Link>
          )}
          {chapter.number < 17 && getChapterByNumber(chapter.number + 1) ? (
            <Link to={`/chapter/${getChapterByNumber(chapter.number + 1)!.slug}`}>Next chapter</Link>
          ) : (
            <Link to="/appendix">Appendix</Link>
          )}
        </nav>
      </article>

      <ChapterRail
        chapter={chapter}
        tutorQuestion={tutorQuestion}
        onTutorQuestion={setTutorQuestion}
        activePartId={activePartId}
        onJumpToPart={jumpToPart}
      />
    </div>
  )
}

export function AppendixPage() {
  return (
    <article className="page">
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
  )
}
