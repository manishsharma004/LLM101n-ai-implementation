import type { PrereqSection } from '../types'

export const unit03Sections: PrereqSection[] = [
  {
    id: 'context-c',
    heading: 'Embedding table C and context windows',
    paragraphs: [
      'A bigram only sees one character of context. Bengio et al. (2003) concatenate embeddings of the previous k characters. Table C has shape (vocab_size, d): row t is the d-dimensional vector for token t.',
      'For context indices [t-2, t-1, t], gather three rows and flatten to length 3*d. That vector feeds a hidden layer with tanh, then a linear head to vocab logits.',
      'Use .view() to reshape embeddings without copying memory when batching many windows in parallel.',
    ],
    code: {
      language: 'python',
      caption: 'Context embedding lookup (conceptual)',
      body: `emb = C[context_ids]          # (batch, block, d)
x = emb.view(batch, block * d)  # concat along features`,
    },
  },
  {
    id: 'splits',
    heading: 'Train / dev / test and mini-batches',
    paragraphs: [
      'Hold out 10% for validation and 10% for test; train on 80%. Track NLL on dev every few hundred steps—if train improves but dev worsens, you are overfitting.',
      'Mini-batches sample random windows instead of full-corpus passes. Larger batches lower gradient noise but need more memory; learning rate often scales with batch size in production systems.',
      'Learning rate decay after plateaus is a simple schedule that appears again in GPT-2 reproduction videos.',
    ],
  },
  {
    id: 'init-bn',
    heading: 'Kaiming init and BatchNorm1d',
    paragraphs: [
      'Default uniform or normal inits can produce huge logits at start—softmax looks confident but wrong ("hockey stick" loss). Kaiming (He) init sets weight std = gain / sqrt(fan_in) so variance through tanh stays stable.',
      'BatchNorm1d standardizes activations per mini-batch to mean 0, variance 1, then applies learnable scale γ and shift β. At evaluation, use running_mean and running_var accumulated during training.',
      'BatchNorm lets you use higher learning rates and reduces sensitivity to initialization—standard in conv nets and early makemore MLP stacks.',
    ],
    checkYourself: [
      {
        prompt: 'Why track running statistics for BatchNorm at inference?',
        reveal: 'Eval often uses batch size 1; per-batch mean/var would be noisy. Running stats approximate the training distribution.',
      },
    ],
    callout: {
      tone: 'tip',
      body: 'Run the MLP lab after reading this unit—the loss curve should fall smoothly once init and LR are reasonable.',
    },
  },
]
