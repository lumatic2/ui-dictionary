import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { desktopHost } from './desktopHost'
import type { AgentDesignDesktopHost, DesktopBridgeStatus, DesktopCollaborationFeed } from './desktopHost'

afterEach(() => {
  cleanup()
  delete window.agentDesignHost
})

describe('desktop bridge surface', () => {
  it('shows only redacted lifecycle state and asks main to copy terminal commands', async () => {
    const ready: DesktopBridgeStatus = {
      apiVersion: 1,
      state: 'ready',
      projectId: 'project:fixture',
      restartCount: 1,
      cursor: 4,
      revision: 4,
      lastErrorCode: null,
      recoveryMode: 'recovered',
    }
    const copyTerminalCommand = vi.fn(async () => ({ copied: true as const }))
    const host: AgentDesignDesktopHost = {
      apiVersion: 1,
      getHostInfo: vi.fn(),
      getBridgeStatus: vi.fn(async () => ready),
      copyTerminalCommand,
      onBridgeStatus: vi.fn(() => () => undefined),
      getCanvasSnapshot: vi.fn(async () => ({ document: { schemaVersion: 1 as const, id: 'fixture', name: 'Fixture', revision: 0, rootIds: [], nodes: {}, selection: [], viewport: { pan: { x: 0, y: 0 }, zoom: 1 }, tokenSetId: 'askewly.default', metadata: { createdAt: '2026-07-11T01:00:00.000Z', updatedAt: '2026-07-11T01:00:00.000Z', sourceRoot: '.' } }, revision: 0, cursor: 0, hash: 'a'.repeat(64) })),
      applyCanvasOperation: vi.fn(),
      undoCanvas: vi.fn(),
      onCanvasSnapshot: vi.fn(() => () => undefined),
      getCollaborationFeed: vi.fn(async () => ({ entries: [], actors: [], cursorRevision: 0 })),
      onCollaborationFeed: vi.fn(() => () => undefined),
      selectProject: vi.fn(async () => ({ canceled: false, project: { id: 'project:aaaaaaaaaaaaaaaaaaaaaaaa', displayName: 'fixture', lastOpenedAt: '2026-07-11T01:00:00.000Z' } })),
      recentProjects: vi.fn(async () => []),
      openRecentProject: vi.fn(async () => ({ id: 'project:aaaaaaaaaaaaaaaaaaaaaaaa', displayName: 'fixture', lastOpenedAt: '2026-07-11T01:00:00.000Z' })),
      openPreview: vi.fn(async (request) => ({ visible: true, projectId: request.projectId, state: 'ready' as const })),
      hidePreview: vi.fn(async () => ({ visible: false, projectId: null, state: 'idle' as const })),
      catalogFiles: vi.fn(async () => [{ id: 'file:bbbbbbbbbbbbbbbbbbbbbbbb', label: 'src/App.tsx' }]),
      revealProject: vi.fn(async () => ({ opened: true as const })),
      openFile: vi.fn(async () => ({ opened: true as const })),
      exportDiagnostics: vi.fn(async () => ({ exported: true })),
      materializeNode: vi.fn(),
    }
    window.agentDesignHost = host

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready · recovered · restart 1'))
    expect(view.getByTestId('desktop-bridge-status').textContent).not.toMatch(/token|127\.0\.0\.1|C:\\/i)
    fireEvent.click(view.getByRole('button', { name: 'Copy Codex' }))
    fireEvent.click(view.getByRole('button', { name: 'Copy Claude' }))
    await waitFor(() => expect(copyTerminalCommand).toHaveBeenCalledTimes(2))
    expect(copyTerminalCommand).toHaveBeenNthCalledWith(1, { apiVersion: 1, actor: 'codex' })
    expect(copyTerminalCommand).toHaveBeenNthCalledWith(2, { apiVersion: 1, actor: 'claude' })
    fireEvent.click(view.getByRole('button', { name: 'Open project' }))
    await waitFor(() => expect(host.selectProject).toHaveBeenCalledWith({ apiVersion: 1 }))
    expect(view.getByRole('combobox', { name: 'Recent projects' }).textContent).toContain('fixture')
    fireEvent.click(view.getByRole('button', { name: 'Preview' }))
    fireEvent.click(view.getByRole('button', { name: 'Explorer' }))
    fireEvent.click(view.getByRole('button', { name: 'Diagnostics' }))
    await waitFor(() => expect(host.openPreview).toHaveBeenCalledWith({ apiVersion: 1, projectId: 'project:aaaaaaaaaaaaaaaaaaaaaaaa' }))
    expect(host.revealProject).toHaveBeenCalledWith({ apiVersion: 1, projectId: 'project:aaaaaaaaaaaaaaaaaaaaaaaa' })
    expect(host.exportDiagnostics).toHaveBeenCalledWith({ apiVersion: 1 })
    await waitFor(() => expect(view.getByRole('combobox', { name: 'Project files' }).textContent).toContain('src/App.tsx'))
    fireEvent.change(view.getByRole('combobox', { name: 'Project files' }), { target: { value: 'file:bbbbbbbbbbbbbbbbbbbbbbbb' } })
    expect(host.openFile).toHaveBeenCalledWith({ apiVersion: 1, projectId: 'project:aaaaaaaaaaaaaaaaaaaaaaaa', fileId: 'file:bbbbbbbbbbbbbbbbbbbbbbbb' })
  })
})

describe('desktop collaboration feed surface', () => {
  it('fetches and subscribes to an actor-attributed, revision-ordered feed and unsubscribes cleanly', async () => {
    const feed: DesktopCollaborationFeed = {
      entries: [
        { transactionId: 'human:1', actor: 'human', kind: 'operations', revision: 1, at: '2026-07-12T00:01:00.000Z', changeCount: 1, nodeIds: ['node-a'] },
        { transactionId: 'codex:2', actor: 'codex', kind: 'operations', revision: 2, at: '2026-07-12T00:02:00.000Z', changeCount: 1, nodeIds: ['node-b'] },
      ],
      actors: [
        { actor: 'codex', lastRevision: 2, lastActiveAt: '2026-07-12T00:02:00.000Z' },
        { actor: 'human', lastRevision: 1, lastActiveAt: '2026-07-12T00:01:00.000Z' },
      ],
      cursorRevision: 2,
    }
    const removeListener = vi.fn()
    const host: Pick<AgentDesignDesktopHost, 'getCollaborationFeed' | 'onCollaborationFeed'> = {
      getCollaborationFeed: vi.fn(async () => feed),
      onCollaborationFeed: vi.fn((listener: (value: DesktopCollaborationFeed) => void) => {
        listener(feed)
        return removeListener
      }),
    }
    window.agentDesignHost = host as unknown as AgentDesignDesktopHost

    const resolved = await desktopHost()?.getCollaborationFeed({ apiVersion: 1 })
    expect(resolved).toEqual(feed)
    expect(resolved?.entries.map((entry) => entry.revision)).toEqual([1, 2])

    const received: DesktopCollaborationFeed[] = []
    const unsubscribe = desktopHost()?.onCollaborationFeed((value) => received.push(value))
    expect(received).toEqual([feed])
    unsubscribe?.()
    expect(removeListener).toHaveBeenCalledTimes(1)
  })
})
