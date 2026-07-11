import type { CanvasDocument } from '@askewly/canvas-core'
import type { CollaborationFeed } from './liveBridge'

interface Props {
  document: CanvasDocument
  feed: CollaborationFeed | null
  connectionLabel: string
  error: string
  onUndoLatest: () => void
}

const kindLabels = {
  operations: 'edited the canvas',
  'source-patch': 'patched source',
  undo: 'undid a change',
} as const

export function AgentPanel({ document, feed, connectionLabel, error, onUndoLatest }: Props) {
  const entries = feed ? [...feed.entries].slice(-12).reverse() : []
  return <aside className="agent-panel" data-testid="agent-panel" aria-label="Agent collaboration">
    <header className="agent-panel-header">
      <h2>Agents</h2>
      <span className="agent-connection" data-testid="agent-connection">{connectionLabel}</span>
    </header>
    <section aria-label="Agent context" className="agent-section">
      <p className="rail-label">Agents see</p>
      <p className="agent-context" data-testid="agent-context">
        Revision {document.revision} · {document.selection.length ? `selection ${document.selection.join(', ')}` : 'no selection'}
      </p>
    </section>
    <section aria-label="Actor activity" className="agent-section">
      <p className="rail-label">Actors</p>
      {feed?.actors.length
        ? feed.actors.map((actor) => <p className="agent-actor" key={actor.actor} data-testid={`actor-${actor.actor}`}>
          <strong>{actor.actor}</strong> · revision {actor.lastRevision} · {actor.lastActiveAt}
        </p>)
        : <p className="agent-empty">No agent activity yet.</p>}
    </section>
    <section aria-label="Recent changes" className="agent-section agent-feed">
      <p className="rail-label">Recent changes</p>
      {entries.length === 0
        ? <p className="agent-empty" data-testid="agent-feed-empty">No transactions recorded.</p>
        : <ol data-testid="agent-feed">
          {entries.map((entry) => <li key={entry.transactionId} data-testid={`feed-${entry.transactionId}`}>
            <strong>{entry.actor}</strong> {kindLabels[entry.kind]} · revision {entry.revision} · {entry.changeCount} change{entry.changeCount === 1 ? '' : 's'}{entry.nodeIds.length ? ` · ${entry.nodeIds.slice(0, 3).join(', ')}` : ''}
          </li>)}
        </ol>}
    </section>
    <button type="button" className="agent-undo" disabled={!entries.length} onClick={onUndoLatest}>Undo latest change</button>
    <p role="alert" className="agent-error" data-testid="agent-error">{error}</p>
  </aside>
}
