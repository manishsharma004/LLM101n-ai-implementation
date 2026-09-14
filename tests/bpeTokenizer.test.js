import assert from 'node:assert/strict'
import { compressionRatio, encodeText, trainBpe } from '../src/lib/bpeTokenizerDemo.ts'

const { rules } = trainBpe('hello hello', 4)
const tokens = encodeText('hello', rules)
assert.ok(tokens.length >= 1)
assert.ok(compressionRatio('hello', tokens.length) >= 1)
