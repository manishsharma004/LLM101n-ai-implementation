import { useState } from 'react'
import {
  buildTutorPrompt,
  getPreferredSearchEngine,
  openSearchEngine,
  SEARCH_ENGINE_OPTIONS,
  setPreferredSearchEngine,
  type SearchEngineId,
} from '../lib/llm/providers'

type Props = {
  chapterTitle?: string
  defaultQuestion?: string
  label?: string
}

export function SearchAssistPanel({ chapterTitle, defaultQuestion = '', label = 'Ask with search AI' }: Props) {
  const [engine, setEngine] = useState<SearchEngineId>(() => getPreferredSearchEngine())
  const [question, setQuestion] = useState(defaultQuestion)

  function onAsk() {
    const prompt = buildTutorPrompt(question, { chapterTitle, moduleTitle: 'LLM101n Storyteller' })
    setPreferredSearchEngine(engine)
    openSearchEngine(engine, prompt)
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
        <select
          value={engine}
          onChange={(e) => setEngine(e.target.value as SearchEngineId)}
        >
          {SEARCH_ENGINE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Question</span>
        <textarea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} />
      </label>
      <button type="button" className="primary" onClick={onAsk}>Open in search</button>
    </section>
  )
}
