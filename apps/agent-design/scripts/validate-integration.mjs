import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const report = JSON.parse(await readFile(path.join(root, 'results', 'integration-results.json'), 'utf8'))
const errors = []
if (report.schemaVersion !== 2) errors.push('invalid report schema')
if (report.gpuState !== 'webgpu') errors.push(`expected WebGPU active, got ${report.gpuState}`)
if (report.nodeCount !== 5000) errors.push(`expected 5000 nodes, got ${report.nodeCount}`)
if (report.sourceCount !== 250) errors.push(`expected 250 source mappings, got ${report.sourceCount}`)
if (!Array.isArray(report.traces) || report.traces.length !== 3) errors.push('expected three 5k trace runs')
if (report.traces?.some((trace) => trace.frames !== 60 || trace.p95LatencyMs > 16 || trace.revisionDelta !== 1)) errors.push(`5k pointer p95/revision invalid: ${report.traces?.map((trace) => `${trace.p95LatencyMs}ms/Δ${trace.revisionDelta}`).join(', ')}`)
if (report.accessibility?.escapeSelectionCount !== 0 || report.accessibility?.firstFocusedId !== 'node-00000' || report.accessibility?.secondFocusedId !== 'node-00001') errors.push('keyboard focus order is unstable')
if (report.fallbackState !== 'dom') errors.push(`forced fallback manipulation unavailable: ${report.fallbackState}`)
if (report.workflow?.componentParentId !== 'node-00100') errors.push('reparent workflow failed')
if (report.workflow?.componentDisabled !== true || report.workflow?.componentHorizontalSizing !== 'fill') errors.push('typed property workflow failed')
if (report.workflow?.tokenSetId !== 'askewly.dark') errors.push('token mode workflow failed')
if (report.workflow?.text !== '한글 실제 Chrome 입력' || report.workflow?.chromeTextEntry !== true) errors.push('Chrome Korean text entry failed')
if (report.workflow?.osMicrosoftImeManualPass !== false) errors.push('OS IME evidence must remain explicitly unclaimed')
if (report.persistence?.reloadedRevision !== report.persistence?.savedRevision || report.persistence?.undoRevision !== report.persistence?.savedRevision - 1 || report.persistence?.redoRevision !== report.persistence?.savedRevision) errors.push('reload undo/redo revisions are unstable')
if (report.reloadPixelDiff?.mismatchRatio !== 0) errors.push(`reload pixel mismatch: ${report.reloadPixelDiff?.mismatchRatio}`)
if (report.consoleErrors?.length) errors.push(`console errors: ${report.consoleErrors.join('; ')}`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`AUC2 integration PASS: 5k pointer p95 [${report.traces.map((trace) => trace.p95LatencyMs.toFixed(2)).join(', ')}]ms; workflow + fallback + keyboard + reload pixel diff 0.`)
}
