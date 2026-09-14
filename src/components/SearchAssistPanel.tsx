import { useEffect, useState } from 'react'
import {
  buildTutorPrompt,
  getPreferredSearchEngine,
  openSearchEngine,
  setPreferredSearchEngine,
  type SearchEngineId,
} from '../lib/llm/providers'

type Props = {
  chapterTitle?: string
  defaultQuestion?: string
  label?: string
  variant?: 'panel' | 'floating'
  suggestedQuestions?: string[]
}

const FLOATING_ENGINES: { id: SearchEngineId; label: string }[] = [
  { id: 'google', label: 'Google AI' },
  { id: 'duckduckgo', label: 'Duck.ai' },
  { id: 'perplexity', label: 'Perplexity' },
]

export function SearchAssistPanel({
  chapterTitle,
  defaultQuestion = '',
  label = 'Ask with search AI',
  variant = 'panel',
  suggestedQuestions = [],
}: Props) {
  const [engine, setEngine] = useState<SearchEngineId>(() => getPreferredSearchEngine())
  const [question, setQuestion] = useState(defaultQuestion)

  useEffect(() => {
    setQuestion(defaultQuestion)
  }, [defaultQuestion])

  function onAsk(targetEngine?: SearchEngineId) {
    const eng = targetEngine ?? engine
    const prompt = buildTutorPrompt(question, { chapterTitle, moduleTitle: 'LLM101n Storyteller' })
    setPreferredSearchEngine(eng)
    setEngine(eng)
    openSearchEngine(eng, prompt)
  }

  if (variant === 'floating') {
    return (
      <div className="search-panel search-panel--floating">
        <div className="provider-pills" role="group" aria-label="Search provider">
          {FLOATING_ENGINES.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`provider-pill ${engine === o.id ? 'active' : ''}`}
              onClick={() => {
                setEngine(o.id)
                if (question.trim()) onAsk(o.id)
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="field field-compact">
          <textarea
            rows={2}
            placeholder="Ask a question about this lesson…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        {suggestedQuestions.length ? (
          <div className="suggested-prompts">
            {suggestedQuestions.map((q) => (
              <button key={q} type="button" className="prompt-chip" onClick={() => setQuestion(q)}>
                {q}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" className="primary btn-run-tutor" onClick={() => onAsk()}>
          Open in search
        </button>
        <p className="muted tutor-footnote">No API keys — opens your browser search tab.</p>
      </div>
    )
  }

  return (
    <section className="panel search-panel">
      <h3>{label}</h3>
      <p className="muted">
        No API keys or backend. Your prompt opens in the search provider you choose (same pattern as{' '}
        <code>system-design-copilot</code>).
      </p>
      <label className="field">
        <span>Provider</span>
        <select value={engine} onChange={(e) => setEngine(e.target.value as SearchEngineId)}>
          {FLOATING_ENGINES.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
          <option value="all">All engines</option>
        </select>
      </label>
      <label className="field">
        <span>Question</span>
        <textarea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} />
      </label>
      <button type="button" className="primary" onClick={() => onAsk()}>Open in search</button>
    </section>
  )
}
