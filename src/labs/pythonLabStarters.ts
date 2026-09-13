/** Embedded Python labs for Pyodide — edit and run in Monaco. */

export const CORPUS_FETCH_HELPER = String.raw`
def load_corpus():
    import urllib.request
    try:
        with urllib.request.urlopen("./data/tinystories-sample.txt") as f:
            return f.read().decode("utf-8")
    except Exception as e:
        print("Using fallback corpus:", e)
        return "Once upon a time, there was a little girl named Lily. She loved the forest."
`

export const BIGRAM_STARTER_PYTHON = String.raw`${CORPUS_FETCH_HELPER}

def train_bigram(text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for i in range(len(text) - 1):
        key = text[i] + "|" + text[i + 1]
        counts[key] = counts.get(key, 0) + 1
    return counts


def row_probs(counts: dict[str, int], context: str, alpha: float = 0.5) -> dict[str, float]:
    vocab = set()
    for key in counts:
        a, b = key.split("|", 1)
        vocab.add(a)
        vocab.add(b)
    total = alpha * len(vocab)
    row: dict[str, float] = {}
    for key, c in counts.items():
        a, b = key.split("|", 1)
        if a != context:
            continue
        row[b] = row.get(b, 0.0) + c
        total += c
    for b in list(row):
        row[b] = (row[b] + alpha) / total
    return row


def sample_bigram(counts: dict[str, int], seed: str, max_len: int = 280, alpha: float = 0.5) -> str:
    import random
    out = seed[-1:] if seed else "O"
    vocab = set()
    for key in counts:
        a, b = key.split("|", 1)
        vocab.add(a)
        vocab.add(b)
    for _ in range(max_len):
        ctx = out[-1]
        probs = row_probs(counts, ctx, alpha)
        if not probs:
            break
        chars, weights = zip(*probs.items())
        out += random.choices(chars, weights=weights, k=1)[0]
    return out


text = load_corpus()
counts = train_bigram(text)
print(f"trained {len(counts)} bigram keys on {len(text)} chars")
generated = sample_bigram(counts, "O", max_len=200, alpha=0.5)
print("--- sample ---")
print(generated[:400])
`

export const BPE_STARTER_PYTHON = String.raw`${CORPUS_FETCH_HELPER}

def train_bpe(text: str, merges: int = 12):
    words = [list(w) for w in text.split() if w]
    merge_rules: list[tuple[str, str]] = []

    def pair_counts(tokens):
        m: dict[str, int] = {}
        for word in tokens:
            for i in range(len(word) - 1):
                pair = word[i] + " " + word[i + 1]
                m[pair] = m.get(pair, 0) + 1
        return m

    for _ in range(merges):
        counts = pair_counts(words)
        if not counts:
            break
        best = max(counts, key=counts.get)
        if counts[best] < 2:
            break
        a, b = best.split(" ")
        merged = a + b
        merge_rules.append((a, b))
        new_words = []
        for word in words:
            i = 0
            nxt: list[str] = []
            while i < len(word):
                if i < len(word) - 1 and word[i] == a and word[i + 1] == b:
                    nxt.append(merged)
                    i += 2
                else:
                    nxt.append(word[i])
                    i += 1
            new_words.append(nxt)
        words = new_words

    vocab = sorted({t for word in words for t in word})
    return vocab, merge_rules


text = load_corpus()
vocab, rules = train_bpe(text, 12)
print("vocab size:", len(vocab))
print("merges:", " ".join(f"{a}+{b}" for a, b in rules))
`

export const ATTENTION_STARTER_PYTHON = String.raw`
import math
import random

random.seed(0)


def softmax(xs):
    m = max(xs)
    ex = [math.exp(x - m) for x in xs]
    s = sum(ex)
    return [e / s for e in ex]


def causal_attention_weights(T: int, d: int):
    Q = [[random.uniform(-0.2, 0.2) for _ in range(d)] for _ in range(T)]
    K = [[random.uniform(-0.2, 0.2) for _ in range(d)] for _ in range(T)]
    scale = 1.0 / math.sqrt(d)
    for i in range(T):
        scores = []
        for j in range(T):
            dot = sum(Q[i][k] * K[j][k] for k in range(d))
            scores.append(-1e9 if j > i else dot * scale)
        w = softmax(scores)
        print(f"pos {i}: " + " ".join(f"{x:.2f}" for x in w))


print("Causal attention weights (4x4 head, d=3):")
causal_attention_weights(4, 3)
`

export const DATASET_STARTER_PYTHON = String.raw`${CORPUS_FETCH_HELPER}

text = load_corpus()
lines = [ln for ln in text.splitlines() if ln.strip()]
words = text.split()
print(f"paragraphs: {len(lines)}")
print(f"chars: {len(text)}")
print(f"words (~): {len(words)}")
print("first line:", lines[0][:80] if lines else "(empty)")
`

export const OPTIMIZER_STARTER_PYTHON = String.raw`
# Gradient descent on a stiff quadratic (optimizer intuition)
x, y = 4.0, 2.0
lr = 0.08
path = []
for step in range(25):
    gx, gy = 2 * x, 20 * y
    x -= lr * gx
    y -= lr * gy
    if step % 5 == 0:
        loss = x * x + 10 * y * y
        path.append(f"step {step:2d} loss={loss:.4f} x={x:.3f} y={y:.3f}")
print("\\n".join(path))
`

