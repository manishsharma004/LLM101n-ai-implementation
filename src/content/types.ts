export type LabId =
  | 'python-quickstart'
  | 'bigram'
  | 'micrograd'
  | 'mlp'
  | 'attention'
  | 'transformer-block'
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

export type MathFigure = {
  type: 'math'
  caption?: string
  /** Display-mode LaTeX (no $ delimiters). */
  latex: string
}

export type MermaidFigure = {
  type: 'mermaid'
  caption?: string
  source: string
}

export type ChartPoint = { x: number; y: number }

export type LineChartFigure = {
  type: 'line'
  caption?: string
  xLabel?: string
  yLabel?: string
  series: { name: string; points: ChartPoint[]; color?: string }[]
}

export type BarChartFigure = {
  type: 'bar'
  caption?: string
  yLabel?: string
  labels: string[]
  values: number[]
  color?: string
}

export type HeatmapFigure = {
  type: 'heatmap'
  caption?: string
  /** Row labels (queries), column labels (keys). values[row][col] in [0,1]. */
  rowLabels: string[]
  colLabels: string[]
  values: number[][]
}

export type ChapterFigure = MathFigure | MermaidFigure | LineChartFigure | BarChartFigure | HeatmapFigure

export type ChapterPart = {
  id: string
  heading: string
  paragraphs: string[]
  figures?: ChapterFigure[]
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
  figures?: ChapterFigure[]
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
