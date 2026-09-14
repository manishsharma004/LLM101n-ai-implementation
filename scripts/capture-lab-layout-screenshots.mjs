import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'
const outDir =
  process.env.ARTIFACTS_DIR ??
  '/tmp/cursor-1001/cursor_agent_stores/bc-c1252740-d37d-495d-9e9f-8106ede2fe31/files/artifacts'
const chromePath =
  process.env.CHROME_PATH ?? '/tmp/pw-browsers/chromium-1243/chrome-linux64/chrome'

const pages = [
  { file: 'lab-layout-prereq.png', hash: '#/prerequisites/python-quickstart', clip: '.lab-dock' },
  { file: 'lab-layout-chapter.png', hash: '#/chapter/attention', clip: '.lab-dock' },
  { file: 'lab-layout-focus.png', hash: '#/chapter/attention/focus', clip: '.lab-focus-editor' },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const { file, hash, clip } of pages) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForTimeout(2000)
  const el = page.locator(clip)
  await el.screenshot({ path: path.join(outDir, file) })
  const metrics = await page.locator('.lab-ide-body').evaluate((body) => {
    const editor = body.querySelector('.lab-editor-pane')
    const console = body.querySelector('.lab-console--grow')
    const br = (el) => (el ? el.getBoundingClientRect() : { height: 0, bottom: 0 })
    const bodyR = body.getBoundingClientRect()
    const consoleR = br(console)
    return {
      bodyH: Math.round(bodyR.height),
      editorH: Math.round(br(editor).height),
      consoleH: Math.round(consoleR.height),
      gapBelowConsole: Math.round(bodyR.bottom - consoleR.bottom),
    }
  })
  console.log('wrote', file, metrics)
  await page.close()
}

await browser.close()
console.log('done')
