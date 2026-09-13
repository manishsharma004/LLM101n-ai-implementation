import { useEffect, useState } from 'react'
import type { LabId } from '../content/types'
import { trainBigram, sampleBigram } from '../labs/bigram'
import { trainBpe } from '../labs/bpe'
import { causalAttention, randomMatrix } from '../labs/attention'
import { Value, zeroGrad } from '../labs/micrograd'

const SAMPLE_URL = './data/tinystories-sample.txt'

export function LabPanel({ labIds }: { labIds: LabId[] }) {
  return (
    <div className="labs">
      {labIds.map((id) => (
        <Lab key={id} id={id} />
      ))}
    </div>
  )
}

function Lab({ id }: { id: LabId }) {
  switch (id) {
    case 'bigram':
      return <BigramLab />
    case 'micrograd':
      return <MicrogradLab />
    case 'bpe':
      return <BpeLab />
    case 'attention':
      return <AttentionLab />
    case 'dataset':
      return <DatasetLab />
    case 'device':
      return <DeviceLab />
    case 'workers':
      return <WorkersLab />
    case 'kvcache':
      return <KVCacheLab />
    case 'quantize':
      return <QuantLab />
    case 'optimizer':
      return <OptimizerLab />
    case 'precision':
      return <PrecisionLab />
    case 'mlp':
      return <MlpNote />
    case 'sft-prompt':
      return <SftPromptLab />
    case 'dpo-prompt':
      return <DpoPromptLab />
    case 'multimodal':
      return <MultimodalLab />
    case 'storyteller':
      return null
    default:
      return null
  }
}

function BigramLab() {
  const [text, setText] = useState('')
  const [out, setOut] = useState('')

  useEffect(() => {
    fetch(SAMPLE_URL)
      .then((r) => r.text())
      .then(setText)
      .catch(() => setText('Once upon a time'))
  }, [])

  function run() {
    const counts = trainBigram(text)
    setOut(sampleBigram(counts, 'O', 280, 0.5))
  }

  return (
    <section className="panel lab">
      <h3>Lab: Bigram training &amp; sampling</h3>
      <button type="button" onClick={run}>Train on sample &amp; generate</button>
      <pre className="output">{out || 'Click generate after corpus loads.'}</pre>
    </section>
  )
}

function MicrogradLab() {
  const [log, setLog] = useState('')

  function run() {
    const x = new Value(2)
    const w1 = new Value(-3)
    const w2 = new Value(1)
    const b = new Value(6)
    const lines: string[] = []
    for (let step = 0; step < 30; step++) {
      const n = x.mul(w1).add(b).mul(w2)
      const loss = n.sub(new Value(1)).pow(2)
      zeroGrad(x, w1, w2, b)
      loss.backward()
      w1.data -= 0.05 * w1.grad
      w2.data -= 0.05 * w2.grad
      b.data -= 0.05 * b.grad
      if (step % 5 === 0) lines.push(`step ${step} loss=${loss.data.toFixed(4)} w1=${w1.data.toFixed(3)}`)
    }
    setLog(lines.join('\n'))
  }

  return (
    <section className="panel lab">
      <h3>Lab: Micrograd scalar descent</h3>
      <button type="button" onClick={run}>Run 30 steps</button>
      <pre className="output">{log}</pre>
    </section>
  )
}

function BpeLab() {
  const [summary, setSummary] = useState('')

  async function run() {
    const text = await fetch(SAMPLE_URL).then((r) => r.text())
    const { vocab, mergeRules } = trainBpe(text, 12)
    setSummary(`Vocab size ${vocab.length}, merges: ${mergeRules.map((m) => m.join('+')).join(', ')}`)
  }

  return (
    <section className="panel lab">
      <h3>Lab: BPE merges</h3>
      <button type="button" onClick={run}>Train 12 merges</button>
      <pre className="output">{summary}</pre>
    </section>
  )
}

