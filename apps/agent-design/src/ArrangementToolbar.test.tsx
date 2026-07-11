import { useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  commitOperation,
  createHistory,
  undo,
  type CanvasDocument,
  type CanvasNode,
  type CanvasOperation,
} from '@askewly/canvas-core'
import { ArrangementToolbar } from './ArrangementToolbar'

afterEach(cleanup)

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

function frame(id: string, parentId: string | null, childIds: string[], bounds: { x: number; y: number; width: number; height: number }, overrides: Partial<CanvasNode> = {}): CanvasNode {
  return {
    id,
    kind: 'frame',
    name: id,
    parentId,
    childIds,
    bounds,
    layout: structuredClone(layout),
    visible: true,
    locked: false,
    tokenBindings: {},
    source: null,
    clipContent: false,
    ...overrides,
  } as CanvasNode
}

function fixture(selection: string[]): CanvasDocument {
  const createdAt = '2026-07-12T00:00:00.000Z'
  return {
    schemaVersion: 1,
    id: 'arrange-fixture',
    name: 'Arrange fixture',
    revision: 0,
    rootIds: ['root'],
    nodes: {
      root: frame('root', null, ['box-1', 'box-2', 'box-3', 'box-locked', 'group-g'], { x: 0, y: 0, width: 800, height: 600 }),
      'box-1': frame('box-1', 'root', [], { x: 10, y: 10, width: 40, height: 30 }),
      'box-2': frame('box-2', 'root', [], { x: 100, y: 40, width: 60, height: 20 }),
      'box-3': frame('box-3', 'root', [], { x: 300, y: 90, width: 20, height: 50 }),
      'box-locked': frame('box-locked', 'root', [], { x: 400, y: 10, width: 30, height: 30 }, { locked: true }),
      'group-g': frame('group-g', 'root', ['inner-1'], { x: 500, y: 10, width: 100, height: 100 }, { kind: 'group', clipContent: undefined } as Partial<CanvasNode>),
      'inner-1': frame('inner-1', 'group-g', [], { x: 510, y: 20, width: 40, height: 40 }),
    },
    selection,
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
  }
}

function Harness({ selection }: { selection: string[] }) {
  const [history, setHistory] = useState(() => createHistory(fixture(selection)))
  return <>
    <ArrangementToolbar document={history.present} onOperation={(operation) => setHistory((current) => commitOperation(current, operation))} />
    <output data-testid="probe-revision">{history.present.revision}</output>
    <output data-testid="probe-selection">{history.present.selection.join(',')}</output>
    <output data-testid="probe-structure">{JSON.stringify(Object.fromEntries(Object.entries(history.present.nodes).map(([id, node]) => [id, { parentId: node.parentId, childIds: node.childIds, bounds: node.bounds }])))}</output>
    <button type="button" data-testid="probe-undo" onClick={() => setHistory(undo)}>undo</button>
  </>
}

function structure(view: ReturnType<typeof render>) {
  return JSON.parse(view.getByTestId('probe-structure').textContent ?? '{}')
}

describe('ArrangementToolbar', () => {
  it('disables commands that the selection cannot support', () => {
    const empty = render(<Harness selection={[]} />)
    for (const button of empty.getAllByRole('button').filter((b) => b.dataset.testid !== 'probe-undo')) {
      expect(button.hasAttribute('disabled')).toBe(true)
    }
    cleanup()

    const pair = render(<Harness selection={['box-1', 'box-2']} />)
    expect(pair.getByRole('button', { name: 'Align left' }).hasAttribute('disabled')).toBe(false)
    expect(pair.getByRole('button', { name: 'Tidy horizontal gap' }).hasAttribute('disabled')).toBe(false)
    expect(pair.getByRole('button', { name: 'Group selection' }).hasAttribute('disabled')).toBe(false)
    expect(pair.getByRole('button', { name: 'Distribute horizontally' }).hasAttribute('disabled')).toBe(true)
    expect(pair.getByRole('button', { name: 'Ungroup selection' }).hasAttribute('disabled')).toBe(true)
    cleanup()

    const locked = render(<Harness selection={['box-1', 'box-locked']} />)
    expect(locked.getByRole('button', { name: 'Align left' }).hasAttribute('disabled')).toBe(true)
    expect(locked.getByRole('button', { name: 'Group selection' }).hasAttribute('disabled')).toBe(true)
    cleanup()

    const mixedParents = render(<Harness selection={['box-1', 'inner-1']} />)
    expect(mixedParents.getByRole('button', { name: 'Group selection' }).hasAttribute('disabled')).toBe(true)
    expect(mixedParents.getByRole('button', { name: 'Align left' }).hasAttribute('disabled')).toBe(false)
    cleanup()

    const group = render(<Harness selection={['group-g']} />)
    expect(group.getByRole('button', { name: 'Ungroup selection' }).hasAttribute('disabled')).toBe(false)
  })

  it('aligns selection to exact bounds as one history entry', () => {
    const view = render(<Harness selection={['box-1', 'box-2', 'box-3']} />)
    fireEvent.click(view.getByRole('button', { name: 'Align left' }))
    let state = structure(view)
    expect(state['box-1'].bounds.x).toBe(10)
    expect(state['box-2'].bounds.x).toBe(10)
    expect(state['box-3'].bounds.x).toBe(10)
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    fireEvent.click(view.getByTestId('probe-undo'))
    state = structure(view)
    expect(state['box-2'].bounds.x).toBe(100)
  })

  it('tidies the horizontal gap to exact spacing', () => {
    const view = render(<Harness selection={['box-1', 'box-2', 'box-3']} />)
    fireEvent.click(view.getByRole('button', { name: 'Tidy horizontal gap' }))
    const state = structure(view)
    expect(state['box-2'].bounds.x).toBe(10 + 40 + 16)
    expect(state['box-3'].bounds.x).toBe(state['box-2'].bounds.x + 60 + 16)
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
  })

  it('groups siblings atomically and ungroups back in place', () => {
    const view = render(<Harness selection={['box-1', 'box-2']} />)
    fireEvent.click(view.getByRole('button', { name: 'Group selection' }))
    let state = structure(view)
    const groupId = view.getByTestId('probe-selection').textContent
    expect(groupId).toBe('grouped-0001')
    expect(state['grouped-0001']).toMatchObject({ parentId: 'root', childIds: ['box-1', 'box-2'], bounds: { x: 10, y: 10, width: 150, height: 50 } })
    expect(state['box-1'].parentId).toBe('grouped-0001')
    expect(view.getByTestId('probe-revision').textContent).toBe('1')

    fireEvent.click(view.getByRole('button', { name: 'Ungroup selection' }))
    state = structure(view)
    expect(state['grouped-0001']).toBeUndefined()
    expect(state['box-1'].parentId).toBe('root')
    expect(state.root.childIds.indexOf('box-1')).toBe(0)
    expect(view.getByTestId('probe-selection').textContent).toBe('box-1,box-2')
    expect(view.getByTestId('probe-revision').textContent).toBe('2')

    fireEvent.click(view.getByTestId('probe-undo'))
    state = structure(view)
    expect(state['grouped-0001']).toMatchObject({ childIds: ['box-1', 'box-2'] })
  })
})
