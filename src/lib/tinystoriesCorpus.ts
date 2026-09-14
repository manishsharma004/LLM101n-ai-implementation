/** Fetch TinyStories shard for Pyodide labs (GitHub Pages–safe absolute URL). */

const CORPUS_PATH = 'data/tinystories-sample.txt'

let cached: string | null = null
let inflight: Promise<string> | null = null

export function corpusUrl(): string {
  const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined
  const base = env?.BASE_URL != null ? env.BASE_URL : '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${CORPUS_PATH}`
}

export async function fetchTinyStoriesCorpus(): Promise<string> {
  if (cached) return cached
  if (inflight) return inflight
  inflight = fetch(corpusUrl())
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} loading ${corpusUrl()}`)
      return res.text()
    })
    .then((text) => {
      if (text.length < 500) {
        throw new Error(`Corpus too small (${text.length} chars) — check deploy asset`)
      }
      cached = text
      return text
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export async function mountCorpusOnPyodide(pyodide: {
  FS: { writeFile: (path: string, data: string) => void }
}): Promise<number> {
  const text = await fetchTinyStoriesCorpus()
  pyodide.FS.writeFile('/tinystories-sample.txt', text)
  return text.length
}
