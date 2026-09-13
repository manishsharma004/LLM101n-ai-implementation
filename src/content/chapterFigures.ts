import type { ChapterFigure } from './types'

/** Key: `${chapterId}/${partId}` */
export const partFigures: Record<string, ChapterFigure[]> = {
  'ch01/what-is-lm': [
    {
      type: 'math',
      caption: 'Average NLL and perplexity',
      latex: String.raw`\mathrm{NLL} = -\frac{1}{N}\sum_{i=1}^{N} \log p(x_i \mid x_{i-1}), \quad \mathrm{PPL} = \exp(\mathrm{NLL})`,
    },
    {
      type: 'math',
      caption: 'Next-token objective (one step)',
      latex: String.raw`P(x_t \mid x_{<t}) \approx P(x_t \mid x_{t-1}) \quad\text{(bigram approximation)}`,
    },
    {
      type: 'mermaid',
      caption: 'Bigram as a Markov chain (memory = 1 symbol)',
      source: `flowchart LR
  x0["x_{t-1}"] --> M["P(·|x_{t-1})"]
  M --> x1["x_t"]`,
    },
  ],
  'ch01/counts': [
    {
      type: 'math',
      caption: 'Smoothed conditional probability',
      latex: String.raw`\hat P(b \mid a) = \frac{C(a,b) + \alpha}{\sum_{b'} C(a,b') + \alpha |V|}`,
    },
    {
      type: 'bar',
      caption: 'Illustrative row after context "e" (counts + α=1)',
      yLabel: 'P(·|e)',
      labels: ['r', 's', 'x', '…'],
      values: [0.42, 0.28, 0.08, 0.22],
    },
  ],
  'ch01/sample': [
    {
      type: 'math',
      caption: 'Temperature-scaled sampling',
      latex: String.raw`P_T(i) = \frac{\exp(\log p_i / T)}{\sum_j \exp(\log p_j / T)}`,
    },
    {
      type: 'line',
      caption: 'Effect of temperature on entropy (toy 4-way distribution)',
      xLabel: 'T',
      yLabel: 'H (bits)',
      series: [
        {
          name: 'entropy',
          points: [
            { x: 0.3, y: 0.2 },
            { x: 0.6, y: 0.9 },
            { x: 1, y: 1.52 },
            { x: 1.5, y: 1.85 },
            { x: 2.5, y: 1.98 },
          ],
        },
      ],
    },
  ],
  'ch02/graph': [
    {
      type: 'math',
      caption: 'Chain rule on a scalar loss',
      latex: String.raw`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\frac{\partial y}{\partial x}`,
    },
    {
      type: 'mermaid',
      caption: 'Computation graph for y = w·x + b',
      source: `flowchart BT
  w --> mul["×"]
  x --> mul
  mul --> add["+"]
  b --> add
  add --> y
  y --> L["loss"]`,
    },
  ],
  'ch02/train-loop': [
    {
      type: 'math',
      caption: 'SGD update',
      latex: String.raw`w \leftarrow w - \eta \frac{\partial L}{\partial w}`,
    },
    {
      type: 'line',
      caption: 'MSE vs step (qualitative)',
      yLabel: 'loss',
      series: [
        {
          name: 'η too large',
          color: '#f87171',
          points: [
            { x: 0, y: 2.2 },
            { x: 1, y: 1.1 },
            { x: 2, y: 3.5 },
            { x: 3, y: 8 },
          ],
        },
        {
          name: 'η well-tuned',
          color: '#6ee7b7',
          points: [
            { x: 0, y: 2.2 },
            { x: 1, y: 0.9 },
            { x: 2, y: 0.35 },
            { x: 3, y: 0.12 },
          ],
        },
      ],
    },
  ],
  'ch02/bridge': [
    {
      type: 'math',
      caption: 'Neural conditional vs counting',
      latex: String.raw`P(x_t \mid x_{t-1}) = \mathrm{softmax}(W h_{t-1})_{x_t}`,
    },
  ],
  'ch03/embed': [
    {
      type: 'math',
      caption: 'Embedding lookup',
      latex: String.raw`h_t = E[x_t] \in \mathbb{R}^{d}`,
    },
  ],
  'ch03/matmul': [
    {
      type: 'math',
      caption: 'GELU (GPT-style)',
      latex: String.raw`\mathrm{GELU}(x) = x\,\Phi(x) \approx 0.5x\left(1 + \tanh\left(\sqrt{2/\pi}\,(x + 0.044715 x^3)\right)\right)`,
    },
    {
      type: 'mermaid',
      caption: 'Char MLP language model head',
      source: `flowchart LR
  ctx["context ids"] --> emb["embed"]
  emb --> cat["concat"]
  cat --> lin1["Linear"]
  lin1 --> gelu["GELU"]
  gelu --> lin2["Linear"]
  lin2 --> sm["softmax"]
  sm --> next["next char"]`,
    },
  ],
  'ch03/train-chars': [
    {
      type: 'math',
      caption: 'Cross-entropy loss',
      latex: String.raw`L = -\log p_\theta(x_{t} \mid x_{t-C:t-1})`,
    },
  ],
  'ch04/qkv': [
    {
      type: 'math',
      caption: 'Scaled dot-product attention (one head)',
      latex: String.raw`\mathrm{Attention}(Q,K,V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}} + M\right)V`,
    },
  ],
  'ch04/positions': [
    {
      type: 'math',
      caption: 'GPT-2 style input to the stack',
      latex: String.raw`h_0 = W_E x + W_P \mathrm{pos}`,
    },
  ],
  'ch04/viz': [
    {
      type: 'heatmap',
      caption: 'Example causal attention weights (T=4)',
      rowLabels: ['q0', 'q1', 'q2', 'q3'],
      colLabels: ['k0', 'k1', 'k2', 'k3'],
      values: [
        [1, 0, 0, 0],
        [0.5, 0.5, 0, 0],
        [0.2, 0.3, 0.5, 0],
        [0.1, 0.2, 0.3, 0.4],
      ],
    },
  ],
  'ch05/block': [
    {
      type: 'mermaid',
      caption: 'Decoder block (pre-norm variant)',
      source: `flowchart TB
  x --> n1["LayerNorm"]
  n1 --> attn["Masked MHA"]
  attn --> r1["+"]
  x --> r1
  r1 --> n2["LayerNorm"]
  n2 --> mlp["MLP 4d"]
  mlp --> r2["+"]
  r1 --> r2
  r2 --> out["h"]`,
    },
  ],
  'ch05/gpt2-map': [
    {
      type: 'math',
      caption: 'Parameter scaling (order of magnitude)',
      latex: String.raw`|\theta| \sim L \cdot (12 d^2) + 2 V d \quad\text{(embed + blocks + lm\_head tie)}`,
    },
  ],
  'ch05/modern': [
    {
      type: 'mermaid',
      caption: 'GPT-2 vs Llama block (conceptual)',
      source: `flowchart LR
  subgraph GPT2["GPT-2"]
    A1["Learned pos"] --> A2["LayerNorm + GELU MLP"]
  end
  subgraph Llama["Llama-class"]
    B1["RoPE"] --> B2["RMSNorm + SwiGLU"]
  end`,
    },
  ],
  'ch05/toy-train': [
    {
      type: 'line',
      caption: 'Typical train loss curve (teacher forcing)',
      yLabel: 'loss',
      series: [
        {
          name: 'CE',
          points: [
            { x: 0, y: 4.2 },
            { x: 100, y: 3.1 },
            { x: 300, y: 2.4 },
            { x: 600, y: 2.0 },
            { x: 1000, y: 1.85 },
          ],
        },
      ],
    },
  ],
  'ch06/motivation': [
    {
      type: 'math',
      caption: 'Compression ratio',
      latex: String.raw`\text{chars/token} = \frac{\text{characters}}{\text{tokens}}`,
    },
  ],
  'ch06/train-merge': [
    {
      type: 'mermaid',
      caption: 'BPE merge loop',
      source: `flowchart TD
  start["tokenize to chars/bytes"] --> count["count pairs"]
  count --> pick["argmax pair"]
  pick --> merge["merge globally"]
  merge --> stop{"K merges?"}
  stop -->|no| count
  stop -->|yes| done["store merge ranks"]`,
    },
  ],
  'ch06/unicode': [
    {
      type: 'math',
      caption: 'UTF-8 byte sequence',
      latex: String.raw`\text{emoji} \rightarrow [b_1, b_2, \ldots, b_k],\quad b_i \in \{0,\ldots,255\}`,
    },
  ],
  'ch07/init': [
    {
      type: 'math',
      caption: 'Fan-in scaling (He-style intuition)',
      latex: String.raw`W \sim \mathcal{N}\left(0, \frac{2}{n_{\text{in}}}\right)`,
    },
  ],
  'ch07/adamw': [
    {
      type: 'math',
      caption: 'AdamW update (schematic)',
      latex: String.raw`\theta_t \leftarrow \theta_{t-1} - \eta \frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon} - \eta \lambda \theta_{t-1}`,
    },
  ],
  'ch07/schedule': [
    {
      type: 'line',
      caption: 'Warmup + cosine learning rate',
      yLabel: 'lr',
      series: [
        {
          name: 'schedule',
          points: [
            { x: 0, y: 0 },
            { x: 0.1, y: 1 },
            { x: 0.5, y: 0.7 },
            { x: 1, y: 0.1 },
          ],
        },
      ],
    },
  ],
  'ch08/cpu': [
    {
      type: 'math',
      caption: 'Matmul FLOPs',
      latex: String.raw`2 m n k \text{ FLOPs for } (m\times k)\cdot(k\times n)`,
    },
  ],
  'ch08/webgpu': [
    {
      type: 'mermaid',
      caption: 'Host ↔ GPU buffer flow',
      source: `sequenceDiagram
  participant CPU
  participant GPU
  CPU->>GPU: upload buffers
  GPU->>GPU: compute shader matmul
  GPU->>CPU: readback (optional)`,
    },
  ],
  'ch08/cuda-map': [
    {
      type: 'bar',
      caption: 'When GPU wins (illustrative)',
      yLabel: 'relative speedup',
      labels: ['8²', '64²', '1024²'],
      values: [0.3, 1.2, 18],
    },
  ],
  'ch09/formats': [
    {
      type: 'math',
      caption: 'fp16 vs bf16 (conceptual)',
      latex: String.raw`\text{fp16: 1 sign, 5 exp, 10 mantissa} \quad \text{bf16: 1 sign, 8 exp, 7 mantissa}`,
    },
  ],
  'ch09/mixed': [
    {
      type: 'mermaid',
      caption: 'Mixed precision training',
      source: `flowchart LR
  fp32["master weights"] --> cast["cast"]
  cast --> fwd["forward fp16/bf16"]
  fwd --> loss["loss"]
  loss --> scale["loss scale"]
  scale --> bwd["backward"]
  bwd --> step["optimizer fp32"]`,
    },
  ],
  'ch09/browser': [
    {
      type: 'line',
      caption: 'fp32 accumulation drift (concept)',
      yLabel: 'sum',
      series: [
        {
          name: 'actual',
          points: [
            { x: 0, y: 0 },
            { x: 250, y: 250025 },
            { x: 500, y: 500050 },
            { x: 750, y: 750075 },
            { x: 1000, y: 1000100 },
          ],
        },
        {
          name: 'exact',
          color: '#93c5fd',
          points: [
            { x: 0, y: 0 },
            { x: 1000, y: 1000100 },
          ],
        },
      ],
    },
  ],
  'ch10/ddp': [
    {
      type: 'mermaid',
      caption: 'Data parallel training step',
      source: `flowchart TB
  shard1["GPU0 batch"] --> g1["grad g0"]
  shard2["GPU1 batch"] --> g2["grad g1"]
  g1 --> ar["all-reduce mean"]
  g2 --> ar
  ar --> opt["optimizer step"]`,
    },
  ],
  'ch10/zero': [
    {
      type: 'math',
      caption: 'ZeRO shards optimizer states',
      latex: String.raw`|\text{state}|_{\text{per rank}} \approx \frac{|\text{state}|_{\text{total}}}{N}`,
    },
  ],
  'ch10/honesty': [
    {
      type: 'bar',
      caption: 'What the Worker lab simulates vs production',
      labels: ['grad sum', 'bandwidth', 'fault tol'],
      values: [1, 0.15, 0.05],
      color: '#93c5fd',
    },
  ],
  'ch11/tinystories': [
    {
      type: 'mermaid',
      caption: 'Train / validation split by story',
      source: `flowchart LR
  corpus["corpus"] --> train["85% stories"]
  corpus --> val["15% stories"]
  val --> ppl["perplexity / NLL"]`,
    },
  ],
  'ch11/loader': [
    {
      type: 'math',
      caption: 'Padded batch shape',
      latex: String.raw`X \in \mathbb{R}^{B \times T},\quad M_{ij}=0 \text{ if pad}`,
    },
  ],
  'ch11/synthetic': [
    {
      type: 'bar',
      caption: 'Risk: synthetic leakage into eval',
      labels: ['train', 'leaked eval'],
      values: [0.9, 0.35],
      color: '#fbbf24',
    },
  ],
  'ch12/naive': [
    {
      type: 'math',
      caption: 'Attention cost per new token',
      latex: String.raw`O(T) \text{ with cache} \quad\text{vs}\quad O(T^2) \text{ recompute-all}`,
    },
  ],
  'ch12/memory': [
    {
      type: 'line',
      caption: 'KV cache bytes vs sequence length (linear)',
      xLabel: 'T',
      yLabel: 'bytes (rel.)',
      series: [
        {
          name: 'KV cache',
          points: [
            { x: 0, y: 0 },
            { x: 512, y: 1 },
            { x: 1024, y: 2 },
            { x: 2048, y: 4 },
            { x: 4096, y: 8 },
          ],
        },
      ],
    },
  ],
  'ch13/linear': [
    {
      type: 'math',
      caption: 'Affine int8 quantization',
      latex: String.raw`q = \mathrm{round}(w/s),\quad \hat w = s\cdot q`,
    },
  ],
  'ch13/quality': [
    {
      type: 'bar',
      caption: 'Illustrative perplexity change after quant',
      labels: ['fp32', 'int8'],
      values: [12.4, 12.9],
    },
  ],
  'ch14/chat-format': [
    {
      type: 'math',
      caption: 'SFT loss mask',
      latex: String.raw`L = -\sum_{t \in \text{assistant}} \log p_\theta(x_t \mid x_{<t})`,
    },
  ],
  'ch14/lora': [
    {
      type: 'math',
      caption: 'LoRA low-rank update',
      latex: String.raw`W' = W + \frac{\alpha}{r} B A,\quad B\in\mathbb{R}^{m\times r},\ A\in\mathbb{R}^{r\times n}`,
    },
    {
      type: 'mermaid',
      caption: 'Frozen base + trainable adapters',
      source: `flowchart LR
  x --> W["W frozen"]
  x --> BA["B·A trainable"]
  W --> add["+"]
  BA --> add
  add --> y`,
    },
  ],
  'ch14/search-sft': [
    {
      type: 'mermaid',
      caption: 'Format-only lab vs real SFT',
      source: `flowchart TB
  template["chat template string"] --> search["search assist critique"]
  pairs["thousands of (prompt, response)"] --> gpu["GPU SFT / LoRA"]`,
    },
  ],
  'ch15/rlhf': [
    {
      type: 'mermaid',
      caption: 'RLHF pipeline',
      source: `flowchart LR
  SFT["SFT model"] --> RM["reward model"]
  RM --> PPO["PPO / policy opt"]
  PPO --> aligned["aligned model"]`,
    },
  ],
  'ch15/dpo': [
    {
      type: 'math',
      caption: 'Preference pair (notation)',
      latex: String.raw`(x, y_w, y_l) \quad y_w \succ y_l`,
    },
  ],
  'ch15/ui': [
    {
      type: 'bar',
      caption: 'Human eval: win-rate between two continuations',
      labels: ['A wins', 'tie', 'B wins'],
      values: [0.55, 0.1, 0.35],
    },
  ],
  'ch16/static': [
    {
      type: 'mermaid',
      caption: 'Static deploy path',
      source: `flowchart LR
  git["git push"] --> ci["CI build"]
  ci --> pages["GitHub Pages"]
  pages --> user["browser SPA"]`,
    },
  ],
  'ch16/api-shape': [
    {
      type: 'math',
      caption: 'Chat completion request (conceptual)',
      latex: String.raw`\texttt{messages} = [(role, content), \ldots]`,
    },
  ],
  'ch16/storage': [
    {
      type: 'mermaid',
      caption: 'Client-side artifacts',
      source: `flowchart TB
  idb["IndexedDB"] --> ckpt["checkpoints"]
  idb --> tok["tokenizer merges"]
  ls["localStorage"] --> prog["chapter progress JSON"]`,
    },
  ],
  'ch17/vq': [
    {
      type: 'math',
      caption: 'VQ codebook assignment',
      latex: String.raw`z = \arg\min_{k} \| e - c_k \|^2`,
    },
  ],
  'ch17/diffusion': [
    {
      type: 'math',
      caption: 'Forward noising (schematic)',
      latex: String.raw`q(x_t \mid x_{t-1}) = \mathcal{N}(\sqrt{1-\beta_t}\,x_{t-1}, \beta_t I)`,
    },
  ],
  'ch17/illustrate': [
    {
      type: 'mermaid',
      caption: 'Story → illustration via search assist',
      source: `flowchart LR
  story["story text"] --> prompt["illustration prompt"]
  prompt --> search["image-capable search tab"]`,
    },
  ],
}

export const appendixFigures: Record<string, ChapterFigure[]> = {
  tensors: [
    {
      type: 'math',
      caption: 'Batched attention shape',
      latex: String.raw`\mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d}}\right)V,\quad Q\in\mathbb{R}^{B\times H\times T\times d}`,
    },
  ],
  architectures: [
    {
      type: 'mermaid',
      caption: 'MoE router (one layer)',
      source: `flowchart LR
  x --> router["top-k gate"]
  router --> e1["expert 1"]
  router --> e2["expert 2"]
  e1 --> sum["weighted sum"]
  e2 --> sum`,
    },
  ],
  frameworks: [
    {
      type: 'mermaid',
      caption: 'Where PyTorch sits',
      source: `flowchart TB
  you["your forward/loss"] --> autograd["autograd"]
  autograd --> kernels["CUDA / CPU kernels"]`,
    },
  ],
}

export function figuresForPart(chapterId: string, partId: string): ChapterFigure[] {
  return partFigures[`${chapterId}/${partId}`] ?? []
}