function AttentionLab() {
  const [weights, setWeights] = useState('')

  function run() {
    const T = 4
    const d = 3
    const Q = randomMatrix(T, d)
    const K = randomMatrix(T, d)
    const V = randomMatrix(T, d)
    causalAttention(Q, K, V)
    const row = []
    for (let i = 0; i < T; i++) {
      const scores = []
      for (let j = 0; j < T; j++) {
        let dot = 0
        for (let k = 0; k < d; k++) dot += Q[i][k] * K[j][k]
        scores.push(j > i ? 0 : Math.exp(dot))
      }
      const sum = scores.reduce((a, b) => a + b, 0) || 1
      row.push(scores.map((s) => (s / sum).toFixed(2)).join(' '))
    }
    setWeights(row.map((r, i) => `pos ${i}: ${r}`).join('\n'))
  }

  return (
    <section className="panel lab">
      <h3>Lab: Causal attention weights</h3>
      <button type="button" onClick={run}>Sample 4×4 head</button>
      <pre className="output">{weights}</pre>
    </section>
  )
}

function DatasetLab() {
  const [info, setInfo] = useState('')

  async function run() {
    const text = await fetch(SAMPLE_URL).then((r) => r.text())
    const lines = text.split('\n').filter((l) => l.trim())
    setInfo(`${lines.length} paragraphs, ${text.length} chars, ~${text.split(/\s+/).length} words`)
  }

  return (
    <section className="panel lab">
      <h3>Lab: TinyStories sample loader</h3>
      <button type="button" onClick={run}>Load static shard</button>
      <pre className="output">{info}</pre>
    </section>
  )
}

function DeviceLab() {
  const [msg, setMsg] = useState('')

  async function run() {
    const nav = navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }
    if (!nav.gpu) {
      setMsg('WebGPU not available — CPU labs still valid (CUDA analogue).')
      return
    }
    const adapter = await nav.gpu.requestAdapter()
    setMsg(adapter ? 'WebGPU adapter ready for accelerated matmul (chapter 8).' : 'WebGPU blocked.')
  }

  return (
    <section className="panel lab">
      <h3>Lab: Device probe</h3>
      <button type="button" onClick={run}>Detect WebGPU</button>
      <pre className="output">{msg}</pre>
    </section>
  )
}

function WorkersLab() {
  const [msg, setMsg] = useState('')

  function run() {
    const workers = 2
    const chunk = 50
    let done = 0
    const grads = new Float32Array(chunk)
    for (let w = 0; w < workers; w++) {
      const worker = new Worker(
        URL.createObjectURL(
          new Blob(
            [
              `self.onmessage = (e) => {
                const { start, end, seed } = e.data;
                const out = new Float32Array(end - start);
                for (let i = start; i < end; i++) out[i - start] = (i * seed) % 7;
                self.postMessage(out, [out.buffer]);
              };`,
            ],
            { type: 'application/javascript' },
          ),
        ),
      )
      const start = w * (chunk / workers)
      const end = start + chunk / workers
      worker.onmessage = (e: MessageEvent<Float32Array>) => {
        grads.set(e.data, start)
        done++
        worker.terminate()
        if (done === workers) setMsg(`Averaged pseudo-gradients from ${workers} workers: sum=${[...grads].reduce((a, b) => a + b, 0)}`)
      }
      worker.postMessage({ start, end, seed: w + 1 })
    }
  }

  return (
    <section className="panel lab">
      <h3>Lab: Worker all-reduce toy</h3>
      <button type="button" onClick={run}>Simulate DDP</button>
      <pre className="output">{msg}</pre>
    </section>
  )
}

function KVCacheLab() {
  const [msg, setMsg] = useState('')

  function run() {
    const len = 64
    const t0 = performance.now()
    let acc = 0
    for (let t = 1; t <= len; t++) for (let i = 0; i < t; i++) acc += i
    const naive = performance.now() - t0
    const t1 = performance.now()
    acc = 0
    let sum = 0
    for (let t = 1; t <= len; t++) {
      sum += t - 1
      acc += sum
    }
    const cached = performance.now() - t1
    setMsg(`Naive O(T²) loop ${naive.toFixed(2)}ms vs incremental ${cached.toFixed(2)}ms (toy proxy for KV-cache savings).`)
  }

  return (
    <section className="panel lab">
      <h3>Lab: KV-cache complexity demo</h3>
      <button type="button" onClick={run}>Benchmark</button>
      <pre className="output">{msg}</pre>
    </section>
  )
}

