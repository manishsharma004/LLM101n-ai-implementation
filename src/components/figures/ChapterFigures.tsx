import type { ChapterFigure } from '../../content/types'
import { BarChartBlock, HeatmapBlock, LineChartBlock } from './ChartBlocks'
import { MathBlock } from './MathBlock'
import { MermaidBlock } from './MermaidBlock'

export function ChapterFigures({
  figures,
  hideAdvancedMath = false,
}: {
  figures: ChapterFigure[]
  hideAdvancedMath?: boolean
}) {
  const visible = hideAdvancedMath ? figures.filter((f) => f.type !== 'math') : figures
  if (!visible.length) {
    return hideAdvancedMath ? (
      <p className="muted beginner-math-hint">Turn off Beginner mode in the top bar to show full derivations.</p>
    ) : null
  }
  return (
    <div className="chapter-figures">
      {visible.map((f, i) => {
        switch (f.type) {
          case 'math':
            return <MathBlock key={i} figure={f} />
          case 'mermaid':
            return <MermaidBlock key={i} figure={f} />
          case 'line':
            return <LineChartBlock key={i} figure={f} />
          case 'bar':
            return <BarChartBlock key={i} figure={f} />
          case 'heatmap':
            return <HeatmapBlock key={i} figure={f} />
          default:
            return null
        }
      })}
    </div>
  )
}
