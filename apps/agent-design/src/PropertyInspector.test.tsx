import { cleanup, fireEvent, render } from '@testing-library/react'
import { createDocumentFixture, type CanvasDocument, type CanvasOperation } from '@askewly/canvas-core'
import { afterEach, describe, expect, it } from 'vitest'
import { INSPECTOR_SECTIONS, PropertyInspector } from './PropertyInspector'
import { documentTokens } from './documentTokens'

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

/** 문서까지 함께 돌려주는 setup — 견본 색 대조에 문서의 tokenSetId가 필요하다. */
function setupWithDocument() {
  const base = createDocumentFixture(1000)
  const document = structuredClone(base)
  const view = render(<PropertyInspector
    document={document} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}}
  />)
  const id = document.selection[0]
  return { view, document, binding: document.nodes[id].tokenBindings.background }
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
    // ECT2 step-1에서 라벨이 `Token · background`(내부 용어)에서 사용자 언어로 바뀌었다.
    // 섹션 소속을 보는 테스트이므로 새 라벨로 대조한다.
    expect(visual.textContent).toContain('배경 색')
    expect(structure.textContent).toContain('Layout')
    // 섞이면 안 된다.
    expect(structure.textContent).not.toContain('배경 색')
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

/**
 * ECT2 step-1 — 색이 색으로 보인다.
 *
 * EU5 관측 계측: 화면 전체에 "색"이라는 단어 **0건**, 색 견본 **0개**.
 * 여기서 재는 건 그 계측의 정확한 역이다.
 */
describe('색이 견본으로 보인다 (ECT2 step-1)', () => {
  it('화면에 "색"이라는 말이 있다 — EU5 계측 0건의 역', () => {
    const { view } = setup()
    const visual = view.container.querySelector('[data-inspector-section="visual"]')!
    expect(visual.textContent).toContain('색')
  })

  it('견본이 캔버스와 **같은 함수**로 해석한 색을 칠한다', () => {
    const { view, document, binding } = setupWithDocument()
    const swatch = view.getByTestId('color-swatch-background')
    // 대조 상대는 컴포넌트가 아니라 렌더러가 쓰는 해석 함수다.
    const expected = documentTokens(document.tokenSetId).resolve(binding)
    expect(expected).toBeTruthy()
    expect(swatch.getAttribute('data-resolved')).toBe(expected)
  })

  it('라벨이 사용자 언어다 — `Token · background`가 아니다', () => {
    const { view } = setup()
    const visual = view.container.querySelector('[data-inspector-section="visual"]')!
    expect(visual.textContent).toContain('배경 색')
    expect(visual.textContent).not.toContain('Token · background')
  })

  it('색 옆에 토큰 이름이 글자로 함께 있다 — 색만으로 말하지 않는다', () => {
    const { view, binding } = setupWithDocument()
    const field = view.getByTestId('color-field-background')
    expect(field.textContent).toContain(binding)
    expect(view.getByTestId('color-swatch-background').getAttribute('aria-label')).toContain('배경 색')
  })

  it('해석 실패는 회색 폴백이 아니라 미해결이라고 적는다', () => {
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const document = structuredClone(base)
    document.nodes[id].tokenBindings.background = 'surface.longgone'
    const view = render(<PropertyInspector
      document={document} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}}
    />)
    const swatch = view.getByTestId('color-swatch-background')
    expect(swatch.getAttribute('data-resolved')).toBeNull()
    expect(swatch.className).toContain('unresolved')
    expect(view.getByTestId('color-field-background').textContent).toContain('해석되지 않는다')
  })

  it('색이 아닌 토큰은 색 컨트롤이 되지 않는다', () => {
    // 글꼴 토큰을 색 견본으로 보여주면 거짓말이 된다.
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const document = structuredClone(base)
    document.tokenSetId = 'askewly.warm'
    document.nodes[id].tokenBindings = { fill: 'surface.canvas', fontFamily: 'type.heading' }
    const view = render(<PropertyInspector
      document={document} onOperation={() => {}} bridgeConnected={false} onMaterialize={() => {}}
    />)
    expect(view.queryByTestId('color-field-fill')).not.toBeNull()
    expect(view.queryByTestId('color-field-fontFamily')).toBeNull()
    expect(view.queryByTestId('property-token-fontFamily')).not.toBeNull()
  })
})

