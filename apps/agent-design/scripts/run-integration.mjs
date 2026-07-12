import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const root = path.resolve(import.meta.dirname, '..')
const resultsDir = path.join(root, 'results')
const screenshotsDir = path.join(resultsDir, 'screenshots')
const port = 4181
const url = `http://127.0.0.1:${port}`
const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('AskewlyDesign integration server did not become ready')
}

let browser
try {
  await mkdir(screenshotsDir, { recursive: true })
  await waitForServer()
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan,UseSkiaRenderer'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const consoleErrors = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.__agentDesignBenchmark?.runTrace === 'function')

  await page.getByTestId('fixture-size').selectOption('5000')
  await page.waitForFunction(() => document.querySelectorAll('[data-canvas-id]').length === 5000)
  await page.waitForFunction(() => document.querySelector('[data-testid="editor-plane"]')?.getAttribute('data-editor-plane') !== 'initializing')
  const gpuState = await page.getByTestId('editor-plane').getAttribute('data-editor-plane')
  const traces = []
  for (let run = 0; run < 3; run += 1) traces.push(await page.evaluate(() => window.__agentDesignBenchmark.runPointerTrace(60)))
  const trace = traces.reduce((worst, item) => item.p95LatencyMs > worst.p95LatencyMs ? item : worst)
  const nodeCount = await page.locator('[data-canvas-id]').count()
  const sourceCount = await page.locator('[data-source-ref]').count()
  await page.screenshot({ path: path.join(screenshotsDir, '5k-webgpu.png') })

  const viewport = page.getByTestId('canvas-viewport')
  await viewport.focus()
  await viewport.press('Escape')
  const escapeSelectionCount = Number(await page.getByTestId('selection-count').textContent())
  await viewport.press('ArrowRight')
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-canvas-id') === 'node-00000')
  const firstFocusedId = await page.evaluate(() => document.activeElement?.getAttribute('data-canvas-id'))
  await viewport.press('ArrowRight')
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-canvas-id') === 'node-00001')
  const secondFocusedId = await page.evaluate(() => document.activeElement?.getAttribute('data-canvas-id'))

  await page.getByTestId('fixture-size').selectOption('1000')
  await page.waitForFunction(() => document.querySelectorAll('[data-canvas-id]').length === 1000)
  await page.waitForFunction(() => document.querySelector('[data-testid="document-revision"]')?.textContent === '0')
  await page.getByTestId('editor-plane-mode').selectOption('forced-fallback')
  await page.waitForFunction(() => document.querySelector('[data-testid="editor-plane"]')?.getAttribute('data-editor-plane') === 'dom')

  const component = page.locator('[data-canvas-id="node-00001"]')
  const targetFrame = page.locator('[data-canvas-id="node-00100"]')
  await component.evaluate((element) => element.click())
  await page.getByTestId('property-prop-disabled').selectOption('true')
  await page.getByTestId('property-layout-horizontal').selectOption('fill')
  await page.getByTestId('token-mode').selectOption('askewly.dark')
  await page.getByTestId('structure-drag-handle').dragTo(targetFrame)
  await page.waitForFunction(() => document.querySelector('[data-canvas-id="node-00001"]')?.getAttribute('data-parent-id') === 'node-00100')

  const textNode = page.locator('[data-canvas-id="node-00007"]')
  await textNode.evaluate((element) => element.click())
  await textNode.fill('한글 실제 Chrome 입력')
  await textNode.press('Tab')
  await page.waitForFunction(() => window.__agentDesignBenchmark.inspect('node-00007').node?.text === '한글 실제 Chrome 입력')

  const componentState = await page.evaluate(() => window.__agentDesignBenchmark.inspect('node-00001'))
  const textState = await page.evaluate(() => window.__agentDesignBenchmark.inspect('node-00007'))
  const fallbackState = await page.getByTestId('editor-plane').getAttribute('data-editor-plane')
  await page.getByTestId('canvas-viewport').screenshot({ path: path.join(screenshotsDir, 'before-reload.png') })
  await page.getByTestId('save-document').click()
  await page.waitForFunction(() => document.querySelector('[data-testid="persistence-status"]')?.textContent?.startsWith('saved'))
  const savedStatus = await page.getByTestId('persistence-status').textContent()
  const savedRevision = Number(await page.getByTestId('document-revision').textContent())
  await page.getByTestId('undo').click()
  await page.getByTestId('reload-document').click()
  await page.waitForFunction((revision) => document.querySelector('[data-testid="persistence-status"]')?.textContent === `reloaded revision ${revision}`, savedRevision)
  await page.getByTestId('canvas-viewport').screenshot({ path: path.join(screenshotsDir, 'after-reload.png') })
  const reloadedRevision = Number(await page.getByTestId('document-revision').textContent())
  await page.getByTestId('undo').click()
  const undoRevision = Number(await page.getByTestId('document-revision').textContent())
  await page.getByTestId('redo').click()
  const redoRevision = Number(await page.getByTestId('document-revision').textContent())

  const before = PNG.sync.read(await readFile(path.join(screenshotsDir, 'before-reload.png')))
  const after = PNG.sync.read(await readFile(path.join(screenshotsDir, 'after-reload.png')))
  const diff = new PNG({ width: before.width, height: before.height })
  const differentPixels = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0.1, includeAA: false })
  await writeFile(path.join(screenshotsDir, 'reload-diff.png'), PNG.sync.write(diff))

  const report = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    runtime: 'Playwright system Chrome headless, 1440x900@1x',
    gpuState,
    nodeCount,
    sourceCount,
    trace,
    traces,
    accessibility: { escapeSelectionCount, firstFocusedId, secondFocusedId },
    fallbackState,
    workflow: {
      componentParentId: componentState.node?.parentId,
      componentDisabled: componentState.node?.props?.disabled,
      componentHorizontalSizing: componentState.node?.layout?.horizontal,
      tokenSetId: componentState.tokenSetId,
      text: textState.node?.text,
      chromeTextEntry: true,
      osMicrosoftImeManualPass: false,
    },
    persistence: { savedStatus, savedRevision, reloadedRevision, undoRevision, redoRevision },
    reloadPixelDiff: { differentPixels, totalPixels: before.width * before.height, mismatchRatio: differentPixels / (before.width * before.height) },
    consoleErrors,
  }
  await writeFile(path.join(resultsDir, 'integration-results.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser?.close()
  server.kill()
}
