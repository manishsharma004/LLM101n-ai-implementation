/**
 * Six-phase learning plan aligned with Karpathy’s video series + this browser Storyteller course.
 * Eleven primary external resources, mapped to in-app chapters and labs.
 */

export type RoadmapStep = {
  id: string
  title: string
  bullets: string[]
  /** In-app chapter slugs (this repo) */
  chapterSlugs?: string[]
  labHints?: string[]
}

export type RoadmapResource = {
  id: string
  title: string
  kind: 'video' | 'repo' | 'course'
  url: string
  author?: string
}

export type RoadmapPhase = {
  id: string
  number: number
  title: string
  summary: string
  primaryResourceIds: string[]
  steps: RoadmapStep[]
}

export const roadmapResources: RoadmapResource[] = [
  {
    id: 'micrograd',
    title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=VMj-3S1tuzw',
    author: 'Andrej Karpathy',
  },
  {
    id: 'makemore-1',
    title: 'The spelled-out intro to language modeling: building makemore',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=PaCmpygFfXo',
    author: 'Andrej Karpathy',
  },
  {
    id: 'makemore-2',
    title: 'Building makemore Part 2: MLP',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=TCH_1BhywMo',
    author: 'Andrej Karpathy',
  },
  {
    id: 'makemore-3',
    title: 'Building makemore Part 3: Activations & Gradients, BatchNorm',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=P6sfmUTpU3M',
    author: 'Andrej Karpathy',
  },
  {
    id: 'makemore-5',
    title: 'Building makemore Part 5: Building a WaveNet',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=q8SA5iVr3K4',
    author: 'Andrej Karpathy',
  },
  {
    id: 'gpt-tokenizer',
    title: "Let's build the GPT Tokenizer",
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=zduSFxRajkE',
    author: 'Andrej Karpathy',
  },
  {
    id: 'nano-gpt',
    title: "Let's build GPT: from scratch, in code, spelled out",
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    author: 'Andrej Karpathy',
  },
  {
    id: 'llm101n-browser',
    title: 'LLM101n — Build a Storyteller (browser labs)',
    kind: 'course',
    url: 'https://manishsharma004.github.io/LLM101n-ai-implementation/',
    author: 'This course',
  },
  {
    id: 'gpt2-repro',
    title: "Let's reproduce GPT-2 (124M)",
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=l8pRSu1IkgA',
    author: 'Andrej Karpathy',
  },
  {
    id: 'state-of-gpt',
    title: 'State of GPT | BRK216HFS',
    kind: 'video',
    url: 'https://www.youtube.com/watch?v=bZQun8Y4L2A',
    author: 'Andrej Karpathy',
  },
  {
    id: 'makemore-repo',
    title: 'makemore (names.txt, training scripts)',
    kind: 'repo',
    url: 'https://github.com/karpathy/makemore',
    author: 'Andrej Karpathy',
  },
]

