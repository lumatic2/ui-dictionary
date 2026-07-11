import { useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  commitOperation,
  createHistory,
  type CanvasDocument,
  type CanvasNode,
  type CanvasOperation,
} from '@askewly/canvas-core'
import { LayersPanel } from './LayersPanel'

afterEach(cleanup)

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

function baseNode(id: string, parentId: string | null, childIds: string[]): Omit<CanvasNode, 'kind'> {
  return {
    id,
    name: id,
    parentId,
    childIds,
    bounds: { x: 0, y: 0, width: 100, height: 60 },
    layout: structuredClone(layout),
    visible: true,
    locked: false,
    tokenBindings: {},
    source: null,
  } as Omit<CanvasNode, 'kind'>
}

function frame(id: string, parentId: string | null, childIds: string[] = [], overrides: Partial<CanvasNode> = {}): CanvasNode {
  return { ...baseNode(id, parentId, childIds), kind: 'frame', clipContent: false, ...overrides } as CanvasNode
}

function fixture(): CanvasDocument {
  const createdAt = '2026-07-12T00:00:00.000Z'
  return {
    schemaVersion: 1,
    id: 'layers-fixture',
    name: 'Layers fixture',
    revision: 0,
    rootIds: ['frame-a', 'frame-d'],
    nodes: {
      'frame-a': frame('frame-a', null, ['group-b', 'text-c']),
      'group-b': { ...baseNode('group-b', 'frame-a', ['text-t']), kind: 'group' } as CanvasNode,
      'text-t': { ...baseNode('text-t', 'group-b', []), kind: 'text', text: 'Deep text', textStyle: { fontFamily: 'Geist', fontSize: 14, fontWeight: 400, lineHeight: 20 } } as CanvasNode,
      'text-c': { ...baseNode('text-c', 'frame-a', []), kind: 'text', text: 'Shallow text', textStyle: { fontFamily: 'Geist', fontSize: 14, fontWeight: 400, lineHeight: 20 } } as CanvasNode,
      'frame-d': frame('frame-d', null, ['frame-e']),
      'frame-e': frame('frame-e', 'frame-d', [], { name: 'Locked frame', locked: true }),
    },
    selection: [],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
  }
}

function Harness() {
  const [history, setHistory] = useState(() => createHistory(fixture()))
  const commit = (operation: CanvasOperation) => setHistory((current) => commitOperation(current, operation))
  return <>
    <LayersPanel document={history.present} onOperation={commit} />
    <output data-testid="probe-selection">{history.present.selection.join(',')}</output>
    <output data-testid="probe-revision">{history.present.revision}</output>
    <button
      type="button"
      data-testid="probe-select-deep"
      onClick={() => commit({ id: 'probe-select', at: '2026-07-12T00:00:01.000Z', type: 'select-nodes', nodeIds: ['text-t'] })}
    >select deep node</button>
  </>
}

function dataTransfer() {
  return {
    effectAllowed: 'none',
    dropEffect: 'none',
    values: new Map<string, string>(),
    setData(type: string, value: string) { this.values.set(type, value) },
    getData(type: string) { return this.values.get(type) ?? '' },
  }
}

