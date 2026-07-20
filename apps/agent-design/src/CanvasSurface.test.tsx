import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { applyOperation, createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { afterEach, describe, expect, it } from 'vitest'
import { CanvasSurface } from './CanvasSurface'
import { editorTokenMaps, FALLBACK_BACKGROUND_TOKEN } from './editorTokens'

afterEach(cleanup)

describe('semantic DOM content plane', () => {
  it.each([1000, 5000] as const)('maps all %i canonical nodes to stable DOM ids', (size) => {
    const document = createDocumentFixture(size)
    const view = render(<CanvasSurface document={document} />)
    const nodes = view.container.querySelectorAll('[data-canvas-id]')
    expect(nodes).toHaveLength(size)
    expect(view.container.querySelectorAll('[data-source-ref]')).toHaveLength(Object.values(document.nodes).filter((node) => node.source).length)
    expect(view.container.querySelector('[data-selected-id]')?.getAttribute('data-selected-id')).toBe(document.selection[0])
  })

  it('preserves Korean composition in the text surface', () => {
    const document = createDocumentFixture(1000)
    const view = render(<CanvasSurface document={document} />)
    const text = view.container.querySelector('[data-node-kind="text"]')
    if (!(text instanceof HTMLElement)) throw new Error('text node missing')
    fireEvent.compositionStart(text, { data: '' })
    text.textContent = '한글 입력 완료'
    fireEvent.input(text, { data: '한글 입력 완료', inputType: 'insertCompositionText', isComposing: true })
    fireEvent.compositionEnd(text, { data: '한글 입력 완료' })
    expect(text.textContent).toBe('한글 입력 완료')
  })

  it('provides one roving tab stop that follows canonical primary selection', () => {
    const document = createDocumentFixture(1000)
    const view = render(<CanvasSurface document={document} />)
    expect(view.container.querySelectorAll('[data-canvas-id][tabindex]')).toHaveLength(1000)
    expect(view.container.querySelectorAll('[data-canvas-id][tabindex="0"]')).toHaveLength(1)
    expect(view.container.querySelector('[data-canvas-id][tabindex="0"]')?.getAttribute('data-canvas-id')).toBe(document.selection.at(-1))
    expect(view.getByTestId('canvas-viewport').getAttribute('role')).toBe('application')
  })

  it.each([
    ['forced-fallback', 'forced fallback'],
    ['validation-error', 'injected validation error'],
    ['device-lost', 'injected device loss'],
  ] as const)('falls back to DOM for %s', async (failure, reason) => {
    const view = render(<CanvasSurface document={createDocumentFixture(1000)} editorPlaneFailure={failure} />)
    await waitFor(() => expect(view.getByTestId('editor-plane').getAttribute('data-editor-plane')).toBe('dom'))
    expect(view.getByTestId('editor-plane').getAttribute('data-editor-reason')).toContain(reason)
    expect(view.getByTestId('editor-selection')).toBeTruthy()
  })
})

describe('token-driven node background', () => {
  it('renders a bound node with its resolved SSOT color and updates it when set-token-mode switches to dark', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const tokenName = component.tokenBindings.background
    if (!tokenName) throw new Error('fixture component has no background binding')

    const view = render(<CanvasSurface document={document} />)
    const el = view.container.querySelector(`[data-canvas-id="${component.id}"]`)
    if (!(el instanceof HTMLElement)) throw new Error('bound node missing')
    expect(el.style.background).toBe(editorTokenMaps['askewly.default'][tokenName])

    const darkened = applyOperation(document, { id: 'mode', at: new Date().toISOString(), type: 'set-token-mode', tokenSetId: 'askewly.dark' })
    view.rerender(<CanvasSurface document={darkened} />)
    const elAfter = view.container.querySelector(`[data-canvas-id="${component.id}"]`)
    if (!(elAfter instanceof HTMLElement)) throw new Error('bound node missing after mode switch')
    expect(elAfter.style.background).toBe(editorTokenMaps['askewly.dark'][tokenName])
    expect(elAfter.style.background).not.toBe(editorTokenMaps['askewly.default'][tokenName])
  })

  it('falls back to the neutral surface token for a node with no background binding', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const unbound = structuredClone(document)
    delete unbound.nodes[component.id].tokenBindings.background

    const view = render(<CanvasSurface document={unbound} />)
    const el = view.container.querySelector(`[data-canvas-id="${component.id}"]`)
    if (!(el instanceof HTMLElement)) throw new Error('unbound node missing')
    expect(el.style.background).toBe(editorTokenMaps['askewly.default'][FALLBACK_BACKGROUND_TOKEN])
  })
})

describe('조작 종류가 구분되는 선택 (EU1)', () => {
  const withSelection = (ids: string[]) => {
    const document = createDocumentFixture(1000)
    return { ...document, selection: ids.length ? ids : document.selection }
  }

  it('모서리 4 · 변 4로 갈리고 클래스가 역할을 말한다', () => {
    const view = render(<CanvasSurface document={createDocumentFixture(1000)} />)
    const handles = [...view.container.querySelectorAll('.resize-handle')]
    expect(handles).toHaveLength(8)
    expect(handles.filter((h) => h.classList.contains('resize-handle-corner'))).toHaveLength(4)
    expect(handles.filter((h) => h.classList.contains('resize-handle-edge'))).toHaveLength(4)

    // 모서리는 양축, 변은 단축 — 어느 핸들이 어느 역할인지 고정한다.
    expect(view.getByTestId('resize-nw').className).toContain('resize-handle-corner')
    expect(view.getByTestId('resize-n').className).toContain('resize-handle-edge')
    expect(view.getByTestId('resize-nw').className).not.toContain('resize-handle-edge')
  })

  it('다중선택은 개수 글자로도 알린다 — 색만으로 신호하지 않는다', () => {
    const single = render(<CanvasSurface document={createDocumentFixture(1000)} />)
    expect(single.queryByTestId('selection-count-badge')).toBeNull()
    cleanup()

    const document = createDocumentFixture(1000)
    const two = Object.keys(document.nodes).slice(1, 3)
    const multi = render(<CanvasSurface document={{ ...document, selection: two }} />)
    expect(multi.getByTestId('selection-count-badge').textContent).toContain('2개 선택')
    const marked = multi.container.querySelectorAll('[data-selection-scope="multi"][data-selection-state="selected"]')
    expect(marked).toHaveLength(2)
  })

  it('단일선택 노드는 multi 표시를 갖지 않는다', () => {
    const view = render(<CanvasSurface document={createDocumentFixture(1000)} />)
    const selected = view.container.querySelector('[data-selection-state="selected"]')
    expect(selected?.getAttribute('data-selection-scope')).toBe('single')
  })
})
