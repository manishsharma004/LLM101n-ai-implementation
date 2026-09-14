import assert from 'node:assert/strict'
import { corpusUrl } from '../src/lib/tinystoriesCorpus.ts'

const url = corpusUrl()
assert.ok(url.includes('data/tinystories-sample.txt'), url)
assert.ok(url.startsWith('/') || url.startsWith('http'), url)
