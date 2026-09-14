export type QuizQuestion = {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explain: string
}

export const graduationQuestions: QuizQuestion[] = [
  {
    id: 'broadcast',
    prompt: 'In PyTorch, what shape does (3, 1) + (4,) broadcast to?',
    choices: ['(3, 4)', '(4, 3)', 'Error — incompatible', '(3,)'],
    correctIndex: 0,
    explain: 'Trailing dimensions align: (3,1) broadcasts across 4 to (3,4).',
  },
  {
    id: 'autograd',
    prompt: 'After loss.backward(), where do leaf gradients accumulate?',
    choices: ['loss.grad', 'tensor.grad on leaves with requires_grad=True', 'optimizer state only', 'every intermediate node'],
    correctIndex: 1,
    explain: 'PyTorch accumulates .grad on leaves; intermediates are freed unless retained.',
  },
  {
    id: 'bpe',
    prompt: 'Byte-level BPE starts with how many base tokens?',
    choices: ['26 letters', '256 bytes', '32k merges', 'UTF-16 code units'],
    correctIndex: 1,
    explain: 'GPT-2 style byte BPE uses 256 byte tokens before merges.',
  },
  {
    id: 'bigram',
    prompt: 'Uniform bigram NLL over 27 symbols is approximately:',
    choices: ['ln(27) ≈ 3.3', '27.0', '1.0', '0.0'],
    correctIndex: 0,
    explain: '-log(1/27) = ln(27) ≈ 3.30 nats per character.',
  },
]
