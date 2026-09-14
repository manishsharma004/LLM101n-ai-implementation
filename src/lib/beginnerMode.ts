const STORAGE_KEY = 'llm101n-beginner-mode-v1'

export function getBeginnerMode(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return true
    return raw === '1'
  } catch {
    return true
  }
}

export function setBeginnerMode(on: boolean): void {
  localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  window.dispatchEvent(new CustomEvent('llm101n-beginner-mode'))
}
