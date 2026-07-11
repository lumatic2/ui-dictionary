import { describe, expect, it } from 'vitest'
import { HOST_API_VERSION, parseBridgeStatus, parseCanvasMutationRequest, parseCanvasSnapshot, parseCollaborationFeed, parseHostRequest, parseTrustedFileSummary, parseTrustedProjectSummary } from '../src/contract'

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

describe('canvas relay contract', () => {
  it('accepts a bounded typed operation and rejects authority-shaped input', () => {
    expect(parseCanvasMutationRequest({ apiVersion: 1, operation: { id: 'select-1', at: '2026-07-11T01:00:00.000Z', type: 'select-nodes', nodeIds: [] } }).operation.type).toBe('select-nodes')
    expect(() => parseCanvasMutationRequest({ apiVersion: 1, operation: { id: 'run', at: '2026-07-11T01:00:00.000Z', type: 'run-command', command: 'calc' } })).toThrow('unsupported canvas operation')
  })

  it('rejects snapshots with extra secret fields', () => {
    expect(() => parseCanvasSnapshot({
      document: { schemaVersion: 1, revision: 0, nodes: {} },
      revision: 0,
      cursor: 0,
      hash: 'a'.repeat(64),
      token: 'secret',
    })).toThrow('invalid canvas snapshot')
  })
})

describe('collaboration feed contract', () => {
  it('accepts a valid actor-attributed feed', () => {
    const feed = {
      entries: [{ transactionId: 'codex:1', actor: 'codex', kind: 'operations', revision: 1, at: '2026-07-12T00:00:00.000Z', changeCount: 1, nodeIds: ['node-a'] }],
      actors: [{ actor: 'codex', lastRevision: 1, lastActiveAt: '2026-07-12T00:00:00.000Z' }],
      cursorRevision: 1,
    }
    expect(parseCollaborationFeed(feed)).toEqual(feed)
  })

  it('rejects a feed entry with an unknown actor or unsupported field', () => {
    expect(() => parseCollaborationFeed({ entries: [{ transactionId: 'x:1', actor: 'attacker', kind: 'operations', revision: 1, at: '2026-07-12T00:00:00.000Z', changeCount: 0, nodeIds: [] }], actors: [], cursorRevision: 1 })).toThrow('invalid feed actor')
    expect(() => parseCollaborationFeed({ entries: [], actors: [], cursorRevision: 0, token: 'secret' })).toThrow('invalid collaboration feed')
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

  it('rejects absolute paths disguised as file labels', () => {
    expect(() => parseTrustedFileSummary({ id: 'file:bbbbbbbbbbbbbbbbbbbbbbbb', label: 'C:\\Users\\name\\App.tsx' })).toThrow('invalid trusted file label')
  })
})
