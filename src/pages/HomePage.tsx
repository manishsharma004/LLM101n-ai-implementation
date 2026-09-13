import { Link } from 'react-router-dom'
import { chapters } from '../content/chapters'
import { StorytellerPanel } from '../components/StorytellerPanel'

export function HomePage() {
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

      <section>
        <h2>Syllabus</h2>
        <ol className="syllabus">
          {chapters.map((ch) => (
            <li key={ch.id}>
              <Link to={`/chapter/${ch.slug}`}>
                <span className="ch-num">{String(ch.number).padStart(2, '0')}</span>
                <span className="ch-title">{ch.title}</span>
                <span className="ch-topic">{ch.syllabusTopic}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <p>
        <Link to="/appendix">Appendix topics</Link> ·{' '}
        <a href="https://huggingface.co/datasets/roneneldan/TinyStories" target="_blank" rel="noreferrer">
          TinyStories dataset
        </a>
      </p>
    </div>
  )
}