export const QUANT_STARTER_PYTHON = String.raw`
import struct

weights = [(i - 4) * 0.25 for i in range(8)]
scale = max(abs(w) for w in weights) / 127
quant = [round(w / scale) for w in weights]
err = [abs(w - q * scale) for w, q in zip(weights, quant)]
print("scale:", round(scale, 6))
print("quant:", quant)
print("max abs error:", round(max(err), 6))
`

export const KVCACHE_STARTER_PYTHON = String.raw`
import time

def naive(T: int) -> float:
    t0 = time.perf_counter()
    acc = 0
    for t in range(1, T + 1):
        for i in range(t):
            acc += i
    return time.perf_counter() - t0


def incremental(T: int) -> float:
    t0 = time.perf_counter()
    acc = 0
    run = 0
    for t in range(1, T + 1):
        run += t - 1
        acc += run
    return time.perf_counter() - t0


T = 2000
n = naive(T)
i = incremental(T)
print(f"T={T}")
print(f"naive O(T^2) loop: {n*1000:.3f} ms")
print(f"incremental (KV-cache idea): {i*1000:.3f} ms")
print(f"speedup ~ {n/i:.1f}x")
`

export const PRECISION_STARTER_PYTHON = String.raw`
# fp32 accumulation drift (precision chapter)
x = 1.0001
acc = 0.0
for _ in range(1_000_000):
    acc += x
print("sum 1e6 * 1.0001 in fp32:", acc)
print("expected ~", 1_000_100.0)
`

export const WORKERS_STARTER_PYTHON = String.raw`
# Toy data-parallel gradient sum (DDP intuition, pure Python)

def shard_grad(seed: int, start: int, end: int) -> list[float]:
    return [float((i * seed) % 7) for i in range(start, end)]


workers = 2
chunk = 50
shards = []
for w in range(workers):
    start = w * (chunk // workers)
    end = start + chunk // workers
    shards.append(shard_grad(w + 1, start, end))

merged = [sum(s[i] for s in shards) for i in range(len(shards[0]))]
print("worker shards:", [round(sum(s), 1) for s in shards])
print("all-reduce sum:", round(sum(merged), 1))
`

export const DEVICE_STARTER_PYTHON = String.raw`
import time

# CPU matmul micro-benchmark (WebGPU/CUDA analogue in the course prose)
n = 64
A = [[float((i + j) % 7) for j in range(n)] for i in range(n)]
B = [[float((i * j) % 5) for j in range(n)] for i in range(n)]

t0 = time.perf_counter()
C = [[sum(A[i][k] * B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
cpu_ms = (time.perf_counter() - t0) * 1000
print(f"CPU matmul {n}x{n}: {cpu_ms:.2f} ms")
print("In the browser, chapter 8 compares this to WebGPU when available.")
`

export const MLP_STARTER_PYTHON = String.raw`
# Tiny char-level MLP LM step (chapter 3) — no external deps
import math
import random

random.seed(1)
vocab = sorted(set("abcdefghijklmnopqrstuvwxyz .,!?'"))
stoi = {ch: i for i, ch in enumerate(vocab)}
V = len(vocab)
C = 3  # context chars
H = 16

W1 = [[random.uniform(-0.1, 0.1) for _ in range(C * V)] for _ in range(H)]
b1 = [0.0] * H
W2 = [[random.uniform(-0.1, 0.1) for _ in range(H)] for _ in range(V)]
b2 = [0.0] * V


def gelu(x):
    return 0.5 * x * (1 + math.tanh(math.sqrt(2 / math.pi) * (x + 0.044715 * x**3)))


def forward(context_ids):
    x = []
    for cid in context_ids:
        row = [0.0] * V
        row[cid] = 1.0
        x.extend(row)
    h = [gelu(sum(w * xi for w, xi in zip(W1[i], x)) + b1[i]) for i in range(H)]
    logits = [sum(w * hi for w, hi in zip(W2[j], h)) + b2[j] for j in range(V)]
    m = max(logits)
    ex = [math.exp(l - m) for l in logits]
    s = sum(ex)
    probs = [e / s for e in ex]
    return probs


ctx = [stoi[c] for c in "the"]
probs = forward(ctx)
top = sorted(zip(vocab, probs), key=lambda t: -t[1])[:5]
print("context 'the' -> top next chars:")
for ch, p in top:
    print(f"  {repr(ch)}: {p:.4f}")
`

export const SFT_STARTER_PYTHON = String.raw`
template = """System: You are a TinyStories story assistant.
User: Continue with a gentle moral about sharing.
Assistant:"""
print(template)
print("\\nCopy into Storyteller or search assist to critique formatting.")
`

export const DPO_STARTER_PYTHON = String.raw`
chosen = "The friends shared the last cookie and laughed."
rejected = "The friends fought and went home angry."
print("Chosen:", chosen)
print("Rejected:", rejected)
print("\\nPreference pair for DPO / RLHF discussions (export as JSON for offline training).")
`

export const MULTIMODAL_STARTER_PYTHON = String.raw`
prompt = "Child-friendly watercolor: a fox and rabbit beside a mushroom, TinyStories style."
print("Illustration prompt:")
print(prompt)
print("\\nOpen an image-capable search tab from the Storyteller panel.")
`
