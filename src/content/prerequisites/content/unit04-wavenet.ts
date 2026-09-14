import type { PrereqSection } from '../types'

export const unit04Sections: PrereqSection[] = [
  {
    id: 'motivation',
    heading: 'Why hierarchical fusion?',
    paragraphs: [
      'Flattening eight characters into one giant vector forces a single hidden layer to mix all interactions at once—parameters grow as (8*d) × hidden, and gradients can dilute.',
      'WaveNet-style models fuse locally first: pairs of embeddings, then pairs of pairs, building a tree over the context. Each stage doubles effective receptive field while keeping layer widths manageable.',
      'You still end with logits over the vocabulary, but intermediate representations are structured rather than one-shot concatenation.',
    ],
  },
  {
    id: 'flatten',
    heading: 'FlattenConsecutive and growing receptive field',
    paragraphs: [
      'Given tensor (B, T, C), group every n consecutive positions along time into the channel dimension: (B, T/n, C*n). After linear + tanh + BatchNorm, repeat with n=2 until T collapses to 1.',
      'Two layers with n=2 turn 4 tokens into one vector; three layers reach 8 tokens. This mirrors DeepMind WaveNet dilated convolutions in spirit, simplified for teaching.',
      'Implement FlattenConsecutive as a thin wrapper around view—no extra parameters, only reshape.',
    ],
    code: {
      language: 'python',
      caption: 'Pairwise flatten along time',
      body: `# x: (B, T, C) with T % 2 == 0
x = x.view(B, T // 2, C * 2)`,
    },
  },
  {
    id: 'bn3d',
    heading: 'BatchNorm on fused blocks',
    paragraphs: [
      'After flattening, tensors are 3D: batch × new_time × channels. BatchNorm1d can normalize over the channel dimension per position; some stacks reduce over dims (0, 1) to mimic global statistics across batch and time.',
      'Match training and eval modes: model.train() updates running stats; model.eval() freezes them.',
      'Modular Sequential containers keep the forward readable: Flatten → Linear → BatchNorm → tanh repeated.',
    ],
    callout: {
      tone: 'note',
      body: 'Main course chapter 3 (N-gram MLP) continues this thread; compare flat MLP vs hierarchical stacks on the same corpus.',
    },
  },
]