export const learningPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Foundations of Neural Networks & Autograd',
    summary:
      'Build intuition for expression graphs, local derivatives, and gradient descent before touching language data.',
    primaryResourceIds: ['micrograd'],
    steps: [
      {
        id: 'p1-scalar',
        title: 'Scalar operations & expression graphs',
        bullets: [
          'Implement a scalar autograd engine (micrograd): Value objects, parents, and op local gradients.',
          'Run forward passes and manual backprop with the chain rule until ∂L/∂w is obvious.',
        ],
        chapterSlugs: ['micrograd'],
        labHints: ['micrograd Pyodide lab — edit hyperparameters and re-run'],
      },
      {
        id: 'p1-mlp',
        title: 'Building & training neurons',
        bullets: [
          'Stack inputs, weights, bias, and tanh into neurons and MLPs.',
          'Minimize MSE with gradient descent; watch learning rate effects.',
        ],
        chapterSlugs: ['micrograd'],
      },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Language Modeling Fundamentals & Bigrams',
    summary:
      'Count-based and neural bigrams on character data; NLL and sampling tie directly to Storyteller text.',
    primaryResourceIds: ['makemore-1', 'makemore-repo'],
    steps: [
      {
        id: 'p2-count',
        title: 'Counting-based language models',
        bullets: [
          'Use character-level corpora (names.txt / TinyStories shard).',
          'Count co-occurrences → row-normalize → sample with multinomial / temperature.',
          'Track quality with NLL and perplexity (eval lab).',
        ],
        chapterSlugs: ['bigram-language-model', 'datasets'],
        labHints: ['bigram', 'eval', 'dataset'],
      },
      {
        id: 'p2-neural-bigram',
        title: 'Bigram as a neural network',
        bullets: [
          'One-hot inputs, linear layer, softmax; cross-entropy matches counting at optimum.',
          'Train with gradients; compare learned probs to explicit counts.',
        ],
        chapterSlugs: ['bigram-language-model', 'ngram-mlp'],
        labHints: ['mlp'],
      },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Deepening Context & Architectural Enhancements',
    summary: 'MLP context windows, initialization, BatchNorm, and hierarchical WaveNet-style fusion.',
    primaryResourceIds: ['makemore-2', 'makemore-3', 'makemore-5'],
    steps: [
      {
        id: 'p3-mlp',
        title: 'Context expansion via MLPs',
        bullets: [
          'Multi-character windows (Bengio et al.); embedding table C; tanh hidden; softmax head.',
          'Prefer view/reshape over huge concatenations in PyTorch; 80/10/10 splits for generalization.',
        ],
        chapterSlugs: ['ngram-mlp', 'datasets'],
        labHints: ['mlp', 'eval'],
      },
      {
        id: 'p3-bn',
        title: 'Initialization & batch normalization',
        bullets: [
          'Fix confidently wrong initial losses and saturated tanh (dead neurons).',
          'Kaiming init ∝ 1/√fan_in; BatchNorm on pre-activations; running stats at eval.',
        ],
        chapterSlugs: ['optimization', 'ngram-mlp'],
        labHints: ['optimizer'],
      },
      {
        id: 'p3-wavenet',
        title: 'Hierarchical modeling (WaveNet)',
        bullets: [
          'Wider context via tree-like fusion (flatten_consecutive): pairs → 4-grams → deeper reps.',
          'Refactor into Sequential / Linear / BatchNorm1d modules.',
        ],
        chapterSlugs: ['ngram-mlp', 'transformer'],
      },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Tokenization & Byte Pair Encoding (BPE)',
    summary: 'Bytes vs Unicode vs subwords; build and compare to GPT-2 / cl100k tokenizers.',
    primaryResourceIds: ['gpt-tokenizer'],
    steps: [
      {
        id: 'p4-why',
        title: 'Why tokenize beyond bytes',
        bullets: [
          'Context length is measured in tokens; compression vs rare-character coverage trade-offs.',
          'UTF-8 byte streams vs code points in production pipelines.',
        ],
        chapterSlugs: ['tokenization'],
      },
      {
        id: 'p4-bpe',
        title: 'Implementing BPE',
        bullets: [
          'Merge frequent byte pairs; store merge rank; encode/decode round-trip.',
          'Study regex pretokenization and special tokens (<|endoftext|>).',
        ],
        chapterSlugs: ['tokenization'],
        labHints: ['bpe'],
      },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Building Transformers & GPT Models',
    summary: 'Attention, GPT blocks, training loops, and Storyteller multimodal extensions.',
    primaryResourceIds: ['nano-gpt', 'llm101n-browser'],
    steps: [
      {
        id: 'p5-attn',
        title: 'Self-attention mechanics',
        bullets: [
          'Build Q, K, V; scaled dot-product attention; causal lower-triangular mask.',
          'Read attention heatmaps; connect to autoregressive decoding.',
        ],
        chapterSlugs: ['attention', 'kv-cache'],
        labHints: ['attention', 'kvcache'],
      },
      {
        id: 'p5-gpt',
        title: 'GPT architecture assembly',
        bullets: [
          'Multi-head attention, residuals, pre-LayerNorm, FFN MLP blocks.',
          'Train character or subword GPT on tiny Shakespeare / TinyStories shard.',
        ],
        chapterSlugs: ['transformer', 'tokenization', 'optimization'],
        labHints: ['mlp', 'attention'],
      },
      {
        id: 'p5-mm',
        title: 'Multimodal extensions',
        bullets: [
          'VQ-VAE codebooks; diffusion transformers (DiT) for illustration workflows.',
          'Use search-assist for image prompts; keep text authoritative in Storyteller.',
        ],
        chapterSlugs: ['multimodal'],
        labHints: ['multimodal', 'storyteller'],
      },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'High-Performance Scaling & Modern Training Pipelines',
    summary: 'Mixed precision, compile, FlashAttention, DDP, and the full pretrain → SFT → RLHF lifecycle.',
    primaryResourceIds: ['gpt2-repro', 'state-of-gpt'],
    steps: [
      {
        id: 'p6-kernels',
        title: 'System & kernel optimizations',
        bullets: [
          'TF32, bfloat16, torch.compile, FlashAttention; pad vocab to friendly multiples (e.g. 50304).',
        ],
        chapterSlugs: ['device', 'precision'],
        labHints: ['device', 'precision'],
      },
      {
        id: 'p6-optim',
        title: 'Optimization standards & multi-GPU',
        bullets: [
          'AdamW (β₁=0.9, β₂=0.95), weight decay on 2D weights, grad clip 1.0, cosine + warmup.',
          'DDP + gradient accumulation for effective global batch size (Worker lab = toy all-reduce).',
        ],
        chapterSlugs: ['optimization', 'distributed'],
        labHints: ['optimizer', 'workers'],
      },
      {
        id: 'p6-lifecycle',
        title: 'Full LLM lifecycle',
        bullets: [
          'Pretrain → SFT → reward model → RLHF/PPO; DPO as offline preference optimization.',
          'Deploy: static Storyteller app, API shapes, client storage of checkpoints.',
        ],
        chapterSlugs: ['finetuning-sft', 'finetuning-rl', 'deployment', 'quantization'],
        labHints: ['lora', 'sft-prompt', 'dpo-prompt', 'quantize'],
      },
    ],
  },
]

export function getResourceById(id: string): RoadmapResource | undefined {
  return roadmapResources.find((r) => r.id === id)
}