/**
 * ECT2 step-2 — 목록에서 고른다.
 *
 * "유효 토큰 목록이 없다"는 데이터가 없어서가 아니라 UI가 안 물어봐서 생긴 결함이었다.
 * 이제 물어본다. 다만 **자기 어휘만** 물어야 한다 — 섞으면 템플릿이 편집기 색으로 칠해진다.
 */
describe('목록에서 고른다 (ECT2 step-2)', () => {
  /** 지정한 어휘의 문서로 인스펙터를 띄우고 색 선택 목록을 연다. */
  function openPicker(tokenSetId: string, bindings: Record<string, string>, key = 'background') {
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const document = structuredClone(base)
    document.tokenSetId = tokenSetId
    document.nodes[id].tokenBindings = bindings
    const operations: CanvasOperation[] = []
    const view = render(<PropertyInspector
      document={document} onOperation={(op) => operations.push(op)} bridgeConnected={false} onMaterialize={() => {}}
    />)
    fireEvent.click(view.getByTestId(`color-swatch-${key}`))
    return { view, operations, document, id }
  }

  it('편집기 문서에는 편집기 색만 — 템플릿 토큰 0건', () => {
    const { view } = openPicker('askewly.default', { background: 'surface.raised' })
    const picker = view.getByTestId('color-picker-background')
    expect(picker.textContent).toContain('surface.base')
    expect(picker.textContent).toContain('action.primary')
    // 상대 어휘 고유 이름은 하나도 없다.
    expect(picker.textContent).not.toContain('surface.canvas')
    expect(picker.textContent).not.toContain('brand.primary')
  })

  it('템플릿 문서에는 템플릿 색만 — 편집기 토큰 0건 (반대 방향)', () => {
    const { view } = openPicker('askewly.warm', { fill: 'surface.canvas' }, 'fill')
    const picker = view.getByTestId('color-picker-fill')
    expect(picker.textContent).toContain('surface.canvas')
    expect(picker.textContent).toContain('brand.primary')
    expect(picker.textContent).not.toContain('surface.base')
    expect(picker.textContent).not.toContain('action.primary')
  })

  it('색만 나온다 — 글꼴 토큰은 목록에 없다', () => {
    const { view } = openPicker('askewly.warm', { fill: 'surface.canvas' }, 'fill')
    const picker = view.getByTestId('color-picker-fill')
    expect(picker.textContent).not.toContain('type.heading')
    expect(picker.textContent).not.toContain('type.display')
  })

  it('모든 항목이 자기 색을 견본으로 보여준다', () => {
    const { view } = openPicker('askewly.warm', { fill: 'surface.canvas' }, 'fill')
    const option = view.getByTestId('color-option-brand.primary')
    const swatch = option.querySelector('.color-swatch') as HTMLElement
    expect(swatch.style.background).toBeTruthy()
    expect(option.textContent).toContain('brand.primary')
  })

  it('검색하면 목록이 줄고 그룹은 보존된다', () => {
    const { view } = openPicker('askewly.default', { background: 'surface.raised' })
    const picker = view.getByTestId('color-picker-background')
    const before = picker.querySelectorAll('.color-picker-option').length
    fireEvent.change(view.getByTestId('color-picker-search-background'), { target: { value: 'border' } })
    const after = picker.querySelectorAll('.color-picker-option').length
    expect(after).toBeGreaterThan(0)
    expect(after).toBeLessThan(before)
    expect([...picker.querySelectorAll('.color-picker-option')].every((o) => o.textContent!.includes('border'))).toBe(true)
    expect(picker.querySelector('.color-picker-group-name')!.textContent).toBe('border')
  })

  it('없는 색을 찾으면 빈 목록이 아니라 그렇다고 말한다', () => {
    const { view } = openPicker('askewly.default', { background: 'surface.raised' })
    fireEvent.change(view.getByTestId('color-picker-search-background'), { target: { value: 'zzzz' } })
    expect(view.getByTestId('color-picker-background').textContent).toContain('찾는 색이 없다')
  })

  it('고르면 연산이 커밋되고 목록이 닫힌다', () => {
    const { view, operations, id } = openPicker('askewly.default', { background: 'surface.raised' })
    fireEvent.click(view.getByTestId('color-option-action.primary'))
    expect(operations).toHaveLength(1)
    expect(operations[0]).toMatchObject({
      type: 'set-node-property', nodeId: id, scope: 'token', key: 'background', value: 'action.primary',
    })
    expect(view.queryByTestId('color-picker-background')).toBeNull()
  })

  it('지금 색이 목록에서 글자로 표시된다 — 색만으로 말하지 않는다', () => {
    const { view } = openPicker('askewly.default', { background: 'surface.raised' })
    const current = view.getByTestId('color-option-surface.raised')
    expect(current.getAttribute('aria-current')).toBe('true')
  })

  it('같은 색을 다시 고르면 연산을 만들지 않는다', () => {
    const { view, operations } = openPicker('askewly.default', { background: 'surface.raised' })
    fireEvent.click(view.getByTestId('color-option-surface.raised'))
    expect(operations).toHaveLength(0)
  })
})

