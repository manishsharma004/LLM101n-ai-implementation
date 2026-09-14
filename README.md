# LLM101n: Let's build a Storyteller

**Browser implementation** — interactive syllabus, in-tab labs, and a Storyteller UI. No server training; AI help via [search-engine redirects](https://github.com/manishsharma004/system-design-copilot) (Google, Duck.ai, Perplexity).

```bash
npm install && npm run dev
```

After merge to `master`, GitHub Actions (`.github/workflows/deploy.yml`) publishes to **GitHub Pages** at  
`https://manishsharma004.github.io/LLM101n-ai-implementation/` (enable Pages → source: GitHub Actions in repo settings if needed).

**Runtime architecture:** [interactive Archify map](public/architecture/llm101n-runtime.architecture.html) — regenerate with `bash scripts/architecture-deliver.sh` (see [docs/architecture/README.md](docs/architecture/README.md)).

**Learning plan:** [Six-phase roadmap](docs/LEARNING_ROADMAP.md) (micrograd → makemore → tokenizer → GPT → scaling/RLHF), also in the app at `#/learning-plan`.

---

**!!! NOTE: the official Eureka Labs course does not yet exist. This repo follows the archived [karpathy/LLM101n](https://github.com/karpathy/LLM101n) syllabus. !!!**

---

![LLM101n header image](llm101n.jpg)

>  What I cannot create, I do not understand. -Richard Feynman

This **browser course** walks the archived [karpathy/LLM101n](https://github.com/karpathy/LLM101n) syllabus: theory, diagrams, and **Pyodide labs** (Python in-tab — no install). You train toy models on a bundled [TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories) shard, use the Storyteller UI, and get AI help via search-engine redirects (no backend API keys). Production-scale training in C/CUDA is out of scope here; the goal is deep intuition for transformers, tokenization, optimization, and deployment concepts before you move to a GPU stack.

**Syllabus**

- Chapter 01 **Bigram Language Model** (language modeling)
- Chapter 02 **Micrograd** (machine learning, backpropagation)
- Chapter 03 **N-gram model** (multi-layer perceptron, matmul, gelu)
- Chapter 04 **Attention** (attention, softmax, positional encoder)
- Chapter 05 **Transformer** (transformer, residual, layernorm, GPT-2)
- Chapter 06 **Tokenization** (minBPE, byte pair encoding)
- Chapter 07 **Optimization** (initialization, optimization, AdamW)
- Chapter 08 **Need for Speed I: Device** (device, CPU, GPU, ...)
- Chapter 09 **Need for Speed II: Precision** (mixed precision training, fp16, bf16, fp8, ...)
- Chapter 10 **Need for Speed III: Distributed** (distributed optimization, DDP, ZeRO)
- Chapter 11 **Datasets** (datasets, data loading, synthetic data generation)
- Chapter 12 **Inference I: kv-cache** (kv-cache)
- Chapter 13 **Inference II: Quantization** (quantization)
- Chapter 14 **Finetuning I: SFT** (supervised finetuning SFT, PEFT, LoRA, chat)
- Chapter 15 **Finetuning II: RL** (reinforcement learning, RLHF, PPO, DPO)
- Chapter 16 **Deployment** (API, web app)
- Chapter 17 **Multimodal** (VQVAE, diffusion transformer)

**Appendix**

Further topics to work into the progression above:

- Programming languages: Assembly, C, Python
- Data types: Integer, Float, String (ASCII, Unicode, UTF-8)
- Tensor: shapes, views, strides, contiguous, ...
- Deep Learning frameworks: PyTorch, JAX
- Neural Net Architecture: GPT (1,2,3,4), Llama (RoPE, RMSNorm, GQA), MoE, ...
- Multimodal: Images, Audio, Video, VQVAE, VQGAN, diffusion
