import { cleanup, fireEvent, render } from '@testing-library/react'
import { createDocumentFixture, type CanvasDocument, type CanvasOperation } from '@askewly/canvas-core'
import { afterEach, describe, expect, it } from 'vitest'
import { INSPECTOR_SECTIONS, PropertyInspector } from './PropertyInspector'

afterEach(cleanup)

/** 선택 하나짜리 문서와, 그 노드의 알려진 기하값. */
function setup(overrides?: Partial<CanvasDocument>) {
  const operations: CanvasOperation[] = []
  const base = createDocumentFixture(1000)
  const id = base.selection[0]
  const document = { ...base, ...overrides }
  const view = render(<PropertyInspector
    document={document}
    onOperation={(operation) => operations.push(operation)}
    bridgeConnected={false}
    onMaterialize={() => {}}
  />)
  return { view, operations, id, node: document.nodes[id] }
}

describe('기하값이 보이고 고쳐진다 (EU4 step-1)', () => {
  it('선택한 노드의 위치·크기·각도를 문서 값 그대로 보인다', () => {
    const { view, node } = setup()
    // 인스펙터에 기하값이 아예 없던 것이 EU4 실사의 출발점이다.
    expect((view.getByTestId('geometry-x') as HTMLInputElement).value).toBe(String(node.bounds.x))
    expect((view.getByTestId('geometry-y') as HTMLInputElement).value).toBe(String(node.bounds.y))
    expect((view.getByTestId('geometry-width') as HTMLInputElement).value).toBe(String(node.bounds.width))
    expect((view.getByTestId('geometry-height') as HTMLInputElement).value).toBe(String(node.bounds.height))
    expect((view.getByTestId('geometry-rotation') as HTMLInputElement).value).toBe(String(node.rotation))
  })

  it('X를 고치면 그 축만 바뀐 transform-nodes 가 커밋된다', () => {
    const { view, operations, id, node } = setup()
    const input = view.getByTestId('geometry-x')
    fireEvent.change(input, { target: { value: '512' } })
    fireEvent.blur(input)

    const transform = operations.find((op) => op.type === 'transform-nodes') as { boundsById: Record<string, { x: number; y: number; width: number }> }
    expect(transform, '기하를 고쳤는데 문서 연산이 없다 — 입력만 바뀐 상태다').toBeDefined()
    expect(transform.boundsById[id].x).toBe(512)
    // 다른 축은 건드리지 않는다.
    expect(transform.boundsById[id].y).toBe(node.bounds.y)
    expect(transform.boundsById[id].width).toBe(node.bounds.width)
  })

  it('각도는 rotate-nodes 로 간다 — 캔버스 회전과 같은 연산이다', () => {
    const { view, operations, id } = setup()
    const input = view.getByTestId('geometry-rotation')
    fireEvent.change(input, { target: { value: '45' } })
    fireEvent.blur(input)

    const rotate = operations.find((op) => op.type === 'rotate-nodes') as { rotationById: Record<string, number> }
    expect(rotate, '각도가 transform 으로 갔거나 아예 커밋되지 않았다').toBeDefined()
    expect(rotate.rotationById[id]).toBe(45)
    expect(operations.some((op) => op.type === 'transform-nodes')).toBe(false)
  })

  it('크기 0 이하는 거부하고 이유를 말한다', () => {
    const { view, operations } = setup()
    const input = view.getByTestId('geometry-width')
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.blur(input)

    expect(operations.filter((op) => op.type === 'transform-nodes')).toHaveLength(0)
    expect(view.getByTestId('property-error').textContent).toContain('0보다')
  })

  it('숫자가 아니면 커밋하지 않는다', () => {
    const { view, operations } = setup()
    const input = view.getByTestId('geometry-x')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    expect(operations.filter((op) => op.type === 'transform-nodes')).toHaveLength(0)
  })

  it('값이 그대로면 연산을 만들지 않는다', () => {
    const { view, operations, node } = setup()
    const input = view.getByTestId('geometry-x')
    fireEvent.change(input, { target: { value: String(node.bounds.x) } })
    fireEvent.blur(input)
    expect(operations).toHaveLength(0)
  })

  it('문서가 바뀌면 표시가 따라온다 — 캔버스에서 끌었을 때', () => {
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const view = render(<PropertyInspector document={base} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)

    const moved = { ...base, nodes: { ...base.nodes, [id]: { ...base.nodes[id], bounds: { ...base.nodes[id].bounds, x: 777 } } } }
    view.rerender(<PropertyInspector document={moved} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    expect((view.getByTestId('geometry-x') as HTMLInputElement).value).toBe('777')
  })
})

describe('섹션이 규약 순서를 따른다 (EU4 step-2)', () => {
  it('기하 → 구조 → 시각 → 내보내기 순서로 나온다', () => {
    const { view } = setup()
    const order = [...view.container.querySelectorAll('[data-inspector-section]')]
      .map((el) => el.getAttribute('data-inspector-section'))
    // 우리가 정한 순서가 아니라 리서치가 Figma·Penpot 공통으로 확인한 순서다.
    expect(order).toEqual([...INSPECTOR_SECTIONS])
  })

  it('토큰 바인딩은 시각 섹션에, 레이아웃은 구조 섹션에 있다', () => {
    const { view } = setup()
    const visual = view.container.querySelector('[data-inspector-section="visual"]')!
    const structure = view.container.querySelector('[data-inspector-section="structure"]')!
    expect(visual.textContent).toContain('Token · background')
    expect(structure.textContent).toContain('Layout')
    // 섞이면 안 된다.
    expect(structure.textContent).not.toContain('Token · background')
  })

  it('빈 섹션은 가짜 컨트롤 대신 상태를 말한다', () => {
    const { view } = setup()
    expect(view.getByTestId('export-status').textContent).toContain('아직 없다')
  })
})

describe('선택 종류에 따라 달라진다 (EU4 step-3)', () => {
  it('선택 없음과 다중선택이 서로 다른 말을 한다', () => {
    const base = createDocumentFixture(1000)
    const none = render(<PropertyInspector document={{ ...base, selection: [] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    expect(none.getByTestId('inspector-none')).toBeTruthy()
    expect(none.queryByTestId('inspector-multi')).toBeNull()
    cleanup()

    // 전에는 둘 다 "Select one node" 였다 — 3개를 골라도 아무것도 안 고른 것처럼 읽혔다.
    const many = render(<PropertyInspector document={{ ...base, selection: Object.keys(base.nodes).slice(0, 3) }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    expect(many.getByTestId('inspector-multi').textContent).toContain('3개')
    expect(many.queryByTestId('inspector-none')).toBeNull()
  })

  it('code-component 에만 Prop·Variant 가 나온다', () => {
    const base = createDocumentFixture(1000)
    const componentId = Object.keys(base.nodes).find((id) => base.nodes[id].kind === 'code-component')!
    const frameId = Object.keys(base.nodes).find((id) => base.nodes[id].kind === 'frame')!

    const component = render(<PropertyInspector document={{ ...base, selection: [componentId] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    const structure = component.container.querySelector('[data-inspector-section="structure"]')!
    expect(structure.textContent).toContain('Prop · ')
    expect(structure.textContent).toContain('Variant · ')
    cleanup()

    const frame = render(<PropertyInspector document={{ ...base, selection: [frameId] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    const frameStructure = frame.container.querySelector('[data-inspector-section="structure"]')!
    expect(frameStructure.textContent).not.toContain('Prop · ')
    expect(frameStructure.textContent).not.toContain('Variant · ')
  })

  it('instance 에만 Override 가 나온다', () => {
    const base = createDocumentFixture(1000)
    const instanceId = Object.keys(base.nodes).find((id) => base.nodes[id].kind === 'instance')!
    const frameId = Object.keys(base.nodes).find((id) => base.nodes[id].kind === 'frame')!

    const instance = render(<PropertyInspector document={{ ...base, selection: [instanceId] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    expect(instance.container.querySelector('[data-inspector-section="structure"]')!.textContent).toContain('Override · ')
    cleanup()

    const frame = render(<PropertyInspector document={{ ...base, selection: [frameId] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
    expect(frame.container.querySelector('[data-inspector-section="structure"]')!.textContent).not.toContain('Override · ')
  })

  it('기하 섹션은 종류와 무관하게 늘 있다 — 무엇을 고르든 어디에 얼마나 큰지는 읽혀야 한다', () => {
    const base = createDocumentFixture(1000)
    for (const kind of ['frame', 'text', 'instance', 'code-component'] as const) {
      const id = Object.keys(base.nodes).find((key) => base.nodes[key].kind === kind)!
      const view = render(<PropertyInspector document={{ ...base, selection: [id] }} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}} />)
      expect(view.getByTestId('geometry-x'), `${kind} 에 기하가 없다`).toBeTruthy()
      cleanup()
    }
  })
})
