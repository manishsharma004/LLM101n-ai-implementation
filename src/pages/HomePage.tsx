import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { chapters } from '../content/chapters'
import { ProgressPanel } from '../components/ProgressPanel'
import { StorytellerPanel } from '../components/StorytellerPanel'
import { isChapterComplete } from '../lib/progress'

const GUIDED_FIRST = [1, 2, 3, 4, 5, 6]

export function HomePage() {
  const [, tick] = useState(0)
  useEffect(() => {
    const onUpdate = () => tick((n) => n + 1)
    window.addEventListener('llm101n-progress', onUpdate)
    return () => window.removeEventListener('llm101n-progress', onUpdate)
  }, [])

  return (
    <div className="page home">
      <header className="hero">
        <h1>LLM101n: Let&apos;s build a Storyteller</h1>
        <p>
          Browser-only implementation of the{' '}
          <a href="https://github.com/karpathy/LLM101n" target="_blank" rel="noreferrer">
            karpathy/LLM101n
          </a>{' '}
          syllabus. Train intuition with in-tab labs; use search engines (Google, Duck.ai, Perplexity) for
          AI-assisted story writing—no backend, no API keys in this app.
        </p>
      </header>

      <StorytellerPanel />

      <section className="guided-path">
        <h2>Start here (self-learners)</h2>
        <p className="muted">
          Work chapters 01→06 before transformers and finetuning: bigram sampling, micrograd, MLP, attention, transformer
          stack, tokenization.
        </p>
        <ol className="syllabus guided">
          {chapters
            .filter((ch) => GUIDED_FIRST.includes(ch.number))
            .map((ch) => (
              <li key={ch.id}>
                <Link to={`/chapter/${ch.slug}`}>
                  <span className="ch-num">{String(ch.number).padStart(2, '0')}</span>
                  <span className="ch-title">{ch.title}</span>
                </Link>
              </li>
            ))}
        </ol>
      </section>

      <ProgressPanel />

      <section>
        <h2>Full syllabus</h2>
        <ol className="syllabus">
          {chapters.map((ch) => (
            <li key={ch.id} className={isChapterComplete(ch.id) ? 'done' : undefined}>
              <Link to={`/chapter/${ch.slug}`}>
                <span className="ch-num">{String(ch.number).padStart(2, '0')}</span>
                <span className="ch-title">{ch.title}</span>
                <span className="ch-topic">{ch.syllabusTopic}</span>
                {isChapterComplete(ch.id) ? <span className="ch-done" aria-label="Completed">✓</span> : null}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <p>
        <Link to="/appendix">Appendix topics</Link> ·{' '}
        <a href="https://huggingface.co/datasets/roneneldan/TinyStories" target="_blank" rel="noreferrer">
          TinyStories dataset
        </a>{' '}
        ·{' '}
        <a href="./architecture/llm101n-runtime.architecture.html" target="_blank" rel="noreferrer">
          Runtime architecture (Archify)
        </a>
      </p>
    </div>
  )
}
