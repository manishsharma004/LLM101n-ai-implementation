import { useEffect, useState } from 'react'
import { getBeginnerMode, setBeginnerMode } from '../lib/beginnerMode'
import { courseCompletionPercent, getStudyStreak } from '../lib/courseStats'

export function useCourseUiPrefs() {
  const [beginnerMode, setBeginner] = useState(() => getBeginnerMode())
  const [completionPct, setCompletionPct] = useState(() => courseCompletionPercent())
  const [streak, setStreak] = useState(() => getStudyStreak())

  useEffect(() => {
    const refresh = () => {
      setCompletionPct(courseCompletionPercent())
      setStreak(getStudyStreak())
    }
    window.addEventListener('llm101n-progress', refresh)
    const onBeginner = () => {
      setBeginner(getBeginnerMode())
      refresh()
    }
    window.addEventListener('llm101n-progress', refresh)
    window.addEventListener('llm101n-beginner-mode', onBeginner)
    return () => {
      window.removeEventListener('llm101n-progress', refresh)
      window.removeEventListener('llm101n-beginner-mode', onBeginner)
    }
  }, [])

  function toggleBeginnerMode() {
    const next = !beginnerMode
    setBeginner(next)
    setBeginnerMode(next)
  }

  return { beginnerMode, toggleBeginnerMode, completionPct, streak }
}
