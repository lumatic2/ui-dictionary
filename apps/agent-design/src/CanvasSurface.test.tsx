import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { createDocumentFixture } from '@askewly/canvas-core'
import { afterEach, describe, expect, it } from 'vitest'
import { CanvasSurface } from './CanvasSurface'

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
