import { createHash } from 'node:crypto'
import type { BridgeStatus } from './contract'
import { CONTENT_SECURITY_POLICY } from './security'
import { PREVIEW_CSP } from './preview-security'

export interface DiagnosticInput {
  appVersion: string
  electronVersion: string
  platform: NodeJS.Platform
  arch: string
  bridge: BridgeStatus
  trustedProjectCount: number
  createdAt?: string
}

export function createDiagnosticBundle(input: DiagnosticInput): string {
  const bundle = {
    format: 'askewly.agent-design.diagnostics',
    version: 1,
    createdAt: input.createdAt ?? new Date().toISOString(),
    runtime: {
      appVersion: input.appVersion,
      electronVersion: input.electronVersion,
      platform: input.platform,
      arch: input.arch,
    },
    bridge: {
      state: input.bridge.state,
      restartCount: input.bridge.restartCount,
      cursor: input.bridge.cursor,
      revision: input.bridge.revision,
      lastErrorCode: input.bridge.lastErrorCode,
      recoveryMode: input.bridge.recoveryMode,
    },
    projects: { trustedCount: input.trustedProjectCount },
    security: {
      editorCspSha256: createHash('sha256').update(CONTENT_SECURITY_POLICY).digest('hex'),
      previewCspSha256: createHash('sha256').update(PREVIEW_CSP).digest('hex'),
      rendererNodeIntegration: false,
      previewNetwork: 'deny',
    },
  }
  const serialized = JSON.stringify(bundle, null, 2)
  if (/AGENT_DESIGN_SESSION_TOKEN|Bearer\s|[A-Za-z]:\\|\/Users\/|\/home\//i.test(serialized)) {
    throw new Error('DIAGNOSTIC_REDACTION_FAILED')
  }
  return serialized
}
