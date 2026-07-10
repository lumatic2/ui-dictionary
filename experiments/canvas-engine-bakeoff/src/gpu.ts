import type { SceneFixture, SelectionState, ViewportState } from './types'

interface GpuScene {
  canvas: HTMLCanvasElement
  supported: boolean
  detail: string
  updateViewport: (state: ViewportState) => void
  updateSelection: (state: SelectionState) => void
  destroy: () => void
}

export async function createGpuScene(canvas: HTMLCanvasElement, fixture: SceneFixture, overlayOnly: boolean): Promise<GpuScene> {
  const gpu = (navigator as Navigator & { gpu?: any }).gpu
  if (!gpu) return unsupported(canvas, 'navigator.gpu unavailable')

  try {
    const adapter = await gpu.requestAdapter()
    if (!adapter) return unsupported(canvas, 'WebGPU adapter unavailable')
    const device = await adapter.requestDevice()
    const context = canvas.getContext('webgpu') as any
    if (!context) return unsupported(canvas, 'webgpu canvas context unavailable')
    const format = gpu.getPreferredCanvasFormat()
    context.configure({ device, format, alphaMode: 'premultiplied' })

    const rectStride = 8
    const data = new Float32Array(fixture.nodes.length * rectStride)
    fixture.nodes.forEach((node, index) => {
      const offset = index * rectStride
      data[offset] = node.x
      data[offset + 1] = node.y
      data[offset + 2] = node.width
      data[offset + 3] = node.height
      const hue = node.tone / 360
      data[offset + 4] = overlayOnly ? 0.435 : 0.18 + hue * 0.35
      data[offset + 5] = overlayOnly ? 0.176 : 0.32 + (1 - hue) * 0.25
      data[offset + 6] = overlayOnly ? 0.741 : 0.54 + hue * 0.22
      data[offset + 7] = overlayOnly ? (index === 0 ? 0.95 : 0.035) : 0.9
    })

    const rectBuffer = device.createBuffer({
      size: data.byteLength,
      usage: 128 | 8,
      mappedAtCreation: true,
    })
    new Float32Array(rectBuffer.getMappedRange()).set(data)
    rectBuffer.unmap()

    device.pushErrorScope('validation')
    const uniformBuffer = device.createBuffer({ size: 32, usage: 64 | 8 })
    const shader = device.createShaderModule({ code: `
      struct Rect { xywh: vec4f, color: vec4f }
      struct Uniforms { viewport_pan: vec4f, scale_pad: vec4f }
      @group(0) @binding(0) var<storage, read> rects: array<Rect>;
      @group(0) @binding(1) var<uniform> uniforms: Uniforms;
      struct Out { @builtin(position) position: vec4f, @location(0) color: vec4f }
      @vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) instance: u32) -> Out {
        let corners = array<vec2f, 6>(vec2f(0,0), vec2f(1,0), vec2f(0,1), vec2f(0,1), vec2f(1,0), vec2f(1,1));
        let rect = rects[instance];
        let pixel = (rect.xywh.xy + corners[vertex] * rect.xywh.zw) * uniforms.scale_pad.x + uniforms.viewport_pan.zw;
        let clip = vec2f(pixel.x / uniforms.viewport_pan.x * 2.0 - 1.0, 1.0 - pixel.y / uniforms.viewport_pan.y * 2.0);
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
      entries: [
        { binding: 0, resource: { buffer: rectBuffer } },
        { binding: 1, resource: { buffer: uniformBuffer } },
      ],
    })

    let viewport: ViewportState = { panX: 0, panY: 0, scale: 1 }
    let selection: SelectionState | null = null
    let alive = true
    const render = () => {
      if (!alive) return
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }
      const values = new Float32Array([canvas.width, canvas.height, viewport.panX * dpr, viewport.panY * dpr, viewport.scale * dpr, 0, 0, 0])
      device.queue.writeBuffer(uniformBuffer, 0, values)
      if (selection && fixture.nodes[0]) {
        const node = fixture.nodes[0]
        const selectionData = new Float32Array([selection.x, selection.y, selection.width, selection.height, 0.435, 0.176, 0.741, 1])
        device.queue.writeBuffer(rectBuffer, 0, selectionData)
        Object.assign(node, selection)
      }
      const encoder = device.createCommandEncoder()
      const pass = encoder.beginRenderPass({
        colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r: 0.97, g: 0.975, b: 0.985, a: overlayOnly ? 0 : 1 }, loadOp: 'clear', storeOp: 'store' }],
      })
      pass.setPipeline(pipeline)
      pass.setBindGroup(0, bindGroup)
      pass.draw(6, fixture.nodes.length)
      pass.end()
      device.queue.submit([encoder.finish()])
    }
    render()
    await device.queue.onSubmittedWorkDone()
    const validationError = await device.popErrorScope()
    if (validationError) {
      rectBuffer.destroy()
      uniformBuffer.destroy()
      return unsupported(canvas, `WebGPU validation failed: ${validationError.message}`)
    }
    return {
      canvas,
      supported: true,
      detail: `WebGPU ${overlayOnly ? 'overlay' : 'scene'} active`,
      updateViewport: (state) => { viewport = state; render() },
      updateSelection: (state) => { selection = state; render() },
      destroy: () => { alive = false; rectBuffer.destroy(); uniformBuffer.destroy() },
    }
  } catch (error) {
    return unsupported(canvas, error instanceof Error ? error.message : String(error))
  }
}

function unsupported(canvas: HTMLCanvasElement, detail: string): GpuScene {
  const context = canvas.getContext('2d')
  context?.clearRect(0, 0, canvas.width, canvas.height)
  return {
    canvas,
    supported: false,
    detail,
    updateViewport: () => undefined,
    updateSelection: () => undefined,
    destroy: () => undefined,
  }
}
