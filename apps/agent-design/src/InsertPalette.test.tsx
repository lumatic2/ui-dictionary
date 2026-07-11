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
import { InsertPalette } from './InsertPalette'

afterEach(cleanup)

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

function baseNode(id: string, parentId: string | null, childIds: string[]): Omit<CanvasNode, 'kind'> {
  return {
    id,
    name: id,
    parentId,
    childIds,
    bounds: { x: 100, y: 80, width: 320, height: 200 },
    layout: structuredClone(layout),
    visible: true,
    locked: false,
    tokenBindings: {},
    source: null,
  } as Omit<CanvasNode, 'kind'>
}

function fixture(selection: string[] = []): CanvasDocument {
  const createdAt = '2026-07-12T00:00:00.000Z'
  return {
    schemaVersion: 1,
    id: 'insert-fixture',
    name: 'Insert fixture',
    revision: 0,
    rootIds: ['frame-a', 'comp-x', 'frame-locked'],
    nodes: {
      'frame-a': { ...baseNode('frame-a', null, ['text-c']), kind: 'frame', clipContent: false } as CanvasNode,
      'text-c': { ...baseNode('text-c', 'frame-a', []), kind: 'text', text: 'Copy', textStyle: { fontFamily: 'Geist', fontSize: 14, fontWeight: 400, lineHeight: 20 } } as CanvasNode,
      'comp-x': {
        ...baseNode('comp-x', null, []),
        kind: 'code-component',
        name: 'Hero Button',
        source: { file: 'src/components/HeroButton.tsx', exportName: 'HeroButton', startLine: 1, endLine: 40 },
        props: { label: 'Hero' },
        variants: { size: 'md' },
      } as CanvasNode,
      'frame-locked': { ...baseNode('frame-locked', null, []), kind: 'frame', clipContent: false, locked: true } as CanvasNode,
    },
    selection,
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
  }
}

function Harness({ selection = [] }: { selection?: string[] }) {
  const [history, setHistory] = useState(() => createHistory(fixture(selection)))
  return <>
    <InsertPalette document={history.present} onOperation={(operation) => setHistory((current) => commitOperation(current, operation))} />
    <output data-testid="probe-selection">{history.present.selection.join(',')}</output>
    <output data-testid="probe-revision">{history.present.revision}</output>
    <output data-testid="probe-structure">{JSON.stringify({
      rootIds: history.present.rootIds,
      nodes: Object.fromEntries(Object.entries(history.present.nodes).map(([id, node]) => [id, { kind: node.kind, parentId: node.parentId, bounds: node.bounds, componentId: node.kind === 'instance' ? node.componentId : undefined, source: node.kind === 'code-component' ? node.source : undefined }])),
    })}</output>
    <button type="button" data-testid="probe-undo" onClick={() => setHistory(undo)}>undo</button>
  </>
}

function structure(view: ReturnType<typeof render>) {
  return JSON.parse(view.getByTestId('probe-structure').textContent ?? '{}')
}

function fixtureWithoutComponents(): CanvasDocument {
  const createdAt = '2026-07-12T00:00:00.000Z'
  return {
    schemaVersion: 1,
    id: 'insert-fixture-no-components',
    name: 'Insert fixture without components',
    revision: 0,
    rootIds: ['frame-a'],
    nodes: {
      'frame-a': { ...baseNode('frame-a', null, []), kind: 'frame', clipContent: false } as CanvasNode,
    },
    selection: [],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
  }
}