function QuantLab() {
  const [msg, setMsg] = useState('')

  function run() {
    const w = Float32Array.from({ length: 8 }, (_, i) => (i - 4) * 0.25)
    const scale = Math.max(...w.map(Math.abs)) / 127
    const q = w.map((x) => Math.round(x / scale))
    const err = w.map((x, i) => Math.abs(x - q[i] * scale))
    setMsg(`scale=${scale.toFixed(4)}\nquant=${q.join(',')}\nmax err=${Math.max(...err).toFixed(4)}`)
  }

  return (
    <section className="panel lab">
      <h3>Lab: INT8 quantize vector</h3>
      <button type="button" onClick={run}>Quantize</button>
      <pre className="output">{msg}</pre>
    </section>
  )
}

function OptimizerLab() {
  const [path, setPath] = useState('')

  function run() {
    let x = 4
    let y = 2
    const pts: string[] = []
    for (let i = 0; i < 25; i++) {
      const gx = 2 * x
      const gy = 20 * y
      x -= 0.08 * gx
      y -= 0.08 * gy
      pts.push(`(${x.toFixed(2)}, ${y.toFixed(2)})`)
    }
    setPath(pts.join(' → '))
  }

  return (
    <section className="panel lab">
      <h3>Lab: Adam-like GD on ill-conditioned bowl</h3>
      <button type="button" onClick={run}>Step</button>
      <pre className="output">{path}</pre>
    </section>
  )
}

function PrecisionLab() {
  const [msg, setMsg] = useState('')

  function run() {
    const x = 1.0001
    const y = x
    let acc = 0
    for (let i = 0; i < 1e6; i++) acc += y
    const round16 = (v: number) => {
      const buffer = new Float32Array(1)
      buffer[0] = v
      return buffer[0]
    }
    setMsg(`fp32 sum drift sample: ${acc}\nfp32 rounded constant: ${round16(x)}`)
  }

  return (
    <section className="panel lab">
      <h3>Lab: Precision rounding</h3>
      <button type="button" onClick={run}>Demonstrate</button>
      <pre className="output">{msg}</pre>
    </section>
  )
}

function SftPromptLab() {
  const template = `System: You are a TinyStories story assistant.
User: Continue with a gentle moral about sharing.
Assistant:`
  return (
    <section className="panel lab">
      <h3>Lab: SFT chat template</h3>
      <pre className="output">{template}</pre>
      <p className="muted">Copy into Storyteller or search assist to critique formatting.</p>
    </section>
  )
}

function DpoPromptLab() {
  return (
    <section className="panel lab">
      <h3>Lab: Preference pair</h3>
      <p><strong>Chosen:</strong> The friends shared the last cookie and laughed.</p>
      <p><strong>Rejected:</strong> The friends fought and went home angry.</p>
      <p className="muted">Export pairs as JSON for offline DPO training discussions via search AI.</p>
    </section>
  )
}

function MultimodalLab() {
  return (
    <section className="panel lab">
      <h3>Lab: Illustration prompt</h3>
      <p>Child-friendly watercolor: a fox and rabbit beside a mushroom, TinyStories style.</p>
      <p className="muted">Open image-capable search with this line in the Storyteller multimodal flow.</p>
    </section>
  )
}

function MlpNote() {
  return (
    <section className="panel lab">
      <h3>Lab: MLP language model</h3>
      <p className="muted">
        Full MLP LM training mirrors chapter 3 code in the reader; combine embeddings lab from micrograd with
        next-char labels. For long runs, export weights and discuss results via search assist.
      </p>
    </section>
  )
}
