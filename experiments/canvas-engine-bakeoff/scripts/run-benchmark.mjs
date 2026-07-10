import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const port = 4179
const url = `http://127.0.0.1:${port}`
const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', String(port)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
})

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('Vite benchmark server did not become ready')
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan,UseSkiaRenderer'],
  })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.__canvasBenchmark?.run === 'function')
  await mkdir(path.join(root, 'results', 'screenshots'), { recursive: true })

  const results = []
  for (const candidate of ['dom', 'dom-webgpu', 'svg', 'webgpu']) {
    for (const size of [1000, 5000, 10000]) {
      const result = await page.evaluate(
        async ({ candidate, size }) => window.__canvasBenchmark.run(candidate, size),
        { candidate, size },
      )
      results.push(result)
      console.log(`${candidate.padEnd(10)} ${String(size).padStart(5)} nodes  p95=${result.panZoom.p95FrameMs.toFixed(2)}ms  supported=${result.supported}`)
      if (size === 1000) {
        await page.screenshot({ path: path.join(root, 'results', 'screenshots', `${candidate}.png`) })
      }
    }
  }

  const output = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    runtime: 'Playwright system Chrome, headless, 1440x900@1x',
    results,
  }
  await writeFile(path.join(root, 'results', 'benchmark-results.json'), `${JSON.stringify(output, null, 2)}\n`)
} finally {
  await browser?.close()
  server.kill()
}
