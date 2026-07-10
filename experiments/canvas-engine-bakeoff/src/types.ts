export type CandidateId = 'dom' | 'dom-webgpu' | 'svg' | 'webgpu'
export type SceneSize = 1000 | 5000 | 10000

export interface SceneNode {
  id: string
  kind: 'frame' | 'group' | 'component' | 'instance' | 'card' | 'text' | 'button'
  x: number
  y: number
  width: number
  height: number
  label: string
  tone: number
  token: 'surface.raised' | 'surface.muted' | 'action.primary'
  parentId: string | null
  componentId: string | null
  sourceRef: string
  responsiveMode: 'fixed' | 'hug' | 'fill'
  props: { size: 'sm' | 'md' | 'lg'; state: 'default' | 'hover' | 'disabled'; visible: boolean }
}

export interface SceneFixture {
  version: 1
  id: string
  width: number
  height: number
  selectedId: string
  nodes: SceneNode[]
}

export interface ViewportState {
  panX: number
  panY: number
  scale: number
}

export interface SelectionState {
  x: number
  y: number
  width: number
  height: number
}

export interface CandidateHandle {
  updateViewport: (state: ViewportState) => void
  updateSelection: (state: SelectionState) => void
  status: () => { supported: boolean; detail: string }
}

export interface TraceStats {
  frames: number
  durationMs: number
  averageFrameMs: number
  p95FrameMs: number
  droppedFrameRatio: number
}

export interface BenchmarkResult {
  schemaVersion: 1
  candidate: CandidateId
  sceneSize: SceneSize
  userAgent: string
  timestamp: string
  supported: boolean
  supportDetail: string
  initialRenderMs: number
  panZoom: TraceStats
  selectionMutation: TraceStats
  serializationMs: number
  roundTripStable: boolean
  semanticElementCount: number
  editableElementCount: number
  focusableElementCount: number
  imeCompositionPreserved: boolean
  operationReplayStable: boolean
  sourceMappingCount: number
  memoryBytes: number | null
  errors: string[]
}

declare global {
  interface Window {
    __canvasBenchmark: {
      run: (candidate: CandidateId, size: SceneSize) => Promise<BenchmarkResult>
      candidates: CandidateId[]
      sizes: SceneSize[]
    }
  }
}
