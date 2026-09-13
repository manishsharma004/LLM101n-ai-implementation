export function softmaxRow(scores: number[]): number[] {
  const max = Math.max(...scores)
  const exps = scores.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

/** Causal scaled dot-product attention for small demo (single head). */
export function causalAttention(Q: number[][], K: number[][], V: number[][]): number[][] {
  const dk = K[0]?.length ?? 1
  const scale = 1 / Math.sqrt(dk)
  const out: number[][] = []
  for (let i = 0; i < Q.length; i++) {
    const scores: number[] = []
    for (let j = 0; j < K.length; j++) {
      let dot = 0
      for (let d = 0; d < dk; d++) dot += Q[i][d] * K[j][d]
      scores.push(j > i ? -1e9 : dot * scale)
    }
    const weights = softmaxRow(scores)
    const row = new Array(V[0].length).fill(0)
    for (let j = 0; j < V.length; j++) {
      for (let d = 0; d < row.length; d++) row[d] += weights[j] * V[j][d]
    }
    out.push(row)
  }
  return out
}

export function randomMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * 0.4),
  )
}
