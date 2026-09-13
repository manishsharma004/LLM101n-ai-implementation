import type { AppendixTopic, Chapter } from './types'

export const chapters: Chapter[] = [
  {
    id: 'ch01',
    number: 1,
    slug: 'bigram-language-model',
    title: 'Bigram Language Model',
    subtitle: 'Language modeling from counts',
    syllabusTopic: 'language modeling',
    readingTime: '35–45 min',
    premise:
      'Before transformers, language models were often just tables of probabilities. A bigram model asks: given one character (or token), what comes next? You will train counts in the browser, sample stories, and see why smoothing matters on TinyStories-style text.',
    labIds: ['bigram', 'storyteller'],
    tutorSeeds: [
      'Why is a bigram model a Markov chain with order 1?',
      'How do log probabilities help when multiplying many small numbers?',
    ],
    parts: [
      {
        id: 'what-is-lm',
        heading: 'Language modeling is next-token prediction',
        paragraphs: [
          'A language model assigns a probability distribution over continuations. Given a prefix, it outputs scores for what could come next. Training does not require labels from a human grader: the next symbol in the corpus is the target. That self-supervision is why web-scale text can train enormous models.',
          'For a Storyteller on TinyStories, the prefix might be "Once upon a". The model should favor child-friendly continuations such as "time" rather than random Unicode. A bigram model only looks at the immediately previous symbol, so it cannot remember the title or characters from earlier in the paragraph. That limitation is the motivation for longer contexts in later chapters.',
        ],
        keyTerms: [
          { term: 'language model', definition: 'A model that predicts the next token (or character) given prior context.' },
          { term: 'self-supervision', definition: 'Training targets taken from the input sequence itself.' },
        ],
        checkYourself: [
          {
            prompt: 'What is the training objective for a bigram model on characters?',
            reveal: 'Maximize the likelihood of each next character given the previous one, equivalent to cross-entropy on a vocabulary-sized softmax.',
          },
        ],
      },
      {
        id: 'counts',
        heading: 'Train by counting, then normalize rows',
        paragraphs: [
          'Scan the corpus once. For each adjacent pair (a, b), increment count[a][b]. Each row count[a][·] becomes a conditional distribution after normalization. Implementation is a sparse map or dense matrix if the alphabet is small (bytes or ASCII).',
          'Raw counts fail on unseen pairs: probability zero means infinite negative log-likelihood. Additive smoothing (e.g. +1 to every count) or backoff to unigrams keeps sampling stable. The lab lets you compare unsmoothed vs smoothed generation on a bundled TinyStories excerpt.',
        ],
        code: {
          language: 'python',
          caption: 'Bigram row normalization',
          body: `def row_probs(counts: dict[str, int], context: str, alpha: float = 1.0) -> dict[str, float]:
    vocab = set()
    for key in counts:
        a, b = key.split("|", 1)
        vocab.add(a)
        vocab.add(b)
    total = alpha * len(vocab)
    row: dict[str, float] = {}
    for key, c in counts.items():
        a, b = key.split("|", 1)
        if a != context:
            continue
        row[b] = row.get(b, 0.0) + c
        total += c
    for b in list(row):
        row[b] = (row[b] + alpha) / total
    return row`,
        },
      },
      {
        id: 'sample',
        heading: 'Sample stories by rolling the dice',
        paragraphs: [
          'Start from a seed string. Repeatedly sample the next character from the conditional distribution given the last character. Stop at max length or when you hit a chosen end symbol. Because memory is one step, output often drifts into repetitive loops ("the the the").',
          'Use the Storyteller panel with search-engine assist: your locally trained bigram can seed text, then you can ask an external AI (via Google, Duck.ai, or Perplexity) to rewrite the draft into a coherent TinyStories-style tale—without hosting inference in this app.',
        ],
        callout: {
          tone: 'tip',
          body: 'Karpathy’s course starts here so you feel generation before matrices. Keep a copy of your favorite failure modes—they make great before/after examples once attention arrives.',
        },
      },
    ],
  },
  {
    id: 'ch02',
    number: 2,
    slug: 'micrograd',
    title: 'Micrograd',
    subtitle: 'Machine learning & backpropagation',
    syllabusTopic: 'machine learning, backpropagation',
    readingTime: '45–55 min',
    premise:
      'Neural networks learn by gradient descent on a scalar loss. Micrograd implements autograd on a tiny computation graph so every backward step is visible—no PyTorch required; the browser lab runs real Python in Pyodide.',
    labIds: ['micrograd'],
    tutorSeeds: ['What is the chain rule in a computation graph?', 'Why do we need backward() in topological order?'],
    parts: [
      {
        id: 'graph',
        heading: 'Scalars, parents, and local gradients',
        paragraphs: [
          'Each value knows how it was produced (+, *, tanh, etc.) and which values contributed. During backward(), each node applies the chain rule to pass gradient to its parents. The result: ∂loss/∂w for every parameter used in the forward pass.',
          'This is exactly what larger frameworks do—only hidden behind tensors. Building it once demystifies "loss.backward()" when you reach transformers.',
        ],
        keyTerms: [
          { term: 'autograd', definition: 'Automatic differentiation that records operations for reverse-mode gradient computation.' },
          { term: 'topological order', definition: 'An ordering of nodes where every parent appears before its children.' },
        ],
      },
      {
        id: 'train-loop',
        heading: 'Fit a toy function with SGD',
        paragraphs: [
          'Pick a loss (MSE for regression). Forward → backward → update weights with learning rate η. Log loss per step in the lab chart. Watch overshoot when η is too large and stagnation when η is too small.',
          'The same loop will train embedding tables and transformer weights later; only the forward graph grows.',
        ],
        code: {
          language: 'python',
          body: `for step in range(200):
    pred = w1 * x + b
    loss = (pred - y) ** 2
    loss.backward()
    w1.data -= lr * w1.grad
    b.data -= lr * b.grad
    zero_grad(w1, b)`,
        },
      },
      {
        id: 'bridge',
        heading: 'Bridge to language modeling',
        paragraphs: [
          'A bigram could be learned by softmax + cross-entropy instead of counting, if you parameterize rows with logits. That is the bridge from tabular models to neural LMs in chapter 3.',
        ],
        callout: { tone: 'interview', body: 'Be ready to explain reverse-mode AD vs forward-mode and why deep learning prefers reverse for many parameters.' },
      },
    ],
  },
  {
    id: 'ch03',
    number: 3,
    slug: 'ngram-mlp',
    title: 'N-gram Model & MLP',
    subtitle: 'MLP, matmul, GELU',
    syllabusTopic: 'multi-layer perceptron, matmul, gelu',
    readingTime: '50–60 min',
    premise:
      'Fix a context window of previous characters, embed them, concatenate or pool, and pass through an MLP with GELU activations. This is makemore-style thinking in miniature.',
    labIds: ['mlp'],
    tutorSeeds: ['Why does GELU smooth ReLU?', 'How does context length trade off capacity vs parameters?'],
    parts: [
      {
        id: 'embed',
        heading: 'Embeddings turn symbols into vectors',
        paragraphs: [
          'Each character id maps to a learnable vector. Stacking contexts gives a fat vector fed into linear layers. The network learns features like "vowel after consonant" without hand-written rules.',
        ],
        keyTerms: [
          { term: 'embedding', definition: 'A lookup table from discrete token ids to continuous vectors.' },
          { term: 'GELU', definition: 'Gaussian Error Linear Unit; smooth nonlinearity used in GPT-family models.' },
        ],
      },
      {
        id: 'matmul',
        heading: 'Matmul is the workhorse',
        paragraphs: [
          'Linear layers are matrix multiplication plus bias. In the browser lab you implement matmul in Python (NumPy-style lists); WebGPU chapters accelerate the same shapes. Track dimensions obsessively: (batch, context·emb) @ (context·emb, vocab) for logits.',
        ],
      },
      {
        id: 'train-chars',
        heading: 'Train on a TinyStories shard',
        paragraphs: [
          'The dataset lab loads a public-domain excerpt. Cross-entropy loss trains logits for the next character. Generation improves over bigrams because multiple prior characters influence the prediction.',
        ],
      },
    ],
  },
  {
    id: 'ch04',
    number: 4,
    slug: 'attention',
    title: 'Attention',
    subtitle: 'Softmax, positional encoding',
    syllabusTopic: 'attention, softmax, positional encoder',
    readingTime: '55–65 min',
    premise: 'Attention lets every position read every other position (with causal masking for decoders). You will implement scaled dot-product attention and visualize weights.',
    labIds: ['attention'],
    tutorSeeds: ['Why divide by sqrt(d_k)?', 'What breaks if you remove positional encodings?'],
    parts: [
      {
        id: 'qkv',
        heading: 'Queries, keys, values',
        paragraphs: [
          'For each position, learn linear maps to query, key, and value vectors. Scores = QKᵀ / √d. Softmax over keys yields convex weights; weighted sum of values is the output. Causal LM masking sets forbidden positions to −∞ before softmax.',
        ],
      },
      {
        id: 'positions',
        heading: 'Positions are not in the symbols',
        paragraphs: [
          'Attention is permutation-equivariant without position info. Add sinusoidal encodings (GPT-2 style) or learned position embeddings so "cat sat" ≠ "sat cat". The lab plots position encodings for small dimensions.',
        ],
      },
      {
        id: 'viz',
        heading: 'Read the heatmap like an X-ray',
        paragraphs: [
          'Bright cells show where the model looks when predicting the next token. In early training on stories, local diagonal structure is common; later heads specialize (syntax, names).',
        ],
      },
    ],
  },
  {
    id: 'ch05',
    number: 5,
    slug: 'transformer',
    title: 'Transformer',
    subtitle: 'Residual, LayerNorm, GPT-2',
    syllabusTopic: 'transformer, residual, layernorm, GPT-2',
    readingTime: '65–80 min',
    premise: 'Stack blocks: attention → residual → LayerNorm → MLP → residual → LayerNorm. This is the GPT decoder stack you will train at toy scale in-browser.',
    labIds: ['attention', 'mlp'],
    tutorSeeds: ['Pre-norm vs post-norm?', 'Why residuals help optimization?'],
    parts: [
      {
        id: 'block',
        heading: 'A block is attention + MLP with residuals',
        paragraphs: [
          'Residual paths preserve a gradient highway. LayerNorm stabilizes activations across depth. GPT-2 uses learned position embeddings and causal multi-head attention.',
        ],
      },
      {
        id: 'gpt2-map',
        heading: 'Map syllabus to GPT-2 shapes',
        paragraphs: [
          'n_layer, n_head, n_embd, context length T. Parameters live in token embeddings, position embeddings, per-block attention projections, MLP fc layers, and final lm_head tied to embeddings (weight tying).',
        ],
      },
      {
        id: 'toy-train',
        heading: 'Toy training expectations',
        paragraphs: [
          'Full training in-tab is limited by CPU time; the course faithful path is to run few hundred steps on a micro corpus, inspect loss, then use search-assisted Storyteller for polished prose while you continue implementing inference optimizations.',
        ],
      },
    ],
  },
  {
    id: 'ch06',
    number: 6,
    slug: 'tokenization',
    title: 'Tokenization',
    subtitle: 'minBPE, byte pair encoding',
    syllabusTopic: 'minBPE, byte pair encoding',
    readingTime: '40–50 min',
    premise: 'Characters are simple but inefficient; BPE merges frequent pairs into subwords. Implement merge training and encode/decode in Python (minBPE spirit).',
    labIds: ['bpe'],
    tutorSeeds: ['Why byte-level BPE handles UTF-8?', 'How does vocab size affect compression?'],
    parts: [
      {
        id: 'motivation',
        heading: 'Compress text into a vocabulary',
        paragraphs: [
          'TinyStories repeats words like "the", "and", "little". BPE starts with bytes or characters and iteratively merges the most common adjacent pair until vocab size K is reached.',
        ],
      },
      {
        id: 'train-merge',
        heading: 'Train merges on corpus statistics',
        paragraphs: [
          'Count pairs in tokenized sequences, pick argmax, merge everywhere, repeat. Store merge rank order for deterministic encoding. The lab trains on your shard and reports compression ratio vs characters.',
        ],
      },
      {
        id: 'unicode',
        heading: 'Unicode & UTF-8 (appendix tie-in)',
        paragraphs: [
          'Byte-level BPE avoids unknown Unicode characters: every UTF-8 byte is in the base alphabet. This is how production tokenizers avoid brittle ASCII-only assumptions.',
        ],
      },
    ],
  },
  {
    id: 'ch07',
    number: 7,
    slug: 'optimization',
    title: 'Optimization',
    subtitle: 'Initialization, AdamW',
    syllabusTopic: 'initialization, optimization, AdamW',
    readingTime: '45–55 min',
    premise: 'Bad init or wrong optimizer can stall transformers. Study variance scaling init, AdamW decoupled weight decay, cosine schedule, gradient clipping.',
    labIds: ['optimizer'],
    tutorSeeds: ['Why AdamW instead of Adam+L2?', 'What does gradient clipping fix?'],
    parts: [
      {
        id: 'init',
        heading: 'Initialization sets signal scale',
        paragraphs: [
          'Too large → saturated activations; too small → vanishing signal. GPT-style init uses small normal weights scaled by depth and width.',
        ],
      },
      {
        id: 'adamw',
        heading: 'AdamW adapts per-parameter steps',
        paragraphs: [
          'Maintain first and second moment estimates of gradients; bias-correct; apply decoupled weight decay on weights only. The optimizer lab steps a 2D loss landscape so you see different trajectories vs SGD.',
        ],
      },
      {
        id: 'schedule',
        heading: 'Learning rate schedules',
        paragraphs: [
          'Warmup stabilizes early attention; cosine decay improves late fine-tuning. Log lr vs step alongside loss in the UI.',
        ],
      },
    ],
  },
  {
    id: 'ch08',
    number: 8,
    slug: 'device',
    title: 'Need for Speed I: Device',
    subtitle: 'CPU, GPU, WebGPU',
    syllabusTopic: 'device, CPU, GPU, ...',
    readingTime: '35–45 min',
    premise: 'The syllabus names CUDA; in a browser-only app, WebGPU is the honest analogue. Compare CPU matmul vs WebGPU when available.',
    labIds: ['device'],
    tutorSeeds: ['What is a command queue in WebGPU?', 'When does GPU win over CPU for small matrices?'],
    parts: [
      {
        id: 'cpu',
        heading: 'CPU baseline in Python',
        paragraphs: [
          'Nested loops or typed arrays for matmul. Good for tiny shapes and debugging numerical issues.',
        ],
      },
      {
        id: 'webgpu',
        heading: 'WebGPU as browser GPU',
        paragraphs: [
          'When `navigator.gpu` exists, dispatch compute shaders for matmul tiles. Fall back gracefully with a clear message—many learners are on laptops without WebGPU.',
        ],
      },
      {
        id: 'cuda-map',
        heading: 'Mental map to CUDA',
        paragraphs: [
          'Kernels, grids, and memory hierarchies in CUDA correspond to WGSL compute pipelines and storage buffers. The concepts transfer even if syntax differs.',
        ],
      },
    ],
  },
  {
    id: 'ch09',
    number: 9,
    slug: 'precision',
    title: 'Need for Speed II: Precision',
    subtitle: 'fp16, bf16, fp8',
    syllabusTopic: 'mixed precision training, fp16, bf16, fp8, ...',
    readingTime: '40–50 min',
    premise: 'Lower precision increases throughput if you manage dynamic range. Simulate fp16 rounding on CPU and discuss bf16/fp8 tradeoffs.',
    labIds: ['precision'],
    tutorSeeds: ['What is loss scaling in fp16 training?', 'Why bf16 is easier than fp16 on some hardware?'],
    parts: [
      {
        id: 'formats',
        heading: 'Floating point formats',
        paragraphs: [
          'fp32 is the reference. fp16 has smaller mantissa; bf16 keeps exponent range; fp8 pushes further with block scaling in hardware trends.',
        ],
      },
      {
        id: 'mixed',
        heading: 'Mixed precision training pattern',
        paragraphs: [
          'Forward/backward in lower precision where safe; master weights in fp32; loss scaling to avoid gradient underflow.',
        ],
      },
      {
        id: 'browser',
        heading: 'What browsers can do today',
        paragraphs: [
          'WebGPU shader types may expose f16 on supported devices. The lab demonstrates bitwise rounding effects on a vector so errors are visible without a datacenter GPU.',
        ],
      },
    ],
  },
  {
    id: 'ch10',
    number: 10,
    slug: 'distributed',
    title: 'Need for Speed III: Distributed',
    subtitle: 'DDP, ZeRO (conceptual)',
    syllabusTopic: 'distributed optimization, DDP, ZeRO',
    readingTime: '35–45 min',
    premise: 'True multi-node DDP is not available in a static browser tab; use Web Workers to simulate data-parallel gradient averaging at toy scale.',
    labIds: ['workers'],
    tutorSeeds: ['What is all-reduce?', 'What problem does ZeRO solve?'],
    parts: [
      {
        id: 'ddp',
        heading: 'Data parallel pattern',
        paragraphs: [
          'Each worker holds a replica, runs forward/backward on a shard, averages gradients, applies the same optimizer step. Synchronization cost dominates at small batch sizes.',
        ],
      },
      {
        id: 'zero',
        heading: 'ZeRO intuition',
        paragraphs: [
          'Shard optimizer states and parameters across ranks to save memory. In-browser demo uses two workers and a 1D parameter vector for clarity.',
        ],
      },
      {
        id: 'honesty',
        heading: 'Scope honesty',
        paragraphs: [
          'Production LLM training uses clusters; this chapter teaches the vocabulary so reading nanoGPT / PyTorch DDP docs feels familiar.',
        ],
        callout: { tone: 'note', body: 'No backend means we simulate—not reproduce—multi-GPU throughput numbers.' },
      },
    ],
  },
  {
    id: 'ch11',
    number: 11,
    slug: 'datasets',
    title: 'Datasets',
    subtitle: 'TinyStories, loaders, synthetic data',
    syllabusTopic: 'datasets, data loading, synthetic data generation',
    readingTime: '45–55 min',
    premise: 'Storyteller quality depends on data. Load TinyStories excerpts, build train/val splits, and discuss synthetic story generation.',
    labIds: ['dataset'],
    tutorSeeds: ['Why deduplicate training data?', 'What is packing for transformer batches?'],
    parts: [
      {
        id: 'tinystories',
        heading: 'TinyStories in the browser',
        paragraphs: [
          'Fetch bundled gzip shards from static hosting (no API server). Parse JSON lines, filter by length, hold out validation lines for perplexity estimates.',
        ],
      },
      {
        id: 'loader',
        heading: 'Batching variable-length stories',
        paragraphs: [
          'Pad or pack sequences to context T. Attention masks prevent pad tokens from contributing. The loader lab shows token throughput per second in JS.',
        ],
      },
      {
        id: 'synthetic',
        heading: 'Synthetic data generation',
        paragraphs: [
          'Templates + word lists can augment rare patterns. Use search-engine assist to brainstorm story prompts, then train only on text you curate locally.',
        ],
      },
    ],
  },
  {
    id: 'ch12',
    number: 12,
    slug: 'kv-cache',
    title: 'Inference I: KV-cache',
    subtitle: 'Fast autoregressive decoding',
    syllabusTopic: 'kv-cache',
    readingTime: '40–50 min',
    premise: 'Recomputing full attention over the prefix every token is wasteful. Cache keys and values per layer; append one position per step.',
    labIds: ['kvcache'],
    tutorSeeds: ['Why cache grows with context length?', 'When is prefix caching useful in chat?'],
    parts: [
      {
        id: 'naive',
        heading: 'Naive vs cached decode',
        paragraphs: [
          'Measure tokens/sec for both paths on the same tiny model. Cached should win as sequence length grows.',
        ],
      },
      {
        id: 'memory',
        heading: 'Memory tradeoff',
        paragraphs: [
          'Cache size scales O(layers · heads · dim · sequence). This is the serving cost behind long Storyteller sessions.',
        ],
      },
    ],
  },
  {
    id: 'ch13',
    number: 13,
    slug: 'quantization',
    title: 'Inference II: Quantization',
    subtitle: 'Smaller, faster weights',
    syllabusTopic: 'quantization',
    readingTime: '40–50 min',
    premise: 'Store weights in int8 (or int4 blocks), dequantize for matmul. Fit larger Storyteller checkpoints in IndexedDB.',
    labIds: ['quantize'],
    tutorSeeds: ['What is per-channel scale for int8?', 'Why quantization hurts small models more?'],
    parts: [
      {
        id: 'linear',
        heading: 'Quantize linear layers',
        paragraphs: [
          'Find max abs per row/column, scale to int8, store scale factors. Dequant on the fly during inference.',
        ],
      },
      {
        id: 'quality',
        heading: 'Quality vs size',
        paragraphs: [
          'Compare perplexity or side-by-side generation before/after quant in the lab.',
        ],
      },
    ],
  },
  {
    id: 'ch14',
    number: 14,
    slug: 'finetuning-sft',
    title: 'Finetuning I: SFT',
    subtitle: 'SFT, LoRA, chat',
    syllabusTopic: 'supervised finetuning SFT, PEFT, LoRA, chat',
    readingTime: '50–60 min',
    premise: 'Teach the model chat format with supervised examples. LoRA updates low-rank adapters instead of full weights—feasible in-browser at tiny rank.',
    labIds: ['sft-prompt', 'storyteller'],
    tutorSeeds: ['What tokens delimit chat turns?', 'Why LoRA targets attention projections?'],
    parts: [
      {
        id: 'chat-format',
        heading: 'Chat templates',
        paragraphs: [
          'Structure user/assistant turns with special tokens. SFT maximizes likelihood of assistant tokens only.',
        ],
      },
      {
        id: 'lora',
        heading: 'LoRA intuition',
        paragraphs: [
          'Freeze base weights W; learn A·B with small rank r. Forward uses W + AB. Far fewer trainable parameters for demo fine-tunes.',
        ],
      },
      {
        id: 'search-sft',
        heading: 'Practice SFT design with search assist',
        paragraphs: [
          'The lab builds an SFT prompt describing your Storyteller persona; open it in Perplexity/Google to critique example conversations—still no in-app LLM.',
        ],
      },
    ],
  },
  {
    id: 'ch15',
    number: 15,
    slug: 'finetuning-rl',
    title: 'Finetuning II: RL',
    subtitle: 'RLHF, PPO, DPO',
    syllabusTopic: 'reinforcement learning, RLHF, PPO, DPO',
    readingTime: '50–60 min',
    premise: 'Align stories to human preferences. Full PPO is heavy; prioritize DPO intuition and preference-pair exercises.',
    labIds: ['dpo-prompt'],
    tutorSeeds: ['What is a preference pair in DPO?', 'Why RLHF needs a reward model?'],
    parts: [
      {
        id: 'rlhf',
        heading: 'RLHF stack',
        paragraphs: [
          'SFT model → reward model on human rankings → policy optimization (PPO) to raise reward without drifting from language.',
        ],
      },
      {
        id: 'dpo',
        heading: 'DPO as direct preference optimization',
        paragraphs: [
          'Compare chosen vs rejected continuations with a classification-style loss on the policy; avoids explicit reward model training in some setups.',
        ],
      },
      {
        id: 'ui',
        heading: 'Preference UI in Storyteller',
        paragraphs: [
          'Pick which story continuation you prefer; export pairs as JSON for offline training scripts or discuss improvements via search-engine tutoring.',
        ],
      },
    ],
  },
  {
    id: 'ch16',
    number: 16,
    slug: 'deployment',
    title: 'Deployment',
    subtitle: 'API shape & web app',
    syllabusTopic: 'API, web app',
    readingTime: '35–45 min',
    premise: 'Deployment here means static hosting: the course app is the product. Document export/import of checkpoints and the search-assisted Storyteller flow.',
    labIds: ['storyteller'],
    tutorSeeds: ['What would a minimal /v1/chat/completions look like?', 'How is SSE streaming structured?'],
    parts: [
      {
        id: 'static',
        heading: 'Static deployment',
        paragraphs: [
          'Build with Vite, publish to GitHub Pages. No server secrets, no API keys in the repo. AI features open user-chosen search tabs.',
        ],
      },
      {
        id: 'api-shape',
        heading: 'API shape (conceptual)',
        paragraphs: [
          'Map Storyteller messages to {model, messages, temperature}. Compare to OpenAI chat schema so learners recognize industry APIs—even though this app does not host one.',
        ],
      },
      {
        id: 'storage',
        heading: 'Client storage',
        paragraphs: [
          'IndexedDB for checkpoints, tokenizer merges, and chat history. Offer download/upload JSON for portability.',
        ],
      },
    ],
  },
  {
    id: 'ch17',
    number: 17,
    slug: 'multimodal',
    title: 'Multimodal',
    subtitle: 'VQVAE, diffusion transformer',
    syllabusTopic: 'VQVAE, diffusion transformer',
    readingTime: '45–55 min',
    premise: 'Illustrate stories: teach VQ codes and diffusion at a high level; use search assist for image-model prompts and optional tiny canvas demos.',
    labIds: ['multimodal', 'storyteller'],
    tutorSeeds: ['What does a VQ-VAE codebook do?', 'How does diffusion differ from autoregressive text?'],
    parts: [
      {
        id: 'vq',
        heading: 'VQ-VAE intuition',
        paragraphs: [
          'Encode image patches to discrete codes; decode back. Autoregressive models can predict codes for illustrations conditioned on story text.',
        ],
      },
      {
        id: 'diffusion',
        heading: 'Diffusion transformer (DiT)',
        paragraphs: [
          'Iterative denoising in latent space; transformer blocks replace U-Net at scale. Browser demos stay 2D grid toy size.',
        ],
      },
      {
        id: 'illustrate',
        heading: 'Illustrate via search workflow',
        paragraphs: [
          'Build a multimodal prompt from story text; open image-capable search providers for the user. Local procedural SVG placeholders show layout without hosting image models.',
        ],
      },
    ],
  },
]

