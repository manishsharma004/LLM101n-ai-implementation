import { type JSX, useMemo, useState } from 'react'

function SamplingExplorer() {
  const base = useMemo(() => [0.5, 0.25, 0.15, 0.1], [])
  const labels = ['a', 'b', 'c', 'd']
  const [temperature, setTemperature] = useState(1)

  const probs = useMemo(() => {
    const scaled = base.map((p) => Math.pow(p, 1 / temperature))
    const s = scaled.reduce((a, b) => a + b, 0)
    return scaled.map((x) => x / s)
  }, [base, temperature])

  return (
    <div className="rail-interactive">
      <p className="rail-subtitle">Sampling temperature</p>
      <label className="rail-slider">
        <span>T = {temperature.toFixed(2)}</span>
        <input
          type="range"
          min={0.3}
          max={2.5}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
      </label>
      <div className="mini-bars">
        {probs.map((p, i) => (
          <div key={labels[i]} className="mini-bar-row">
            <span>{labels[i]}</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill" style={{ width: `${p * 100}%` }} />
            </div>
            <span className="mini-bar-val">{p.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PrecisionExplorer() {
  const [format, setFormat] = useState<'fp16' | 'bf16'>('fp16')
  const spec =
    format === 'fp16'
      ? { sign: 1, exp: 5, mant: 10, label: 'fp16' }
      : { sign: 1, exp: 8, mant: 7, label: 'bf16' }

  return (
    <div className="rail-interactive">
      <p className="rail-subtitle">Float layout</p>
      <div className="chip-row">
        <button type="button" className={format === 'fp16' ? 'chip active' : 'chip'} onClick={() => setFormat('fp16')}>
          fp16
        </button>
        <button type="button" className={format === 'bf16' ? 'chip active' : 'chip'} onClick={() => setFormat('bf16')}>
          bf16
        </button>
      </div>
      <div className="bit-row" aria-label={`${spec.label} bit fields`}>
        <span className="bit sign" title="sign">{spec.sign} sign</span>
        <span className="bit exp" title="exponent">{spec.exp} exp</span>
        <span className="bit mant" title="mantissa">{spec.mant} mantissa</span>
      </div>
      <p className="muted rail-hint">
        bf16 keeps fp32 exponent range; fp16 has finer mantissa but smaller exponent.
      </p>
    </div>
  )
}

function AttentionMaskToggle() {
  const [causal, setCausal] = useState(true)
  const n = 4
  const cells = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const allowed = causal ? j <= i : true
      cells.push({ i, j, allowed })
    }
  }

  return (
    <div className="rail-interactive">
      <p className="rail-subtitle">Attention mask</p>
      <label className="rail-check">
        <input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} />
        Causal (decoder)
      </label>
      <div className="mask-grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {cells.map(({ i, j, allowed }) => (
          <div key={`${i}-${j}`} className={allowed ? 'mask-on' : 'mask-off'} title={`q${i}→k${j}`} />
        ))}
      </div>
    </div>
  )
}

const BY_CHAPTER: Record<number, () => JSX.Element> = {
  1: SamplingExplorer,
  4: AttentionMaskToggle,
  9: PrecisionExplorer,
}

export function ChapterInteractive({ chapterNumber }: { chapterNumber: number }) {
  const Widget = BY_CHAPTER[chapterNumber]
  if (!Widget) return null
  return <div className="rail-block">{Widget()}</div>
}
