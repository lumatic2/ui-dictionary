import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

beforeEach(() => {
  window.localStorage.clear()
  Object.defineProperty(window, 'PointerEvent', { value: MouseEvent, configurable: true })
})
afterEach(cleanup)

describe('Agent Design persistence flow', () => {
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
})
