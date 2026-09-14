export const PYTHON_PREREQ_STARTER = `# Unit 0.0 — Python patterns used in LLM101n labs
# Edit and run: slicing, zip/enumerate, comprehensions, a tiny Value class.

words = ["the", "fox", "ran"]
for i, w in enumerate(words):
    print(i, w, w[1:])  # sliding window start

pairs = list(zip(words, words[1:] + [""]))
print("bigram pairs:", pairs)

counts: dict[str, int] = {}
for a, b in zip("abca", "bcab"):
    key = a + b
    counts[key] = counts.get(key, 0) + 1
print("counts", counts)

top = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)
print("top pair", top[0])


class Value:
    def __init__(self, data: float):
        self.data = data
        self.grad = 0.0

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data)

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data)

    def __repr__(self):
        return f"Value({self.data})"

    def __rmul__(self, other):
        return self.__mul__(other)


class Neuron:
    def __init__(self, n_in: int):
        self.w = [Value(0.5) for _ in range(n_in)]
        self.b = Value(0.0)

    def __call__(self, x):
        act = self.b
        for wi, xi in zip(self.w, x):
            act = act + wi * xi
        return act


n = Neuron(2)
out = n([Value(1.0), Value(-0.5)])
print("neuron out", out)
print("2 * value", 2 * Value(3.0))

`