export const appendixTopics: AppendixTopic[] = [
  {
    id: 'langs',
    title: 'Programming languages: Assembly, C, Python',
    summary: 'LLM101n names three implementation layers; this browser course uses Pyodide (Python) for labs, TypeScript for the SPA shell, and optional WASM C.',
    bullets: [
      'Python chapters map to Pyodide labs and exported .py snippets.',
      'C hot paths can ship as WASM modules for matmul kernels (advanced optional track).',
      'Assembly is conceptual—inspect WASM disassembly when curious.',
    ],
  },
  {
    id: 'data-types',
    title: 'Integers, floats, strings, UTF-8',
    summary: 'Tokenizers and quantizers depend on bitwise exactness.',
    bullets: [
      'See chapter 6 for UTF-8 byte-level BPE.',
      'Chapter 9 for float formats; chapter 13 for int8 storage.',
    ],
  },
  {
    id: 'tensors',
    title: 'Tensor views, strides, contiguous memory',
    summary: 'Attention and batched matmul require shape reasoning.',
    bullets: [
      'Every lab logs tensor shapes in the UI.',
      'KV-cache append is a stride / offset exercise in chapter 12.',
    ],
  },
  {
    id: 'frameworks',
    title: 'PyTorch, JAX',
    summary: 'Production stacks use frameworks; this course implements core ops to understand what frameworks automate.',
    bullets: [
      'After each lab, a sidebar lists the PyTorch one-liner equivalent.',
      'JAX mentioned for pmap vs our Worker simulation in chapter 10.',
    ],
  },
  {
    id: 'architectures',
    title: 'GPT, Llama, MoE',
    summary: 'GPT-2 is the spine; appendix cards contrast Llama (RoPE, RMSNorm, GQA) and MoE routing.',
    bullets: [
      'RoPE: relative positions via rotated embeddings.',
      'GQA: grouped query heads for faster inference.',
      'MoE: sparse FFN experts—memory vs quality tradeoff.',
    ],
  },
  {
    id: 'multimodal-extra',
    title: 'Images, audio, video',
    summary: 'Chapter 17 introduces illustration; audio/video noted for future extension.',
    bullets: [
      'Whisper-style speech is out of scope for v1 static hosting.',
      'Link external resources via search assist when exploring.',
    ],
  },
]

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug)
}

export function getChapterByNumber(n: number): Chapter | undefined {
  return chapters.find((c) => c.number === n)
}