/**
 * ECT2 step-3 — 키보드로도 완주된다.
 *
 * 리서치가 본 5개 시스템 전부 포인터 외 경로를 갖는다. anti-patterns 3(접근 가능한
 * 인터랙션 경로)이 요구하는 것도 같다 — 열기·이동·선택·닫기 + 포커스 복귀.
 */
describe('키보드로 색을 고른다 (ECT2 step-3)', () => {
  function openPicker() {
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const document = structuredClone(base)
    const operations: CanvasOperation[] = []
    const view = render(<PropertyInspector
      document={document} onOperation={(op) => operations.push(op)} bridgeConnected={false} onMaterialize={() => {}}
    />)
    const swatch = view.getByTestId('color-swatch-background')
    fireEvent.click(swatch)
    return { view, operations, swatch, picker: view.getByTestId('color-picker-background') }
  }

  it('열면 검색창으로 포커스가 간다 — 바로 타이핑할 수 있다', () => {
    const { view } = openPicker()
    expect(window.document.activeElement).toBe(view.getByTestId('color-picker-search-background'))
  })

  it('화살표로 커서가 움직인다', () => {
    const { view, picker } = openPicker()
    const search = view.getByTestId('color-picker-search-background')
    const names = () => [...picker.querySelectorAll('.color-picker-option')].map((o) => o.getAttribute('data-testid'))
    const activeName = () => picker.querySelector('[data-active]')?.getAttribute('data-testid')

    expect(activeName()).toBe(names()[0])
    fireEvent.keyDown(search, { key: 'ArrowDown' })
    expect(activeName()).toBe(names()[1])
    fireEvent.keyDown(search, { key: 'ArrowUp' })
    expect(activeName()).toBe(names()[0])
  })

  it('끝에서 화살표를 더 누르면 반대편으로 돈다 — 막다른 길이 없다', () => {
    const { view, picker } = openPicker()
    const search = view.getByTestId('color-picker-search-background')
    const names = [...picker.querySelectorAll('.color-picker-option')].map((o) => o.getAttribute('data-testid'))
    fireEvent.keyDown(search, { key: 'ArrowUp' })
    expect(picker.querySelector('[data-active]')?.getAttribute('data-testid')).toBe(names[names.length - 1])
  })

  it('Enter로 고르면 활성 항목이 커밋되고 목록이 닫힌다', () => {
    const { view, operations, picker } = openPicker()
    const search = view.getByTestId('color-picker-search-background')
    // 현재 색이 아닌 항목까지 내려간다 — 같은 색 재선택은 연산을 만들지 않는 게 정상이다.
    let activeName = ''
    for (let i = 0; i < 6; i += 1) {
      activeName = picker.querySelector('[data-active]')!.getAttribute('data-testid')!.replace('color-option-', '')
      if (activeName !== 'surface.raised') break
      fireEvent.keyDown(search, { key: 'ArrowDown' })
    }
    expect(activeName).not.toBe('surface.raised')
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(operations).toHaveLength(1)
    expect(operations[0]).toMatchObject({ scope: 'token', key: 'background', value: activeName })
    expect(view.queryByTestId('color-picker-background')).toBeNull()
  })

  it('Esc로 닫히고 포커스가 견본으로 돌아온다 — 키보드 사용자가 튕기지 않는다', () => {
    const { view, swatch } = openPicker()
    fireEvent.keyDown(view.getByTestId('color-picker-search-background'), { key: 'Escape' })
    expect(view.queryByTestId('color-picker-background')).toBeNull()
    expect(window.document.activeElement).toBe(swatch)
  })

  it('검색으로 목록이 줄어도 커서가 목록 밖을 가리키지 않는다', () => {
    const { view, picker } = openPicker()
    const search = view.getByTestId('color-picker-search-background')
    // 커서를 뒤로 보낸 뒤 목록을 확 줄인다.
    for (let i = 0; i < 12; i += 1) fireEvent.keyDown(search, { key: 'ArrowDown' })
    fireEvent.change(search, { target: { value: 'border.focus' } })
    const options = [...picker.querySelectorAll('.color-picker-option')]
    expect(options).toHaveLength(1)
    // 활성 항목이 남아 있고 Enter가 그걸 고른다(빈 곳을 가리키지 않는다).
    expect(picker.querySelector('[data-active]')).not.toBeNull()
  })

  it('Tab으로 목록을 빠져나가면 목록이 닫힌다 — 유령 UI를 남기지 않는다', () => {
    // 독립 검증이 잡은 결함(refuted, 2026-07-21): Tab으로 목록 끝을 지나면 포커스는
    // 툴바로 가는데 목록은 화면에 그대로 떠 있었다. Esc·화살표·Enter만 테스트했던 탓이다.
    const { view, picker } = openPicker()
    const 바깥 = window.document.createElement('button')
    window.document.body.appendChild(바깥)
    fireEvent.blur(picker, { relatedTarget: 바깥 })
    expect(view.queryByTestId('color-picker-background')).toBeNull()
    바깥.remove()
  })

  it('목록 안에서 포커스가 옮겨가는 건 닫지 않는다', () => {
    // 검색창 → 항목 이동은 정상 사용이다. 이걸 닫으면 Tab 탐색이 불가능해진다.
    const { view, picker } = openPicker()
    const option = picker.querySelector('.color-picker-option')!
    fireEvent.blur(picker, { relatedTarget: option })
    expect(view.queryByTestId('color-picker-background')).not.toBeNull()
  })

  it('Tab으로 나갈 때는 포커스를 붙잡지 않는다 — 포커스 덫 금지', () => {
    const { view, picker } = openPicker()
    const 바깥 = window.document.createElement('button')
    window.document.body.appendChild(바깥)
    바깥.focus()
    fireEvent.blur(picker, { relatedTarget: 바깥 })
    expect(window.document.activeElement).toBe(바깥)
    바깥.remove()
  })

  it('키보드만으로 색 변경 1회 완주', () => {
    const { view, operations } = openPicker()
    const search = view.getByTestId('color-picker-search-background')
    fireEvent.change(search, { target: { value: 'action.primary' } })
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(operations[0]).toMatchObject({ scope: 'token', key: 'background', value: 'action.primary' })
  })
})

