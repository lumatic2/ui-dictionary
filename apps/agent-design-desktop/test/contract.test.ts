import { describe, expect, it } from 'vitest'
import { HOST_API_VERSION, parseBridgeStatus, parseHostRequest, parseTrustedProjectSummary } from '../src/contract'

describe('host authority contract', () => {
  it('accepts versioned opaque project and session identifiers', () => {
    expect(
      parseHostRequest({
        apiVersion: HOST_API_VERSION,
        projectId: 'project:alpha-1',
        sessionId: 'session.42',
      }),
    ).toEqual({ apiVersion: 1, projectId: 'project:alpha-1', sessionId: 'session.42' })
  })

  it.each([
    null,
    { apiVersion: 2 },
    { apiVersion: 1, path: 'C:\\secret' },
    { apiVersion: 1, command: 'powershell' },
    { apiVersion: 1, projectId: '../escape' },
    { apiVersion: 1, sessionId: '' },
  ])('rejects unversioned or authority-bearing input %#', (input) => {
    expect(() => parseHostRequest(input)).toThrow()
  })
})

describe('redacted desktop responses', () => {
  it('rejects project summaries that contain main-owned paths', () => {
    expect(() => parseTrustedProjectSummary({
      id: 'project:aaaaaaaaaaaaaaaaaaaaaaaa',
      displayName: 'fixture',
      lastOpenedAt: '2026-07-11T01:00:00.000Z',
      canonicalRoot: 'C:\\secret',
    })).toThrow(/path|unsupported/)
  })

  it('rejects bridge status objects that contain connection secrets', () => {
    expect(() => parseBridgeStatus({
      apiVersion: 1,
      state: 'ready',
      projectId: 'project:aaaaaaaaaaaaaaaaaaaaaaaa',
      restartCount: 0,
      cursor: 0,
      revision: 0,
      lastErrorCode: null,
      recoveryMode: 'fresh',
      token: 'secret',
    })).toThrow(/secret|unsupported/)
  })
})
