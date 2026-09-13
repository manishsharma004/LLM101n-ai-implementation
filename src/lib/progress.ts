const STORAGE_KEY = 'llm101n-chapter-progress-v1'

export type ProgressExport = {
  version: 1
  completedChapterIds: string[]
  updatedAt: string
}

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const data = JSON.parse(raw) as ProgressExport
    if (data.version !== 1 || !Array.isArray(data.completedChapterIds)) return new Set()
    return new Set(data.completedChapterIds)
  } catch {
    return new Set()
  }
}

function writeIds(ids: Set<string>): void {
  const payload: ProgressExport = {
    version: 1,
    completedChapterIds: [...ids].sort(),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  window.dispatchEvent(new CustomEvent('llm101n-progress'))
}

export function isChapterComplete(chapterId: string): boolean {
  return readIds().has(chapterId)
}

export function setChapterComplete(chapterId: string, complete: boolean): void {
  const ids = readIds()
  if (complete) ids.add(chapterId)
  else ids.delete(chapterId)
  writeIds(ids)
}

export function exportProgress(): string {
  const ids = readIds()
  const payload: ProgressExport = {
    version: 1,
    completedChapterIds: [...ids].sort(),
    updatedAt: new Date().toISOString(),
  }
  return JSON.stringify(payload, null, 2)
}

export function importProgress(json: string): { ok: true } | { ok: false; error: string } {
  try {
    const data = JSON.parse(json) as ProgressExport
    if (data.version !== 1 || !Array.isArray(data.completedChapterIds)) {
      return { ok: false, error: 'Expected { version: 1, completedChapterIds: string[] }' }
    }
    writeIds(new Set(data.completedChapterIds.filter((id) => typeof id === 'string')))
    return { ok: true }
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }
}
