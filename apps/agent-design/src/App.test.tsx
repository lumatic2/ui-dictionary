import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App, connectionStatusLabel, desktopBridgeStateLabel } from './App'

beforeEach(() => {
  window.localStorage.clear()
  Object.defineProperty(window, 'PointerEvent', { value: MouseEvent, configurable: true })
})
afterEach(cleanup)

describe('AskewlyDesign persistence flow', () => {
  it('presents a product workspace before development diagnostics', () => {
    const view = render(<App />)
    expect(view.getByRole('banner', { name: 'Application title bar' })).toBeTruthy()
    expect(view.getByRole('navigation', { name: 'Workspace toolbar' })).toBeTruthy()
    expect(view.getByRole('complementary', { name: 'Workspace navigation' })).toBeTruthy()
    expect(view.getByRole('region', { name: 'Design canvas' })).toBeTruthy()
    expect(view.getByRole('contentinfo', { name: 'Workspace status' })).toBeTruthy()
    expect(view.getByText('Development').closest('details')?.hasAttribute('open')).toBe(false)
    expect(view.queryByText('Terminal Agent Live Canvas')).toBeNull()
  })

  it('keeps viewport and panels available from the persistent toolbar', () => {
    const view = render(<App />)
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('100%')
    fireEvent.click(view.getByRole('button', { name: 'Zoom in' }))
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('110%')
    fireEvent.click(view.getByRole('button', { name: 'Toggle workspace navigation' }))
    expect(view.queryByRole('complementary', { name: 'Workspace navigation' })).toBeNull()
    fireEvent.click(view.getByRole('button', { name: 'Toggle properties' }))
    expect(view.queryByText('Properties', { selector: 'h2' })).toBeNull()
    expect(view.getByRole('region', { name: 'Design canvas' })).toBeTruthy()
  })

  it('applies, saves, reloads, undoes, and redoes canonical operations', async () => {
    const view = render(<App />)
    fireEvent.click(view.getByTestId('apply-demo'))
    expect(view.getByTestId('document-revision').textContent).toBe('3')
    fireEvent.click(view.getByTestId('save-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('saved'))
    fireEvent.click(view.getByTestId('undo'))
    expect(view.getByTestId('document-revision').textContent).toBe('2')
    fireEvent.click(view.getByTestId('reload-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toBe('reloaded revision 3'))
    expect(view.getByTestId('document-revision').textContent).toBe('3')
    fireEvent.click(view.getByTestId('undo'))
    expect(view.getByTestId('document-revision').textContent).toBe('2')
    fireEvent.click(view.getByTestId('redo'))
    expect(view.getByTestId('document-revision').textContent).toBe('3')
  })

  it('commits click, Shift multi-select, arrow traversal, and Escape through history', () => {
    const view = render(<App />)
    const node7 = view.container.querySelector('[data-canvas-id="node-00007"]')
    const node14 = view.container.querySelector('[data-canvas-id="node-00014"]')
    if (!(node7 instanceof HTMLElement) || !(node14 instanceof HTMLElement)) throw new Error('fixture nodes missing')

    fireEvent.click(node7)
    expect(node7.getAttribute('aria-selected')).toBe('true')
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    fireEvent.click(node14, { shiftKey: true })
    expect(view.getByTestId('selection-count').textContent).toBe('2')

    fireEvent.keyDown(view.getByTestId('canvas-viewport'), { key: 'ArrowRight' })
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    fireEvent.keyDown(view.getByTestId('canvas-viewport'), { key: 'Escape' })
    expect(view.getByTestId('selection-count').textContent).toBe('0')
    expect(view.getByTestId('document-revision').textContent).toBe('4')
  })

  it('previews move and resize but commits exactly one operation per gesture', () => {
    const view = render(<App />)
    const viewport = view.getByTestId('canvas-viewport')
    const node1 = view.container.querySelector('[data-canvas-id="node-00001"]')
    if (!(node1 instanceof HTMLElement)) throw new Error('fixture node missing')
    fireEvent.click(node1)
    expect(view.getByTestId('document-revision').textContent).toBe('1')

    fireEvent.pointerDown(view.getByTestId('manipulation-selection'), { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(viewport, { pointerId: 1, clientX: 20, clientY: 10 })
    expect(node1.style.left).toBe('148px')
    expect(view.getByTestId('document-revision').textContent).toBe('1')
    fireEvent.pointerUp(viewport, { pointerId: 1, clientX: 20, clientY: 10 })
    expect(view.getByTestId('document-revision').textContent).toBe('2')

    fireEvent.pointerDown(view.getByTestId('resize-se'), { pointerId: 2, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(viewport, { pointerId: 2, clientX: 20, clientY: 10 })
    expect(node1.style.width).toBe('112px')
    fireEvent.pointerCancel(viewport, { pointerId: 2 })
    expect(node1.style.width).toBe('92px')
    expect(view.getByTestId('document-revision').textContent).toBe('2')

    fireEvent.click(view.getByTestId('undo'))
    expect(node1.style.left).toBe('128px')
    fireEvent.click(view.getByTestId('redo'))
    expect(node1.style.left).toBe('148px')
  })

  it('opens the insert palette from the toolbar and inserts as one undoable entry', () => {
    const view = render(<App />)
    fireEvent.click(view.getByTestId('toggle-insert'))
    fireEvent.click(view.getByTestId('insert-primitive-frame'))
    expect(view.getByTestId('document-revision').textContent).toBe('1')
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    expect(view.getByTestId('insert-feedback').textContent).toBe('Frame inserted into Node 0')
    fireEvent.click(view.getByTestId('undo'))
    expect(view.getByTestId('document-revision').textContent).toBe('0')
  })

  it('synchronizes selection between canvas and layers tree', () => {
    const view = render(<App />)
    const node7 = view.container.querySelector('[data-canvas-id="node-00007"]')
    if (!(node7 instanceof HTMLElement)) throw new Error('fixture node missing')
    fireEvent.click(node7)
    expect(view.getByTestId('layer-node-00007').getAttribute('aria-selected')).toBe('true')
    expect(view.getByTestId('layer-node-00000').getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(view.getByTestId('layer-node-00014'))
    const node14 = view.container.querySelector('[data-canvas-id="node-00014"]')
    expect(node14?.getAttribute('aria-selected')).toBe('true')
    expect(view.getByTestId('selection-count').textContent).toBe('1')
  })

  it('reorders by keyboard and reparents by valid native drop', () => {
    const view = render(<App />)
    const viewport = view.getByTestId('canvas-viewport')
    const node1 = view.container.querySelector('[data-canvas-id="node-00001"]')
    const target = view.container.querySelector('[data-canvas-id="node-00100"]')
    if (!(node1 instanceof HTMLElement) || !(target instanceof HTMLElement)) throw new Error('fixture nodes missing')
    fireEvent.click(node1)
    fireEvent.keyDown(viewport, { key: 'ArrowDown', altKey: true })
    expect(view.getByTestId('document-revision').textContent).toBe('2')

    const transfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      values: new Map<string, string>(),
      setData(type: string, value: string) { this.values.set(type, value) },
      getData(type: string) { return this.values.get(type) ?? '' },
    }
    fireEvent.dragStart(view.getByTestId('structure-drag-handle'), { dataTransfer: transfer })
    fireEvent.dragOver(target, { dataTransfer: transfer })
    expect(target.getAttribute('data-drop-target')).toBe('active')
    fireEvent.drop(target, { dataTransfer: transfer })
    expect(node1.getAttribute('data-parent-id')).toBe('node-00100')
    expect(view.getByTestId('document-revision').textContent).toBe('3')
  })

  it('validates and commits typed props, variants, layout, tokens, and token mode', () => {
    const view = render(<App />)
    const component = view.container.querySelector('[data-canvas-id="node-00001"]')
    if (!(component instanceof HTMLElement)) throw new Error('component missing')
    fireEvent.click(component)

    fireEvent.change(view.getByTestId('property-prop-disabled'), { target: { value: 'true' } })
    fireEvent.change(view.getByTestId('property-layout-horizontal'), { target: { value: 'fill' } })
    const appShell = view.container.querySelector('.app-shell')
    if (!(appShell instanceof HTMLElement)) throw new Error('app shell missing')
    expect(appShell.getAttribute('data-ad-mode')).toBe('default')
    fireEvent.change(view.getByTestId('token-mode'), { target: { value: 'askewly.dark' } })
    expect(view.getByTestId('document-revision').textContent).toBe('4')
    expect(appShell.getAttribute('data-ad-mode')).toBe('dark')
    fireEvent.change(view.getByTestId('token-mode'), { target: { value: 'askewly.default' } })
    expect(appShell.getAttribute('data-ad-mode')).toBe('default')

    const variant = view.getByTestId('property-variant-size')
    fireEvent.change(variant, { target: { value: '' } })
    fireEvent.blur(variant)
    expect(view.getByTestId('property-error').textContent).toContain('invalid variant')
    expect(view.getByTestId('document-revision').textContent).toBe('5')
    fireEvent.change(variant, { target: { value: 'lg' } })
    fireEvent.blur(variant)
    expect(view.getByTestId('document-revision').textContent).toBe('6')
  })

  it('runs delete, duplicate, and group shortcuts outside editable fields', () => {
    const view = render(<App />)
    const node3 = view.container.querySelector('[data-canvas-id="node-00003"]')
    const node4 = view.container.querySelector('[data-canvas-id="node-00004"]')
    if (!(node3 instanceof HTMLElement) || !(node4 instanceof HTMLElement)) throw new Error('fixture nodes missing')

    fireEvent.click(node3)
    fireEvent.keyDown(window, { key: 'd', ctrlKey: true })
    expect(view.getByText('1,001 nodes')).toBeTruthy()
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    fireEvent.keyDown(window, { key: 'Delete' })
    expect(view.getByText('1,000 nodes')).toBeTruthy()

    fireEvent.click(node3)
    fireEvent.click(node4, { shiftKey: true })
    fireEvent.keyDown(window, { key: 'g', ctrlKey: true })
    expect(view.getByText('1,001 nodes')).toBeTruthy()
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    fireEvent.keyDown(window, { key: 'G', ctrlKey: true, shiftKey: true })
    expect(view.getByText('1,000 nodes')).toBeTruthy()
    expect(view.getByTestId('selection-count').textContent).toBe('2')

    fireEvent.click(node3)
    fireEvent.keyDown(view.getByTestId('property-name'), { key: 'Delete' })
    expect(view.getByText('1,000 nodes')).toBeTruthy()
  })

  it('zooms around the cursor with ctrl+wheel inside zoom bounds', () => {
    const view = render(<App />)
    const viewport = view.getByTestId('canvas-viewport')
    fireEvent.wheel(viewport, { ctrlKey: true, deltaY: -100, clientX: 200, clientY: 150 })
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('110%')
    const transform = view.getByTestId('canvas-content').style.transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)/)
    if (!transform) throw new Error('canvas transform missing')
    expect(Number(transform[1])).toBeCloseTo(-20)
    expect(Number(transform[2])).toBeCloseTo(-15)
    expect(Number(transform[3])).toBeCloseTo(1.1)
    for (let index = 0; index < 40; index += 1) fireEvent.wheel(viewport, { ctrlKey: true, deltaY: -100, clientX: 200, clientY: 150 })
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('400%')
    for (let index = 0; index < 80; index += 1) fireEvent.wheel(viewport, { ctrlKey: true, deltaY: 100, clientX: 200, clientY: 150 })
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('25%')
  })

  it('pans with space drag as a preview and commits one viewport operation', () => {
    const view = render(<App />)
    const viewport = view.getByTestId('canvas-viewport')
    const revisionBefore = Number(view.getByTestId('document-revision').textContent)
    fireEvent.keyDown(viewport, { key: ' ' })
    fireEvent.pointerDown(viewport, { pointerId: 5, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(viewport, { pointerId: 5, clientX: 130, clientY: 120 })
    expect(view.getByTestId('canvas-content').style.transform).toBe('translate(30px, 20px) scale(1)')
    expect(Number(view.getByTestId('document-revision').textContent)).toBe(revisionBefore)
    fireEvent.pointerUp(viewport, { pointerId: 5, clientX: 130, clientY: 120 })
    expect(Number(view.getByTestId('document-revision').textContent)).toBe(revisionBefore + 1)
    fireEvent.keyUp(viewport, { key: ' ' })
    expect(view.getByTestId('selection-count').textContent).toBe('1')
    expect(view.queryByTestId('selection-marquee')).toBeNull()
  })

  it('fits canvas, fits selection, and resets zoom from visible commands', () => {
    const view = render(<App />)
    fireEvent.click(view.getByRole('button', { name: 'Fit canvas' }))
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('25%')
    const node3 = view.container.querySelector('[data-canvas-id="node-00003"]')
    if (!(node3 instanceof HTMLElement)) throw new Error('fixture node missing')
    fireEvent.click(node3)
    fireEvent.click(view.getByRole('button', { name: 'Fit selection' }))
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('400%')
    fireEvent.click(view.getByRole('button', { name: 'Zoom to 100 percent' }))
    expect(view.getByLabelText('Canvas zoom').textContent).toBe('100%')
  })

  it('toggles the agent collaboration panel with an offline empty state', () => {
    const view = render(<App />)
    fireEvent.click(view.getByTestId('toggle-agents'))
    expect(view.getByTestId('agent-panel')).toBeTruthy()
    expect(view.getByTestId('agent-context').textContent).toContain('selection node-00000')
    expect(view.getByTestId('agent-feed-empty')).toBeTruthy()
    fireEvent.click(view.getByTestId('toggle-agents'))
    expect(view.queryByTestId('agent-panel')).toBeNull()
  })

  it('discovers shortcuts through a visible dialog', () => {
    const view = render(<App />)
    fireEvent.click(view.getByTestId('open-shortcuts'))
    expect(view.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeTruthy()
    expect(view.getByText('Space+Drag')).toBeTruthy()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(view.queryByRole('dialog')).toBeNull()
    fireEvent.keyDown(window, { key: '?' })
    expect(view.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeTruthy()
  })

  it('marks the shortcuts dialog as modal, moves focus into it, and restores focus to the opener on close', () => {
    const view = render(<App />)
    const opener = view.getByTestId('open-shortcuts')
    fireEvent.click(opener)
    const dialog = view.getByTestId('shortcuts-dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(dialog)
    fireEvent.click(view.getByRole('button', { name: 'Close' }))
    expect(view.queryByTestId('shortcuts-dialog')).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it('traps Tab and Shift+Tab so focus cycles only within the shortcuts dialog', () => {
    const view = render(<App />)
    fireEvent.click(view.getByTestId('open-shortcuts'))
    const dialog = view.getByTestId('shortcuts-dialog')
    const closeButton = view.getByRole('button', { name: 'Close' })
    expect(document.activeElement).toBe(dialog)

    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)
    expect(dialog.contains(document.activeElement)).toBe(true)

    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)
    expect(dialog.contains(document.activeElement)).toBe(true)

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(closeButton)
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('groups the workspace toolbar into labeled sections so it can wrap at narrow widths', () => {
    const view = render(<App />)
    expect(view.getByRole('group', { name: 'Panels' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Document' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Zoom' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Viewport' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Arrange selection' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Help and panels' })).toBeTruthy()
  })

  it('applies a viewport preset to the canvas root through the canonical update-node operation, undoably', () => {
    const view = render(<App />)
    const preset = view.getByTestId('viewport-preset')
    expect((preset as HTMLSelectElement).value).toBe('desktop')

    const root = view.container.querySelector('[data-canvas-id="node-00000"]')
    if (!(root instanceof HTMLElement)) throw new Error('canvas root node missing')
    const revisionBefore = Number(view.getByTestId('document-revision').textContent)

    fireEvent.change(preset, { target: { value: 'mobile' } })
    expect((preset as HTMLSelectElement).value).toBe('mobile')
    expect(Number(view.getByTestId('document-revision').textContent)).toBe(revisionBefore + 1)
    expect(root.style.width).toBe('390px')
    expect(root.style.height).toBe('844px')

    fireEvent.change(preset, { target: { value: 'tablet' } })
    expect((preset as HTMLSelectElement).value).toBe('tablet')
    expect(Number(view.getByTestId('document-revision').textContent)).toBe(revisionBefore + 2)
    expect(root.style.width).toBe('768px')
    expect(root.style.height).toBe('1024px')

    fireEvent.click(view.getByTestId('undo'))
    expect(Number(view.getByTestId('document-revision').textContent)).toBe(revisionBefore + 1)
    expect(root.style.width).toBe('390px')
    expect(root.style.height).toBe('844px')
  })

  it('completes a representative creation workflow from insert to reload continuity', async () => {
    const view = render(<App />)
    const viewport = view.getByTestId('canvas-viewport')

    fireEvent.keyDown(viewport, { key: 'Escape' })
    fireEvent.click(view.getByTestId('toggle-insert'))
    fireEvent.click(view.getByTestId('insert-primitive-frame'))
    expect(view.getByTestId('insert-feedback').textContent).toBe('Frame inserted into canvas root')
    fireEvent.click(view.getByTestId('insert-primitive-text'))
    expect(view.getByTestId('insert-feedback').textContent).toBe('Text inserted into Frame')
    expect(view.getByText('1,002 nodes')).toBeTruthy()

    fireEvent.click(view.getByTestId('layer-created-0001'))
    fireEvent.click(view.getByTestId('insert-primitive-group'))
    expect(view.getByTestId('insert-feedback').textContent).toBe('Group inserted into Frame')

    fireEvent.click(view.getByTestId('layer-created-0002'))
    fireEvent.click(view.getByTestId('layer-created-0003'), { shiftKey: true })
    fireEvent.click(view.getByRole('button', { name: 'Tidy horizontal gap' }))
    const text = view.container.querySelector<HTMLElement>('[data-canvas-id="created-0002"]')
    const group = view.container.querySelector<HTMLElement>('[data-canvas-id="created-0003"]')
    if (!text || !group) throw new Error('created nodes missing from canvas')
    expect(text.style.left).toBe('64px')
    expect(group.style.left).toBe('200px')

    fireEvent.keyDown(view.getByTestId('layer-created-0001'), { key: 'F2' })
    const rename = view.getByTestId('layer-rename-input')
    fireEvent.change(rename, { target: { value: 'Hero section' } })
    fireEvent.keyDown(rename, { key: 'Enter' })
    expect(view.getByTestId('layer-created-0001').getAttribute('aria-label')).toBe('Hero section')

    fireEvent.click(view.getByTestId('layer-created-0002'))
    fireEvent.change(view.getByTestId('property-layout-horizontal'), { target: { value: 'fill' } })
    fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(view.getByTestId('layer-created-0003').getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(window, { key: 'd', ctrlKey: true })
    expect(view.getByText('1,004 nodes')).toBeTruthy()
    fireEvent.keyDown(window, { key: 'Delete' })
    expect(view.getByText('1,003 nodes')).toBeTruthy()
    fireEvent.click(view.getByTestId('undo'))
    expect(view.getByText('1,004 nodes')).toBeTruthy()
    fireEvent.click(view.getByTestId('undo'))
    expect(view.getByText('1,003 nodes')).toBeTruthy()

    fireEvent.click(view.getByTestId('save-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('saved'))
    fireEvent.click(view.getByTestId('reload-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('reloaded revision'))
    expect(view.getByText('1,003 nodes')).toBeTruthy()
    const frame = view.container.querySelector<HTMLElement>('[data-canvas-id="created-0001"]')
    expect(frame?.getAttribute('aria-label')).toBe('Hero section')
    expect(view.container.querySelector('[data-canvas-id="created-0002"]')?.getAttribute('data-parent-id')).toBe('created-0001')
    expect(view.getByTestId('layer-created-0001').getAttribute('aria-label')).toBe('Hero section')
  })

  it('keeps Korean composition transient and commits one text operation at composition end', () => {
    const view = render(<App />)
    const text = view.container.querySelector('[data-canvas-id="node-00007"]')
    if (!(text instanceof HTMLElement)) throw new Error('text node missing')
    fireEvent.click(text)
    fireEvent.compositionStart(text, { data: '' })
    text.textContent = '한글 조합 완료'
    fireEvent.input(text, { data: '한글 조합 완료', inputType: 'insertCompositionText', isComposing: true })
    expect(view.getByTestId('document-revision').textContent).toBe('1')
    fireEvent.compositionEnd(text, { data: '한글 조합 완료' })
    expect(view.getByTestId('document-revision').textContent).toBe('2')
    expect(text.textContent).toBe('한글 조합 완료')
    fireEvent.click(view.getByTestId('undo'))
    expect(text.textContent).toBe('한글 캔버스 입력')
  })
})

describe('connection status labels', () => {
  it('humanizes raw connection state strings for error, disconnected, and reconnecting', () => {
    expect(connectionStatusLabel('offline')).toBe('offline')
    expect(connectionStatusLabel('connected')).toBe('connected')
    expect(connectionStatusLabel('error')).toBe('Connection error')
    expect(connectionStatusLabel('disconnected')).toBe('Disconnected')
    expect(connectionStatusLabel('reconnecting')).toBe('Reconnecting…')
  })

  it('humanizes raw desktop bridge state strings while keeping ready readable as-is', () => {
    expect(desktopBridgeStateLabel('ready')).toBe('ready')
    expect(desktopBridgeStateLabel('idle')).toBe('idle')
    expect(desktopBridgeStateLabel('failed')).toBe('Connection failed')
    expect(desktopBridgeStateLabel('backoff')).toBe('Reconnecting…')
  })
})

describe('편집 상태 지속성 (TH10)', () => {
  /** 템플릿을 열고 캔버스 문서가 템플릿 장면으로 바뀔 때까지 기다린다. */
  async function openTemplate(view: ReturnType<typeof render>) {
    fireEvent.click(view.getByTestId('toggle-templates'))
    fireEvent.click(view.getByTestId('template-open-business-card-minimal'))
    await waitFor(() =>
      expect(view.getByTestId('persistence-status').textContent).toContain('template'),
    )
  }

  it('템플릿을 열고 저장한 뒤 재적재하면 템플릿이 돌아온다', async () => {
    const view = render(<App />)
    await openTemplate(view)
    const opened = view.getByTestId('document-node-count').textContent

    fireEvent.click(view.getByTestId('save-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('saved'))

    fireEvent.click(view.getByTestId('reload-document'))
    await waitFor(() => expect(view.getByTestId('persistence-status').textContent).toContain('reloaded'))

    // 저장 슬롯이 fixture 문서에 묶여 있으면 여기서 1,000노드 fixture가 복원된다.
    expect(view.getByTestId('document-node-count').textContent).toBe(opened)
  })

  it('fixture 크기 토글이 열어둔 템플릿을 파괴하지 않는다', async () => {
    const view = render(<App />)
    await openTemplate(view)
    const opened = view.getByTestId('document-node-count').textContent

    const sizeSelect = view.getByTestId('fixture-size') as HTMLSelectElement
    expect(sizeSelect.disabled).toBe(true)

    // 비활성이어도 상태 변화가 새어들어오지 않는지 직접 확인한다.
    fireEvent.change(sizeSelect, { target: { value: '5000' } })
    expect(view.getByTestId('document-node-count').textContent).toBe(opened)
  })

  it('템플릿이 없으면 fixture 크기 토글이 그대로 동작한다', () => {
    const view = render(<App />)
    const sizeSelect = view.getByTestId('fixture-size') as HTMLSelectElement
    expect(sizeSelect.disabled).toBe(false)
    fireEvent.change(sizeSelect, { target: { value: '5000' } })
    expect(view.getByTestId('document-node-count').textContent).toContain('5,000')
  })
})

describe('토큰 세트 표시·검증 정합 (TH10)', () => {
  async function openBusinessCard(view: ReturnType<typeof render>) {
    fireEvent.click(view.getByTestId('toggle-templates'))
    fireEvent.click(view.getByTestId('template-open-business-card-minimal'))
    await waitFor(() =>
      expect(view.getByTestId('persistence-status').textContent).toContain('template'),
    )
  }

  it('템플릿을 열면 드롭다운이 문서의 세트를 그대로 보여준다', async () => {
    const view = render(<App />)
    await openBusinessCard(view)
    // 옵션이 편집기 세트 둘로 하드코딩돼 있으면 여기서 askewly.default가 나온다.
    expect((view.getByTestId('token-mode') as HTMLSelectElement).value).toBe('askewly.warm')
  })

  it('옵션이 실재하는 세트 전부를 담는다', () => {
    const view = render(<App />)
    const values = Array.from((view.getByTestId('token-mode') as HTMLSelectElement).options).map((o) => o.value)
    expect(values).toContain('askewly.default')
    expect(values).toContain('askewly.dark')
    expect(values).toContain('askewly.warm')
    expect(values).toContain('askewly.ink')
  })

  it('목록 밖 값은 문서를 바꾸지 않고 오류를 표면화한다', () => {
    const view = render(<App />)
    const before = view.getByTestId('document-revision').textContent
    fireEvent.change(view.getByTestId('token-mode'), { target: { value: 'foo.bar' } })
    // select는 목록 밖 값을 담지 못해 빈 값으로 떨어진다 — 어느 쪽이든 **통과하면 안 된다**.
    expect(view.getByTestId('property-error').textContent).toContain('없습니다')
    expect(view.getByTestId('document-revision').textContent).toBe(before)
  })
})
