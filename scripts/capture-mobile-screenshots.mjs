import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'
const outDir =
  process.env.ARTIFACTS_DIR ??
  '/tmp/cursor-1001/cursor_agent_stores/bc-c1252740-d37d-495d-9e9f-8106ede2fe31/files/artifacts'
const chromePath =
  process.env.CHROME_PATH ?? '/tmp/pw-browsers/chromium-1243/chrome-linux64/chrome'

const viewports = [
  { name: 'iphone15', width: 393, height: 852 },
  { name: 'pixel9a', width: 412, height: 915 },
]

const routes = [
  { hash: '#/', file: 'mobile-home' },
  { hash: '#/prerequisites', file: 'mobile-prereq-hub' },
  { hash: '#/chapter/bigram-language-model', file: 'mobile-chapter-bigram' },
  { hash: '#/prerequisites/autograd-micrograd', file: 'mobile-prereq-micrograd' },
  { hash: '#/prerequisites/bpe-tokenization', file: 'mobile-prereq-bpe' },
  { hash: '#/chapter/multimodal', file: 'mobile-chapter-multimodal' },
  { hash: '#/prerequisites/graduation', file: 'mobile-prereq-graduation' },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const vp of viewports) {
  for (const { hash, file } of routes) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle', timeout: 90_000 })
    await page.waitForTimeout(1500)
    if (hash.includes('bigram-language-model')) {
      await page.locator('.workspace-mobile-tabs button', { hasText: 'Data' }).click().catch(() => {})
      await page.waitForTimeout(400)
    }
    if (hash.includes('multimodal')) {
      await page.locator('.workspace-mobile-tabs button', { hasText: 'Prompt' }).click().catch(() => {})
      await page.waitForTimeout(400)
    }
    const splitCols = await page
      .locator('.chapter-split')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns)
      .catch(() => 'n/a')
    const tabsVisible = await page.locator('.workspace-mobile-tabs').isVisible().catch(() => false)
    await page.screenshot({
      path: path.join(outDir, `${file}-${vp.name}.png`),
      fullPage: true,
    })
    console.log(file, vp.name, { tabsVisible, splitCols })
    await page.close()
  }
}

await browser.close()
console.log('done')
