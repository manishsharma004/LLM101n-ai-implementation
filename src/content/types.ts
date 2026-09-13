export type LabId =
  | 'bigram'
  | 'micrograd'
  | 'mlp'
  | 'attention'
  | 'bpe'
  | 'optimizer'
  | 'device'
  | 'precision'
  | 'workers'
  | 'dataset'
  | 'kvcache'
  | 'quantize'
  | 'sft-prompt'
  | 'lora'
  | 'eval'
  | 'dpo-prompt'
  | 'storyteller'
  | 'multimodal'

export type ChapterPart = {
  id: string
  heading: string
  paragraphs: string[]
  keyTerms?: { term: string; definition: string }[]
  code?: { language: string; body: string; caption?: string }
  checkYourself?: { prompt: string; reveal: string }[]
  callout?: { tone: 'tip' | 'note' | 'interview'; body: string }
}

export type AppendixTopic = {
  id: string
  title: string
  summary: string
  bullets: string[]
}

export type Chapter = {
  id: string
  number: number
  slug: string
  title: string
  subtitle: string
  syllabusTopic: string
  readingTime: string
  premise: string
  parts: ChapterPart[]
  labIds: LabId[]
  tutorSeeds: string[]
}
