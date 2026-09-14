/** Embedded Python labs for Pyodide — edit and run in Monaco. */

export const CORPUS_FETCH_HELPER = String.raw`
def load_corpus():
    """Reads /tinystories-sample.txt mounted by the host app before Run."""
    try:
        with open("/tinystories-sample.txt", "r", encoding="utf-8") as f:
            text = f.read()
    except OSError as e:
        raise RuntimeError(
            "TinyStories shard not mounted — wait for Pyodide ready or refresh the page"
        ) from e
    if len(text) < 500:
        raise RuntimeError(f"Corpus too small ({len(text)} chars) — lab cannot train on this shard")
    return text
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


def sample_bigram(
    counts: dict[str, int],
    seed: str,
    max_len: int = 200,
    alpha: float = 0.5,
    temperature: float = 1.0,
    top_k: int | None = 8,
    greedy: bool = False,
) -> str:
    import random
    out = seed if seed else "O"
    for _ in range(max_len):
        ctx = out[-1]
        probs = row_probs(counts, ctx, alpha)
        if not probs:
            break
        items = sorted(probs.items(), key=lambda t: -t[1])
        if top_k is not None:
            items = items[:top_k]
        chars, weights = zip(*items)
        if greedy:
            out += chars[0]
            continue
        if temperature <= 0:
            out += chars[0]
            continue
        scaled = [w ** (1.0 / temperature) for w in weights]
        s = sum(scaled)
        scaled = [w / s for w in scaled]
        out += random.choices(chars, weights=scaled, k=1)[0]
    return out


# --- generation knobs (issue #10) ---
SEED = "Once "
MAX_LEN = 180
SMOOTHING_ALPHA = 0.5
TEMPERATURE = 0.9
TOP_K = 8
GREEDY = False

text = load_corpus()
counts = train_bigram(text)
print(f"trained {len(counts)} bigram keys on {len(text)} chars")
for mode, kwargs in [
    ("sampled", {"greedy": False}),
    ("greedy", {"greedy": True}),
]:
    gen = sample_bigram(
        counts,
        SEED,
        max_len=MAX_LEN,
        alpha=SMOOTHING_ALPHA,
        temperature=TEMPERATURE,
        top_k=TOP_K,
        **kwargs,
    )
    print(f"--- {mode} (T={TEMPERATURE}, top_k={TOP_K}) ---")
    print(gen[:320])
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


def apply_merges(tokens: list[str], rules: list[tuple[str, str]]) -> list[str]:
    word = list(tokens)
    for a, b in rules:
        i = 0
        merged = a + b
        nxt: list[str] = []
        while i < len(word):
            if i < len(word) - 1 and word[i] == a and word[i + 1] == b:
                nxt.append(merged)
                i += 2
            else:
                nxt.append(word[i])
                i += 1
        word = nxt
    return word


def encode_word(word: str, rules: list[tuple[str, str]]) -> list[str]:
    return apply_merges(list(word), rules)


def decode_tokens(tokens: list[str]) -> str:
    return "".join(tokens)


text = load_corpus()
vocab, rules = train_bpe(text, 12)
print("vocab size:", len(vocab))
print("merges:", " ".join(f"{a}+{b}" for a, b in rules))
demo = "strawberry"
enc = encode_word(demo, rules)
print(f"encode '{demo}' ->", enc)
print("decode ->", decode_tokens(enc))
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


def causal_attention_matrix(T: int, d: int):
    Q = [[random.uniform(-0.2, 0.2) for _ in range(d)] for _ in range(T)]
    K = [[random.uniform(-0.2, 0.2) for _ in range(d)] for _ in range(T)]
    scale = 1.0 / math.sqrt(d)
    rows = []
    for i in range(T):
        scores = []
        for j in range(T):
            dot = sum(Q[i][k] * K[j][k] for k in range(d))
            scores.append(-1e9 if j > i else dot * scale)
        rows.append(softmax(scores))
    return rows


def print_heatmap(weights, title: str):
    print(title)
    for i, row in enumerate(weights):
        cells = "".join("#" if w > 0.25 else "." if w > 0.08 else " " for w in row)
        nums = " ".join(f"{w:.2f}" for w in row)
        print(f"q{i} |{cells}|  {nums}")


W = causal_attention_matrix(4, 3)
print_heatmap(W, "Causal attention heatmap (d=3, T=4):")
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
# SGD vs Adam vs AdamW on f(x,y) = x^2 + 10 y^2 (stiff axes)
import math

def loss(x, y):
    return x * x + 10 * y * y


def grad(x, y):
    return 2 * x, 20 * y


def run_sgd(steps=30, lr=0.08):
    x, y = 4.0, 2.0
    for _ in range(steps):
        gx, gy = grad(x, y)
        x -= lr * gx
        y -= lr * gy
    return loss(x, y)


def run_adam(steps=30, lr=0.15, beta1=0.9, beta2=0.999, eps=1e-8):
    x, y = 4.0, 2.0
    mx, my, vx, vy = 0.0, 0.0, 0.0, 0.0
    for t in range(1, steps + 1):
        gx, gy = grad(x, y)
        mx = beta1 * mx + (1 - beta1) * gx
        my = beta1 * my + (1 - beta1) * gy
        vx = beta2 * vx + (1 - beta2) * gx * gx
        vy = beta2 * vy + (1 - beta2) * gy * gy
        mx_hat = mx / (1 - beta1 ** t)
        my_hat = my / (1 - beta1 ** t)
        vx_hat = vx / (1 - beta2 ** t)
        vy_hat = vy / (1 - beta2 ** t)
        x -= lr * mx_hat / (math.sqrt(vx_hat) + eps)
        y -= lr * my_hat / (math.sqrt(vy_hat) + eps)
    return loss(x, y)


def run_adamw(steps=30, lr=0.15, wd=0.01, beta1=0.9, beta2=0.999, eps=1e-8):
    x, y = 4.0, 2.0
    mx, my, vx, vy = 0.0, 0.0, 0.0, 0.0
    for t in range(1, steps + 1):
        gx, gy = grad(x, y)
        mx = beta1 * mx + (1 - beta1) * gx
        my = beta1 * my + (1 - beta1) * gy
        vx = beta2 * vx + (1 - beta2) * gx * gx
        vy = beta2 * vy + (1 - beta2) * gy * gy
        mx_hat = mx / (1 - beta1 ** t)
        my_hat = my / (1 - beta1 ** t)
        vx_hat = vx / (1 - beta2 ** t)
        vy_hat = vy / (1 - beta2 ** t)
        x -= lr * (mx_hat / (math.sqrt(vx_hat) + eps) + wd * x)
        y -= lr * (my_hat / (math.sqrt(vy_hat) + eps) + wd * y)
    return loss(x, y)


print("final loss (lower is better):")
print(f"  SGD:   {run_sgd():.6f}")
print(f"  Adam:  {run_adam():.6f}")
print(f"  AdamW: {run_adamw():.6f}")
print("AdamW decouples weight decay from the adaptive step — default in modern LM trainers.")
`

