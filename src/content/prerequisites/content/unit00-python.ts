import type { PrereqSection } from '../types'

export const unit00Sections: PrereqSection[] = [
  {
    id: 'sequences',
    heading: 'Lists, tuples, and sliding windows',
    paragraphs: [
      'Language models consume sequences of symbols. In Python, a string is an immutable sequence of characters; a list is a mutable sequence of arbitrary objects. Indexing starts at 0: for word = "fox", word[0] is "f" and word[-1] is "x". Slicing word[1:] returns every character after the first—this pattern builds bigram contexts without manual loops over indices.',
      'Tuples behave like lists but cannot be reassigned in place; they are useful for fixed pairs such as (previous_char, next_char). When you iterate a corpus, you often need overlapping windows: for indices i, the context might be chars[i : i + block_size] and the target chars[i + block_size]. Off-by-one errors at the end of the string are why courses introduce explicit start/end tokens (makemore uses ".").',
      'Before PyTorch, you will implement these windows with plain Python in the bigram lab. Getting comfortable with slice notation saves hours when reading transformer training code that reshapes batches.',
    ],
    code: {
      language: 'python',
      caption: 'Sliding character windows',
      body: `text = "emma"
for i in range(len(text) - 1):
    context, target = text[i], text[i + 1]
    print(context, "->", target)
# e -> m, m -> m, m -> a`,
    },
    checkYourself: [
      {
        prompt: 'Why is word[-1] useful when you do not know the string length?',
        reveal: 'Negative indices count from the end, so you can grab the last character without len(word) - 1.',
      },
    ],
  },
  {
    id: 'iteration',
    heading: 'zip, enumerate, and dictionary tables',
    paragraphs: [
      'zip pairs elements from multiple sequences in lockstep. zip("ab", "bc") yields ("a","b") and ("b","c")—exactly the bigram iterator you need before building a count matrix. enumerate adds an index: for i, ch in enumerate(word) lets you align positions with characters when debugging tokenization.',
      'Counting co-occurrences is naturally expressed as a dictionary mapping keys to integers. dict.get(key, 0) avoids KeyError when incrementing rare pairs. When you move to neural models, the same mapping becomes s2i (string to index) and i2s (index to string): two dicts that define your vocabulary.',
      'sorted(..., key=lambda kv: kv[1], reverse=True) appears constantly when finding the most frequent BPE merge or inspecting loss components. Lambda is a one-line anonymous function; use it when the sort key is simple and local.',
    ],
    code: {
      language: 'python',
      caption: 'Bigram counts with zip',
      body: `counts = {}
for a, b in zip("emma", "mmma"):
    key = a + b
    counts[key] = counts.get(key, 0) + 1
print(counts)  # {'em': 1, 'mm': 1, 'ma': 1}`,
    },
    keyTerms: [
      { term: 's2i / i2s', definition: 'Lookup tables mapping characters or tokens to integer ids and back—your vocabulary API.' },
    ],
  },
  {
    id: 'oop',
    heading: 'Classes, dunder methods, and callable modules',
    paragraphs: [
      'micrograd wraps floats in a Value class. __init__(self, data) stores the number on self.data and initializes self.grad to zero. Methods take self as the first argument so each instance can read and update its own fields.',
      'Operator overloading lets Value participate in normal math: __add__ returns a new Value representing the sum and records child nodes for backprop. __mul__, __pow__, and __neg__ do the same. __radd__ and __rmul__ handle reflected operations when Python sees 2 * value instead of value * 2.',
      '__repr__ controls what print(value) shows—essential when tracing graphs. __call__ turns instances into functions: a Neuron class with __call__(self, x) lets you write y = neuron(x) the same way you later write y = layer(x) in PyTorch.',
    ],
    code: {
      language: 'python',
      caption: 'Minimal Value with + and *',
      body: `class Value:
    def __init__(self, data):
        self.data = data
        self.grad = 0.0
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data)
    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data)
    def __repr__(self):
        return f"Value({self.data})"`,
    },
    callout: {
      tone: 'tip',
      body: 'Run the Unit 0.0 lab to execute a Neuron class that uses these patterns end-to-end.',
    },
  },
  {
    id: 'torch',
    heading: 'PyTorch tensors you will see in every lab',
    paragraphs: [
      'torch.tensor([1, 2, 3]) infers integer dtype; torch.tensor([1.0, 2.0]) is float. torch.Tensor is a class alias with different defaults—most course code uses torch.tensor or torch.zeros / torch.randn with explicit dtype=torch.float32.',
      'Integer token ids must become floats before matmul with weights: x = torch.tensor([1, 2]); w = torch.randn(3, 5); you cannot multiply x @ w until x = x.float() or you index rows of an embedding table.',
      'Shape is (rows, cols) for 2D tensors. For a batch of sequences, expect (batch, time) or (batch, time, channels). view reshapes using the same underlying storage—makemore uses it to flatten context blocks without copying memory.',
    ],
    code: {
      language: 'python',
      caption: 'view vs reshape intuition',
      body: `import torch
x = torch.arange(12).view(3, 4)   # 3 rows, 4 cols
y = x.view(3, 2, 2)              # same 12 elements, new shape
assert y.numel() == x.numel()`,
    },
    checkYourself: [
      {
        prompt: 'Why does .float() matter before multiplying token ids by weights?',
        reveal: 'Integer dtypes do not participate in gradient-based weight updates the same way; embeddings and linear layers expect floating activations.',
      },
    ],
  },
]
