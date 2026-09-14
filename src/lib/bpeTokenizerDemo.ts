/** Toy word-level BPE (matches lab spirit) for in-browser mobile visualizer. */

export type BpeToken = { id: number; text: string; color: string }

const CHIP_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6']

function pairCounts(words: string[][]): Map<string, number> {
  const m = new Map<string, number>()
  for (const word of words) {
    for (let i = 0; i < word.length - 1; i++) {
      const key = `${word[i]}\0${word[i + 1]}`
      m.set(key, (m.get(key) ?? 0) + 1)
    }
  }
  return m
}

export function trainBpe(text: string, merges = 12): { rules: [string, string][]; words: string[][] } {
  let words = text.split(/\s+/).filter(Boolean).map((w) => [...w])
  const rules: [string, string][] = []

  for (let step = 0; step < merges; step++) {
    const counts = pairCounts(words)
    if (counts.size === 0) break
    let bestKey = ''
    let bestCount = 0
    for (const [k, c] of counts) {
      if (c > bestCount) {
        bestCount = c
        bestKey = k
      }
    }
    if (bestCount < 2) break
    const [a, b] = bestKey.split('\0')
    const merged = a + b
    rules.push([a, b])

    words = words.map((word) => {
      const nxt: string[] = []
      let i = 0
      while (i < word.length) {
        if (i < word.length - 1 && word[i] === a && word[i + 1] === b) {
          nxt.push(merged)
          i += 2
        } else {
          nxt.push(word[i])
          i += 1
        }
      }
      return nxt
    })
  }

  return { rules, words }
}

export function applyMerges(chars: string[], rules: [string, string][]): string[] {
  let word = [...chars]
  for (const [a, b] of rules) {
    const merged = a + b
    const nxt: string[] = []
    let i = 0
    while (i < word.length) {
      if (i < word.length - 1 && word[i] === a && word[i + 1] === b) {
        nxt.push(merged)
        i += 2
      } else {
        nxt.push(word[i])
        i += 1
      }
    }
    word = nxt
  }
  return word
}

export function encodeText(text: string, rules: [string, string][]): BpeToken[] {
  const pieces: string[] = []
  const rawWords = text.split(/(\s+)/).filter((p) => p.length > 0)
  for (const part of rawWords) {
    if (/^\s+$/.test(part)) {
      pieces.push(part)
    } else {
      pieces.push(...applyMerges([...part], rules))
    }
  }

  const vocab = new Map<string, number>()
  let nextId = 256
  for (const p of pieces) {
    if (!vocab.has(p)) vocab.set(p, nextId++)
  }

  return pieces.map((text, i) => ({
    id: vocab.get(text) ?? 0,
    text,
    color: CHIP_COLORS[i % CHIP_COLORS.length],
  }))
}

export function utf8ByteRows(text: string): { label: string; bytes: number[]; tokenId: number }[] {
  const enc = new TextEncoder()
  const { rules } = trainBpe(text, 8)
  const tokens = encodeText(text, rules)
  const rows: { label: string; bytes: number[]; tokenId: number }[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    const slice = t.text.trim() ? t.text : t.text
    rows.push({
      label: slice.replace(/\n/g, '\\n') || '(space)',
      bytes: [...enc.encode(t.text)],
      tokenId: t.id,
    })
  }
  return rows.length ? rows : [{ label: '(empty)', bytes: [], tokenId: 0 }]
}

export function compressionRatio(text: string, tokenCount: number): number {
  const bytes = new TextEncoder().encode(text).length
  if (tokenCount === 0) return 1
  return bytes / tokenCount
}
