export type ChapterMobileTabId = 'theory' | 'lab' | 'prompt' | 'metrics'

export type ChapterMobileTab = { id: ChapterMobileTabId; label: string }

const DEFAULT: ChapterMobileTab[] = [
  { id: 'theory', label: 'Theory & Math' },
  { id: 'lab', label: 'Code Lab' },
]

const BY_SLUG: Record<string, ChapterMobileTab[]> = {
  multimodal: [
    { id: 'prompt', label: 'Prompt lab' },
    { id: 'theory', label: 'Theory' },
    { id: 'lab', label: 'Code lab' },
  ],
  'bigram-language-model': [
    { id: 'metrics', label: 'Data & metrics' },
    { id: 'theory', label: 'Theory & math' },
    { id: 'lab', label: 'Code lab' },
  ],
}

export function chapterMobileTabs(slug: string): ChapterMobileTab[] {
  return BY_SLUG[slug] ?? DEFAULT
}

export function defaultChapterMobileTab(slug: string): ChapterMobileTabId {
  if (slug === 'multimodal') return 'prompt'
  if (slug === 'bigram-language-model') return 'metrics'
  return 'theory'
}
