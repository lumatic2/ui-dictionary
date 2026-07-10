import { readFile } from 'node:fs/promises'
import path from 'node:path'

const file = path.resolve(import.meta.dirname, '..', 'results', 'benchmark-results.json')
const report = JSON.parse(await readFile(file, 'utf8'))
const candidates = ['dom', 'dom-webgpu', 'svg', 'webgpu']
const sizes = [1000, 5000, 10000]
const errors = []

if (report.schemaVersion !== 1) errors.push('report schemaVersion must be 1')
if (!Array.isArray(report.results)) errors.push('results must be an array')

for (const candidate of candidates) {
  for (const size of sizes) {
    const result = report.results?.find((item) => item.candidate === candidate && item.sceneSize === size)
    if (!result) {
      errors.push(`missing ${candidate}/${size}`)
      continue
    }
    for (const field of ['initialRenderMs', 'serializationMs', 'semanticElementCount', 'editableElementCount', 'focusableElementCount', 'sourceMappingCount']) {
      if (typeof result[field] !== 'number') errors.push(`${candidate}/${size} missing numeric ${field}`)
    }
    for (const trace of ['panZoom', 'selectionMutation']) {
      if (result[trace]?.frames !== 90 || typeof result[trace]?.p95FrameMs !== 'number') {
        errors.push(`${candidate}/${size} invalid ${trace}`)
      }
    }
    if (!result.roundTripStable) errors.push(`${candidate}/${size} failed canonical round-trip`)
    if (!result.operationReplayStable) errors.push(`${candidate}/${size} failed operation-log recovery`)
    if (result.sourceMappingCount !== size) errors.push(`${candidate}/${size} lost source mappings`)
  }
}

if (report.results?.length !== candidates.length * sizes.length) {
  errors.push(`expected 12 results, found ${report.results?.length ?? 0}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Validated 12/12 benchmark cells with stable canonical round-trips.')
}
