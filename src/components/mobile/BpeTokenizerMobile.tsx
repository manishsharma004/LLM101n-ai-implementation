import { useMemo, useState } from 'react'
import {
  compressionRatio,
  encodeText,
  trainBpe,
  utf8ByteRows,
  type BpeToken,
} from '../../lib/bpeTokenizerDemo'

const DEFAULT_INPUT = 'Hello World!'

type SubTab = 'input' | 'tokens' | 'merges'

export function BpeTokenizerMobile() {
  const [subTab, setSubTab] = useState<SubTab>('tokens')
  const [input, setInput] = useState(DEFAULT_INPUT)

  const byteLen = useMemo(() => new TextEncoder().encode(input).length, [input])
  const { rules } = useMemo(() => trainBpe(input, 12), [input])
  const tokens: BpeToken[] = useMemo(() => encodeText(input, rules), [input, rules])
  const vocabSize = useMemo(() => 256 + rules.length, [rules.length])
  const ratio = useMemo(() => compressionRatio(input, tokens.length), [input, tokens.length])
  const byteRows = useMemo(() => utf8ByteRows(input), [input])

  return (
    <section className="mobile-rich-panel bpe-mobile" aria-label="BPE tokenizer visualizer">
      <div className="mobile-subtabs" role="tablist" aria-label="Tokenizer views">
        {(
          [
            ['input', 'Input'],
            ['tokens', 'Tokens'],
            ['merges', 'Merge tree'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={subTab === id}
            className={subTab === id ? 'active' : ''}
            onClick={() => setSubTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'input' ? (
        <div className="bpe-input-pane">
          <label className="bpe-input-label" htmlFor="bpe-mobile-input">Raw text</label>
          <textarea
            id="bpe-mobile-input"
            className="bpe-input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
          <p className="bpe-byte-count">{byteLen} bytes UTF-8</p>
        </div>
      ) : null}

      {subTab === 'tokens' ? (
        <>
          <h3 className="mobile-rich-heading">Token breakdown</h3>
          <div className="bpe-chip-row">
            {tokens.map((t, i) => (
              <span key={`${t.id}-${i}`} className="bpe-chip" style={{ backgroundColor: `${t.color}33`, borderColor: t.color }}>
                [{t.id}: &apos;{t.text.replace(/\n/g, '\\n')}&apos;]
              </span>
            ))}
          </div>
          <div className="bpe-compare-table panel-surface">
            <div className="bpe-compare-head">
              <span>Raw bytes (UTF-8)</span>
              <span>Token IDs</span>
            </div>
            {byteRows.map((row) => (
              <div key={row.label} className="bpe-compare-row">
                <code>[{row.bytes.join(', ')}]</code>
                <span className="bpe-arrow">→</span>
                <code>[{row.tokenId}]</code>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {subTab === 'merges' ? (
        <>
          <h3 className="mobile-rich-heading">BPE merge rules</h3>
          <ol className="bpe-merge-list">
            {rules.map(([a, b], i) => (
              <li key={i}>
                <span className="bpe-merge-step">{i + 1}</span>
                merge &apos;{a}&apos; + &apos;{b}&apos; → &apos;{a}{b}&apos;
              </li>
            ))}
          </ol>
          {rules.length === 0 ? <p className="muted">No merges yet — add more repeated pairs in the input.</p> : null}
        </>
      ) : null}

      <div className="bpe-metrics-card">
        <div>
          <span className="bpe-metric-value">{ratio.toFixed(2)}×</span>
          <span className="bpe-metric-label">BPE compression ratio</span>
        </div>
        <div>
          <span className="bpe-metric-value accent-green">{vocabSize}</span>
          <span className="bpe-metric-label">Vocab size</span>
        </div>
      </div>
    </section>
  )
}
