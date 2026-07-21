import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CanvasDocument } from '@askewly/canvas-core'
import { App } from './App'
import type { AgentDesignDesktopHost, DesktopCanvasSnapshot, DesktopCanvasSnapshotReason, DesktopCollaborationFeed } from './desktopHost'

const PROJECT_ID = 'project:aaaaaaaaaaaaaaaaaaaaaaaa'

afterEach(() => {
  cleanup()
  delete window.agentDesignHost
})

function documentFixture(revision: number): CanvasDocument {
  return {
    schemaVersion: 1,
    id: 'collab-fixture',
    name: 'Collab fixture',
    revision,
    rootIds: ['node-a'],
    nodes: {
      'node-a': {
        id: 'node-a', kind: 'frame', name: `Frame r${revision}`, parentId: null, childIds: [],
        bounds: { x: 0, y: 0, width: 200, height: 120 },
        rotation: 0,
        layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
        visible: true, locked: false, tokenBindings: {}, source: null, clipContent: false,
      },
    },
    selection: ['node-a'],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt: '2026-07-12T00:00:00.000Z', updatedAt: '2026-07-12T00:00:00.000Z', sourceRoot: '.' },
  }
}

function snapshotFixture(revision: number): DesktopCanvasSnapshot {
  return { document: documentFixture(revision), revision, cursor: revision, hash: 'c'.repeat(64) }
}

describe('dual-actor collaboration round-trip', () => {
  it('surfaces agent activity, conflict rejection, recovery, and audit undo in one flow', async () => {
    let snapshotListener: ((snapshot: DesktopCanvasSnapshot, reason: DesktopCanvasSnapshotReason) => void) | null = null
    let feedListener: ((feed: DesktopCollaborationFeed) => void) | null = null
    const applyCanvasOperation = vi.fn()
      .mockRejectedValueOnce(new Error('REVISION_CONFLICT: base revision 1 is stale'))
      .mockResolvedValueOnce(snapshotFixture(3))
    const undoCanvas = vi.fn(async () => snapshotFixture(4))
    const host = {
      apiVersion: 1,
      getHostInfo: vi.fn(),
      getBridgeStatus: vi.fn(async () => ({ apiVersion: 1, state: 'ready', projectId: PROJECT_ID, restartCount: 0, cursor: 1, revision: 1, lastErrorCode: null, recoveryMode: null })),
      copyTerminalCommand: vi.fn(async () => ({ copied: true as const })),
      onBridgeStatus: vi.fn(() => () => undefined),
      getCanvasSnapshot: vi.fn(async () => snapshotFixture(1)),
      applyCanvasOperation,
      undoCanvas,
      onCanvasSnapshot: vi.fn((listener: (snapshot: DesktopCanvasSnapshot, reason: DesktopCanvasSnapshotReason) => void) => { snapshotListener = listener; return () => undefined }),
      getCollaborationFeed: vi.fn(async () => ({ entries: [], actors: [], cursorRevision: 0 })),
      onCollaborationFeed: vi.fn((listener: (feed: DesktopCollaborationFeed) => void) => { feedListener = listener; return () => undefined }),
      selectProject: vi.fn(),
      recentProjects: vi.fn(async () => [{ id: PROJECT_ID, displayName: 'fixture', lastOpenedAt: '2026-07-12T00:00:00.000Z' }]),
      openRecentProject: vi.fn(),
      openPreview: vi.fn(),
      hidePreview: vi.fn(),
      catalogFiles: vi.fn(async () => []),
      revealProject: vi.fn(),
      openFile: vi.fn(),
      exportDiagnostics: vi.fn(),
    }
    window.agentDesignHost = host as unknown as AgentDesignDesktopHost

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('initial revision 1'))
    fireEvent.click(view.getByTestId('toggle-agents'))
    expect(view.getByTestId('agent-feed-empty')).toBeTruthy()

    // Agent (codex) edits arrive: snapshot push + feed push
    const emitSnapshot = snapshotListener as unknown as (snapshot: DesktopCanvasSnapshot, reason: DesktopCanvasSnapshotReason) => void
    const emitFeed = feedListener as unknown as (feed: DesktopCollaborationFeed) => void
    if (!emitSnapshot || !emitFeed) throw new Error('host listeners were not registered')
    emitSnapshot(snapshotFixture(2), 'transaction')
    emitFeed({
      entries: [{ transactionId: 'codex:2', actor: 'codex', kind: 'operations', revision: 2, at: '2026-07-12T00:02:00.000Z', changeCount: 1, nodeIds: ['node-a'] }],
      actors: [{ actor: 'codex', lastRevision: 2, lastActiveAt: '2026-07-12T00:02:00.000Z' }],
      cursorRevision: 2,
    })
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('transaction revision 2'))
    expect(view.getByTestId('actor-codex').textContent).toContain('codex · revision 2')
    expect(view.getByTestId('feed-codex:2').textContent).toContain('codex edited the canvas · revision 2')

    // Human edit rejected with a revision conflict — surfaced inline, no partial mutation
    fireEvent.click(view.getByRole('button', { name: 'Zoom in' }))
    await waitFor(() => expect(view.getByTestId('agent-error').textContent).toContain('REVISION_CONFLICT'))
    expect(view.getByTestId('persistence-status').textContent).toContain('REVISION_CONFLICT')

    // Retry succeeds and clears the conflict surface
    fireEvent.click(view.getByRole('button', { name: 'Zoom in' }))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('transaction revision 3'))
    expect(view.getByTestId('agent-error').textContent).toBe('')

    // Audit undo from the collaboration panel goes through the canonical desktop undo
    fireEvent.click(view.getByRole('button', { name: 'Undo latest change' }))
    await waitFor(() => expect(undoCanvas).toHaveBeenCalledWith({ apiVersion: 1 }))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('transaction revision 4'))
  })
})
