import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

beforeEach(() => {
  window.localStorage.clear()
  Object.defineProperty(window, 'PointerEvent', { value: MouseEvent, configurable: true })
})
afterEach(cleanup)

describe('Agent Design persistence flow', () => {
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
    fireEvent.change(view.getByTestId('token-mode'), { target: { value: 'askewly.dark' } })
    expect(view.getByTestId('document-revision').textContent).toBe('4')

    const variant = view.getByTestId('property-variant-size')
    fireEvent.change(variant, { target: { value: '' } })
    fireEvent.blur(variant)
    expect(view.getByTestId('property-error').textContent).toContain('invalid variant')
    expect(view.getByTestId('document-revision').textContent).toBe('4')
    fireEvent.change(variant, { target: { value: 'lg' } })
    fireEvent.blur(variant)
    expect(view.getByTestId('document-revision').textContent).toBe('5')
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
