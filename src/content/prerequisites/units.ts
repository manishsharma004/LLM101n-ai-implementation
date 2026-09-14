import type { PrerequisiteUnit } from './types'

export const prerequisiteUnits: PrerequisiteUnit[] = [
  {
    id: 'prereq-00',
    unitLabel: '0.0',
    slug: 'python-quickstart',
    title: 'Python for Deep Learning Quickstart',
    shortTitle: 'Python Foundations',
    estimatedHours: '2 hours',
    difficulty: 'Beginner',
    iconGlyph: 'Py',
    coreGoal:
      'Learn the exact Python syntax, OOP patterns, and PyTorch tensor conventions used in micrograd, makemore, and the Storyteller labs—before touching autograd or language modeling.',
    labId: 'python-quickstart',
    relatedChapterSlug: 'micrograd',
    tutorSeeds: [
      'When should I use torch.tensor vs torch.Tensor?',
      'Why do we need .float() before multiplying integers with weights?',
    ],
    sections: [
      {
        id: 'data-structures',
        heading: 'Essential data structures & manipulation',
        bullets: [
          'Lists, tuples, and slicing: index strings/lists, sliding windows like w[1:], and boundary tokens.',
          'zip() to pair consecutive symbols; enumerate() for positions; dict.items() for count tables.',
          'List comprehensions and lambda for concise transforms and sorted(..., key=lambda x: x).',
          'Dictionaries as lookup tables: char→int (s2i) and int→char (i2s) for tokenization.',
        ],
      },
      {
        id: 'oop',
        heading: 'OOP & magic methods',
        bullets: [
          'Classes, __init__, self, and instance fields (.data, .grad) as in micrograd Value.',
          '__add__, __mul__, __pow__, __neg__, __sub__, __truediv__ for expression graphs.',
          '__repr__ for debugging; __radd__ / __rmul__ so 2 * value works.',
          '__call__ on Neuron/MLP modules so instances run like functions: neuron(x).',
        ],
      },
      {
        id: 'torch-primer',
        heading: 'PyTorch tensor primers',
        bullets: [
          'torch.tensor vs torch.Tensor — dtype inference pitfalls; prefer explicit dtypes for LM code.',
          'Cast with .float() so integers can multiply weights and receive gradients.',
          'Indexing rows/columns; .shape for batch×time×channel layouts.',
          '.view() reshapes using the same storage (no copy) — critical for MLP context windows.',
        ],
      },
    ],
  },
  {
    id: 'prereq-01',
    unitLabel: '0.1',
    slug: 'autograd-micrograd',
    title: 'Math & Autograd Engine (micrograd)',
    shortTitle: 'micrograd',
    estimatedHours: '2 hours',
    difficulty: 'Beginner',
    iconGlyph: '∂',
    coreGoal:
      'Build micrograd—a scalar autograd engine—from scratch to master expression graphs, local derivatives, and gradient descent without high-level tensor abstractions.',
    labId: 'micrograd',
    relatedChapterSlug: 'micrograd',
    tutorSeeds: [
      'Why accumulate gradients with += during backprop?',
      'Walk through the tanh local derivative.',
    ],
    sections: [
      {
        id: 'value',
        heading: 'The Value data structure',
        bullets: [
          'Wrap floats in Value with .data, .grad, _prev children, and _op tags.',
          'Each op creates a DAG edge for reverse-mode autodiff.',
        ],
      },
      {
        id: 'ops',
        heading: 'Operations & graph construction',
        bullets: [
          'Overload +, *, **, negation, subtraction, division.',
          'Implement tanh/exp activations as differentiable nodes.',
        ],
      },
      {
        id: 'chain-rule',
        heading: 'Chain rule & local derivatives',
        bullets: [
          'Addition routes ∂L equally; multiplication scales by the other operand.',
          'tanh: (1 − tanh²); power rule: n·x^(n−1).',
        ],
      },
      {
        id: 'backward',
        heading: 'Topological sort & backward()',
        bullets: [
          'Visit nodes in reverse topological order in one backward() call.',
          'Accumulate multivariate gradients with += when a Value is reused.',
        ],
      },
      {
        id: 'mlp-train',
        heading: 'Neurons, MLPs, and optimization',
        bullets: [
          'Neuron (w·x + b), Layer, MLP containers.',
          'MSE loss, zero_grad(), gradient descent: p.data -= lr * p.grad.',
        ],
      },
    ],
  },
  {
    id: 'prereq-02',
    unitLabel: '0.2',
    slug: 'bigram-modeling',
    title: 'Counting & Single-Layer NNs (makemore)',
    shortTitle: 'Bigram LM',
    estimatedHours: '2.5 hours',
    difficulty: 'Beginner',
    iconGlyph: '27²',
    coreGoal:
      'Move from counting character co-occurrences to a single-layer neural bigram trained with NLL—matching explicit probabilities at optimum.',
    labId: 'bigram',
    relatedChapterSlug: 'bigram-language-model',
    tutorSeeds: [
      'Why add +1 smoothing to the count matrix?',
      'How does one-hot × W relate to the count table?',
    ],
    sections: [
      {
        id: 'counts',
        heading: 'Counting-based bigrams',
        bullets: [
          'Build a 27×27 co-occurrence matrix N with a start/end “.” token.',
          'Row-normalize with sum(keepdim=True) for conditional next-char distributions.',
        ],
      },
      {
        id: 'sample',
        heading: 'Sampling & evaluation',
        bullets: [
          'torch.multinomial for autoregressive generation; seed RNGs for reproducibility.',
          'NLL loss: −log p(true next char); lower is better.',
          'Pseudo-count smoothing (+1) avoids zero probs and infinite loss.',
        ],
      },
      {
        id: 'neural-bigram',
        heading: 'Single-layer neural formulation',
        bullets: [
          'One-hot inputs × linear W (no bias) → softmax probabilities.',
          'Gradient descent on W learns the same table as counting at convergence.',
        ],
      },
    ],
  },
  {
    id: 'prereq-03',
    unitLabel: '0.3',
    slug: 'mlp-and-batchnorm',
    title: 'MLP, Initialization & BatchNorm',
    shortTitle: 'Context MLP',
    estimatedHours: '3 hours',
    difficulty: 'Beginner',
    iconGlyph: 'C',
    coreGoal:
      'Expand context with Bengio-style embeddings and MLPs while keeping activations healthy via Kaiming init and BatchNorm1d.',
    labId: 'mlp',
    relatedChapterSlug: 'ngram-mlp',
    tutorSeeds: [
      'Why does BatchNorm need running stats at eval time?',
      'What is fan_in for Kaiming init on a linear layer?',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context & embedding table C',
        bullets: [
          'Map tokens to d-dim rows in C (27 × d).',
          'Concatenate or view context windows without copying memory.',
        ],
      },
      {
        id: 'splits',
        heading: 'Splits & mini-batches',
        bullets: [
          '80/10/10 train/dev/test to spot overfitting.',
          'Mini-batch SGD with learning-rate sweeps and decay.',
        ],
      },
      {
        id: 'init-bn',
        heading: 'Initialization & BatchNorm',
        bullets: [
          'Diagnose saturated tanh / dead ReLU and “confidently wrong” initial loss.',
          'Kaiming normal: std = gain / √fan_in.',
          'BatchNorm1d: unit Gaussian pre-activations, learnable γ/β, running mean/var at inference.',
        ],
      },
    ],
  },
  {
    id: 'prereq-04',
    unitLabel: '0.4',
    slug: 'wavenet-hierarchies',
    title: 'WaveNet Hierarchies',
    shortTitle: 'WaveNet',
    estimatedHours: '3.5 hours',
    difficulty: 'Beginner',
    iconGlyph: '⌗',
    coreGoal:
      'Scale context length (e.g. 8 tokens) with tree-like fusion instead of squashing everything into one hidden layer.',
    relatedChapterSlug: 'ngram-mlp',
    tutorSeeds: [
      'What does flatten_consecutive do to the time dimension?',
      'Why normalize over dims (0, 1) for 3D BatchNorm?',
    ],
    sections: [
      {
        id: 'fusion',
        heading: 'Progressive context fusion',
        bullets: [
          'WaveNet-style hierarchy: pairs → 4-grams → 8-grams across layers.',
          'FlattenConsecutive groups consecutive tokens in the channel dimension.',
        ],
      },
      {
        id: 'bn3d',
        heading: 'BatchNorm on 3D tensors',
        bullets: [
          'Shapes B × T/N × (C·N); reduce over batch and time (0, 1).',
        ],
      },
      {
        id: 'modules',
        heading: 'Modular PyTorch containers',
        bullets: [
          'Sequential stacks of Linear, BatchNorm1d, FlattenConsecutive, tanh.',
          'Clean forward() for readable deep nets.',
        ],
      },
    ],
  },
  {
    id: 'prereq-05',
    unitLabel: '0.5',
    slug: 'bpe-tokenization',
    title: 'Byte Pair Encoding Tokenizer',
    shortTitle: 'BPE',
    estimatedHours: '2 hours',
    difficulty: 'Beginner',
    iconGlyph: 'BPE',
    coreGoal:
      'Implement BPE on UTF-8 bytes, regex pretokenization, and special tokens—the pipeline used before GPT training.',
    labId: 'bpe',
    relatedChapterSlug: 'tokenization',
    tutorSeeds: [
      'Why tokenize bytes instead of Unicode code points?',
      'How does <|endoftext|> stay outside merge tables?',
    ],
    sections: [
      {
        id: 'bytes',
        heading: 'Unicode vs UTF-8 bytes',
        bullets: [
          '150k+ code points are unwieldy; 256 byte tokens are a fixed alphabet.',
          'Encode strings to bytes; decode with graceful invalid UTF-8 handling.',
        ],
      },
      {
        id: 'bpe-algo',
        heading: 'BPE algorithm',
        bullets: [
          'get_stats() for pair frequencies; merge() mints new ids 256+.',
          'Iterative merges build a ranked vocabulary.',
        ],
      },
      {
        id: 'pipeline',
        heading: 'Encode/decode & regex pretokenization',
        bullets: [
          'GPT-2 style regex splits letters, numbers, whitespace boundaries.',
          'Register <|endoftext|> and other control tokens outside standard merges.',
        ],
      },
    ],
  },
]

export function getPrereqUnitBySlug(slug: string): PrerequisiteUnit | undefined {
  return prerequisiteUnits.find((u) => u.slug === slug)
}

export function getPrereqUnitById(id: string): PrerequisiteUnit | undefined {
  return prerequisiteUnits.find((u) => u.id === id)
}
