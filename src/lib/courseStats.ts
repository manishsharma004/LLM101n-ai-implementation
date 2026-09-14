import { chapters } from '../content/chapters'
import { isChapterComplete } from './progress'

const STREAK_KEY = 'llm101n-study-streak-v1'

type StreakState = { lastDate: string; count: number }

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function readStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return { lastDate: '', count: 0 }
    const data = JSON.parse(raw) as StreakState
    if (!data || typeof data.count !== 'number') return { lastDate: '', count: 0 }
    return data
  } catch {
    return { lastDate: '', count: 0 }
  }
}

/** Call on chapter view or lab run to bump streak. */
export function touchStudyStreak(): void {
  const today = todayKey()
  const prev = readStreak()
  if (prev.lastDate === today) return
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yKey = yesterday.toISOString().slice(0, 10)
  const count = prev.lastDate === yKey ? prev.count + 1 : 1
  localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count }))
  window.dispatchEvent(new CustomEvent('llm101n-progress'))
}

export function getStudyStreak(): number {
  const today = todayKey()
  const prev = readStreak()
  if (prev.lastDate === today) return prev.count
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (prev.lastDate === yesterday.toISOString().slice(0, 10)) return prev.count
  return 0
}

export function courseCompletionPercent(): number {
  const done = chapters.filter((c) => isChapterComplete(c.id)).length
  return Math.round((done / chapters.length) * 100)
}
