import {
  planAlign,
  planDistribute,
  planGroupSelection,
  planTidyGap,
  planUngroup,
  type CanvasDocument,
  type CanvasOperation,
} from '@askewly/canvas-core'

interface Props {
  document: CanvasDocument
  onOperation: (operation: CanvasOperation) => void
}

const TIDY_GAP = 16

export function ArrangementToolbar({ document, onOperation }: Props) {
  const nodes = document.selection.map((id) => document.nodes[id]).filter(Boolean)
  const anyLocked = nodes.some((node) => node.locked)
  const canAlign = nodes.length >= 2 && !anyLocked
  const canDistribute = nodes.length >= 3 && !anyLocked
  const canTidy = nodes.length >= 2 && !anyLocked
  const canGroup = nodes.length >= 2 && !anyLocked && nodes.every((node) => node.parentId === nodes[0].parentId)
  const single = nodes.length === 1 ? nodes[0] : null
  const canUngroup = single?.kind === 'group' && !single.locked && single.childIds.length > 0

  const dispatch = (plan: () => CanvasOperation) => {
    try {
      onOperation(plan())
    } catch {
      // planners reject invalid selections; disabled states should prevent reaching here
    }
  }
  const at = () => new Date().toISOString()

  return <div className="arrangement-toolbar" role="group" aria-label="Arrange selection" data-testid="arrangement-toolbar">
    <button type="button" disabled={!canAlign} aria-label="Align left" onClick={() => dispatch(() => planAlign(document, 'left', at()))}>⇤</button>
    <button type="button" disabled={!canAlign} aria-label="Align horizontal centers" onClick={() => dispatch(() => planAlign(document, 'center-x', at()))}>⇹</button>
    <button type="button" disabled={!canAlign} aria-label="Align right" onClick={() => dispatch(() => planAlign(document, 'right', at()))}>⇥</button>
    <button type="button" disabled={!canAlign} aria-label="Align top" onClick={() => dispatch(() => planAlign(document, 'top', at()))}>⤒</button>
    <button type="button" disabled={!canAlign} aria-label="Align vertical centers" onClick={() => dispatch(() => planAlign(document, 'center-y', at()))}>⇳</button>
    <button type="button" disabled={!canAlign} aria-label="Align bottom" onClick={() => dispatch(() => planAlign(document, 'bottom', at()))}>⤓</button>
    <button type="button" disabled={!canDistribute} aria-label="Distribute horizontally" onClick={() => dispatch(() => planDistribute(document, 'horizontal', at()))}>⫝̸</button>
    <button type="button" disabled={!canDistribute} aria-label="Distribute vertically" onClick={() => dispatch(() => planDistribute(document, 'vertical', at()))}>⫝</button>
    <button type="button" disabled={!canTidy} aria-label="Tidy horizontal gap" onClick={() => dispatch(() => planTidyGap(document, 'horizontal', TIDY_GAP, at()))}>Tidy</button>
    <button type="button" disabled={!canGroup} aria-label="Group selection" onClick={() => dispatch(() => planGroupSelection(document, at()))}>Group</button>
    <button type="button" disabled={!canUngroup} aria-label="Ungroup selection" onClick={() => dispatch(() => planUngroup(document, at()))}>Ungroup</button>
  </div>
}
