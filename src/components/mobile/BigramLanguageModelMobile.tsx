import { useMemo, useState } from 'react'
import {
  BIGRAM_CHARSET,
  DATASET_BLURB,
  PYTORCH_SNIPPET,
  SAMPLE_NAMES,
  TRAINED_BIGRAM_NLL,
  UNIFORM_NLL,
  heatCellIntensity,
  HEATMAP_HIGHLIGHTS,
} from '../../lib/bigramDemoData'

export function BigramLanguageModelMobile() {
  const [selected, setSelected] = useState<{ from: string; to: string; count: number } | null>(null)

  const cells = useMemo(() => {
    const out: { from: string; to: string; fromIdx: number; toIdx: number; intensity: number }[] = []
    for (let i = 0; i < BIGRAM_CHARSET.length; i++) {
      for (let j = 0; j < BIGRAM_CHARSET.length; j++) {
        out.push({
          from: BIGRAM_CHARSET[i],
          to: BIGRAM_CHARSET[j],
          fromIdx: i,
          toIdx: j,
          intensity: heatCellIntensity(i, j),
        })
      }
    }
    return out
  }, [])

  function onCellTap(from: string, to: string, fromIdx: number, toIdx: number) {
    const hit = HEATMAP_HIGHLIGHTS.find((h) => h.from === from && h.to === to)
    setSelected(
      hit ?? {
        from,
        to,
        count: Math.round(heatCellIntensity(fromIdx, toIdx) * 500),
      },
    )
  }

  return (
    <section className="mobile-rich-panel bigram-mobile" aria-label="Bigram language model metrics">
      <article className="bigram-card panel-surface">
        <h3>1. Dataset: names.txt</h3>
        <p className="muted">{DATASET_BLURB}</p>
      </article>

      <article className="bigram-card panel-surface">
        <h3>2. PyTorch normalization</h3>
        <pre className="bigram-code"><code>{PYTORCH_SNIPPET}</code></pre>
      </article>

      <article className="bigram-card panel-surface">
        <h3>3. Letter transition matrix (27×27)</h3>
        <p className="muted">Tap a cell for bigram counts (sample highlights from training shard).</p>
        <div className="bigram-heatmap-wrap">
          <div className="bigram-heatmap-labels-y" aria-hidden>
            {BIGRAM_CHARSET.split('').map((ch) => (
              <span key={`y-${ch}`}>{ch}</span>
            ))}
          </div>
          <div className="bigram-heatmap-scroll">
            <div
              className="bigram-heatmap"
              style={{ gridTemplateColumns: `repeat(${BIGRAM_CHARSET.length}, 1fr)` }}
            >
              {cells.map((c) => (
                <button
                  key={`${c.from}-${c.to}`}
                  type="button"
                  className={`bigram-cell ${selected?.from === c.from && selected?.to === c.to ? 'selected' : ''}`}
                  style={{
                    background: `rgba(56, 189, 248, ${0.12 + c.intensity * 0.88})`,
                  }}
                  title={`${c.from} → ${c.to}`}
                  onClick={() => onCellTap(c.from, c.to, c.fromIdx, c.toIdx)}
                />
              ))}
            </div>
            <div className="bigram-heatmap-labels-x" aria-hidden>
              {BIGRAM_CHARSET.split('').map((ch) => (
                <span key={`x-${ch}`}>{ch}</span>
              ))}
            </div>
          </div>
        </div>
        {selected ? (
          <p className="bigram-cell-detail">
            Bigram <strong>{selected.from} → {selected.to}</strong>: {selected.count.toLocaleString()} co-occurrences
          </p>
        ) : null}
      </article>

      <pre className="bigram-console panel-surface">
        Uniform baseline NLL: {UNIFORM_NLL.toFixed(2)} (−ln 1/27)
        {'\n'}
        Trained bigram NLL: {TRAINED_BIGRAM_NLL.toFixed(2)}
        {'\n'}
        Generated samples: {SAMPLE_NAMES.map((n) => `'${n}'`).join(', ')}
      </pre>
    </section>
  )
}
