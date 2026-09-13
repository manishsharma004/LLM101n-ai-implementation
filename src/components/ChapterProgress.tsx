import { useEffect, useState } from 'react'
import { isChapterComplete, setChapterComplete } from '../lib/progress'

export function ChapterProgress({ chapterId }: { chapterId: string }) {
  const [done, setDone] = useState(() => isChapterComplete(chapterId))

  useEffect(() => {
    setDone(isChapterComplete(chapterId))
  }, [chapterId])

  function toggle() {
    const next = !done
    setChapterComplete(chapterId, next)
    setDone(next)
  }

  return (
    <div className="chapter-progress">
      <label>
        <input type="checkbox" checked={done} onChange={toggle} />
        Mark chapter complete
      </label>
    </div>
  )
}
