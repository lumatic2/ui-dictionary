import type { AlignmentGuide, CanvasRect } from '@askewly/canvas-core'

export type EditorPlaneMode = 'initializing' | 'webgpu' | 'dom'
export type EditorPlaneFailure = 'forced-fallback' | 'validation-error' | 'device-lost'

export interface EditorPlaneState {
  mode: EditorPlaneMode
  reason: string
}

export interface EditorPlaneOptions {
  failure?: EditorPlaneFailure | null
}

export interface EditorPlaneHandle {
  update: (geometry: EditorPlaneGeometry) => void
  destroy: () => void
}

export interface EditorPlaneGeometry {
  selection: CanvasRect
  guides: AlignmentGuide[]
}

const fallback = (reason: string, onState: (state: EditorPlaneState) => void): EditorPlaneHandle => {
  onState({ mode: 'dom', reason })
  return { update: () => undefined, destroy: () => undefined }
}

/** 선택·가이드 틴트 색(비프리멀티플라이드 RGB). 알파는 쓰임새마다 다르다. */
export const SELECTION_TINT: readonly [number, number, number] = [0.49, 0.18, 0.83]

/**
 * 캔버스가 `alphaMode: 'premultiplied'`라 RGB는 **알파가 곱해진 값**이어야 한다.
 *
 * 곱하지 않고 넘기면 합성식 `src.rgb + dst.rgb*(1-src.a)`에서 src가 과하게 밝아져
 * **선택한 노드의 색이 바뀌어 보인다.** 실측(ECT2 step-2 픽셀 측정): 빨강 `#DF2225` 노드를
 * 선택하면 `#FF4AF2` 마젠타로 그려졌다 — 하필 색을 판단하려는 그 노드가 오염된다.
 * 수정 후 같은 지점이 `#CD2444`(빨강 + 보라 틴트 18%)로 측정됐다.
 */
export function premultiplied([r, g, b]: readonly [number, number, number], alpha: number): number[] {
  return [r * alpha, g * alpha, b * alpha, alpha]
}

export async function createEditorPlane(
  canvas: HTMLCanvasElement,
  geometry: EditorPlaneGeometry,
  onState: (state: EditorPlaneState) => void,
  options: EditorPlaneOptions = {},
): Promise<EditorPlaneHandle> {
  if (options.failure === 'forced-fallback') return fallback('forced fallback', onState)
  if (options.failure === 'validation-error') return fallback('injected validation error', onState)
  if (options.failure === 'device-lost') return fallback('injected device loss', onState)
  const gpu = (navigator as Navigator & { gpu?: any }).gpu
  if (!gpu) return fallback('navigator.gpu unavailable', onState)

  let alive = true
  try {
    const adapter = await gpu.requestAdapter()
    if (!adapter) return fallback('WebGPU adapter unavailable', onState)
    const device = await adapter.requestDevice()
    const context = canvas.getContext('webgpu') as any
    if (!context) return fallback('WebGPU canvas context unavailable', onState)
    const width = Math.max(1, canvas.clientWidth)
    const height = Math.max(1, canvas.clientHeight)
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    const format = gpu.getPreferredCanvasFormat()
    context.configure({ device, format, alphaMode: 'premultiplied' })

    device.pushErrorScope('validation')
    const rects = new Float32Array(40)
    const rectBuffer = device.createBuffer({ size: rects.byteLength, usage: 128 | 8, mappedAtCreation: true })
    new Float32Array(rectBuffer.getMappedRange()).set(rects)
    rectBuffer.unmap()
    const uniformBuffer = device.createBuffer({ size: 16, usage: 64 | 8 })
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([canvas.width, canvas.height, 0, 0]))
    const shader = device.createShaderModule({ code: `
      struct Rect { xywh: vec4f, color: vec4f }
      @group(0) @binding(0) var<storage, read> rects: array<Rect>;
      @group(0) @binding(1) var<uniform> viewport: vec4f;
      struct Out { @builtin(position) position: vec4f, @location(0) color: vec4f }
      @vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) instance: u32) -> Out {
        let corners = array<vec2f, 6>(vec2f(0,0), vec2f(1,0), vec2f(0,1), vec2f(0,1), vec2f(1,0), vec2f(1,1));
        let rect = rects[instance];
        let pixel = rect.xywh.xy + corners[vertex] * rect.xywh.zw;
        let clip = vec2f(pixel.x / viewport.x * 2.0 - 1.0, 1.0 - pixel.y / viewport.y * 2.0);
        var out: Out;
        out.position = vec4f(clip, 0.0, 1.0);
        out.color = rect.color;
        return out;
      }
      @fragment fn fs(in: Out) -> @location(0) vec4f { return in.color; }
    ` })
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: shader, entryPoint: 'vs' },
      fragment: { module: shader, entryPoint: 'fs', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    })
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: rectBuffer } }, { binding: 1, resource: { buffer: uniformBuffer } }],
    })
    const draw = ({ selection: nextSelection, guides }: EditorPlaneGeometry) => {
      rects.fill(0)
      rects.set([nextSelection.x * dpr, nextSelection.y * dpr, nextSelection.width * dpr, nextSelection.height * dpr, ...premultiplied(SELECTION_TINT, 0.18)])
      guides.slice(0, 4).forEach((guide, index) => {
        const offset = (index + 1) * 8
        rects.set(guide.axis === 'x'
          ? [guide.value * dpr, 0, 1 * dpr, canvas.height, ...premultiplied(SELECTION_TINT, 0.72)]
          : [0, guide.value * dpr, canvas.width, 1 * dpr, ...premultiplied(SELECTION_TINT, 0.72)], offset)
      })
      device.queue.writeBuffer(rectBuffer, 0, rects)
      const encoder = device.createCommandEncoder()
      const pass = encoder.beginRenderPass({
        colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }],
      })
      pass.setPipeline(pipeline)
      pass.setBindGroup(0, bindGroup)
      pass.draw(6, 1 + Math.min(4, guides.length))
      pass.end()
      device.queue.submit([encoder.finish()])
    }
    draw(geometry)
    await device.queue.onSubmittedWorkDone()
    const validationError = await device.popErrorScope()
    if (validationError) {
      rectBuffer.destroy(); uniformBuffer.destroy()
      return fallback(validationError.message, onState)
    }
    onState({ mode: 'webgpu', reason: 'WebGPU editor plane active' })
    device.lost.then((info: { message?: string }) => {
      if (alive) onState({ mode: 'dom', reason: `device lost: ${info.message || 'unknown'}` })
    })
    return {
      update: draw,
      destroy: () => {
        alive = false
        rectBuffer.destroy()
        uniformBuffer.destroy()
      },
    }
  } catch (error) {
    return fallback(error instanceof Error ? error.message : String(error), onState)
  }
}
