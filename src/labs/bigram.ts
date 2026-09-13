export function trainBigram(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  if (text.length < 2) return counts
  for (let i = 0; i < text.length - 1; i++) {
    const key = `${text[i]}|${text[i + 1]}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

export function sampleBigram(
  counts: Map<string, number>,
  seed: string,
  maxLen: number,
  alpha = 1,
): string {
  if (!seed) seed = 'O'
  let out = seed.slice(-1)
  const vocab = new Set<string>()
  for (const key of counts.keys()) {
    const [a, b] = key.split('|')
    vocab.add(a)
    vocab.add(b)
  }
  for (let step = 0; step < maxLen; step++) {
    const ctx = out[out.length - 1]
    let total = alpha * vocab.size
    const options: { ch: string; w: number }[] = []
    for (const [pair, c] of counts) {
      const [a, b] = pair.split('|')
      if (a !== ctx) continue
      const w = c + alpha
      options.push({ ch: b, w })
      total += c
    }
    if (!options.length) break
    let r = Math.random() * total
    let pick = options[0].ch
    for (const { ch, w } of options) {
      r -= w
      if (r <= 0) {
        pick = ch
        break
      }
    }
    out += pick
  }
  return out
}
