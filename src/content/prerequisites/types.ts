import type { LabId } from '../types'

export type PrereqSection = {
  id: string
  heading: string
  paragraphs?: string[]
  bullets: string[]
}

export type PrerequisiteUnit = {
  id: string
  unitLabel: string
  slug: string
  title: string
  shortTitle: string
  estimatedHours: string
  difficulty: 'Beginner'
  iconGlyph: string
  coreGoal: string
  sections: PrereqSection[]
  labId?: LabId
  relatedChapterSlug?: string
  tutorSeeds: string[]
}
