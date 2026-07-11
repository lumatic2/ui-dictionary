import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const report = JSON.parse(await readFile(resolve(import.meta.dirname, '..', 'results', 'packaged', 'packaged-e2e.json'), 'utf8'))
const installer = JSON.parse(await readFile(resolve(import.meta.dirname, '..', 'results', 'packaged', 'installer-lifecycle.json'), 'utf8'))
const ime = JSON.parse(await readFile(resolve(import.meta.dirname, '..', 'results', 'packaged', 'ime-manual.json'), 'utf8'))
const errors = []
if (report.schemaVersion !== 1 || report.classification !== 'unsigned-development') errors.push('invalid packaged evidence classification')
if (!report.security?.appProtocol || !report.security?.preloadApiVerified || report.security?.rendererNodeAuthority || report.security?.rendererCredentialSurface) errors.push('packaged renderer security boundary failed')
if (!report.terminalAdapters?.codex || !report.terminalAdapters?.claude || !report.terminalAdapters?.packagedAdapter || !report.terminalAdapters?.commandCredentialsRedacted) errors.push('dual packaged terminal adapter proof failed')
if (!report.roundTrip?.humanEdit || !report.roundTrip?.watcherEdit || report.roundTrip?.finalLabel !== 'Watcher packaged update') errors.push('human/source round-trip failed')
if (report.roundTrip?.watcherVisibleMs > 300) errors.push(`source watcher p95 proxy exceeded 300ms: ${report.roundTrip?.watcherVisibleMs}`)
if (report.recovery?.revisionBeforeCrash !== report.recovery?.revisionAfterCrashRecovery || report.recovery?.restartRevision !== report.recovery?.revisionBeforeCrash) errors.push('crash/restart revision recovery failed')
if (report.recovery?.differentPixels !== 0) errors.push(`restart canvas drift: ${report.recovery?.differentPixels} pixels`)
if (!Array.isArray(report.performance?.traces) || report.performance.traces.length !== 3 || report.performance.traces.some((trace) => trace.p95LatencyMs > 16 || trace.revisionDelta !== 1)) errors.push(`packaged 5k pointer budget failed: ${report.performance?.traces?.map((trace) => trace.p95LatencyMs).join(', ')}`)
if (report.performance?.fallbackState !== 'dom' || report.performance?.fallbackTrace?.revisionDelta !== 1) errors.push('packaged DOM fallback manipulation failed')
if (report.accessibility?.firstFocus !== 'node-00000' || report.accessibility?.secondFocus !== 'node-00001') errors.push('packaged keyboard focus order failed')
if (report.processCleanup?.packagedExecutableStillRunning) errors.push('packaged process leak detected')
if (report.consoleErrors?.length) errors.push(`packaged console errors: ${report.consoleErrors.join('; ')}`)
// Budget = 3 app launches (trusted-project, restart, benchmark) x 2 known Electron 43 sandbox startup messages; CDP attach timing decides how many launches are captured.
if (!Number.isInteger(report.instrumentation?.knownElectronSandboxStartupExceptions) || report.instrumentation.knownElectronSandboxStartupExceptions > 6) errors.push('unexpected Electron sandbox startup telemetry volume')
if (!installer.installed || !installer.launched || !installer.rendererSecurityVerified || !installer.startMenuShortcutCreated || !installer.desktopShortcutCreated || !installer.uninstalled || !installer.uninstallerRemovedApplicationPayload || !installer.harnessRemovedExpectedTombstone || !installer.installDirectoryRemoved || !installer.shortcutRemoved) errors.push('installer lifecycle evidence failed')
const imeGateSatisfied = (ime.actualMicrosoftImePass && !ime.syntheticOnly)
  || (ime.waived === true && ime.waivedBy === 'user')
if (!imeGateSatisfied) errors.push(`actual Microsoft IME gate remains open: ${ime.blockerCode ?? 'NO_PASS_EVIDENCE'}`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`packaged evidence: PASS (5k p95 ${report.performance.p95WorstMs.toFixed(2)}ms; restart drift 0; watcher ${report.roundTrip.watcherVisibleMs.toFixed(1)}ms; IME ${ime.actualMicrosoftImePass ? 'passed' : 'user-waived'})`)
}