export const TRANSFORMER_BLOCK_STARTER_PYTHON = String.raw`
import math
import random

random.seed(0)


def softmax(xs):
    m = max(xs)
    ex = [math.exp(x - m) for x in xs]
    s = sum(ex)
    return [e / s for e in ex]


def layer_norm(x, eps=1e-5):
    mu = sum(x) / len(x)
    var = sum((v - mu) ** 2 for v in x) / len(x)
    inv = 1.0 / math.sqrt(var + eps)
    return [(v - mu) * inv for v in x]


def dot(a, b):
    return sum(ai * bi for ai, bi in zip(a, b))


def matvec(rows, v):
    return [dot(r, v) for r in rows]


def causal_attention(x_tokens, d):
    T = len(x_tokens)
    scale = 1.0 / math.sqrt(d)
    out = []
    for i in range(T):
        scores = []
        for j in range(T):
            s = dot(x_tokens[i], x_tokens[j]) * scale
            scores.append(-1e9 if j > i else s)
        w = softmax(scores)
        mixed = [0.0] * d
        for j in range(T):
            for k in range(d):
                mixed[k] += w[j] * x_tokens[j][k]
        out.append(mixed)
    return out


def mlp_token(x, hidden):
    h = [max(0.0, v) for v in matvec(hidden, x)]  # ReLU toy FFN
    w2 = [[random.uniform(-0.1, 0.1) for _ in range(len(hidden))] for _ in range(len(x))]
    return matvec(w2, h)


def transformer_block(x_tokens):
    d = len(x_tokens[0])
    hidden = [[random.uniform(-0.1, 0.1) for _ in range(d)] for _ in range(2 * d)]
    attn_out = causal_attention(x_tokens, d)
    x1 = [layer_norm([a + b for a, b in zip(xi, ai)]) for xi, ai in zip(x_tokens, attn_out)]
    mlp_out = [mlp_token(xi, hidden) for xi in x1]
    return [layer_norm([a + b for a, b in zip(xi, mi)]) for xi, mi in zip(x1, mlp_out)]


T, d = 4, 6
x0 = [[random.uniform(-0.2, 0.2) for _ in range(d)] for _ in range(T)]
x1 = transformer_block(x0)
print(f"block in/out shapes: {len(x0)}x{d} -> {len(x1)}x{len(x1[0])}")
print("token 0 L2 norm before/after:", round(math.sqrt(sum(v * v for v in x0[0])), 4), "->", round(math.sqrt(sum(v * v for v in x1[0])), 4))
print("One decoder block: causal attn + residual + norm + MLP + residual + norm.")
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
import random

random.seed(0)
T, d = 64, 8


def step_attention(q, keys, values):
    scores = [sum(q[k] * keys[j][k] for k in range(d)) for j in range(len(keys))]
    m = max(scores)
    ex = [pow(2.718281828, s - m) for s in scores]
    s = sum(ex)
    w = [e / s for e in ex]
    out = [sum(w[j] * values[j][k] for j in range(len(values))) for k in range(d)]
    return out


def decode_naive(seq_len: int) -> int:
    ops = 0
    for t in range(seq_len):
        keys = [[random.random() for _ in range(d)] for _ in range(t + 1)]
        values = [[random.random() for _ in range(d)] for _ in range(t + 1)]
        q = [random.random() for _ in range(d)]
        step_attention(q, keys, values)
        ops += (t + 1)
    return ops


def decode_cached(seq_len: int) -> int:
    keys: list[list[float]] = []
    values: list[list[float]] = []
    ops = 0
    for t in range(seq_len):
        keys.append([random.random() for _ in range(d)])
        values.append([random.random() for _ in range(d)])
        q = [random.random() for _ in range(d)]
        step_attention(q, keys, values)
        ops += len(keys)
    return ops


n_ops = decode_naive(T)
c_ops = decode_cached(T)
print(f"sequence length T={T}, head dim d={d}")
print(f"naive recompute-all attention ops ~ {n_ops}")
print(f"cached append-one-step ops ~ {c_ops}")
print(f"ratio naive/cached ~ {n_ops / c_ops:.1f}x (not wall-clock; shows growth)")
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

export const MLP_STARTER_PYTHON = String.raw`${CORPUS_FETCH_HELPER}
# Tiny char-level MLP LM — forward + SGD steps (chapter 3)
import math
import random

