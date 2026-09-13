export function trainBpe(text: string, merges: number): { vocab: string[]; mergeRules: [string, string][] } {
  const words = text.split(/\s+/).filter(Boolean)
  let tokens = words.map((w) => [...w].map((c) => c))
  const mergeRules: [string, string][] = []

  const pairCounts = () => {
    const m = new Map<string, number>()
    for (const word of tokens) {
      for (let i = 0; i < word.length - 1; i++) {
        const pair = `${word[i]} ${word[i + 1]}`
        m.set(pair, (m.get(pair) ?? 0) + 1)
      }
    }
    return m
  }

  for (let m = 0; m < merges; m++) {
    const counts = pairCounts()
    let best: string | null = null
    let bestC = 0
    for (const [pair, c] of counts) {
      if (c > bestC) {
        bestC = c
        best = pair
      }
    }
    if (!best || bestC < 2) break
    const [a, b] = best.split(' ')
    mergeRules.push([a, b])
    const merged = a + b
    tokens = tokens.map((word) => {
      const next: string[] = []
      for (let i = 0; i < word.length; i++) {
        if (i < word.length - 1 && word[i] === a && word[i + 1] === b) {
          next.push(merged)
          i++
        } else next.push(word[i])
      }
      return next
    })
  }

  const vocab = new Set<string>()
  for (const word of tokens) for (const t of word) vocab.add(t)
  return { vocab: [...vocab].sort(), mergeRules }
}
