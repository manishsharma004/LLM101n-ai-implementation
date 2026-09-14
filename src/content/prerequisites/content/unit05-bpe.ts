import type { PrereqSection } from '../types'

export const unit05Sections: PrereqSection[] = [
  {
    id: 'bytes',
    heading: 'Why UTF-8 bytes instead of Unicode code points?',
    paragraphs: [
      'Unicode assigns code points to 150k+ characters—too large for a softmax in small models. UTF-8 encodes each code point as 1–4 bytes from a fixed alphabet of 256 byte values.',
      'BPE starts with 256 byte tokens and merges frequent pairs into new ids 256, 257, … until vocabulary size budget is met. Rare characters share byte sequences; common words become single tokens.',
      'Decoding maps ids back to bytes, then bytes to string with errors="replace" for invalid sequences—production tokenizers must not crash on bad data.',
    ],
  },
  {
    id: 'merge-loop',
    heading: 'The BPE training loop',
    paragraphs: [
      'get_stats(ids) counts adjacent pairs in the current token id list. Pick the most frequent pair (a, b), assign a new id, and merge all non-overlapping occurrences with merge(ids, pair, new_id).',
      'Store merges in order—merge rank matters at encode time. Training is greedy and deterministic given tie-breaking rules.',
      'Vocabulary size trades compression (fewer tokens per document) against rare-token coverage and embedding table size.',
    ],
    code: {
      language: 'python',
      caption: 'Merge one pair into new id',
      body: `def merge(ids, pair, new_id):
    i = 0
    out = []
    while i < len(ids):
        if i < len(ids) - 1 and (ids[i], ids[i+1]) == pair:
            out.append(new_id)
            i += 2
        else:
            out.append(ids[i])
            i += 1
    return out`,
    },
  },
  {
    id: 'regex-special',
    heading: 'Regex pretokenization and special tokens',
    paragraphs: [
      'GPT-2 applies a regex to split text into chunks (letters, numbers, punctuation, whitespace) before byte-level BPE inside each chunk. That prevents merges from jumping unnatural boundaries.',
      'Special strings like <|endoftext|> are registered with fixed ids and excluded from merge tables—they delimit documents or chat turns without being split by BPE.',
      'Compare your toy tokenizer to tiktoken cl100k_base in the main tokenization chapter: same ideas, industrial scale and optimized Rust implementations.',
    ],
    checkYourself: [
      {
        prompt: 'Why is merge order part of the tokenizer file format?',
        reveal: 'Encoding must replay merges in the same order they were learned; otherwise the same text maps to different id sequences.',
      },
    ],
    callout: {
      tone: 'tip',
      body: 'Use the BPE lab to train merges on a short string, then encode/decode round-trip to verify correctness.',
    },
  },
]
