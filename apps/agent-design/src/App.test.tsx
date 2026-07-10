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
})
