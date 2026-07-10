import type { CanvasRect } from '@askewly/canvas-core'

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
  update: (selection: CanvasRect) => void
  destroy: () => void
}

const fallback = (reason: string, onState: (state: EditorPlaneState) => void): EditorPlaneHandle => {
  onState({ mode: 'dom', reason })
  return { update: () => undefined, destroy: () => undefined }
}

export async function createEditorPlane(
  canvas: HTMLCanvasElement,
  selection: CanvasRect,
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
    const rects = new Float32Array(24)
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
    const draw = (nextSelection: CanvasRect) => {
      rects.set([
        nextSelection.x * dpr, nextSelection.y * dpr, nextSelection.width * dpr, nextSelection.height * dpr, 0.49, 0.18, 0.83, 0.18,
        0, nextSelection.y * dpr, canvas.width, 1 * dpr, 0.49, 0.18, 0.83, 0.5,
        nextSelection.x * dpr, 0, 1 * dpr, canvas.height, 0.49, 0.18, 0.83, 0.5,
      ])
      device.queue.writeBuffer(rectBuffer, 0, rects)
      const encoder = device.createCommandEncoder()
      const pass = encoder.beginRenderPass({
        colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }],
      })
      pass.setPipeline(pipeline)
      pass.setBindGroup(0, bindGroup)
      pass.draw(6, 3)
      pass.end()
      device.queue.submit([encoder.finish()])
    }
    draw(selection)
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
