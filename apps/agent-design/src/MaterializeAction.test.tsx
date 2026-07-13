import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CanvasDocument } from '@askewly/canvas-core'
import { planMaterializeRegistryNode } from '@askewly/component-registry'
import { App } from './App'
import type { AgentDesignDesktopHost, DesktopCanvasSnapshot } from './desktopHost'

const PROJECT_ID = 'project:aaaaaaaaaaaaaaaaaaaaaaaa'

afterEach(() => {
  cleanup()
  delete window.agentDesignHost
})

function documentFixture(revision: number, sourceFile = 'registry://shadcn/button'): CanvasDocument {
  return {
    schemaVersion: 1,
    id: 'materialize-fixture',
    name: 'Materialize fixture',
    revision,
    rootIds: ['node-a'],
    nodes: {
      'node-a': {
        id: 'node-a',
        kind: 'code-component',
        name: 'Button',
        parentId: null,
        childIds: [],
        bounds: { x: 0, y: 0, width: 96, height: 36 },
        layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
        visible: true,
        locked: false,
        tokenBindings: {},
        source: { file: sourceFile, exportName: 'Button', startLine: 1, endLine: 1 },
        props: { label: 'Button' },
        variants: {},
      },
    },
    selection: ['node-a'],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt: '2026-07-12T00:00:00.000Z', updatedAt: '2026-07-12T00:00:00.000Z', sourceRoot: '.' },
  }
}

function snapshotFixture(revision: number, sourceFile?: string): DesktopCanvasSnapshot {
  return { document: documentFixture(revision, sourceFile), revision, cursor: revision, hash: 'd'.repeat(64) }
}

function buildHost(overrides: Partial<AgentDesignDesktopHost> = {}): AgentDesignDesktopHost {
  return {
    apiVersion: 1,
    getHostInfo: vi.fn(),
    getBridgeStatus: vi.fn(async () => ({ apiVersion: 1 as const, state: 'ready' as const, projectId: PROJECT_ID, restartCount: 0, cursor: 1, revision: 1, lastErrorCode: null, recoveryMode: null })),
    copyTerminalCommand: vi.fn(async () => ({ copied: true as const })),
    onBridgeStatus: vi.fn(() => () => undefined),
    getCanvasSnapshot: vi.fn(async () => snapshotFixture(1)),
    applyCanvasOperation: vi.fn(),
    undoCanvas: vi.fn(),
    onCanvasSnapshot: vi.fn(() => () => undefined),
    getCollaborationFeed: vi.fn(async () => ({ entries: [], actors: [], cursorRevision: 0 })),
    onCollaborationFeed: vi.fn(() => () => undefined),
    selectProject: vi.fn(),
    recentProjects: vi.fn(async () => [{ id: PROJECT_ID, displayName: 'fixture', lastOpenedAt: '2026-07-12T00:00:00.000Z' }]),
    openRecentProject: vi.fn(),
    openPreview: vi.fn(),
    hidePreview: vi.fn(),
    catalogFiles: vi.fn(async () => []),
    revealProject: vi.fn(),
    openFile: vi.fn(),
    exportDiagnostics: vi.fn(),
    materializeNode: vi.fn(),
    ...overrides,
  } as AgentDesignDesktopHost
}

describe('materialize registry node action', () => {
  it('hides the action in web/demo mode with no desktop bridge', () => {
    const view = render(<App mode="benchmark" />)
    const component = view.container.querySelector('[data-canvas-id="node-00001"]')
    if (!(component instanceof HTMLElement)) throw new Error('code-component fixture missing')
    fireEvent.click(component)
    expect(view.queryByTestId('materialize-node')).toBeNull()
  })

  it('hides the action for an already source-backed code-component even with the bridge connected', async () => {
    const host = buildHost({ getCanvasSnapshot: vi.fn(async () => snapshotFixture(1, 'src/components/Button.tsx')) })
    window.agentDesignHost = host

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready'))
    expect(view.queryByTestId('materialize-node')).toBeNull()
  })

  it('shows Materialize for a registry-backed code-component when the desktop bridge is connected, and submits the planned source patch', async () => {
    const materializeNode = vi.fn(async (request: { apiVersion: 1; file: string; content: string }) => snapshotFixture(2, request.file))
    const host = buildHost({ materializeNode })
    window.agentDesignHost = host

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready'))
    await waitFor(() => expect(view.getByTestId('materialize-node')).toBeTruthy())

    const expectedPlan = planMaterializeRegistryNode(documentFixture(1), 'node-a')
    fireEvent.click(view.getByTestId('materialize-node'))

    await waitFor(() => expect(materializeNode).toHaveBeenCalledWith({ apiVersion: 1, file: expectedPlan.filePath, content: expectedPlan.content }))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toBe(`materialized to ${expectedPlan.filePath}`))
  })

  it('surfaces the bridge error when materialization is rejected', async () => {
    const materializeNode = vi.fn(async () => { throw new Error('source file already exists: src/components/Button.tsx') })
    const host = buildHost({ materializeNode })
    window.agentDesignHost = host

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready'))
    await waitFor(() => expect(view.getByTestId('materialize-node')).toBeTruthy())
    fireEvent.click(view.getByTestId('toggle-agents'))
    fireEvent.click(view.getByTestId('materialize-node'))

    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('source file already exists'))
    expect(view.getByTestId('agent-error').textContent).toContain('source file already exists')
  })
})
