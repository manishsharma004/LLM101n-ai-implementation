const STORAGE_KEY = 'llm101n-prerequisite-progress-v1'

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const data = JSON.parse(raw) as { completedUnitIds?: string[] }
    if (!Array.isArray(data.completedUnitIds)) return new Set()
    return new Set(data.completedUnitIds)
  } catch {
    return new Set()
  }
}

function writeIds(ids: Set<string>): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ completedUnitIds: [...ids].sort(), updatedAt: new Date().toISOString() }),
  )
  window.dispatchEvent(new CustomEvent('llm101n-prerequisite-progress'))
}

export function isPrereqUnitComplete(unitId: string): boolean {
  return readIds().has(unitId)
}

export function setPrereqUnitComplete(unitId: string, complete: boolean): void {
  const ids = readIds()
  if (complete) ids.add(unitId)
  else ids.delete(unitId)
  writeIds(ids)
}

export function prereqCompletionCount(total: number, unitIds?: string[]): { done: number; total: number } {
  const ids = readIds()
  if (unitIds?.length) {
    const done = unitIds.filter((id) => ids.has(id)).length
    return { done, total }
  }
  return { done: ids.size, total }
}

export function allPrereqUnitsComplete(unitIds: string[]): boolean {
  const ids = readIds()
  return unitIds.length > 0 && unitIds.every((id) => ids.has(id))
}
