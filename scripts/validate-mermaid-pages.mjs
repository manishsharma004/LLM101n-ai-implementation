import { chromium } from 'playwright'
import path from 'node:path'

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'
const chromePath =
  process.env.CHROME_PATH ?? '/tmp/pw-browsers/chromium-1243/chrome-linux64/chrome'

const routes = [
  '#/chapter/bigram-language-model',
  '#/chapter/micrograd',
  '#/chapter/ngram-mlp',
  '#/chapter/transformer',
  '#/chapter/tokenization',
  '#/chapter/precision',
  '#/chapter/distributed',
  '#/chapter/finetuning-sft',
  '#/chapter/multimodal',
  '#/appendix',
]

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

let failures = 0
for (const hash of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForTimeout(2500)
  const syntax = await page.getByText('Syntax error in text').count()
  const errors = await page.locator('.diagram-error').count()
  const rendered = await page.locator('.mermaid-svg svg').count()
  if (syntax > 0 || errors > 0) {
    failures++
    console.error('FAIL', hash, { syntax, errors, rendered })
  } else {
    console.log('ok', hash, 'diagrams', rendered)
  }
  await page.close()
}

await browser.close()
if (failures) process.exit(1)
console.log('all mermaid pages ok')
