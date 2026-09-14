import type { PrereqSection } from '../types'

export const unit01Sections: PrereqSection[] = [
  {
    id: 'value-graph',
    heading: 'The Value object and expression graphs',
    paragraphs: [
      'A scalar autograd engine represents each intermediate result as a Value with .data (forward value) and .grad (accumulated ∂loss/∂this). When you compute c = a * b, the multiplication node stores _prev = (a, b) and _op = "*" so backward knows which local rule to apply.',
      'The graph is a DAG: no cycles, single loss root. Frameworks build the same structure behind torch operations; micrograd makes every edge visible so the chain rule is not magic.',
      'Printing the graph by walking _prev from the loss downward is a useful debugging habit before you trust large models.',
    ],
    keyTerms: [
      { term: 'DAG', definition: 'Directed acyclic graph of operations; backprop walks it from outputs to inputs.' },
      { term: 'local gradient', definition: 'Derivative of an op output w.r.t. each input, holding other inputs fixed.' },
    ],
  },
  {
    id: 'local-rules',
    heading: 'Local derivatives and the chain rule',
    paragraphs: [
      'Addition: if z = x + y, then ∂z/∂x = 1 and ∂z/∂y = 1, so each parent receives the downstream gradient unchanged. Multiplication: z = x * y gives ∂z/∂x = y and ∂z/∂y = x—swap in the other operand value at forward time.',
      'tanh squashes to (-1, 1); local derivative is 1 - tanh(x)². Powers follow n * x^(n-1). Division and subtraction compose from these primitives.',
      'During backward(), each node multiplies its local gradient by the gradient flowing in from above (the chain rule) and routes the product to parents.',
    ],
    code: {
      language: 'python',
      caption: 'Multiplication local grads (conceptual)',
      body: `# forward: out = a * b
# backward: a.grad += out.grad * b.data
#            b.grad += out.grad * a.data`,
    },
  },
  {
    id: 'backward',
    heading: 'Topological order and gradient accumulation',
    paragraphs: [
      'Build a list of nodes in reverse topological order (children before parents). Visit loss first with grad = 1.0, then call each node backward method.',
      'If the same Value is used twice in the graph, its gradient must accumulate with +=. Using = overwrites partial derivatives and breaks multivariate chain rule—this is the classic "variable reused in graph" bug.',
      'After backward, leaf parameters have .grad populated for the learning step.',
    ],
    checkYourself: [
      {
        prompt: 'Why zero gradients before each training step?',
        reveal: 'Unless you intentionally accumulate across batches, stale .grad from the previous step would add to new gradients and corrupt updates.',
      },
    ],
  },
  {
    id: 'mlp-train',
    heading: 'Neurons, MLPs, and the training loop',
    paragraphs: [
      'A neuron computes tanh(sum(w_i * x_i) + b). Stack neurons into layers, layers into an MLP. For regression toy data, Mean Squared Error (pred - target)² is a scalar loss you can differentiate.',
      'Training loop: forward → loss.backward() → for each parameter p: p.data -= learning_rate * p.grad → zero_grad(). Log loss every N steps; if loss diverges, reduce learning rate.',
      'This identical pattern trains billion-parameter models—only the forward pass and loss function change when you reach language modeling.',
    ],
    code: {
      language: 'python',
      caption: 'SGD step after backward',
      body: `loss.backward()
for p in parameters:
    p.data -= lr * p.grad
zero_grad(parameters)`,
    },
    callout: {
      tone: 'interview',
      body: 'Be able to explain reverse-mode AD vs forward-mode and why scalar-loss reverse pass is O(graph size), not O(num parameters × graph size).',
    },
  },
]
