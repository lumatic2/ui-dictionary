import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createGpuScene } from './gpu'
import type { CandidateHandle, CandidateId, SceneFixture, SelectionState, ViewportState } from './types'

interface Props { candidate: CandidateId; fixture: SceneFixture }

export const CandidateSurface = forwardRef<CandidateHandle, Props>(function CandidateSurface({ candidate, fixture }, ref) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement | SVGSVGElement>(null)
  const selectionRef = useRef<HTMLDivElement | SVGRectElement>(null)
  const gpuCanvasRef = useRef<HTMLCanvasElement>(null)
  const gpuRef = useRef<Awaited<ReturnType<typeof createGpuScene>> | null>(null)
  const initialGpuStatus = candidate === 'webgpu' || candidate === 'dom-webgpu'
    ? { supported: false, detail: 'initializing' }
    : { supported: true, detail: 'not required' }
  const gpuStatusRef = useRef(initialGpuStatus)
  const [gpuStatus, setGpuStatus] = useState(initialGpuStatus)

  useEffect(() => {
    let cancelled = false
    if ((candidate === 'webgpu' || candidate === 'dom-webgpu') && gpuCanvasRef.current) {
      void createGpuScene(gpuCanvasRef.current, fixture, candidate === 'dom-webgpu').then((scene) => {
        if (cancelled) { scene.destroy(); return }
        gpuRef.current = scene
        const nextStatus = { supported: scene.supported, detail: scene.detail }
        gpuStatusRef.current = nextStatus
        setGpuStatus(nextStatus)
      })
    }
    return () => { cancelled = true; gpuRef.current?.destroy(); gpuRef.current = null }
  }, [candidate, fixture])

  useImperativeHandle(ref, () => ({
    updateViewport(state: ViewportState) {
      if (candidate === 'webgpu' || candidate === 'dom-webgpu') gpuRef.current?.updateViewport(state)
      if (candidate !== 'webgpu' && contentRef.current) contentRef.current.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`
    },
    updateSelection(state: SelectionState) {
      gpuRef.current?.updateSelection(state)
      const selection = selectionRef.current
      if (selection instanceof SVGRectElement) {
        selection.setAttribute('x', String(state.x)); selection.setAttribute('y', String(state.y)); selection.setAttribute('width', String(state.width)); selection.setAttribute('height', String(state.height))
      } else if (selection) {
        Object.assign(selection.style, { left: `${state.x}px`, top: `${state.y}px`, width: `${state.width}px`, height: `${state.height}px` })
      }
    },
    status: () => candidate === 'webgpu' || candidate === 'dom-webgpu' ? gpuStatusRef.current : { supported: true, detail: `${candidate} active` },
  }), [candidate])

  if (candidate === 'svg') {
    return <div ref={rootRef} className="candidate-root" data-candidate={candidate} data-supported="true" data-support-detail="svg active">
      <svg ref={contentRef as React.RefObject<SVGSVGElement>} className="scene-content svg-scene" width={fixture.width} height={fixture.height} role="img" aria-label="SVG UI canvas benchmark">
        {fixture.nodes.map((node, index) => <g key={node.id} data-node-id={node.id}>
          <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="6" fill={`hsl(${node.tone} 35% ${index % 4 === 0 ? 92 : 96}%)`} stroke="hsl(250 18% 78%)" />
          {index < 500 && <text x={node.x + 7} y={node.y + 17} fontSize="10" fill="#334155">{node.label}</text>}
          {index === 0 && <foreignObject x={node.x + 5} y={node.y + 24} width={node.width - 10} height="26"><input className="embedded-input" defaultValue="한글 입력 테스트" aria-label="Korean IME test" /></foreignObject>}
        </g>)}
        <rect ref={selectionRef as React.RefObject<SVGRectElement>} className="svg-selection" x="24" y="24" width="92" height="58" />
      </svg>
    </div>
  }

  if (candidate === 'webgpu') {
    return <div ref={rootRef} className="candidate-root gpu-root" data-candidate={candidate} data-supported={String(gpuStatus.supported)} data-support-detail={gpuStatus.detail}>
      <canvas ref={gpuCanvasRef} className="gpu-scene" aria-hidden="true" />
      <div className="gpu-semantic-mirror" aria-label="WebGPU canvas semantic mirror">
        <button type="button">Selected component</button>
        <input defaultValue="한글 입력 테스트" aria-label="Korean IME test" />
      </div>
    </div>
  }

  return <div ref={rootRef} className="candidate-root" data-candidate={candidate} data-supported={String(candidate === 'dom' || gpuStatus.supported)} data-support-detail={candidate === 'dom' ? 'dom active' : gpuStatus.detail}>
    <div ref={contentRef as React.RefObject<HTMLDivElement>} className="scene-content dom-scene" style={{ width: fixture.width, height: fixture.height }}>
      {fixture.nodes.map((node, index) => {
        const attributes = {
          className: `scene-node kind-${node.kind}`,
          'data-node-id': node.id,
          'data-source-ref': node.sourceRef,
          'aria-label': node.label,
          style: { left: node.x, top: node.y, width: node.width, height: node.height, background: `hsl(${node.tone} 35% ${index % 4 === 0 ? 92 : 96}%)` },
        }
        const content = index === 0 ? <input className="node-input" defaultValue="한글 입력 테스트" aria-label="Korean IME test" /> : index < 500 ? <span>{node.label}</span> : null
        return node.kind === 'button'
          ? <button key={node.id} type="button" {...attributes}>{content}</button>
          : <div key={node.id} role="group" {...attributes}>{content}</div>
      })}
    </div>
    {candidate === 'dom-webgpu' ? <canvas ref={gpuCanvasRef} className="gpu-overlay" aria-hidden="true" /> : <div ref={selectionRef as React.RefObject<HTMLDivElement>} className="dom-selection" />}
  </div>
})
