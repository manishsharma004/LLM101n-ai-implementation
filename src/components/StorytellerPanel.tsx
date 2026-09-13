import { useState } from 'react'
import {
  buildStorytellerPrompt,
  getPreferredSearchEngine,
  openSearchEngine,
  SEARCH_ENGINE_OPTIONS,
  setPreferredSearchEngine,
  type SearchEngineId,
} from '../lib/llm/providers'

export function StorytellerPanel() {
  const [engine, setEngine] = useState<SearchEngineId>(() => getPreferredSearchEngine())
  const [story, setStory] = useState('')
  const [prompt, setPrompt] = useState('Write a new TinyStories-style adventure about a kind fox.')

  function continueStory() {
    const full = buildStorytellerPrompt(prompt, { priorStory: story })
    setPreferredSearchEngine(engine)
    openSearchEngine(engine, full)
  }

  return (
    <section className="panel storyteller">
      <h2>Storyteller</h2>
      <p className="muted">
        Karpathy&apos;s course ends in a ChatGPT-like app. This build stays static: refine stories using{' '}
        <strong>your</strong> chosen search AI tab—local labs supply drafts; providers supply fluent text.
      </p>
      <label className="field">
        <span>Search provider</span>
        <select value={engine} onChange={(e) => setEngine(e.target.value as SearchEngineId)}>
          {SEARCH_ENGINE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Your story draft (optional)</span>
        <textarea
          rows={5}
          placeholder="Paste output from the bigram lab or your own notes…"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </label>
      <label className="field">
        <span>Instruction</span>
        <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </label>
      <button type="button" className="primary" onClick={continueStory}>
        Continue story in search AI
      </button>
    </section>
  )
}