random.seed(1)
text = load_corpus()[:4000]
vocab = sorted(set(text))
stoi = {ch: i for i, ch in enumerate(vocab)}
itos = {i: ch for ch, i in stoi.items()}
V = len(vocab)
C = 3
H = 12
lr = 0.05

W1 = [[random.uniform(-0.05, 0.05) for _ in range(C * V)] for _ in range(H)]
b1 = [0.0] * H
W2 = [[random.uniform(-0.05, 0.05) for _ in range(H)] for _ in range(V)]
b2 = [0.0] * V


def gelu(x):
    return 0.5 * x * (1 + math.tanh(math.sqrt(2 / math.pi) * (x + 0.044715 * x**3)))


def gelu_deriv(x):
    t = math.tanh(math.sqrt(2 / math.pi) * (x + 0.044715 * x**3))
    return 0.5 * (1 + t) + 0.5 * x * (1 - t * t) * (math.sqrt(2 / math.pi) * (1 + 3 * 0.044715 * x**2))


def forward(context_ids):
    x = []
    for cid in context_ids:
        row = [0.0] * V
        row[cid] = 1.0
        x.extend(row)
    pre = [sum(w * xi for w, xi in zip(W1[i], x)) + b1[i] for i in range(H)]
    h = [gelu(p) for p in pre]
    logits = [sum(w * hi for w, hi in zip(W2[j], h)) + b2[j] for j in range(V)]
    m = max(logits)
    ex = [math.exp(l - m) for l in logits]
    s = sum(ex)
    probs = [e / s for e in ex]
    return x, pre, h, probs


