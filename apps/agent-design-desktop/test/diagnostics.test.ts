import { describe, expect, it } from 'vitest'
import { createDiagnosticBundle } from '../src/diagnostics'

describe('redacted diagnostics', () => {
  it('includes operational evidence without project IDs, paths, source, or tokens', () => {
    const bundle = createDiagnosticBundle({
      appVersion: '0.1.0',
      electronVersion: '43.1.0',
      platform: 'win32',
      arch: 'x64',
      bridge: {
        apiVersion: 1,
        state: 'ready',
        projectId: 'project:aaaaaaaaaaaaaaaaaaaaaaaa',
        restartCount: 1,
        cursor: 4,
        revision: 4,
        lastErrorCode: null,
        recoveryMode: 'recovered',
      },
      trustedProjectCount: 2,
      createdAt: '2026-07-11T01:00:00.000Z',
    })
    expect(bundle).toContain('"trustedCount": 2')
    expect(bundle).toContain('"recoveryMode": "recovered"')
    expect(bundle).not.toMatch(/project:|token|source|username|C:\\/i)
  })

  it('fails closed if an upstream runtime field contains an absolute path', () => {
    expect(() => createDiagnosticBundle({
      appVersion: 'C:\\Users\\name\\build',
      electronVersion: '43.1.0',
      platform: 'win32',
      arch: 'x64',
      bridge: { apiVersion: 1, state: 'idle', projectId: null, restartCount: 0, cursor: 0, revision: 0, lastErrorCode: null, recoveryMode: null },
      trustedProjectCount: 0,
    })).toThrow('DIAGNOSTIC_REDACTION_FAILED')
  })
})
