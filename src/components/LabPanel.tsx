import type { LabId } from '../content/types'
import {
  ATTENTION_STARTER_PYTHON,
  BIGRAM_STARTER_PYTHON,
  BPE_STARTER_PYTHON,
  DATASET_STARTER_PYTHON,
  DEVICE_STARTER_PYTHON,
  DPO_STARTER_PYTHON,
  KVCACHE_STARTER_PYTHON,
  MLP_STARTER_PYTHON,
  MULTIMODAL_STARTER_PYTHON,
  OPTIMIZER_STARTER_PYTHON,
  PRECISION_STARTER_PYTHON,
  QUANT_STARTER_PYTHON,
  SFT_STARTER_PYTHON,
  WORKERS_STARTER_PYTHON,
} from '../labs/pythonLabStarters'
import { MICROGRAD_STARTER_PYTHON } from '../labs/microgradStarterPython'
import { PyodideCodeLab } from './PyodideCodeLab'

const PY_LAB: Partial<
  Record<
    LabId,
    { title: string; description?: string; code: string; runLabel?: string; minLines?: number }
  >
> = {
  bigram: {
    title: 'Lab: Bigram training & sampling (Python)',
    description: 'Train character bigrams on the TinyStories sample shard and sample text.',
    code: BIGRAM_STARTER_PYTHON,
    runLabel: 'Train & generate',
    minLines: 18,
  },
  micrograd: {
    title: 'Lab: Micrograd (Python)',
    description: 'Karpathy-style scalar autograd and SGD in CPython (Pyodide).',
    code: MICROGRAD_STARTER_PYTHON,
    runLabel: 'Run training',
    minLines: 18,
  },
  bpe: {
    title: 'Lab: BPE merges (Python)',
    code: BPE_STARTER_PYTHON,
    runLabel: 'Train BPE',
    minLines: 16,
  },
  attention: {
    title: 'Lab: Causal attention weights (Python)',
    code: ATTENTION_STARTER_PYTHON,
    minLines: 12,
  },
  dataset: {
    title: 'Lab: TinyStories sample loader (Python)',
    code: DATASET_STARTER_PYTHON,
    minLines: 10,
  },
  device: {
    title: 'Lab: CPU matmul benchmark (Python)',
    description: 'Compare with WebGPU in chapter 8 when the browser exposes it.',
    code: DEVICE_STARTER_PYTHON,
    minLines: 12,
  },
  workers: {
    title: 'Lab: Toy all-reduce (Python)',
    description: 'Simulates data-parallel gradient shards (DDP intuition).',
    code: WORKERS_STARTER_PYTHON,
    minLines: 10,
  },
  kvcache: {
    title: 'Lab: KV-cache complexity (Python)',
    code: KVCACHE_STARTER_PYTHON,
    minLines: 12,
  },
  quantize: {
    title: 'Lab: INT8 quantize vector (Python)',
    code: QUANT_STARTER_PYTHON,
    minLines: 10,
  },
  optimizer: {
    title: 'Lab: Gradient descent (Python)',
    code: OPTIMIZER_STARTER_PYTHON,
    minLines: 10,
  },
  precision: {
    title: 'Lab: fp32 drift (Python)',
    code: PRECISION_STARTER_PYTHON,
    minLines: 8,
  },
  mlp: {
    title: 'Lab: Tiny MLP LM forward pass (Python)',
    code: MLP_STARTER_PYTHON,
    minLines: 16,
  },
  'sft-prompt': {
    title: 'Lab: SFT chat template (Python)',
    code: SFT_STARTER_PYTHON,
    minLines: 6,
  },
  'dpo-prompt': {
    title: 'Lab: Preference pair (Python)',
    code: DPO_STARTER_PYTHON,
    minLines: 6,
  },
  multimodal: {
    title: 'Lab: Illustration prompt (Python)',
    code: MULTIMODAL_STARTER_PYTHON,
    minLines: 6,
  },
}

export function LabPanel({ labIds }: { labIds: LabId[] }) {
  return (
    <div className="labs">
      {labIds.map((id) => {
        const spec = PY_LAB[id]
        if (!spec) return null
        return (
          <PyodideCodeLab
            key={id}
            title={spec.title}
            description={spec.description}
            starterCode={spec.code}
            runLabel={spec.runLabel}
            editorMinLines={spec.minLines}
          />
        )
      })}
    </div>
  )
}
