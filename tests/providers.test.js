import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSearchEngineUrls, buildStorytellerPrompt, buildTutorPrompt } from '../src/lib/llm/providers.ts'

test('search engine URLs match system-design-copilot shape', () => {
  const urls = buildSearchEngineUrls('System: test\nUser: explain bigram LM')
  assert.equal(urls.google.startsWith('https://www.google.com/search?'), true)
  assert.equal(urls.duckduckgo.startsWith('https://duck.ai/?'), true)
  assert.equal(urls.perplexity.startsWith('https://www.perplexity.ai/?'), true)
  assert.equal(urls.google.includes('udm=50'), true)
})

test('storyteller and tutor prompts include system lines', () => {
  const story = buildStorytellerPrompt('Add a dragon', { chapterTitle: 'Bigram' })
  assert.match(story, /System:/)
  assert.match(story, /TinyStories/)
  const tutor = buildTutorPrompt('What is softmax?', { chapterTitle: 'Attention' })
  assert.match(tutor, /LLM101n/)
  assert.match(tutor, /softmax/)
})