/**
 * ECT3 step-1 — 안 묶인 것을 묶는다.
 *
 * 리서치가 본 5개 시스템 전부 미바인딩 어포던스를 갖는다. 우리는 0이었고,
 * EU5에서 사용자가 막힌 지점이 정확히 "이 노드에 묶인 토큰이 없다"는 막다른 길이었다.
 */
describe('안 묶인 색을 묶는다 (ECT3 step-1)', () => {
  /** 주어진 종류·바인딩의 노드 하나만 선택된 문서로 인스펙터를 띄운다. */
  function withNode(kind: string, tokenBindings: Record<string, string>, extra: Record<string, unknown> = {}) {
    const base = createDocumentFixture(1000)
    const id = base.selection[0]
    const document = structuredClone(base)
    Object.assign(document.nodes[id], { kind, tokenBindings, ...extra })
    const operations: CanvasOperation[] = []
    const view = render(<PropertyInspector
      document={document} onOperation={(op) => operations.push(op)} bridgeConnected={false} onMaterialize={() => {}}
    />)
    return { view, operations, id }
  }

  it('바인딩이 없으면 막다른 안내문 대신 묶는 버튼이 있다', () => {
    const { view } = withNode('frame', {})
    expect(view.getByTestId('bind-color-background').textContent).toContain('묶기')
    // 예전 막다른 문구가 그 자리를 대신하지 않는다.
    expect(view.container.textContent).not.toContain('이 노드에 묶인 토큰이 없다')
  })

  it('묶기 버튼이 같은 색 목록을 연다 — 목록이 두 벌 생기지 않는다', () => {
    const { view } = withNode('frame', {})
    fireEvent.click(view.getByTestId('bind-color-background'))
    const picker = view.getByTestId('color-picker-background')
    // 어휘 필터가 살아 있다(따로 만든 목록이면 이게 빠진다).
    expect(picker.textContent).toContain('surface.base')
    expect(picker.textContent).not.toContain('surface.canvas')
    expect(picker.textContent).not.toContain('type.heading')
  })

  it('고르면 바인딩 연산이 커밋된다', () => {
    const { view, operations, id } = withNode('frame', {})
    fireEvent.click(view.getByTestId('bind-color-background'))
    fireEvent.click(view.getByTestId('color-option-action.primary'))
    expect(operations).toHaveLength(1)
    expect(operations[0]).toMatchObject({
      type: 'set-node-property', nodeId: id, scope: 'token', key: 'background', value: 'action.primary',
    })
  })

  it('이미 묶인 색은 묶기 버튼이 아니라 견본으로 나온다', () => {
    const { view } = withNode('frame', { background: 'surface.raised' })
    expect(view.queryByTestId('bind-color-background')).toBeNull()
    expect(view.queryByTestId('color-swatch-background')).not.toBeNull()
  })

  it('노드 종류마다 묶을 수 있는 키가 다르다 — 렌더러가 칠하는 것만', () => {
    // shape은 fill이 우선이고 background도 읽는다.
    const shape = withNode('shape', {}, { fill: '#000' })
    expect(shape.view.queryByTestId('bind-color-fill')).not.toBeNull()
    expect(shape.view.queryByTestId('bind-color-background')).not.toBeNull()
    cleanup()

    // text는 글자 색.
    const text = withNode('text', {}, { text: '가나다' })
    expect(text.view.queryByTestId('bind-color-color')).not.toBeNull()
    expect(text.view.queryByTestId('bind-color-fill')).toBeNull()
  })

  it('이미지 노드는 묶기를 제안하지 않는다 — 렌더러가 아직 안 읽는다', () => {
    // 검증자가 지적: fixture에 image 종류가 없어 확인이 안 됐던 경로.
    // 여기서 묶게 하면 "묶이긴 하는데 안 칠해지는" 상태가 된다(ECT4가 렌더러를 확장한 뒤 열린다).
    const { view } = withNode('image', {}, { assetId: 'a1', alt: '', fit: 'cover', opacity: 1 })
    expect(view.queryByTestId('bind-color-background')).toBeNull()
    expect(view.container.textContent).toContain('이 노드에는 색 속성이 없다')
  })

  it('묶기도 키보드로 된다', () => {
    const { view, operations } = withNode('frame', {})
    const trigger = view.getByTestId('bind-color-background')
    fireEvent.click(trigger)
    const search = view.getByTestId('color-picker-search-background')
    fireEvent.change(search, { target: { value: 'action.destructive' } })
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(operations[0]).toMatchObject({ scope: 'token', key: 'background', value: 'action.destructive' })
  })

  it('Esc로 닫으면 포커스가 묶기 버튼으로 돌아온다', () => {
    const { view } = withNode('frame', {})
    const trigger = view.getByTestId('bind-color-background')
    fireEvent.click(trigger)
    fireEvent.keyDown(view.getByTestId('color-picker-search-background'), { key: 'Escape' })
    expect(view.queryByTestId('color-picker-background')).toBeNull()
    expect(window.document.activeElement).toBe(trigger)
  })
})
