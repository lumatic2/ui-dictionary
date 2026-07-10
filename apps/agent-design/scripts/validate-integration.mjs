import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const report = JSON.parse(await readFile(path.join(root, 'results', 'integration-results.json'), 'utf8'))
const errors = []
if (report.schemaVersion !== 1) errors.push('invalid report schema')
if (report.gpuState !== 'webgpu') errors.push(`expected WebGPU active, got ${report.gpuState}`)
if (report.nodeCount !== 5000) errors.push(`expected 5000 nodes, got ${report.nodeCount}`)
if (report.sourceCount !== 250) errors.push(`expected 250 source mappings, got ${report.sourceCount}`)
if (!Array.isArray(report.traces) || report.traces.length !== 3) errors.push('expected three 5k trace runs')
if (report.traces?.some((trace) => trace.frames !== 90 || trace.p95FrameMs > 16)) errors.push(`5k p95 exceeds 16ms: ${report.traces?.map((trace) => trace.p95FrameMs).join(', ')}`)
if (report.persistence?.reloadedRevision !== 3 || report.persistence?.undoRevision !== 2 || report.persistence?.redoRevision !== 3) errors.push('reload undo/redo revisions are unstable')
if (report.reloadPixelDiff?.mismatchRatio !== 0) errors.push(`reload pixel mismatch: ${report.reloadPixelDiff?.mismatchRatio}`)
if (report.consoleErrors?.length) errors.push(`console errors: ${report.consoleErrors.join('; ')}`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`AUC1 integration PASS: 5k p95 [${report.traces.map((trace) => trace.p95FrameMs.toFixed(2)).join(', ')}]ms; reload pixel diff 0; undo/redo 2→3.`)
}
