import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CanvasDocument } from '@askewly/canvas-core'
import { App } from './App'
import type { AgentDesignDesktopHost, DesktopBridgeStatus, DesktopCanvasSnapshot } from './desktopHost'

const PROJECT_A = 'project:aaaaaaaaaaaaaaaaaaaaaaaa'
const PROJECT_B = 'project:bbbbbbbbbbbbbbbbbbbbbbbb'

function documentFixture(revision: number): CanvasDocument {
  return {
    schemaVersion: 1,
    id: 'authority-fixture',
    name: 'Authority fixture',
    revision,
    rootIds: ['node-a'],
    nodes: {
      'node-a': {
        id: 'node-a',
        kind: 'frame',
        name: 'Project A frame',
        parentId: null,
        childIds: [],
        bounds: { x: 0, y: 0, width: 160, height: 90 },
        layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
        visible: true,
        locked: false,
        clipContent: false,
        tokenBindings: {},
        source: null,
      },
    },
    selection: [],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt: '2026-07-13T00:00:00.000Z', updatedAt: '2026-07-13T00:00:00.000Z', sourceRoot: '.' },
  }
}

function snapshotFixture(revision: number): DesktopCanvasSnapshot {
  return { document: documentFixture(revision), revision, cursor: revision, hash: 'a'.repeat(64) }
}

function ready(projectId: string): DesktopBridgeStatus {
  return { apiVersion: 1, state: 'ready', projectId, restartCount: 0, cursor: 1, revision: 1, lastErrorCode: null, recoveryMode: null }
}

afterEach(() => {
  cleanup()
  delete window.agentDesignHost
})

describe('desktop project authority boundary', () => {
  it('clears the old canvas, rejects mutations, and ignores a stale response while the bridge switches projects', async () => {
    let bridgeListener: ((status: DesktopBridgeStatus) => void) | null = null
    let resolveMutation: ((snapshot: DesktopCanvasSnapshot) => void) | null = null
    let snapshotCalls = 0
    const applyCanvasOperation = vi.fn(() => new Promise<DesktopCanvasSnapshot>((resolve) => { resolveMutation = resolve }))
    const host: AgentDesignDesktopHost = {
      apiVersion: 1,
      getHostInfo: vi.fn(),
      getBridgeStatus: vi.fn(async () => ready(PROJECT_A)),
      copyTerminalCommand: vi.fn(),
      onBridgeStatus: vi.fn((listener) => { bridgeListener = listener; return () => undefined }),
      getCanvasSnapshot: vi.fn(() => {
        snapshotCalls += 1
        return snapshotCalls === 1 ? Promise.resolve(snapshotFixture(1)) : new Promise<DesktopCanvasSnapshot>(() => undefined)
      }),
      applyCanvasOperation,
      undoCanvas: vi.fn(),
      onCanvasSnapshot: vi.fn(() => () => undefined),
      getCollaborationFeed: vi.fn(async () => ({ entries: [], actors: [], cursorRevision: 0 })),
      onCollaborationFeed: vi.fn(() => () => undefined),
      selectProject: vi.fn(),
      recentProjects: vi.fn(async () => [
        { id: PROJECT_A, displayName: 'Project A', lastOpenedAt: '2026-07-13T00:00:00.000Z' },
        { id: PROJECT_B, displayName: 'Project B', lastOpenedAt: '2026-07-13T00:00:00.000Z' },
      ]),
      openRecentProject: vi.fn(),
      openPreview: vi.fn(),
      hidePreview: vi.fn(),
      catalogFiles: vi.fn(async () => []),
      revealProject: vi.fn(),
      openFile: vi.fn(),
      exportDiagnostics: vi.fn(),
      materializeNode: vi.fn(),
    }
    window.agentDesignHost = host

    const view = render(<App mode="production" />)
    const node = await waitFor(() => {
      const current = view.container.querySelector('[data-canvas-id="node-a"]')
      expect(current).toBeTruthy()
      return current as HTMLElement
    })
    fireEvent.click(node)
    expect(applyCanvasOperation).toHaveBeenCalledTimes(1)

    act(() => {
      bridgeListener?.(ready(PROJECT_B))
      fireEvent.click(node)
    })
    expect(applyCanvasOperation).toHaveBeenCalledTimes(1)
    expect(view.queryByTestId('canvas-content')).toBeNull()

    await act(async () => { resolveMutation?.(snapshotFixture(2)) })
    expect(view.queryByTestId('canvas-content')).toBeNull()
    expect(view.getByTestId('production-empty-state')).toBeTruthy()
  })

  it('shows a retryable error when the trusted snapshot cannot be loaded', async () => {
    const host = {
      apiVersion: 1,
      getBridgeStatus: vi.fn(async () => ready(PROJECT_A)),
      onBridgeStatus: vi.fn(() => () => undefined),
      getCanvasSnapshot: vi.fn(async () => { throw new Error('snapshot unavailable') }),
      onCanvasSnapshot: vi.fn(() => () => undefined),
      getCollaborationFeed: vi.fn(async () => ({ entries: [], actors: [], cursorRevision: 0 })),
      onCollaborationFeed: vi.fn(() => () => undefined),
      recentProjects: vi.fn(async () => [{ id: PROJECT_A, displayName: 'Project A', lastOpenedAt: '2026-07-13T00:00:00.000Z' }]),
      catalogFiles: vi.fn(async () => []),
      selectProject: vi.fn(),
    } as unknown as AgentDesignDesktopHost
    window.agentDesignHost = host

    const view = render(<App mode="production" />)
    await waitFor(() => expect(view.getByRole('alert').textContent).toContain('snapshot could not be loaded'))
    expect(view.getByRole('button', { name: 'Try again' })).toBeTruthy()
  })
})
