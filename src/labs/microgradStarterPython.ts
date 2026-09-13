/** Karpathy-style micrograd (scalar autograd) + training loop — runs in Pyodide. */
export const MICROGRAD_STARTER_PYTHON = String.raw`
class Value:
    """Scalar with autograd (micrograd-style)."""

    def __init__(self, data, _children=(), _op=""):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def __pow__(self, other):
        assert isinstance(other, (int, float))
        out = Value(self.data ** other, (self,), f"**{other}")
        def _backward():
            self.grad += (other * self.data ** (other - 1)) * out.grad
        out._backward = _backward
        return out

    def __neg__(self):
        return self * -1

    def __sub__(self, other):
        return self + (-other)

    def __radd__(self, other):
        return self + other

    def __rmul__(self, other):
        return self * other

    def __truediv__(self, other):
        return self * other**-1

    def __repr__(self):
        return f"Value(data={self.data})"

    def backward(self):
        topo = []
        visited = set()

        def build(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build(child)
                topo.append(v)

        build(self)
        self.grad = 1.0
        for v in reversed(topo):
            v._backward()


def zero_grad(*nodes):
    for n in nodes:
        n.grad = 0.0


# --- Training demo: fit f(x) = (w1*x + b) * w2 to target 1 when x=2 ---
x = Value(2.0)
w1 = Value(-3.0)
w2 = Value(1.0)
b = Value(6.0)
lr = 0.05
steps = 30

print("micrograd training in Pyodide (edit hyperparams above and re-run)")
for step in range(steps):
    n = (x * w1 + b) * w2
    loss = (n - Value(1.0)) ** 2
    zero_grad(x, w1, w2, b)
    loss.backward()
    w1.data -= lr * w1.grad
    w2.data -= lr * w2.grad
    b.data -= lr * b.grad
    if step % 5 == 0:
        print(f"step {step:2d}  loss={loss.data:.6f}  w1={w1.data:.4f}  w2={w2.data:.4f}  b={b.data:.4f}")

print("done.")
`