describe('InsertPalette', () => {
  it('shows a helpful message in the Project category when the document has no project components', () => {
    const view = render(<InsertPalette document={fixtureWithoutComponents()} onOperation={() => {}} />)
    expect(view.getByText('Primitives')).toBeTruthy()
    expect(view.getByText('Components')).toBeTruthy()
    expect(view.getByText('Layout')).toBeTruthy()
    expect(view.getByText('Project')).toBeTruthy()
    expect(view.getByTestId('insert-project-empty').textContent).toBe('No project components in this project yet. Insert primitives instead.')
    expect(view.getByTestId('insert-registry-button').textContent).toBe('Button')
    expect(view.getByTestId('insert-registry-stack').textContent).toBe('Stack')
  })

  it('lists primitives, registry sections, and project components by category', () => {
    const view = render(<Harness />)
    expect(view.getByTestId('insert-primitive-frame').textContent).toBe('Frame')
    expect(view.getByTestId('insert-primitive-text').textContent).toBe('Text')
    expect(view.getByTestId('insert-primitive-group').textContent).toBe('Group')
    expect(view.getByTestId('insert-registry-button').textContent).toBe('Button')
    expect(view.getByTestId('insert-registry-stack').textContent).toBe('Stack')
    expect(view.getByTestId('insert-component-comp-x').textContent).toBe('Hero Button')
    expect(view.getByText('Primitives')).toBeTruthy()
    expect(view.getByText('Components')).toBeTruthy()
    expect(view.getByText('Layout')).toBeTruthy()
    expect(view.getByText('Project')).toBeTruthy()
  })

  it('filters by search and shows an empty state without insert actions', () => {
    const view = render(<Harness />)
    fireEvent.change(view.getByTestId('insert-search'), { target: { value: 'hero' } })
    expect(view.queryByTestId('insert-primitive-frame')).toBeNull()
    expect(view.queryByTestId('insert-registry-button')).toBeNull()
    expect(view.getByTestId('insert-component-comp-x')).toBeTruthy()

    fireEvent.change(view.getByTestId('insert-search'), { target: { value: 'zzz' } })
    expect(view.getByTestId('insert-empty').textContent).toContain('zzz')
    expect(view.queryAllByRole('button').filter((button) => button.className.includes('insert-entry'))).toHaveLength(0)
  })

  it('filters registry entries by search case-insensitively', () => {
    const view = render(<Harness />)
    fireEvent.change(view.getByTestId('insert-search'), { target: { value: 'BUTTON' } })
    expect(view.getByTestId('insert-registry-button').textContent).toBe('Button')
    expect(view.queryByTestId('insert-registry-stack')).toBeNull()
    expect(view.queryByTestId('insert-primitive-frame')).toBeNull()
    expect(view.getByTestId('insert-component-comp-x')).toBeTruthy()
  })

  it('inserts a frame at the canvas root with deterministic placement and single-undo', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByTestId('insert-primitive-frame'))
    let state = structure(view)
    expect(state.rootIds.at(-1)).toBe('created-0001')
    expect(state.nodes['created-0001']).toMatchObject({ kind: 'frame', parentId: null, bounds: { x: 40, y: 40, width: 240, height: 160 } })
    expect(view.getByTestId('probe-selection').textContent).toBe('created-0001')
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByTestId('insert-feedback').textContent).toBe('Frame inserted into canvas root')

    fireEvent.click(view.getByTestId('probe-undo'))
    state = structure(view)
    expect(state.nodes['created-0001']).toBeUndefined()
    expect(view.getByTestId('probe-selection').textContent).toBe('')
  })

  it('inserts into the selected container with parent-relative bounds', () => {
    const view = render(<Harness selection={['frame-a']} />)
    fireEvent.click(view.getByTestId('insert-primitive-text'))
    const state = structure(view)
    const inserted = state.nodes['created-0001']
    expect(inserted).toMatchObject({ kind: 'text', parentId: 'frame-a', bounds: { x: 124, y: 104, width: 120, height: 32 } })
    expect(view.getByTestId('insert-feedback').textContent).toBe('Text inserted into frame-a')
  })

  it('inserts component instances bound to the source component', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByTestId('insert-component-comp-x'))
    const state = structure(view)
    expect(state.nodes['created-0001']).toMatchObject({ kind: 'instance', parentId: null, componentId: 'comp-x' })
    expect(view.getByTestId('probe-selection').textContent).toBe('created-0001')
  })

  it('inserts a registry component with deterministic bounds, selection, and single-undo', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByTestId('insert-registry-button'))
    let state = structure(view)
    const inserted = state.nodes['created-0001']
    expect(inserted).toMatchObject({
      kind: 'code-component',
      parentId: null,
      bounds: { x: 40, y: 40, width: 120, height: 40 },
      source: { file: 'registry://shadcn/button', exportName: 'Button', startLine: 1, endLine: 1 },
    })
    expect(view.getByTestId('probe-selection').textContent).toBe('created-0001')
    expect(view.getByTestId('probe-revision').textContent).toBe('1')
    expect(view.getByTestId('insert-feedback').textContent).toBe('Button inserted into canvas root')

    fireEvent.click(view.getByTestId('probe-undo'))
    state = structure(view)
    expect(state.nodes['created-0001']).toBeUndefined()
    expect(view.getByTestId('probe-selection').textContent).toBe('')
    expect(view.getByTestId('probe-revision').textContent).toBe('0')
  })

  it('still inserts project components as instances alongside registry sections', () => {
    const view = render(<Harness />)
    fireEvent.click(view.getByTestId('insert-component-comp-x'))
    const state = structure(view)
    expect(state.nodes['created-0001']).toMatchObject({ kind: 'instance', parentId: null, componentId: 'comp-x' })
    expect(view.getByTestId('probe-selection').textContent).toBe('created-0001')
  })

  it('falls back to the canvas root for locked or non-container selections', () => {
    const lockedView = render(<Harness selection={['frame-locked']} />)
    fireEvent.click(lockedView.getByTestId('insert-primitive-frame'))
    expect(structure(lockedView).nodes['created-0001'].parentId).toBeNull()
    cleanup()

    const textView = render(<Harness selection={['text-c']} />)
    fireEvent.click(textView.getByTestId('insert-primitive-frame'))
    expect(structure(textView).nodes['created-0001'].parentId).toBeNull()
  })
})
