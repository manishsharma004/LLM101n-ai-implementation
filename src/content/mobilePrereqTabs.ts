export type PrereqMobileTabId = 'theory' | 'graph' | 'bpe' | 'lab'

export type PrereqMobileTab = { id: PrereqMobileTabId; label: string }

const DEFAULT_TABS: PrereqMobileTab[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'lab', label: 'Python sandbox' },
]

const BY_SLUG: Record<string, PrereqMobileTab[]> = {
  'autograd-micrograd': [
    { id: 'theory', label: 'Theory' },
    { id: 'graph', label: 'DAG graph' },
    { id: 'lab', label: 'Python code' },
  ],
  'bpe-tokenization': [
    { id: 'theory', label: 'Theory' },
    { id: 'bpe', label: 'Tokenizer' },
    { id: 'lab', label: 'Run tokenizer' },
  ],
}

export function prereqMobileTabs(slug: string, hasLab: boolean): PrereqMobileTab[] {
  if (!hasLab) return [{ id: 'theory', label: 'Theory' }]
  return BY_SLUG[slug] ?? DEFAULT_TABS
}
