import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'
const outDir =
  process.env.ARTIFACTS_DIR ??
  '/tmp/cursor-1001/cursor_agent_stores/bc-c1252740-d37d-495d-9e9f-8106ede2fe31/files/artifacts'
const chromePath =
  process.env.CHROME_PATH ?? '/tmp/pw-browsers/chromium-1243/chrome-linux64/chrome'

const shots = [
  { file: 'llm101n-dashboard.png', hash: '#/' },
  { file: 'llm101n-chapter-split.png', hash: '#/chapter/attention' },
  { file: 'llm101n-learning-plan.png', hash: '#/learning-plan' },
  { file: 'llm101n-lab-focus.png', hash: '#/chapter/attention/focus' },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const { file, hash } of shots) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForTimeout(2500)
  await page.screenshot({
    path: path.join(outDir, file),
    fullPage: false,
  })
  console.log('wrote', path.join(outDir, file))
  await page.close()
}

await browser.close()
console.log('done')
