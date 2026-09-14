/** Demo stats aligned with makemore / names.txt curriculum (mobile Ch.1 view). */

export const BIGRAM_CHARSET = 'abcdefghijklmnopqrstuvwxyz.'
export const CHARSET_SIZE = 27

export const UNIFORM_NLL = Math.log(CHARSET_SIZE)
export const TRAINED_BIGRAM_NLL = 2.45

export const DATASET_BLURB =
  'names.txt — ~32,000 names (Emma, Olivia, Ava, Isabella), lengths 2–15 characters.'

export const SAMPLE_NAMES = ['katon', 'alivia', 'mora', 'yvon']

export const PYTORCH_SNIPPET = `N = torch.zeros((27, 27), dtype=torch.int32)
P = (N + 1).float()
P /= P.sum(1, keepdim=True)
out = torch.multinomial(P[0], num_samples=1)`

/** Representative co-occurrence highlights for heatmap taps (not full 27×27 table). */
export const HEATMAP_HIGHLIGHTS: { from: string; to: string; count: number }[] = [
  { from: 'a', to: 'n', count: 6640 },
  { from: 'q', to: 'u', count: 3821 },
  { from: 'e', to: 'm', count: 2910 },
  { from: 'a', to: 'a', count: 1842 },
  { from: 'm', to: 'e', count: 2655 },
]

export function heatCellIntensity(fromIdx: number, toIdx: number): number {
  const from = BIGRAM_CHARSET[fromIdx]
  const to = BIGRAM_CHARSET[toIdx]
  const hit = HEATMAP_HIGHLIGHTS.find((h) => h.from === from && h.to === to)
  if (hit) return Math.min(1, hit.count / 7000)
  if (fromIdx === toIdx) return 0.35
  return 0.08 + ((fromIdx * 3 + toIdx) % 7) * 0.04
}
