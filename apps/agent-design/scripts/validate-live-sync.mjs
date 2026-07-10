import { readFile } from 'node:fs/promises'

const report = JSON.parse(await readFile(new URL('../results/live-sync-results.json', import.meta.url), 'utf8'))
const failures = []
if (!String(report.connection).startsWith('connected')) failures.push(`connection=${report.connection}`)
if (report.agentAckToVisibleMs.p95 > report.agentAckToVisibleMs.target) failures.push(`agent p95=${report.agentAckToVisibleMs.p95}`)
if (report.fileEditToVisibleMs.p95 > report.fileEditToVisibleMs.target) failures.push(`watcher p95=${report.fileEditToVisibleMs.p95}`)
if (report.final.revision !== 20 || report.final.cursor !== 20 || report.final.auditEntries !== 20) failures.push(`final counters=${JSON.stringify(report.final)}`)
if (report.final.label !== 'File update 9') failures.push(`final label=${report.final.label}`)
if (report.watcherErrors.length) failures.push(`watcher errors=${report.watcherErrors.join('; ')}`)
if (report.consoleErrors.length) failures.push(`console errors=${report.consoleErrors.join('; ')}`)
if (failures.length) {
  console.error(`live sync validation failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(`live sync validation passed: agent p95=${report.agentAckToVisibleMs.p95.toFixed(1)}ms, watcher p95=${report.fileEditToVisibleMs.p95.toFixed(1)}ms`)
