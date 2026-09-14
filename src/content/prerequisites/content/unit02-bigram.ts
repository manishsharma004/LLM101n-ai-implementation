import type { PrereqSection } from '../types'

export const unit02Sections: PrereqSection[] = [
  {
    id: 'counts',
    heading: 'Building the 27×27 count matrix',
    paragraphs: [
      'Map each character to an integer 0–25 plus a special token "." for start/end. Scan the corpus: for every adjacent pair (i, j), increment N[i, j]. Row i of N counts how often character i is followed by each possible next character.',
      'This is maximum likelihood with a tabular model: no hidden layers, just stored statistics. It is a Markov chain of order 1 because the next symbol depends only on the current one.',
      'Tiny corpora produce sparse rows; rare pairs have count zero, which becomes a problem at sampling and evaluation time.',
    ],
    code: {
      language: 'python',
      caption: 'Row-normalize counts to probabilities',
      body: `import torch
N = torch.zeros(27, 27)
# ... fill N from corpus ...
P = N / N.sum(dim=1, keepdim=True)  # each row sums to 1`,
    },
  },
  {
    id: 'sample-nll',
    heading: 'Sampling, NLL, and smoothing',
    paragraphs: [
      'Given current character i, sample next j from P[i, :] using torch.multinomial. Repeat to generate names or story snippets. Seeding torch.manual_seed makes demos reproducible.',
      'Negative log-likelihood averages -log P(true_next | context). If the model assigns probability zero, loss is infinite—hence add-one smoothing: N += 1 before normalizing, or use a small epsilon in the denominator.',
      'Perplexity is exp(average NLL): interpret as effective branching factor. Lower is better.',
    ],
    keyTerms: [
      { term: 'NLL', definition: 'Negative log-likelihood; cross-entropy between empirical next-char and model distribution.' },
    ],
  },
  {
    id: 'neural-bigram',
    heading: 'One-hot linear model matches counting',
    paragraphs: [
      'Encode current character as a one-hot vector x of length 27. Logits are x @ W with W shaped (27, 27); no bias. Softmax turns logits into probabilities; cross-entropy loss against the true next character is the training objective.',
      'With enough data and training, learned rows of W align with log-counts from the table—neural and counting views are the same family, different implementation.',
      'This is the bridge to deeper models: replace one-hot with embeddings and add hidden layers (Unit 0.3).',
    ],
    code: {
      language: 'python',
      caption: 'Softmax from logits',
      body: `logits = x @ W
probs = logits.exp() / logits.exp().sum()
loss = -probs[target].log()`,
    },
    callout: {
      tone: 'note',
      body: 'The bigram Pyodide lab trains on a TinyStories shard—compare sampled text to count-based baselines.',
    },
  },
]