def train_step(i: int):
    ctx = [stoi[text[i + j]] for j in range(C)]
    target = stoi[text[i + C]]
    x, pre, h, probs = forward(ctx)
    loss = -math.log(probs[target] + 1e-9)
    dlogits = probs[:]
    dlogits[target] -= 1.0
    dh = [sum(W2[j][k] * dlogits[j] for j in range(V)) for k in range(H)]
    dpre = [dh[k] * gelu_deriv(pre[k]) for k in range(H)]
    for j in range(V):
        for k in range(H):
            W2[j][k] -= lr * dlogits[j] * h[k]
        b2[j] -= lr * dlogits[j]
    for k in range(H):
        for idx, xi in enumerate(x):
            W1[k][idx] -= lr * dpre[k] * xi
        b1[k] -= lr * dpre[k]
    return loss


steps = 80
losses = []
for step in range(steps):
    i = random.randint(0, len(text) - C - 2)
    losses.append(train_step(i))
print(f"train steps: {steps}, vocab={V}")
print(f"loss start={losses[0]:.3f} end={losses[-1]:.3f}")
ctx = [stoi[c] for c in text[C : C + 3] if c in stoi]
_, _, _, probs = forward(ctx)
top = sorted(zip(vocab, probs), key=lambda t: -t[1])[:5]
print("after train, top next chars:")
for ch, p in top:
    print(f"  {repr(ch)}: {p:.4f}")
`

export const EVAL_STARTER_PYTHON = String.raw`${CORPUS_FETCH_HELPER}
import math

def train_bigram(text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for i in range(len(text) - 1):
        key = text[i] + "|" + text[i + 1]
        counts[key] = counts.get(key, 0) + 1
    return counts


def nll_bigram(counts: dict[str, int], text: str, alpha: float = 0.5) -> float:
    vocab = set(text)
    nll = 0.0
    n = 0
    for i in range(len(text) - 1):
        a, b = text[i], text[i + 1]
        total = alpha * len(vocab)
        row_sum = 0.0
        for key, c in counts.items():
            ka, kb = key.split("|", 1)
            if ka != a:
                continue
            row_sum += c
            total += c
        p = (counts.get(a + "|" + b, 0) + alpha) / total if total else 1e-9
        nll -= math.log(p)
        n += 1
    return nll / max(n, 1)


text = load_corpus()
lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
split = max(1, int(len(lines) * 0.85))
train = "\\n".join(lines[:split])
val = "\\n".join(lines[split:])
counts = train_bigram(train)
train_nll = nll_bigram(counts, train)
val_nll = nll_bigram(counts, val)
print(f"stories train/val: {split}/{len(lines) - split}")
print(f"train avg NLL (bits): {train_nll / math.log(2):.3f}")
print(f"val avg NLL (bits):   {val_nll / math.log(2):.3f}")
print(f"val perplexity ~ {math.exp(val_nll):.1f}")
`

export const LORA_STARTER_PYTHON = String.raw`
# LoRA: frozen W + low-rank update ΔW ≈ B @ A (issue #14 — not full Qwen training)
import random

random.seed(0)
m, n, r = 6, 5, 2
W = [[random.uniform(-0.5, 0.5) for _ in range(n)] for _ in range(m)]
A = [[random.uniform(-0.2, 0.2) for _ in range(n)] for _ in range(r)]
B = [[random.uniform(-0.2, 0.2) for _ in range(r)] for _ in range(m)]


def matmul(X, Y):
    return [
        [sum(X[i][k] * Y[k][j] for k in range(len(Y))) for j in range(len(Y[0]))]
        for i in range(len(X))
    ]


delta = matmul(B, A)
full_params = m * n
lora_params = m * r + r * n
print(f"W shape {m}x{n}: {full_params} frozen base params")
print(f"rank r={r}: trainable LoRA params = {lora_params} ({100 * lora_params / full_params:.1f}% of W)")
x = [1.0, 0.0, -0.5, 0.2, 0.0]
base = [sum(x[j] * W[i][j] for j in range(n)) for i in range(m)]
adapt = [sum(x[j] * delta[i][j] for j in range(n)) for i in range(m)]
print("base output:", [round(v, 3) for v in base])
print("+ LoRA:", [round(base[i] + adapt[i], 3) for i in range(m)])
print("\\nSFT chat template lab is separate (format only). No PPO/RLHF in-browser.")
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
