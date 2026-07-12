import { describe, expect, it } from 'vitest'
import { HOST_API_VERSION, parseBridgeStatus, parseCanvasMutationRequest, parseCanvasSnapshot, parseCollaborationFeed, parseHostRequest, parseSourcePatchRequest, parseTrustedFileSummary, parseTrustedProjectSummary } from '../src/contract'

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

  it('accepts a batch operation and validates each child operation against the same whitelist', () => {
    const request = parseCanvasMutationRequest({
      apiVersion: 1,
      operation: {
        id: 'batch-1',
        at: '2026-07-11T01:00:00.000Z',
        type: 'batch',
        operations: [
          { id: 'child-1', at: '2026-07-11T01:00:00.000Z', type: 'create-node', node: { id: 'n1' }, parentId: null, index: 0 },
          { id: 'child-2', at: '2026-07-11T01:00:00.000Z', type: 'select-nodes', nodeIds: ['n1'] },
        ],
      },
    })
    expect(request.operation.type).toBe('batch')
  })

  it('rejects a batch operation containing a forbidden child operation type', () => {
    expect(() =>
      parseCanvasMutationRequest({
        apiVersion: 1,
        operation: {
          id: 'batch-2',
          at: '2026-07-11T01:00:00.000Z',
          type: 'batch',
          operations: [{ id: 'child-shell', at: '2026-07-11T01:00:00.000Z', type: 'run-command', command: 'calc' }],
        },
      }),
    ).toThrow('unsupported canvas operation')
  })

  it('rejects a batch operation nesting another batch operation', () => {
    expect(() =>
      parseCanvasMutationRequest({
        apiVersion: 1,
        operation: {
          id: 'batch-3',
          at: '2026-07-11T01:00:00.000Z',
          type: 'batch',
          operations: [{ id: 'nested', at: '2026-07-11T01:00:00.000Z', type: 'batch', operations: [{ id: 'leaf', at: '2026-07-11T01:00:00.000Z', type: 'select-nodes', nodeIds: [] }] }],
        },
      }),
    ).toThrow('unsupported canvas operation')
  })

  it('rejects an empty batch and an oversized batch', () => {
    expect(() =>
      parseCanvasMutationRequest({ apiVersion: 1, operation: { id: 'batch-empty', at: '2026-07-11T01:00:00.000Z', type: 'batch', operations: [] } }),
    ).toThrow('invalid canvas batch operations')

    const oversized = Array.from({ length: 501 }, (_, index) => ({ id: `child-${index}`, at: '2026-07-11T01:00:00.000Z', type: 'select-nodes', nodeIds: [] }))
    expect(() =>
      parseCanvasMutationRequest({ apiVersion: 1, operation: { id: 'batch-oversized', at: '2026-07-11T01:00:00.000Z', type: 'batch', operations: oversized } }),
    ).toThrow('canvas batch is too large')
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

describe('materialize source patch contract', () => {
  it('accepts a project-relative new-file request', () => {
    expect(parseSourcePatchRequest({ apiVersion: 1, file: 'src/components/Button.tsx', content: 'export function Button() { return null }\n' }))
      .toEqual({ apiVersion: 1, file: 'src/components/Button.tsx', content: 'export function Button() { return null }\n' })
  })

  it('rejects a path that escapes the project root, an absolute path, and an unsupported field', () => {
    expect(() => parseSourcePatchRequest({ apiVersion: 1, file: '../outside.tsx', content: 'x' })).toThrow('invalid source patch file path')
    expect(() => parseSourcePatchRequest({ apiVersion: 1, file: 'C:\\secret\\Button.tsx', content: 'x' })).toThrow('invalid source patch file path')
    expect(() => parseSourcePatchRequest({ apiVersion: 1, file: 'src/components/Button.tsx', content: 'x', token: 'secret' })).toThrow('invalid source patch request')
  })

  it('rejects empty content', () => {
    expect(() => parseSourcePatchRequest({ apiVersion: 1, file: 'src/components/Button.tsx', content: '' })).toThrow('invalid source patch content')
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