describe('LayersPanel', () => {
  it('projects the document hierarchy as a collapsed accessible tree', () => {
    const view = render(<Harness />)
    expect(view.getByRole('tree', { name: 'Layers' })).toBeTruthy()
    const items = view.getAllByRole('treeitem')
    expect(items.map((item) => item.getAttribute('aria-label'))).toEqual(['frame-a', 'frame-d'])
    expect(items[0].getAttribute('aria-level')).toBe('1')
    expect(items[0].getAttribute('aria-expanded')).toBe('false')
    expect(view.queryByTestId('layer-group-b')).toBeNull()
  })

  it('expands and collapses subtrees with pointer and keyboard', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByRole('button', { name: 'Expand frame-a' }))
    expect(view.getByTestId('layer-frame-a').getAttribute('aria-expanded')).toBe('true')
    expect(view.getByTestId('layer-group-b').getAttribute('aria-level')).toBe('2')
    expect(view.queryByTestId('layer-text-t')).toBeNull()

    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'ArrowLeft' })
    expect(view.queryByTestId('layer-group-b')).toBeNull()
    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'ArrowRight' })
    expect(view.getByTestId('layer-group-b')).toBeTruthy()
    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(view.getByTestId('layer-group-b'))
  })

  it('synchronizes selection from tree to document and reveals canvas selection in the tree', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByTestId('layer-frame-a'))
    expect(view.getByTestId('probe-selection').textContent).toBe('frame-a')
    expect(view.getByTestId('layer-frame-a').getAttribute('aria-selected')).toBe('true')

    fireEvent.click(view.getByTestId('layer-frame-d'), { shiftKey: true })
    expect(view.getByTestId('probe-selection').textContent).toBe('frame-a,frame-d')

    fireEvent.click(view.getByTestId('probe-select-deep'))
    expect(view.getByTestId('layer-text-t').getAttribute('aria-selected')).toBe('true')
    expect(view.getByTestId('layer-frame-a').getAttribute('aria-expanded')).toBe('true')
    expect(view.getByTestId('layer-group-b').getAttribute('aria-expanded')).toBe('true')
  })

  it('traverses visible rows with arrow keys and selects with Enter', () => {
    const view = render(<Harness />)
    const first = view.getByTestId('layer-frame-a')
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(view.getByTestId('layer-frame-d'))
    fireEvent.keyDown(view.getByTestId('layer-frame-d'), { key: 'ArrowUp' })
    expect(document.activeElement).toBe(first)
    fireEvent.keyDown(first, { key: 'Enter' })
    expect(view.getByTestId('probe-selection').textContent).toBe('frame-a')
  })

  it('renames inline, commits one operation, and restores focus to the row', () => {
    const view = render(<Harness />)
    fireEvent.doubleClick(view.getByTestId('layer-frame-a'))
    const input = view.getByTestId('layer-rename-input')
    fireEvent.change(input, { target: { value: 'Hero frame' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByTestId('layer-frame-a').getAttribute('aria-label')).toBe('Hero frame')
    expect(document.activeElement).toBe(view.getByTestId('layer-frame-a'))

    fireEvent.keyDown(view.getByTestId('layer-frame-d'), { key: 'F2' })
    const second = view.getByTestId('layer-rename-input')
    fireEvent.change(second, { target: { value: 'Discarded' } })
    fireEvent.keyDown(second, { key: 'Escape' })
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByTestId('layer-frame-d').getAttribute('aria-label')).toBe('frame-d')
  })

  it('toggles visibility and lock through canonical update operations', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByRole('button', { name: 'Toggle visibility for frame-a' }))
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByRole('button', { name: 'Toggle visibility for frame-a' }).getAttribute('aria-pressed')).toBe('false')
    expect(view.getByTestId('probe-selection').textContent).toBe('')

    fireEvent.click(view.getByRole('button', { name: 'Toggle lock for frame-a' }))
    expect(view.getByRole('button', { name: 'Toggle lock for frame-a' }).getAttribute('aria-pressed')).toBe('true')
    expect(view.getByTestId('layer-frame-a').getAttribute('draggable')).toBe('false')
    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'F2' })
    expect(view.queryByTestId('layer-rename-input')).toBeNull()
  })

  it('reorders siblings by keyboard and ignores boundary and locked moves', () => {
    const view = render(<Harness />)
    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'ArrowDown', altKey: true })
    expect(view.getAllByRole('treeitem').map((item) => item.getAttribute('aria-label'))).toEqual(['frame-d', 'frame-a'])
    expect(view.getByTestId('probe-revision').textContent).toBe('1')

    fireEvent.keyDown(view.getByTestId('layer-frame-a'), { key: 'ArrowDown', altKey: true })
    expect(view.getByTestId('probe-revision').textContent).toBe('1')

    fireEvent.click(view.getByRole('button', { name: 'Expand frame-a' }))
    fireEvent.click(view.getByRole('button', { name: 'Toggle lock for text-c' }))
    fireEvent.keyDown(view.getByTestId('layer-text-c'), { key: 'ArrowUp', altKey: true })
    expect(view.getByTestId('probe-revision').textContent).toBe('2')
    const frameAChildren = view.getAllByRole('treeitem').filter((item) => item.getAttribute('data-layer-parent-id') === 'frame-a')
    expect(frameAChildren.map((item) => item.getAttribute('aria-label'))).toEqual(['group-b', 'text-c'])
  })

  it('reparents through valid drops and rejects invalid targets without mutation', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByRole('button', { name: 'Expand frame-a' }))

    const transfer = dataTransfer()
    fireEvent.dragStart(view.getByTestId('layer-text-c'), { dataTransfer: transfer })
    fireEvent.dragOver(view.getByTestId('layer-frame-d'), { dataTransfer: transfer })
    expect(view.getByTestId('layer-frame-d').getAttribute('data-drop-target')).toBe('active')
    fireEvent.drop(view.getByTestId('layer-frame-d'), { dataTransfer: transfer })
    expect(view.getByTestId('layer-text-c').getAttribute('data-layer-parent-id')).toBe('frame-d')
    expect(view.getByTestId('layer-frame-d').getAttribute('aria-expanded')).toBe('true')
    expect(view.getByTestId('probe-revision').textContent).toBe('1')

    const invalidTransfer = dataTransfer()
    fireEvent.dragStart(view.getByTestId('layer-frame-a'), { dataTransfer: invalidTransfer })
    fireEvent.dragOver(view.getByTestId('layer-group-b'), { dataTransfer: invalidTransfer })
    expect(view.getByTestId('layer-group-b').getAttribute('data-drop-target')).toBe('invalid')
    fireEvent.drop(view.getByTestId('layer-group-b'), { dataTransfer: invalidTransfer })
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByTestId('layer-frame-a').getAttribute('data-layer-parent-id')).toBe('')

    const lockedTransfer = dataTransfer()
    fireEvent.dragStart(view.getByTestId('layer-text-c'), { dataTransfer: lockedTransfer })
    fireEvent.dragOver(view.getByTestId('layer-frame-e'), { dataTransfer: lockedTransfer })
    expect(view.getByTestId('layer-frame-e').getAttribute('data-drop-target')).toBe('invalid')
    fireEvent.drop(view.getByTestId('layer-frame-e'), { dataTransfer: lockedTransfer })
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
  })
})
