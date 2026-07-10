import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const root = path.resolve(import.meta.dirname, '..')
const screenshots = path.join(root, 'results', 'screenshots')
const baseline = PNG.sync.read(await readFile(path.join(screenshots, 'dom.png')))
const benchmark = JSON.parse(await readFile(path.join(root, 'results', 'benchmark-results.json'), 'utf8'))
const comparisons = []

for (const candidate of ['dom-webgpu', 'svg', 'webgpu']) {
  const actual = PNG.sync.read(await readFile(path.join(screenshots, `${candidate}.png`)))
  if (actual.width !== baseline.width || actual.height !== baseline.height) {
    throw new Error(`${candidate} screenshot dimensions differ from DOM baseline`)
  }
  const diff = new PNG({ width: baseline.width, height: baseline.height })
  const differentPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.1, includeAA: false },
  )
  const comparable = benchmark.results.some((item) => item.candidate === candidate && item.sceneSize === 1000 && item.supported)
  comparisons.push({
    candidate,
    baseline: 'dom',
    comparable,
    note: comparable ? 'Shared fixture compared at 1000 nodes in a supported runtime.' : 'Renderer was unsupported; visual score is diagnostic only.',
    differentPixels,
    totalPixels: baseline.width * baseline.height,
    mismatchRatio: differentPixels / (baseline.width * baseline.height),
  })
  await writeFile(path.join(screenshots, `diff-dom-vs-${candidate}.png`), PNG.sync.write(diff))
}

await writeFile(
  path.join(root, 'results', 'pixel-diff.json'),
  `${JSON.stringify({ schemaVersion: 1, baseline: 'dom', comparisons }, null, 2)}\n`,
)
for (const item of comparisons) {
  console.log(`${item.candidate.padEnd(10)} mismatch=${(item.mismatchRatio * 100).toFixed(2)}% comparable=${item.comparable}`)
}
