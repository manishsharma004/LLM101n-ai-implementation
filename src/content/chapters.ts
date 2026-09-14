import type { AppendixTopic, Chapter } from './types'

export const chapters: Chapter[] = [
  {
    id: 'ch01',
    number: 1,
    slug: 'bigram-language-model',
    title: 'Bigram Language Model',
    subtitle: 'Language modeling from counts',
    syllabusTopic: 'language modeling',
    readingTime: '45–55 min',
    premise:
      'Before transformers, language models were often just tables of probabilities. A bigram model asks: given one character (or token), what comes next? You will train counts in the browser, sample stories, measure perplexity on a hold-out split, and see why smoothing and sampling knobs matter on TinyStories-style text.',
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
          'The figures below state the bigram objective in standard notation (NLL, perplexity, Markov chain).',
          'A language model assigns a probability distribution over continuations. Given a prefix, it outputs scores for what could come next. Training does not require labels from a human grader: the next symbol in the corpus is the target. That self-supervision is why web-scale text can train enormous models.',
          'For a Storyteller on TinyStories, the prefix might be "Once upon a". The model should favor child-friendly continuations such as "time" rather than random Unicode. A bigram model only looks at the immediately previous symbol, so it cannot remember the title or characters from earlier in the paragraph. That limitation is the motivation for longer contexts in later chapters.',
          'We measure fit with negative log-likelihood (NLL): assign probability p to the true next symbol and accumulate −log p. Lower NLL means the model is less surprised by the data. Perplexity is exp(average NLL); interpret it as the effective branching factor per step. A bigram that always guesses uniformly over V symbols has perplexity ≈ V.',
          'Character models are pedagogical: small vocabularies make tables visible. Production systems use subword tokens (chapter 6), but the training objective is the same—predict the next token from context.',
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
          'Raw counts fail on unseen pairs: probability zero means infinite negative log-likelihood. Additive smoothing (e.g. +1 to every count) or backoff to unigrams keeps sampling stable. The lab trains on a bundled TinyStories shard and exposes temperature, top-k, and greedy decoding—generation is not only about counts, but how you turn probabilities into choices.',
          'Worked intuition: if after context "e" you saw "r" 40 times and "x" once among 50 continuations, the raw estimate is P(r|e)=0.8. With add-α smoothing toward a uniform row, rare letters keep non-zero mass so validation text with "ex" does not explode NLL. Tuning α trades memorization vs generalization on tiny data.',
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
          'Start from a seed string. Repeatedly sample the next character from the conditional distribution given the last character. Stop at max length or when you hit a chosen end symbol. Because memory is one step, output often drifts into repetitive loops ("the the the") or loses plot—compare greedy decoding (always argmax) vs stochastic sampling in the lab.',
          'Temperature scales how sharply you read probabilities: T→0 approaches greedy; T>1 flattens the distribution and increases diversity at the cost of coherence. Top-k truncates the tail before sampling, a cheap guardrail against sampling a rare punctuation character mid-word.',
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
          'Reverse-mode AD walks the graph from loss to inputs once, reusing intermediate ∂loss/∂node values. For a scalar loss and thousands of parameters, that beats forward-mode (which would need one pass per parameter). Micrograd stores the graph implicitly via parent pointers—frameworks batch this into tensor ops.',
          'This is exactly what larger frameworks do—only hidden behind tensors. Building it once demystifies "loss.backward()" when you reach transformers.',
        ],
        checkYourself: [
          {
            prompt: 'Why must backward() visit nodes in topological order from loss to leaves?',
            reveal: 'A node’s gradient depends on downstream gradients already being computed; children must be processed before their parents in the reverse topological order.',
          },
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
          'Pick a loss (MSE for regression). Forward → backward → update weights with learning rate η. Log loss per step in the lab output. Watch overshoot when η is too large (loss spikes) and stagnation when η is too small (loss flatlines).',
          'Always zero gradients after each step unless you intentionally accumulate—stale grads are a common bug when porting loops from pseudocode to PyTorch.',
          'The same loop will train embedding tables and transformer weights later; only the forward graph grows. Language modeling swaps MSE for cross-entropy over vocab logits.',
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
          'Counting is maximum likelihood on a discrete table; neural nets learn the same conditional distributions but share structure across contexts via embeddings and depth. When data is sparse, neural models can generalize; when data is abundant and tabular, counts can be hard to beat.',
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
    readingTime: '60–75 min',
    premise:
      'Fix a context window of previous characters, embed them, concatenate, and pass through an MLP with GELU activations. The lab runs real SGD steps on a corpus shard—this is makemore-style thinking in miniature, not a diagram-only chapter.',
    labIds: ['mlp'],
    tutorSeeds: ['Why does GELU smooth ReLU?', 'How does context length trade off capacity vs parameters?'],
    parts: [
      {
        id: 'embed',
        heading: 'Embeddings turn symbols into vectors',
        paragraphs: [
          'Each character id maps to a learnable vector. Stacking contexts gives a fat vector fed into linear layers. The network learns features like "vowel after consonant" or "space after word fragment" without hand-written rules.',
          'Embeddings are not magic semantics—they start random and become useful because the loss forces them to predict co-occurrence structure. Similar characters (vowels, punctuation) often end up nearby in embedding space after training.',
        ],
        keyTerms: [
          { term: 'embedding', definition: 'A lookup table from discrete token ids to continuous vectors.' },
          { term: 'GELU', definition: 'Gaussian Error Linear Unit; smooth nonlinearity used in GPT-family models.' },
          { term: 'context window', definition: 'How many prior tokens the model conditions on; trades memory and compute for capacity.' },
        ],
        checkYourself: [
          {
            prompt: 'Why concatenate embeddings instead of averaging them for a fixed context length?',
            reveal: 'Concatenation preserves position-specific information within the window; averaging would collapse "cat" vs "tac" style distinctions unless you add position features elsewhere.',
          },
        ],
      },
      {
        id: 'matmul',
        heading: 'Matmul is the workhorse',
        paragraphs: [
          'Linear layers are matrix multiplication plus bias. In the browser lab you implement matmul in Python (NumPy-style lists); WebGPU chapters accelerate the same shapes. Track dimensions obsessively: input dim = context × emb_dim, hidden dim H, output dim = vocab for logits.',
          'A two-layer MLP block is x → W₁x + b₁ → GELU → W₂h + b₂. Parameter count scales with (input·H + H·output). Wider H learns richer features but needs more data and regularization on small shards.',
        ],
        code: {
          language: 'python',
          caption: 'Cross-entropy on one next-character target',
          body: `import math
logits = model(context_ids)  # length V
target = next_char_id
probs = softmax(logits)
loss = -math.log(probs[target] + 1e-9)`,
        },
      },
      {
        id: 'train-chars',
        heading: 'Train on a TinyStories shard',
        paragraphs: [
          'Cross-entropy loss trains logits for the next character. Backprop updates embeddings and both weight matrices; the lab logs loss from early to late steps so you can see whether the shard is large enough to learn anything beyond noise.',
          'Generation improves over bigrams because multiple prior characters influence the prediction—but with only thousands of characters of data, do not expect GPT-quality prose. Use chapter 11 eval habits: hold out lines and ask whether validation loss tracks training.',
        ],
        callout: {
          tone: 'note',
          body: 'Sim vs reality: this MLP is a single hidden layer on characters. GPT-2 stacks dozens of transformer blocks on subword tokens with billions of parameters. The training loop shape is the same; scale is not.',
        },
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
    readingTime: '65–80 min',
    premise: 'Attention lets every position read every other position (with causal masking for decoders). You will implement scaled dot-product attention, read an ASCII heatmap of weights, and connect masking to autoregressive generation.',
    labIds: ['attention'],
    tutorSeeds: ['Why divide by sqrt(d_k)?', 'What breaks if you remove positional encodings?'],
    parts: [
      {
        id: 'qkv',
        heading: 'Queries, keys, values',
        paragraphs: [
          'For each position, learn linear maps to query, key, and value vectors. Scores = QKᵀ / √d. Softmax over keys yields convex weights; weighted sum of values is the output. Causal LM masking sets forbidden positions to −∞ before softmax so token i cannot attend to future tokens j > i.',
          'Scaling by √d keeps dot products from growing with head dimension so softmax does not saturate into one-hot weights. Multi-head attention runs h parallel heads with smaller d_k each, then concatenates—different heads can specialize (local syntax vs long-range coreference).',
        ],
        keyTerms: [
          { term: 'scaled dot-product attention', definition: 'Softmax(QKᵀ/√d)V mixing values according to query–key similarity.' },
          { term: 'causal mask', definition: 'Upper-triangular forbidden region so decoders only see past and present.' },
        ],
        checkYourself: [
          {
            prompt: 'What happens to attention weights if you remove the √d scale with large d_k?',
            reveal: 'Dot products grow in magnitude; softmax becomes peaked (near one-hot), gradients shrink, and training can become unstable.',
          },
        ],
      },
      {
        id: 'positions',
        heading: 'Positions are not in the symbols',
        paragraphs: [
          'Attention is permutation-equivariant without position info: shuffling token order shuffles outputs the same way. GPT-2 adds learned position embeddings to token embeddings before the stack. Sinusoidal encodings (original Transformer) bake relative structure via sin/cos at different frequencies.',
          'Modern Llama-style models often use RoPE (rotary position embeddings) instead of additive positions—see appendix architectures. For this chapter, remember: positions are explicit inputs; the attention math alone does not know left-to-right order.',
        ],
      },
      {
        id: 'viz',
        heading: 'Read the heatmap like an X-ray',
        paragraphs: [
          'The lab prints a causal weight matrix as numbers and an ASCII heatmap (# vs .). Bright cells show where a query position allocates mass over keys. On random Q/K you see a legal causal pattern; after training on text, diagonals and phrase boundaries often brighten.',
          'In early training on stories, local structure is common; later heads specialize (syntax, names, dialogue). Heatmaps are debugging tools—production stacks rarely visualize every head, but the skill transfers to interpreting attention rollout papers.',
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
    readingTime: '75–90 min',
    premise: 'Stack blocks: attention → residual → LayerNorm → MLP → residual → LayerNorm. This is the GPT decoder stack—here you connect the pieces you have already coded (attention + MLP) to the full block diagram and modern variants.',
    labIds: ['transformer-block', 'attention', 'mlp'],
    tutorSeeds: ['Pre-norm vs post-norm?', 'Why residuals help optimization?'],
    parts: [
      {
        id: 'block',
        heading: 'A block is attention + MLP with residuals',
        paragraphs: [
          'Residual paths preserve a gradient highway: output = x + SubLayer(x). If the sublayer learns something close to zero early, the block approximates identity and depth is easier to optimize. LayerNorm re-centers and scales activations per token before each sublayer (GPT-2 post-norm); many newer models use pre-norm (norm before attention/MLP) for training stability.',
          'The MLP inside a block is usually two linear layers with expansion ratio 4× (n_embd → 4·n_embd → n_embd) and GELU in the middle—this is where most FLOPs live at wide widths.',
        ],
      },
      {
        id: 'gpt2-map',
        heading: 'Map syllabus to GPT-2 shapes',
        paragraphs: [
          'Hyperparameters: n_layer, n_head, n_embd, context length T. Each block has Q,K,V,O projections (roughly 4·n_embd² params) plus MLP matrices (8·n_embd² with 4× expansion). Token + position embeddings add V·n_embd; lm_head often ties weights with token embeddings to save parameters.',
          'Forward pass for decoding: embed tokens → for each block apply masked self-attention then MLP, with residuals and norms → final linear to logits → softmax/sample next token. Training uses teacher forcing (feed gold prefix) and predicts next token at every position in parallel within T.',
        ],
        keyTerms: [
          { term: 'weight tying', definition: 'Sharing input embedding and output projection weights to reduce params and regularize.' },
          { term: 'teacher forcing', definition: 'Training with ground-truth prefix tokens instead of model-generated prefix.' },
        ],
      },
      {
        id: 'modern',
        heading: 'What changed since GPT-2',
        paragraphs: [
          'GPT-2 (2019) is still the pedagogical spine: decoder-only, causal attention, learned positions, LayerNorm + GELU MLP. Llama-class models swap LayerNorm for RMSNorm, use RoPE instead of additive positions, often GQA (grouped query attention) for faster inference, and SwiGLU MLPs instead of GELU-MLP.',
          'None of these change the autoregressive objective—they change stability, speed, and memory. When reading HF config.json for a modern checkpoint, map each field back to the block diagram you built here.',
        ],
        callout: {
          tone: 'interview',
          body: 'Be able to sketch one transformer block and name where GPT-2 vs Llama differ (norm, position, MLP activation, attention grouping).',
        },
      },
      {
        id: 'toy-train',
        heading: 'Toy training expectations',
        paragraphs: [
          'Full transformer training in-tab is limited by CPU time and memory. The faithful path: implement forward for a few blocks on a micro batch, run hundreds of steps, watch loss, then use search-assisted Storyteller for polished prose while you study inference (KV-cache, quant) in later chapters.',
          'If loss flatlines, check data size (chapter 11), learning rate (chapter 7), and whether your implementation applies the causal mask. Most student bugs are shape errors or masking mistakes, not missing secret tricks.',
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
          'Compression matters: fewer tokens per story means longer effective context and cheaper training. A 32k vocab might represent common English morphemes in one token while rare words decompose into pieces ("straw" + "berry").',
        ],
      },
      {
        id: 'train-merge',
        heading: 'Train merges on corpus statistics',
        paragraphs: [
          'Count pairs in tokenized sequences, pick argmax, merge everywhere, repeat. Store merge rank order for deterministic encoding—the merge list is the tokenizer artifact you ship with the model.',
          'The lab trains merges on your shard, then encodes and decodes a demo word. Production tokenizers also define special tokens (BOS, EOS, padding) and normalization (NFKC, whitespace) before BPE.',
        ],
        checkYourself: [
          {
            prompt: 'Why must encode and decode use the same merge order?',
            reveal: 'Merges are greedy and order-dependent; changing order changes segment boundaries and token ids, breaking compatibility with trained embeddings.',
          },
        ],
      },
      {
        id: 'unicode',
        heading: 'Unicode & UTF-8 (appendix tie-in)',
        paragraphs: [
          'Byte-level BPE avoids unknown Unicode characters: every UTF-8 byte is in the base alphabet. This is how production tokenizers avoid brittle ASCII-only assumptions.',
          'Emoji and accented characters become short byte sequences; the model never sees an "unknown" token if bytes are exhaustive. Tradeoff: sequences can be longer for non-Latin scripts unless merges capture frequent multibyte patterns.',
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
          'Too large → saturated activations and exploding logits; too small → vanishing signal and slow learning. GPT-style init uses small normal weights, sometimes scaled by 1/√(fan-in) or divided by √(2·n_layer) for residuals.',
          'Attention projection init especially affects early softmax entropy—if logits are huge, attention becomes one-hot and gradients vanish.',
        ],
      },
      {
        id: 'adamw',
        heading: 'AdamW adapts per-parameter steps',
        paragraphs: [
          'Adam tracks exponential moving averages of gradient (m) and squared gradient (v), then updates with bias-corrected estimates. AdamW decouples weight decay: shrink weights directly instead of mixing L2 into the gradient, which matters for transformers.',
          'The optimizer lab walks a stiff 2D quadratic—large learning rate on the steep axis oscillates; Adam-like per-axis scaling can converge faster than vanilla SGD on ill-conditioned surfaces.',
        ],
      },
      {
        id: 'schedule',
        heading: 'Learning rate schedules',
        paragraphs: [
          'Warmup ramps lr from near zero over the first few hundred or thousand steps so attention and layernorm statistics stabilize. Cosine decay (or linear) lowers lr late in training for fine detail in weights.',
          'Gradient clipping (global norm cap) prevents rare bad batches from dominating when loss spikes—common in RL and sometimes in LM pretrain. Log lr vs step alongside loss when you train outside the browser.',
        ],
        callout: { tone: 'tip', body: 'If loss NaNs, first divide lr by 10 and enable grad clip before rewriting the model.' },
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
          'Nested loops or typed arrays for matmul. Good for tiny shapes and debugging numerical issues. The device lab times a 64×64 multiply—at that size CPU often wins because GPU launch overhead dominates.',
        ],
        callout: {
          tone: 'note',
          body: 'Sim vs reality: CUDA kernels on datacenter GPUs drive LLM training; this course measures intuition in Python/WebGPU, not TFLOPS leaderboard numbers.',
        },
      },
      {
        id: 'webgpu',
        heading: 'WebGPU as browser GPU',
        paragraphs: [
          'When `navigator.gpu` exists, dispatch compute shaders for matmul tiles. Fall back gracefully with a clear message—many learners are on laptops without WebGPU or with blocked adapters.',
          'Think in terms of host-visible buffers, bind groups, and workgroup sizes—analogous to cudaMalloc, kernel launches, and thread blocks.',
        ],
      },
      {
        id: 'cuda-map',
        heading: 'Mental map to CUDA',
        paragraphs: [
          'Kernels, grids, and memory hierarchies in CUDA correspond to WGSL compute pipelines and storage buffers. Shared memory tile optimizations in CUTLASS-style libraries are why large matmuls saturate GPUs; you will call those via frameworks long before writing your own.',
          'Inference serving adds another layer: batching requests, KV-cache paging, and tensor parallel sharding across GPUs.',
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
          'fp32 is the reference for loss and master weights. fp16 halves memory bandwidth but risks underflow in tiny gradients; bf16 shares fp32 exponent width with a shorter mantissa—often the sweet spot on NVIDIA training chips.',
          'fp8 (e4m3 / e5m2) appears in H100-class hardware with per-tensor or per-block scaling factors; treat it as an inference and training acceleration format, not a new algorithm.',
        ],
      },
      {
        id: 'mixed',
        heading: 'Mixed precision training pattern',
        paragraphs: [
          'Forward/backward in lower precision where safe; master weights in fp32; loss scaling multiplies loss before backward then unscales grads to keep fp16 gradients representable.',
          'Some layers (softmax, layernorm reductions) stay in fp32 even when matmuls are fp16/bf16 because numerical error accumulates across the vocab dimension.',
        ],
      },
      {
        id: 'browser',
        heading: 'What browsers can do today',
        paragraphs: [
          'WebGPU shader types may expose f16 on supported devices. The precision lab demonstrates fp32 accumulation drift on many small adds—a different failure mode than low-precision matmul but equally real.',
          'You will not train a 1B model in mixed precision in-tab; the goal is to recognize dtype arguments in PyTorch (`autocast`, `GradScaler`) when you move off-browser.',
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
    labIds: ['dataset', 'eval'],
    tutorSeeds: ['Why deduplicate training data?', 'What is packing for transformer batches?'],
    parts: [
      {
        id: 'tinystories',
        heading: 'TinyStories in the browser',
        paragraphs: [
          'This app ships a plain-text TinyStories-style shard under `public/data/` (tens of thousands of characters) so labs can train and evaluate without a backend. Larger training pulls JSONL from Hugging Face with story text, metadata, and deduplication hashes.',
          'Hold out 10–15% of stories (not random characters) for validation so perplexity reflects generalization to new plots, not just new positions in the same paragraph.',
        ],
      },
      {
        id: 'loader',
        heading: 'Batching variable-length stories',
        paragraphs: [
          'Pad or pack sequences to context T. Attention masks prevent pad tokens from contributing to attention or loss. Packing concatenates multiple short stories with boundary tokens to raise GPU utilization—standard in nanoGPT-style trainers.',
          'The dataset lab prints basic corpus stats; the eval lab estimates bigram perplexity on a train/val split as a template for how you would score any LM.',
        ],
      },
      {
        id: 'synthetic',
        heading: 'Synthetic data generation',
        paragraphs: [
          'Templates + word lists can augment rare patterns (morals, settings, character names). Use search-engine assist to brainstorm story prompts, then train only on text you curate and license-check.',
          'Synthetic data can inflate benchmarks if templates leak into eval—keep held-out human-written or separately generated stories for honest metrics.',
        ],
        checkYourself: [
          {
            prompt: 'Why split by story lines instead of shuffling all characters for validation?',
            reveal: 'Character-level splits leak adjacent context across the boundary; story-level splits mimic deploying on unseen documents.',
          },
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
          'Naive autoregressive attention recomputes keys/values for every prior token on each new token—cost grows like O(T²) per layer. Caching stores K and V tensors after each step and only projects the new token’s q, k, v for the latest position.',
          'The lab contrasts operation counts for recompute-all vs append-to-cache; wall-clock wins appear once T exceeds a modest threshold and implementations are fused.',
        ],
      },
      {
        id: 'memory',
        heading: 'Memory tradeoff',
        paragraphs: [
          'Cache size scales O(layers · heads · head_dim · sequence_length · bytes_per_element). Long chat histories and multi-turn Storyteller sessions are bounded by this footprint before they are bounded by FLOPs.',
          'Serving systems use paging (vLLM-style), quantization of KV, or context truncation policies. Prefix caching reuses KV when system prompts repeat across users.',
        ],
        callout: {
          tone: 'interview',
          body: 'Explain why decode batching is memory-bound for long contexts even when matmul FLOPs look small.',
        },
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
          'Affine quantization maps floating weights to int8 with scale s (and sometimes zero-point z): q = round(w / s). Per-channel scales track outliers better than one global scale for an entire layer.',
          'The quant lab quantizes a tiny vector and reports max reconstruction error—real checkpoints use grouped int4 blocks (GPTQ/AWQ) with calibration data to pick scales.',
        ],
      },
      {
        id: 'quality',
        heading: 'Quality vs size',
        paragraphs: [
          'Smaller dtypes shrink model bytes (fit in IndexedDB or mobile) and raise tokens/sec if hardware has int8 tensor cores. Quality loss shows up as higher perplexity or factual drift on niche domains.',
          'Always compare before/after on the same eval set; generation samples alone are noisy. Quant-aware fine-tuning (QAT) can recover accuracy at the cost of another training pass.',
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
    labIds: ['lora', 'sft-prompt', 'storyteller'],
    tutorSeeds: ['What tokens delimit chat turns?', 'Why LoRA targets attention projections?'],
    parts: [
      {
        id: 'chat-format',
        heading: 'Chat templates',
        paragraphs: [
          'Structure user/assistant turns with special tokens (`<|user|>`, `<|assistant|>`, or model-specific headers). SFT maximizes likelihood of assistant tokens only—mask loss on user/system tokens so the model learns to respond, not imitate prompts.',
          'The SFT template lab is format-only: it prints a chat-shaped string you can critique via search assist. Real SFT datasets are thousands of (prompt, response) pairs with consistent templating.',
        ],
      },
      {
        id: 'lora',
        heading: 'LoRA intuition',
        paragraphs: [
          'Freeze base weights W; learn low-rank adapters A∈ℝ^{r×n}, B∈ℝ^{m×r} so ΔW = B·A. Forward uses W + ΔW (often scaled by α/r). Trainable params drop from m·n to r·(m+n), which is why consumer GPUs can fine-tune 7B models.',
          'Targets are usually attention projections (q,k,v,o) and sometimes MLP layers—not every matrix needs an adapter. The LoRA lab counts params on toy shapes and applies ΔW to a vector.',
        ],
        callout: {
          tone: 'note',
          body: 'Sim vs reality: the LoRA lab is linear algebra on toy matrices. Production SFT/LoRA runs on GPUs with billions of parameters; RLHF/PPO is not reproduced in this browser app.',
        },
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
          'RLHF pipeline: (1) SFT model, (2) train a reward model on human rankings of completions, (3) optimize the policy with PPO (or similar) to increase reward while a KL penalty keeps outputs close to the SFT model.',
          'PPO is sample-expensive and finicky—production teams increasingly use offline preference losses. This course does not run PPO in-browser; understand the vocabulary to read papers and TRL docs.',
        ],
        callout: {
          tone: 'note',
          body: 'Sim vs reality: preference data is costly; alignment failures (sycophancy, refusal overreach) often trace to reward misspecification, not missing one more epoch.',
        },
      },
      {
        id: 'dpo',
        heading: 'DPO as direct preference optimization',
        paragraphs: [
          'DPO reparameterizes the RL objective so you can train on (prompt, chosen, rejected) triples with a classification-style loss on log-prob ratios—no explicit reward model rollout loop in the inner training step.',
          'The DPO lab exports a single preference pair as text/JSON for discussion; real runs need diverse pairs covering safety, tone, and factuality for your Storyteller persona.',
        ],
        checkYourself: [
          {
            prompt: 'What does the KL term in RLHF protect against?',
            reveal: 'It penalizes drifting far from the reference (SFT) policy so optimization for reward does not collapse into high-scoring gibberish.',
          },
        ],
      },
      {
        id: 'ui',
        heading: 'Preference UI in Storyteller',
        paragraphs: [
          'Pick which story continuation you prefer; export pairs as JSON for offline training scripts or discuss improvements via search-engine tutoring.',
          'Design evals the same way: show two continuations to testers, aggregate win-rate, and only ship style changes that improve preferences without raising hallucination rate on factual prompts.',
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
          'Build with Vite, publish to GitHub Pages (or any static host). No server secrets, no API keys in the repo. CI runs typecheck, tests, and `vite build`; AI features open user-chosen search tabs instead of proxying inference.',
          'HashRouter keeps deep links working on GitHub Pages where the server always serves `index.html` for unknown paths.',
        ],
      },
      {
        id: 'api-shape',
        heading: 'API shape (conceptual)',
        paragraphs: [
          'Map Storyteller messages to `{ model, messages: [{role, content}], temperature, max_tokens }`. Streaming uses SSE chunks with delta content fields—compare to OpenAI-compatible servers (vLLM, llama.cpp server) even though this app does not host one.',
          'If you later wrap a local model, the Storyteller UI becomes a thin client; the hard parts remain tokenizer, sampling, and KV-cache serving.',
        ],
      },
      {
        id: 'storage',
        heading: 'Client storage',
        paragraphs: [
          'IndexedDB can store checkpoints, tokenizer merges, and chat history in the browser. This course exports chapter progress as JSON today; model checkpoints would follow the same pattern (download/upload) for portability.',
          'Version your artifacts: include vocab size, merge list hash, and model config next to weights so you do not load incompatible tensors.',
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
          'VQ-VAE encodes image patches into discrete codebook indices; a decoder reconstructs pixels from codes. Autoregressive text models can predict image token sequences conditioned on story embeddings—DALL·E / early multimodal LMs used variants of this idea.',
          'Codebook collapse (unused entries) and blur are classic training issues; diffusion models partly sidestep discrete codes for photorealism at the cost of slower sampling.',
        ],
      },
      {
        id: 'diffusion',
        heading: 'Diffusion transformer (DiT)',
        paragraphs: [
          'Diffusion trains a network to predict noise ε given noisy latents and timestep t. Sampling starts from Gaussian noise and iteratively denoises. DiT replaces U-Net backbones with transformer blocks operating on latent patches.',
          'Text conditioning injects via cross-attention or adaLN from a text encoder (CLIP/T5). Browser-scale demos stay on tiny grids; production runs billions of params on GPU clusters.',
        ],
      },
      {
        id: 'illustrate',
        heading: 'Illustrate via search workflow',
        paragraphs: [
          'Build a multimodal prompt from story text (characters, setting, art style); open image-capable search providers for the user. The multimodal lab prints a structured illustration prompt aligned with TinyStories tone.',
          'For a Storyteller product, illustration is optional media—keep text generation authoritative and treat images as suggestions that may need human review for child safety.',
        ],
      },
    ],
  },
]

export const appendixTopics: AppendixTopic[] = [
  {
    id: 'langs',
    title: 'Programming languages: Assembly, C, Python',
    summary:
      'Karpathy’s syllabus names three implementation layers. This browser port runs pedagogy in Python (Pyodide), ships the UI in TypeScript, and leaves room for WASM/C kernels where Python is too slow.',
    bullets: [
      'Python: all editable labs—bigram through LoRA—share the same Pyodide runner; export snippets to a local venv when you outgrow the browser.',
      'C / Rust: production inference kernels (flash-attn, fused layernorm) live here; WASM can accelerate matmul in chapter 8 as an optional fork.',
      'Assembly: useful mental model for SIMD and memory bandwidth limits; inspect WASM disassembly if you want to see what the CPU actually executes.',
    ],
  },
  {
    id: 'data-types',
    title: 'Integers, floats, strings, UTF-8',
    summary: 'Tokenizers, quantizers, and distributed collectives all assume you know how bits represent numbers and text.',
    bullets: [
      'UTF-8: variable-length bytes; byte-level BPE never sees “unknown char” if the alphabet is 256 bytes (chapter 6).',
      'fp32 vs bf16 vs int8: exponent width, rounding, and accumulation order change loss curves (chapters 9 and 13).',
      'Strings in Python 3 are Unicode code points; on disk stories are UTF-8 bytes—encode/decode consciously when hashing datasets.',
    ],
  },
  {
    id: 'tensors',
    title: 'Tensor views, strides, contiguous memory',
    summary: 'Attention, batched matmul, and KV-cache updates are shape and stride problems disguised as architecture.',
    bullets: [
      'A tensor shape `[batch, heads, seq, dim]` tells you which axis to softmax over; draw it before coding.',
      'KV-cache append is “write new K/V at offset seq_len-1” per layer—strides decide whether copies are needed.',
      'Contiguous vs strided views explain when `.contiguous()` appears in PyTorch stack traces.',
    ],
  },
  {
    id: 'frameworks',
    title: 'PyTorch, JAX',
    summary: 'Frameworks record autograd graphs, fuse kernels, and ship distributed primitives—you implement the math once here, then delegate.',
    bullets: [
      'PyTorch: `nn.Linear`, `F.scaled_dot_product_attention`, `AdamW`, `torch.compile`—map each chapter lab to one API call after you understand the forward pass.',
      'JAX: functional style + `pmap`/`shard_map` for SPMD; compare to our Worker all-reduce toy in chapter 10.',
      'Hugging Face Transformers: config.json + `AutoModelForCausalLM`—use after you can explain one block by hand.',
    ],
  },
  {
    id: 'architectures',
    title: 'GPT, Llama, MoE',
    summary: 'GPT-2 is the teaching skeleton; modern checkpoints remix norms, positions, MLPs, and attention grouping.',
    bullets: [
      'GPT-2: learned absolute positions, LayerNorm, GELU MLP, dense multi-head attention.',
      'Llama: RMSNorm, RoPE, SwiGLU MLP, often GQA—fewer KV heads, same query count.',
      'MoE: multiple FFN experts per layer + router; activates top-k experts per token—great quality/$, tricky to serve.',
    ],
  },
  {
    id: 'multimodal-extra',
    title: 'Images, audio, video',
    summary: 'Chapter 17 covers illustration prompts; speech and video are adjacent product surfaces with their own tokenizers and latency budgets.',
    bullets: [
      'Speech: encoder-decoder (Whisper) or speech-to-semantic-token pipelines—real-time needs streaming inference.',
      'Video: spatiotemporal patches + huge context; mostly research/product labs outside this static course.',
      'Use search assist to explore papers; keep child-safety review human-in-the-loop for any generated media.',
    ],
  },
]

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug)
}

export function getChapterByNumber(n: number): Chapter | undefined {
  return chapters.find((c) => c.number === n)
}
