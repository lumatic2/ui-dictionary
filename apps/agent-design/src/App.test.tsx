import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

beforeEach(() => window.localStorage.clear())
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
})
