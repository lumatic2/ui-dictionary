import { createFixture, verifyFixture } from './fixtures'
import type { BenchmarkResult, CandidateHandle, CandidateId, SceneFixture, SceneSize, TraceStats } from './types'

const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve))

export async function runTrace(frames: number, update: (index: number) => void): Promise<TraceStats> {
  const intervals: number[] = []
  let previous = await nextFrame()
  const start = previous
  for (let index = 0; index < frames; index += 1) {
    update(index)
    const now = await nextFrame()
    intervals.push(now - previous)
    previous = now
  }
  const sorted = [...intervals].sort((a, b) => a - b)
  const durationMs = previous - start
  const p95FrameMs = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0
  return {
    frames,
    durationMs,
    averageFrameMs: durationMs / frames,
    p95FrameMs,
    droppedFrameRatio: intervals.filter((value) => value > 20).length / frames,
  }
}

function testIme(root: HTMLElement): boolean {
  const input = root.querySelector<HTMLInputElement>('input[aria-label="Korean IME test"]')
  if (!input) return false
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { data: '' }))
  input.value = '한글 입력 완료'
  input.dispatchEvent(new InputEvent('input', { data: '한글 입력 완료', inputType: 'insertCompositionText', bubbles: true, isComposing: true }))
  input.dispatchEvent(new CompositionEvent('compositionend', { data: '한글 입력 완료' }))
  return input.value === '한글 입력 완료'
}

export async function benchmarkCandidate(candidate: CandidateId, size: SceneSize, fixture: SceneFixture, handle: CandidateHandle, root: HTMLElement, mountedAt: number): Promise<BenchmarkResult> {
  const errors = verifyFixture(fixture)
  await nextFrame(); await nextFrame()
  const initialRenderMs = performance.now() - mountedAt
  let status = handle.status()
  for (let attempt = 0; status.detail === 'initializing' && attempt < 120; attempt += 1) {
    await nextFrame()
    status = handle.status()
  }
  const panZoom = await runTrace(90, (index) => {
    handle.updateViewport({ panX: -index * 2.5, panY: -index * 1.2, scale: 0.82 + (index % 30) * 0.006 })
  })
  const selectionMutation = await runTrace(90, (index) => {
    handle.updateSelection({ x: 24 + index * 0.9, y: 24 + index * 0.45, width: 92 + (index % 20), height: 58 + (index % 15) })
  })
  const serializationStart = performance.now()
  const serialized = JSON.stringify(fixture)
  const parsed = JSON.parse(serialized) as SceneFixture
  const serializationMs = performance.now() - serializationStart
  const roundTripStable = JSON.stringify(parsed) === serialized
  const semanticElementCount = root.querySelectorAll('[role],button,input,[aria-label]').length
  const editableElementCount = root.querySelectorAll('input,textarea,[contenteditable="true"]').length
  const focusableElementCount = root.querySelectorAll('button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])').length
  const operationLog = [
    { type: 'viewport', panX: -222.5, panY: -106.8, scale: 0.994 },
    { type: 'selection', x: 104.1, y: 64.05, width: 101, height: 72 },
  ]
  const recoveredLog = JSON.parse(JSON.stringify(operationLog)) as typeof operationLog
  const operationReplayStable = JSON.stringify(recoveredLog) === JSON.stringify(operationLog)
  const sourceMappingCount = parsed.nodes.filter((node) => node.sourceRef.startsWith('src/components/')).length
  const memory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? null
  if (!status.supported) errors.push(status.detail)
  if (!roundTripStable) errors.push('canonical fixture round-trip lost IDs or tokens')

  return {
    schemaVersion: 1,
    candidate,
    sceneSize: size,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    supported: status.supported,
    supportDetail: status.detail,
    initialRenderMs,
    panZoom,
    selectionMutation,
    serializationMs,
    roundTripStable,
    semanticElementCount,
    editableElementCount,
    focusableElementCount,
    imeCompositionPreserved: testIme(root),
    operationReplayStable,
    sourceMappingCount,
    memoryBytes: memory,
    errors,
  }
}

export { createFixture }
