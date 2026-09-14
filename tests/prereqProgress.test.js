import assert from 'node:assert/strict'
import { allPrereqUnitsComplete } from '../src/lib/prerequisiteProgress.ts'

assert.equal(allPrereqUnitsComplete([]), false)
