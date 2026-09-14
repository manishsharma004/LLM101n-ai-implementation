import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'
const outDir =
  process.env.ARTIFACTS_DIR ??
  '/tmp/cursor-1001/cursor_agent_stores/bc-c1252740-d37d-495d-9e9f-8106ede2fe31/files/artifacts'
const chromePath =
  process.env.CHROME_PATH ?? '/tmp/pw-browsers/chromium-1243/chrome-linux64/chrome'

const slugs = [
  'hub',
  'python-quickstart',
  'autograd-micrograd',
  'bigram-modeling',
  'mlp-and-batchnorm',
  'wavenet-hierarchies',
  'bpe-tokenization',
]

const shots = slugs.map((slug) => ({
  file: `prereq-${slug}.png`,
  hash: slug === 'hub' ? '#/prerequisites' : `#/prerequisites/${slug}`,
}))

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const { file, hash } of shots) {
  const slug = file.replace('prereq-', '').replace('.png', '')
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForTimeout(1500)
  const theory = page.locator('.chapter-split-theory')
  const hasProse = await theory.count().then((n) => n > 0)
  const textLen = hasProse
    ? await theory.innerText().then((t) => t.length)
    : await page.locator('.prereq-unit-grid').innerText().then((t) => t.length)
  if (textLen < 200 && slug !== 'hub') {
    console.warn('WARN: short content on', slug, 'chars=', textLen)
  }
  await page.screenshot({ path: path.join(outDir, file), fullPage: true })
  console.log('wrote', file, 'contentChars≈', textLen)
  await page.close()
}

await browser.close()
console.log('done')
