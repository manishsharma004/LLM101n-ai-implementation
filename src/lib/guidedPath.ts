import { getChapterByNumber } from '../content/chapters'
import { prerequisiteUnits } from '../content/prerequisites/units'
import { isPrereqUnitComplete } from './prerequisiteProgress'
import { isChapterComplete } from './progress'

export type GuidedStep = {
  title: string
  description: string
  to: string
  cta: string
}

/** Single recommended next step (issue #22 — one map for new learners). */
export function recommendedNextStep(): GuidedStep {
  const ch1 = getChapterByNumber(1)
  const firstPrereq = prerequisiteUnits[0]

  const prereqDone = prerequisiteUnits.every((u) => isPrereqUnitComplete(u.id))
  if (!prereqDone) {
    const nextUnit = prerequisiteUnits.find((u) => !isPrereqUnitComplete(u.id)) ?? firstPrereq
    return {
      title: 'Recommended: prerequisites first',
      description:
        'Units 0.0–0.5 are a short Python + makemore ramp before Chapter 1 — not a second syllabus.',
      to: `/prerequisites/${nextUnit.slug}`,
      cta: `Start Unit ${nextUnit.unitLabel}`,
    }
  }

  if (ch1 && !isChapterComplete(ch1.id)) {
    return {
      title: 'Recommended: Chapter 1',
      description: 'Train a character bigram on TinyStories in the browser, then explore the 17-chapter LLM101n path.',
      to: `/chapter/${ch1.slug}`,
      cta: 'Start Chapter 1 — Bigram LM',
    }
  }

  return {
    title: 'Continue the course',
    description: 'Pick the next chapter from the phase roadmap below, or review the optional Karpathy video plan.',
    to: ch1 ? `/chapter/${ch1.slug}` : '/',
    cta: 'Open course modules',
  }
}
