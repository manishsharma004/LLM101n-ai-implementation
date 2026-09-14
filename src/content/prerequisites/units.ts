import { unit00Sections } from './content/unit00-python'
import { unit01Sections } from './content/unit01-micrograd'
import { unit02Sections } from './content/unit02-bigram'
import { unit03Sections } from './content/unit03-mlp'
import { unit04Sections } from './content/unit04-wavenet'
import { unit05Sections } from './content/unit05-bpe'
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
    sections: unit00Sections,
    labId: 'python-quickstart',
    relatedChapterSlug: 'micrograd',
    tutorSeeds: [
      'When should I use torch.tensor vs torch.Tensor?',
      'Why do we need .float() before multiplying integers with weights?',
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
    sections: unit01Sections,
    labId: 'micrograd',
    relatedChapterSlug: 'micrograd',
    tutorSeeds: [
      'Why accumulate gradients with += during backprop?',
      'Walk through the tanh local derivative.',
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
    sections: unit02Sections,
    labId: 'bigram',
    relatedChapterSlug: 'bigram-language-model',
    tutorSeeds: [
      'Why add +1 smoothing to the count matrix?',
      'How does one-hot × W relate to the count table?',
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
    sections: unit03Sections,
    labId: 'mlp',
    relatedChapterSlug: 'ngram-mlp',
    tutorSeeds: [
      'Why does BatchNorm need running stats at eval time?',
      'What is fan_in for Kaiming init on a linear layer?',
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
    sections: unit04Sections,
    relatedChapterSlug: 'ngram-mlp',
    tutorSeeds: [
      'What does flatten_consecutive do to the time dimension?',
      'Why normalize over dims (0, 1) for 3D BatchNorm?',
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
    sections: unit05Sections,
    labId: 'bpe',
    relatedChapterSlug: 'tokenization',
    tutorSeeds: [
      'Why tokenize bytes instead of Unicode code points?',
      'How does <|endoftext|> stay outside merge tables?',
    ],
  },
]

export function getPrereqUnitBySlug(slug: string): PrerequisiteUnit | undefined {
  return prerequisiteUnits.find((u) => u.slug === slug)
}

export function getPrereqUnitById(id: string): PrerequisiteUnit | undefined {
  return prerequisiteUnits.find((u) => u.id === id)
}
