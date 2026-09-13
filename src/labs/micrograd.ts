export class Value {
  data: number
  grad = 0
  private backwardFn: (() => void) | null = null
  private prev: Set<Value> = new Set()

  constructor(data: number) {
    this.data = data
  }

  add(other: Value): Value {
    const out = new Value(this.data + other.data)
    out.prev = new Set([this, other])
    out.backwardFn = () => {
      this.grad += out.grad
      other.grad += out.grad
    }
    return out
  }

  mul(other: Value): Value {
    const out = new Value(this.data * other.data)
    out.prev = new Set([this, other])
    out.backwardFn = () => {
      this.grad += other.data * out.grad
      other.grad += this.data * out.grad
    }
    return out
  }

  sub(other: Value): Value {
    const out = new Value(this.data - other.data)
    out.prev = new Set([this, other])
    out.backwardFn = () => {
      this.grad += out.grad
      other.grad -= out.grad
    }
    return out
  }

  pow(n: number): Value {
    const out = new Value(this.data ** n)
    out.prev = new Set([this])
    out.backwardFn = () => {
      this.grad += n * this.data ** (n - 1) * out.grad
    }
    return out
  }

  backward(): void {
    const topo: Value[] = []
    const visited = new Set<Value>()
    const build = (v: Value) => {
      if (visited.has(v)) return
      visited.add(v)
      for (const p of v.prev) build(p)
      topo.push(v)
    }
    build(this)
    this.grad = 1
    for (let i = topo.length - 1; i >= 0; i--) topo[i].backwardFn?.()
  }
}

export function zeroGrad(...vals: Value[]): void {
  for (const v of vals) v.grad = 0
}
