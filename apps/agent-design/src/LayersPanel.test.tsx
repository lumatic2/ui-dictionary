import { useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  commitOperation,
  createDocumentFixture,
  createHistory,
  type CanvasDocument,
  type CanvasNode,
  type CanvasOperation,
} from '@askewly/canvas-core'
import { LAYER_KIND_ICONS, LayersPanel } from './LayersPanel'

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
  it('shows a short empty message instead of a bare tree when the document has no layers', () => {
    const empty: CanvasDocument = { ...fixture(), rootIds: [], nodes: {} }
    const view = render(<LayersPanel document={empty} onOperation={() => {}} />)
    expect(view.queryByRole('tree')).toBeNull()
    expect(view.getByTestId('layers-empty').textContent).toBe('No layers yet. Insert a frame to get started.')
  })

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

describe('타입이 아이콘으로 갈린다 (EU3 step-1)', () => {
  it('7종이 서로 다른 아이콘을 갖는다 — 겹치는 종류가 없다', () => {
    const kinds: Array<CanvasNode['kind']> = ['frame', 'group', 'code-component', 'text', 'image', 'shape', 'instance']
    const icons = kinds.map((kind) => LAYER_KIND_ICONS[kind])
    // 전에는 frame·image·shape가 전부 '▭'로 뭉쳐 있었다.
    expect(new Set(icons).size).toBe(kinds.length)
    expect(icons.every((icon) => icon.length > 0)).toBe(true)
  })

  it('행이 자기 종류를 아이콘과 속성 양쪽으로 말한다', () => {
    const document = createDocumentFixture(1000)
    const view = render(<LayersPanel document={document} onOperation={() => {}} />)
    const rows = [...view.container.querySelectorAll('.layer-kind')]
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      const kind = row.getAttribute('data-layer-kind') as CanvasNode['kind']
      expect(row.textContent).toBe(LAYER_KIND_ICONS[kind])
    }
  })
})

describe('이름으로 찾는다 (EU3 step-2)', () => {
  const search = (view: ReturnType<typeof render>, value: string) =>
    fireEvent.change(view.getByTestId('layer-search'), { target: { value } })

  const visibleIds = (view: ReturnType<typeof render>) =>
    [...view.container.querySelectorAll('[role="treeitem"]')].map((row) => row.getAttribute('data-testid')!.replace('layer-', ''))

  it('매칭 행과 그 조상만 남는다 — 계층이 사라지지 않는다', () => {
    const document = createDocumentFixture(1000)
    // 깊이가 있는 노드를 하나 골라 고유한 이름을 준다.
    const target = document.nodes['node-00042']
    const parentId = target.parentId!
    target.name = '고유한이름ZZZ'

    const view = render(<LayersPanel document={document} onOperation={() => {}} />)
    search(view, '고유한이름ZZZ')

    const ids = visibleIds(view)
    expect(view.getByTestId('layer-search-count').textContent).toContain('1건')
    expect(ids).toContain(target.id)
    // 조상이 함께 보여야 "어디 있는지"가 읽힌다.
    expect(ids).toContain(parentId)
    // 관계없는 형제는 사라진다.
    expect(ids).not.toContain('node-00043')
  })

  it('매칭 행과 맥락 행이 구분된다', () => {
    const document = createDocumentFixture(1000)
    document.nodes['node-00042'].name = '고유한이름ZZZ'
    const view = render(<LayersPanel document={document} onOperation={() => {}} />)
    search(view, '고유한이름ZZZ')

    expect(view.container.querySelector(`[data-testid="layer-node-00042"]`)?.getAttribute('data-layer-match')).toBe('hit')
    const parentId = document.nodes['node-00042'].parentId!
    expect(view.container.querySelector(`[data-testid="layer-${parentId}"]`)?.getAttribute('data-layer-match')).toBe('context')
  })

  it('검색어를 비우면 원래 트리로 돌아온다', () => {
    const document = createDocumentFixture(1000)
    const view = render(<LayersPanel document={document} onOperation={() => {}} />)
    const before = visibleIds(view).length
    search(view, '고유한이름ZZZ')
    expect(visibleIds(view).length).not.toBe(before)
    search(view, '')
    expect(visibleIds(view).length).toBe(before)
  })

  it('맞는 게 없으면 없다고 말한다 — 빈 트리로 넘기지 않는다', () => {
    const document = createDocumentFixture(1000)
    const view = render(<LayersPanel document={document} onOperation={() => {}} />)
    search(view, '존재하지않는이름QQQ')
    expect(view.getByTestId('layers-no-match').textContent).toContain('존재하지않는이름QQQ')
  })

  it('검색 결과에서도 선택이 동작한다', () => {
    const operations: CanvasOperation[] = []
    const document = createDocumentFixture(1000)
    document.nodes['node-00042'].name = '고유한이름ZZZ'
    const view = render(<LayersPanel document={document} onOperation={(op) => operations.push(op)} />)
    search(view, '고유한이름ZZZ')
    fireEvent.click(view.getByTestId('layer-node-00042'))
    const select = operations.find((op) => op.type === 'select-nodes') as { nodeIds: string[] }
    expect(select.nodeIds).toEqual(['node-00042'])
  })
})

describe('선택하면 부모 경로가 펼쳐진다 (EU3 step-3)', () => {
  /** 이 동작은 EU3 이전부터 있었지만 지키는 테스트가 없었다 — 여기서 고정한다. */
  it('깊은 노드를 선택하면 그 행이 보이고 조상이 전부 펼쳐진다', () => {
    const document = createDocumentFixture(1000)
    const deepId = 'node-00042'
    const ancestors: string[] = []
    let parentId = document.nodes[deepId].parentId
    while (parentId) { ancestors.push(parentId); parentId = document.nodes[parentId].parentId }
    expect(ancestors.length, '조상이 없으면 이 테스트가 아무것도 증명하지 않는다').toBeGreaterThan(0)

    const view = render(<LayersPanel document={{ ...document, selection: [deepId] }} onOperation={() => {}} />)
    expect(view.getByTestId(`layer-${deepId}`)).toBeTruthy()
    for (const ancestorId of ancestors) {
      expect(view.getByTestId(`layer-${ancestorId}`).getAttribute('aria-expanded')).toBe('true')
    }
  })

  it('선택을 옮겨도 이미 펼친 경로는 접히지 않는다', () => {
    const document = createDocumentFixture(1000)
    const view = render(<LayersPanel document={{ ...document, selection: ['node-00042'] }} onOperation={() => {}} />)
    const parentId = document.nodes['node-00042'].parentId!
    view.rerender(<LayersPanel document={{ ...document, selection: ['node-00000'] }} onOperation={() => {}} />)
    expect(view.getByTestId(`layer-${parentId}`).getAttribute('aria-expanded')).toBe('true')
  })
})
