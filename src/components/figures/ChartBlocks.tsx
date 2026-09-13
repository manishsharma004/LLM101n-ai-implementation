import type { BarChartFigure, HeatmapFigure, LineChartFigure } from '../../content/types'

const W = 420
const H = 220
const PAD = { t: 16, r: 16, b: 36, l: 44 }

function scaleLinear(domain: [number, number], range: [number, number], v: number) {
  const [d0, d1] = domain
  const [r0, r1] = range
  if (d1 === d0) return (r0 + r1) / 2
  return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
}

export function LineChartBlock({ figure }: { figure: LineChartFigure }) {
  const allX = figure.series.flatMap((s) => s.points.map((p) => p.x))
  const allY = figure.series.flatMap((s) => s.points.map((p) => p.y))
  const xDom: [number, number] = [Math.min(...allX), Math.max(...allX)]
  const yDom: [number, number] = [Math.min(...allY), Math.max(...allY)]

  const colors = ['#6ee7b7', '#93c5fd', '#fbbf24', '#f472b6']

  return (
    <figure className="chart-block">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={figure.caption ?? 'Line chart'}>
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#444" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#444" />
        {figure.yLabel ? (
          <text x={12} y={PAD.t + 8} fill="#888" fontSize="10">{figure.yLabel}</text>
        ) : null}
        {figure.series.map((s, si) => {
          const d = s.points
            .map((p, i) => {
              const x = scaleLinear(xDom, [PAD.l, W - PAD.r], p.x)
              const y = scaleLinear(yDom, [H - PAD.b, PAD.t], p.y)
              return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
            })
            .join(' ')
          return (
            <path
              key={s.name}
              d={d}
              fill="none"
              stroke={s.color ?? colors[si % colors.length]}
              strokeWidth="2"
            />
          )
        })}
      </svg>
      <ul className="chart-legend">
        {figure.series.map((s, si) => (
          <li key={s.name}>
            <span className="swatch" style={{ background: s.color ?? colors[si % colors.length] }} />
            {s.name}
          </li>
        ))}
      </ul>
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  )
}

export function BarChartBlock({ figure }: { figure: BarChartFigure }) {
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const maxV = Math.max(...figure.values, 1e-9)
  const barW = innerW / figure.values.length - 6

  return (
    <figure className="chart-block">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={figure.caption ?? 'Bar chart'}>
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#444" />
        {figure.values.map((v, i) => {
          const h = (v / maxV) * innerH
          const x = PAD.l + i * (barW + 6) + 3
          const y = H - PAD.b - h
          return (
            <g key={figure.labels[i] ?? i}>
              <rect x={x} y={y} width={barW} height={h} fill={figure.color ?? '#6ee7b7'} rx="2" />
              <text x={x + barW / 2} y={H - PAD.b + 14} textAnchor="middle" fill="#888" fontSize="9">
                {figure.labels[i]}
              </text>
            </g>
          )
        })}
      </svg>
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  )
}

export function HeatmapBlock({ figure }: { figure: HeatmapFigure }) {
  const rows = figure.values.length
  const cols = figure.colLabels.length
  const cell = 28
  const gw = cols * cell
  const gh = rows * cell

  return (
    <figure className="chart-block heatmap">
      <svg viewBox={`0 0 ${gw + 60} ${gh + 40}`} role="img" aria-label={figure.caption ?? 'Heatmap'}>
        {figure.values.map((row, i) =>
          row.map((v, j) => {
            const intensity = Math.max(0, Math.min(1, v))
            const fill = `rgba(110, 231, 183, ${0.15 + intensity * 0.85})`
            return (
              <rect
                key={`${i}-${j}`}
                x={50 + j * cell}
                y={i * cell}
                width={cell - 2}
                height={cell - 2}
                fill={fill}
                stroke="#333"
              />
            )
          }),
        )}
        {figure.rowLabels.map((lab, i) => (
          <text key={lab} x={4} y={i * cell + cell / 2 + 4} fill="#888" fontSize="10">{lab}</text>
        ))}
        {figure.colLabels.map((lab, j) => (
          <text key={lab} x={50 + j * cell + cell / 2} y={gh + 14} textAnchor="middle" fill="#888" fontSize="10">
            {lab}
          </text>
        ))}
      </svg>
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  )
}
