import { useEffect, useRef, useState } from 'react'
import type { AlignmentGuide, CanvasRect } from '@askewly/canvas-core'
import { createEditorPlane, type EditorPlaneFailure, type EditorPlaneState } from './editorPlaneRuntime'

interface Props {
  selection: CanvasRect
  guides?: AlignmentGuide[]
  failure?: EditorPlaneFailure | null
}

export function EditorPlane({ selection, guides = [], failure = null }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<Awaited<ReturnType<typeof createEditorPlane>> | null>(null)
  const [state, setState] = useState<EditorPlaneState>({ mode: 'initializing', reason: 'initializing' })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let destroy: () => void = () => undefined
    setState({ mode: 'initializing', reason: 'initializing' })
    void createEditorPlane(canvas, { selection, guides }, (next) => { if (!disposed) setState(next) }, { failure }).then((handle) => {
      if (disposed) handle.destroy()
      else { destroy = handle.destroy; handleRef.current = handle; handle.update({ selection, guides }) }
    })
    return () => { disposed = true; handleRef.current = null; destroy() }
  }, [failure])

  useEffect(() => {
    handleRef.current?.update({ selection, guides })
  }, [guides, selection.height, selection.width, selection.x, selection.y])

  return <div className="editor-plane" data-testid="editor-plane" data-editor-plane={state.mode} data-editor-reason={state.reason}>
    <canvas ref={canvasRef} className="webgpu-editor-canvas" aria-hidden="true" hidden={state.mode === 'dom'} />
    {state.mode !== 'webgpu' ? <div
      className="dom-editor-selection"
      data-testid="editor-selection"
      style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }}
    /> : null}
    {state.mode !== 'webgpu' ? guides.map((guide, index) => <div
      key={`${guide.axis}-${guide.value}-${index}`}
      className={`dom-alignment-guide guide-${guide.axis}`}
      style={guide.axis === 'x' ? { left: guide.value } : { top: guide.value }}
    />) : null}
  </div>
}
