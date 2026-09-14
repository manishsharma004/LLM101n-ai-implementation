# Six-phase learning roadmap

This document mirrors the in-app **Learning plan** (`/learning-plan`). It organizes the course around **11 primary resources** (Karpathy videos/repos + this browser Storyteller) from scalar autograd through multimodal GPT and multi-GPU training.

Source of truth for links and chapter mapping: `src/content/learningRoadmap.ts`.

## Primary resources (11)

| # | Resource | Kind |
|---|----------|------|
| 1 | [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tuzw) | video |
| 2 | [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo) | video |
| 3 | [Building makemore Part 2: MLP](https://www.youtube.com/watch?v=TCH_1BhywMo) | video |
| 4 | [Building makemore Part 3: Activations & Gradients, BatchNorm](https://www.youtube.com/watch?v=P6sfmUTpU3M) | video |
| 5 | [Building makemore Part 5: Building a WaveNet](https://www.youtube.com/watch?v=q8SA5iVr3K4) | video |
| 6 | [Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE) | video |
| 7 | [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY) | video |
| 8 | [LLM101n — Build a Storyteller (browser labs)](https://manishsharma004.github.io/LLM101n-ai-implementation/) | course |
| 9 | [Let's reproduce GPT-2 (124M)](https://www.youtube.com/watch?v=l8pRSu1IkgA) | video |
| 10 | [State of GPT \| BRK216HFS](https://www.youtube.com/watch?v=bZQun8Y4L2A) | video |
| 11 | [makemore (names.txt, training scripts)](https://github.com/karpathy/makemore) | repo |

## Phase 1: Foundations of Neural Networks & Autograd

**Primary:** micrograd video

1. **Scalar operations & expression graphs** — Value objects, expression graphs, chain rule; chapters: `micrograd`.
2. **Building & training neurons** — MLPs, MSE, gradient descent; chapters: `micrograd`.

## Phase 2: Language Modeling Fundamentals & Bigrams

**Primary:** makemore part 1 + makemore repo

1. **Counting-based language models** — bigrams, NLL, sampling; chapters: `bigram-language-model`, `datasets`.
2. **Bigram as a neural network** — one-hot + linear + softmax; chapters: `bigram-language-model`, `ngram-mlp`.

## Phase 3: Deepening Context & Architectural Enhancements

**Primary:** makemore parts 2, 3, 5

1. **Context expansion via MLPs** — Bengio-style windows, splits; chapters: `ngram-mlp`, `datasets`.
2. **Initialization & batch normalization** — Kaiming init, BatchNorm; chapters: `optimization`, `ngram-mlp`.
3. **Hierarchical modeling (WaveNet)** — flatten_consecutive, modular PyTorch; chapters: `ngram-mlp`, `transformer`.

## Phase 4: Tokenization & Byte Pair Encoding (BPE)

**Primary:** GPT tokenizer video

1. **Why tokenize beyond bytes** — tokens vs bytes vs Unicode; chapter: `tokenization`.
2. **Implementing BPE** — merges, gpt2/cl100k patterns; chapter: `tokenization`.

## Phase 5: Building Transformers & GPT Models

**Primary:** nanoGPT video + this browser course

1. **Self-attention mechanics** — Q/K/V, causal mask; chapters: `attention`, `kv-cache`.
2. **GPT architecture assembly** — blocks, tiny Shakespeare; chapters: `transformer`, `tokenization`, `optimization`.
3. **Multimodal extensions** — VQ-VAE, DiT; chapter: `multimodal`.

## Phase 6: High-Performance Scaling & Modern Training Pipelines

**Primary:** GPT-2 repro + State of GPT

1. **System & kernel optimizations** — TF32, bf16, compile, FlashAttention; chapters: `device`, `precision`.
2. **Optimization standards & multi-GPU** — AdamW, DDP, grad accumulation; chapters: `optimization`, `distributed`.
3. **Full LLM lifecycle** — pretrain → SFT → RLHF → deploy; chapters: `finetuning-sft`, `finetuning-rl`, `deployment`, `quantization`.

## Chapter mapping (quick reference)

- Phases 1–4 ≈ chapters 01–06
- Phase 5 ≈ chapters 04–05, 12, 17
- Phase 6 ≈ chapters 07–16

Use the full syllabus on the home page for appendix topics (RoPE, MoE, dtypes).
