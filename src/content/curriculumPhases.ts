import { chapters } from './chapters'
import type { Chapter } from './types'

export type CurriculumPhaseId = 'foundations' | 'architectures' | 'scaling' | 'alignment'

export type CurriculumPhase = {
  id: CurriculumPhaseId
  number: number
  title: string
  subtitle: string
  theme: 'cyan' | 'purple'
  chapterNumbers: number[]
}

export const curriculumPhases: CurriculumPhase[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Foundations',
    subtitle: 'Counts, autograd, and shallow LMs',
    theme: 'cyan',
    chapterNumbers: [1, 2, 3],
  },
  {
    id: 'architectures',
    number: 2,
    title: 'Core architectures',
    subtitle: 'Attention, GPT blocks, tokenization',
    theme: 'purple',
    chapterNumbers: [4, 5, 6],
  },
  {
    id: 'scaling',
    number: 3,
    title: 'Optimization & scaling',
    subtitle: 'Speed, precision, data, inference',
    theme: 'cyan',
    chapterNumbers: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: 'alignment',
    number: 4,
    title: 'Alignment & multimodal',
    subtitle: 'SFT, RLHF, deploy, images',
    theme: 'purple',
    chapterNumbers: [14, 15, 16, 17],
  },
]

const difficultyByNumber: Record<number, 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'> = {
  1: 'Beginner',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Advanced',
  6: 'Intermediate',
  7: 'Advanced',
  8: 'Intermediate',
  9: 'Advanced',
  10: 'Advanced',
  11: 'Intermediate',
  12: 'Intermediate',
  13: 'Advanced',
  14: 'Advanced',
  15: 'Expert',
  16: 'Intermediate',
  17: 'Advanced',
}

export function difficultyForChapter(ch: Chapter): string {
  return difficultyByNumber[ch.number] ?? 'Intermediate'
}

export function chaptersInPhase(phaseId: CurriculumPhaseId): Chapter[] {
  const phase = curriculumPhases.find((p) => p.id === phaseId)
  if (!phase) return []
  return phase.chapterNumbers
    .map((n) => chapters.find((c) => c.number === n))
    .filter((c): c is Chapter => Boolean(c))
}

export function phaseForChapterNumber(n: number): CurriculumPhase | undefined {
  return curriculumPhases.find((p) => p.chapterNumbers.includes(n))
}
