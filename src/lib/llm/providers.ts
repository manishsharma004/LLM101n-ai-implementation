/** Adapted from manishsharma004/system-design-copilot — search-only path (no in-app LLM API). */

export type SearchEngineId = 'all' | 'google' | 'duckduckgo' | 'perplexity'

export const SEARCH_ENGINE_OPTIONS: { id: SearchEngineId; label: string }[] = [
  { id: 'all', label: 'All engines' },
  { id: 'google', label: 'Google AI Mode' },
  { id: 'duckduckgo', label: 'Duck.ai' },
  { id: 'perplexity', label: 'Perplexity' },
]

const STORAGE_KEY = 'llm101n-preferred-search-engine'

export function getPreferredSearchEngine(): SearchEngineId {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'google' || raw === 'duckduckgo' || raw === 'perplexity' || raw === 'all') return raw
  return 'all'
}

export function setPreferredSearchEngine(id: SearchEngineId): void {
  localStorage.setItem(STORAGE_KEY, id)
}

export function buildSearchEngineUrls(prompt: string): {
  google: string
  duckduckgo: string
  perplexity: string
} {
  const google = new URL(
    `https://www.google.com/search?${new URLSearchParams({ udm: '50', q: prompt })}`,
  )
  const duckduckgo = new URL(`https://duck.ai/?${new URLSearchParams({ q: prompt })}`)
  const perplexity = new URL(`https://www.perplexity.ai/?${new URLSearchParams({ q: prompt })}`)
  return {
    google: google.toString(),
    duckduckgo: duckduckgo.toString(),
    perplexity: perplexity.toString(),
  }
}

export function openSearchEngine(engine: SearchEngineId, prompt: string): void {
  const urls = buildSearchEngineUrls(prompt)
  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')
  if (engine === 'google') {
    open(urls.google)
    return
  }
  if (engine === 'duckduckgo') {
    open(urls.duckduckgo)
    return
  }
  if (engine === 'perplexity') {
    open(urls.perplexity)
    return
  }
  open(urls.google)
  open(urls.duckduckgo)
  open(urls.perplexity)
}

export const DEFAULT_STORYTELLER_SYSTEM =
  'You are a Storyteller AI in the spirit of Karpathy LLM101n and the TinyStories dataset. Write short, child-friendly fiction (clear morals, simple vocabulary, 2–4 short paragraphs unless asked otherwise). Stay in character as the story assistant; do not mention that you are a search result.'

export const DEFAULT_TUTOR_SYSTEM =
  'You are a patient LLM101n course tutor. The learner is building a Storyteller language model from scratch in the browser (no server training). Explain concepts with intuition, one tiny example, shapes or complexity when relevant, and common pitfalls. Tie answers to TinyStories-style text when helpful. Be precise; avoid hype.'

export function buildStorytellerPrompt(
  userMessage: string,
  context: { chapterTitle?: string; priorStory?: string },
): string {
  const chapter = context.chapterTitle?.trim()
  const prior = context.priorStory?.trim()
  const user = userMessage.trim()
  const lines = [
    `System: ${DEFAULT_STORYTELLER_SYSTEM}`,
    chapter ? `Context: Learner is studying "${chapter}" in LLM101n.` : null,
    prior ? `Story so far:\n"""${prior}"""` : null,
    `User: ${user || 'Continue the story with something new about friendship and adventure.'}`,
  ].filter(Boolean)
  return lines.join('\n')
}

export function buildTutorPrompt(
  selectionOrQuestion: string,
  context: { chapterTitle?: string; moduleTitle?: string },
): string {
  const selection = selectionOrQuestion.trim()
  const ctx: string[] = []
  if (context.moduleTitle) ctx.push(`Module: ${context.moduleTitle}`)
  if (context.chapterTitle) ctx.push(`Chapter: ${context.chapterTitle}`)
  const userPrompt = [
    ctx.length ? ctx.join('\n') : null,
    'Explain for a learner implementing LLM101n in the browser.',
    '',
    'Question / selection:',
    `"""${selection}"""`,
    '',
    'Cover: (1) intuition, (2) definition, (3) tiny example, (4) pitfalls, (5) how it connects to building a Storyteller LM.',
  ]
    .filter(Boolean)
    .join('\n')
  return `System: ${DEFAULT_TUTOR_SYSTEM}\nUser: ${userPrompt}`
}
