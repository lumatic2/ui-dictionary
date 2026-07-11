import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDocumentFixture } from '@askewly/canvas-core'
import { AgentPanel } from './AgentPanel'
import type { CollaborationFeed } from './liveBridge'

afterEach(cleanup)

function feedFixture(): CollaborationFeed {
  return {
    entries: [
      { transactionId: 'tx-1', actor: 'human', kind: 'operations', revision: 3, at: '2026-07-12T02:00:00.000Z', changeCount: 1, nodeIds: ['node-00001'] },
      { transactionId: 'tx-2', actor: 'codex', kind: 'operations', revision: 4, at: '2026-07-12T02:01:00.000Z', changeCount: 2, nodeIds: ['node-00002', 'node-00003'] },
      { transactionId: 'tx-3', actor: 'claude', kind: 'undo', revision: 5, at: '2026-07-12T02:02:00.000Z', changeCount: 1, nodeIds: [] },
    ],
    actors: [
      { actor: 'codex', lastRevision: 4, lastActiveAt: '2026-07-12T02:01:00.000Z' },
      { actor: 'claude', lastRevision: 5, lastActiveAt: '2026-07-12T02:02:00.000Z' },
    ],
    cursorRevision: 5,
  }
}

describe('AgentPanel', () => {
  it('shows the selection context agents see', () => {
    const document = createDocumentFixture(1000)
    const view = render(<AgentPanel document={document} feed={null} connectionLabel="offline" error="" onUndoLatest={() => {}} />)
    expect(view.getByTestId('agent-context').textContent).toBe('Revision 0 · selection node-00000')
    expect(view.getByTestId('agent-connection').textContent).toBe('offline')
  })

  it('renders empty collaboration state with undo disabled', () => {
    const document = createDocumentFixture(1000)
    const view = render(<AgentPanel document={document} feed={null} connectionLabel="offline" error="" onUndoLatest={() => {}} />)
    expect(view.getByText('No agent activity yet.')).toBeTruthy()
    expect(view.getByTestId('agent-feed-empty')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Undo latest change' }).hasAttribute('disabled')).toBe(true)
  })

  it('renders actor activity and a human-readable feed, newest first', () => {
    const document = createDocumentFixture(1000)
    const view = render(<AgentPanel document={document} feed={feedFixture()} connectionLabel="desktop ready" error="" onUndoLatest={() => {}} />)
    expect(view.getByTestId('actor-codex').textContent).toContain('codex · revision 4')
    expect(view.getByTestId('actor-claude').textContent).toContain('claude · revision 5')
    const items = view.getByTestId('agent-feed').querySelectorAll('li')
    expect(items).toHaveLength(3)
    expect(items[0].textContent).toContain('claude undid a change · revision 5 · 1 change')
    expect(items[1].textContent).toContain('codex edited the canvas · revision 4 · 2 changes · node-00002, node-00003')
    expect(items[2].textContent).toContain('human edited the canvas · revision 3')
  })

  it('dispatches undo for the latest change and surfaces conflicts', () => {
    const document = createDocumentFixture(1000)
    const onUndoLatest = vi.fn()
    const view = render(<AgentPanel document={document} feed={feedFixture()} connectionLabel="desktop ready" error="REVISION_CONFLICT: base revision 4 is stale" onUndoLatest={onUndoLatest} />)
    fireEvent.click(view.getByRole('button', { name: 'Undo latest change' }))
    expect(onUndoLatest).toHaveBeenCalledTimes(1)
    expect(view.getByRole('alert').textContent).toContain('REVISION_CONFLICT')
  })
})
