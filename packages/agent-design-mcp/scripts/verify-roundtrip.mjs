import { readFile } from 'node:fs/promises'

const report = JSON.parse(await readFile(new URL('../../../apps/agent-design/results/dual-cli-roundtrip.json', import.meta.url), 'utf8'))
const failures = []
const expectedTools = ['apply_operations', 'apply_source_patch', 'get_context', 'undo', 'verify']
if (JSON.stringify(report.tools) !== JSON.stringify(expectedTools)) failures.push(`tools=${JSON.stringify(report.tools)}`)
if (report.codexApplied?.actor !== 'codex' || report.codexApplied?.label !== 'Codex layout') failures.push('Codex operation missing')
if (!report.staleConflict?.isError || report.staleConflict?.code !== 'REVISION_CONFLICT') failures.push('stale Claude conflict missing')
if (report.claudePatched?.actor !== 'claude' || report.claudePatched?.label !== 'Claude source') failures.push('Claude source patch missing')
if (report.undo?.transactionId !== 'fresh-codex-undo') failures.push('Undo missing')
if (!report.crashRecovery?.downIsError || report.crashRecovery.recoveredRevision !== report.crashRecovery.beforeRevision) failures.push(`crash recovery=${JSON.stringify(report.crashRecovery)}`)
if (report.final?.label !== 'Watcher recovery' || !report.final?.sourceContains) failures.push(`final convergence=${JSON.stringify(report.final)}`)
if (report.final?.sourceHash !== report.final?.contextSourceHash) failures.push('source hash drift')
for (const actor of ['codex', 'claude']) {
  const smoke = report.actualCli?.[actor]
  if (smoke?.exitCode !== 0 || !smoke?.contextEvidenceObserved || !smoke?.documentIdMatched || !smoke?.revisionMatched) failures.push(`${actor} live CLI smoke failed: ${JSON.stringify(smoke)}`)
}
if (failures.length) {
  console.error(`dual CLI roundtrip verification failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(`dual CLI roundtrip verification passed at revision ${report.final.revision}`)
