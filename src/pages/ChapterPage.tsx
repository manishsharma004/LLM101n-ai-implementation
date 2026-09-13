import { Link, useParams } from 'react-router-dom'
import { appendixTopics, getChapterByNumber, getChapterBySlug } from '../content/chapters'
import { ChapterProgress } from '../components/ChapterProgress'
import { LabPanel } from '../components/LabPanel'
import { SearchAssistPanel } from '../components/SearchAssistPanel'
import { ChapterFigures } from '../components/figures/ChapterFigures'
import { appendixFigures, figuresForPart } from '../content/chapterFigures'

export function ChapterPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapterBySlug(slug) : undefined

  if (!chapter) {
    return (
      <div className="page">
        <p>Chapter not found.</p>
        <Link to="/">Back to syllabus</Link>
      </div>
    )
  }

  return (
    <article className="page chapter">
      <header>
        <p className="eyebrow">Chapter {chapter.number} · {chapter.syllabusTopic}</p>
        <h1>{chapter.title}</h1>
        <p className="subtitle">{chapter.subtitle}</p>
        <p className="meta">{chapter.readingTime} read · {chapter.premise}</p>
      </header>

      {chapter.parts.map((part) => (
        <section key={part.id} className="part">
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

      <ChapterProgress chapterId={chapter.id} />

      <LabPanel labIds={chapter.labIds} />

      <SearchAssistPanel
        chapterTitle={chapter.title}
        defaultQuestion={chapter.tutorSeeds[0] ?? ''}
      />

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
