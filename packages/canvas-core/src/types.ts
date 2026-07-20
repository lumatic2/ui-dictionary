export type NodeId = string

export interface CanvasPoint {
  x: number
  y: number
}

export interface CanvasSize {
  width: number
  height: number
}

export interface CanvasRect extends CanvasPoint, CanvasSize {}

export type LayoutMode = 'absolute' | 'horizontal' | 'vertical'
export type SizingMode = 'fixed' | 'hug' | 'fill'

export interface LayoutConstraints {
  mode: LayoutMode
  horizontal: SizingMode
  vertical: SizingMode
  gap: number
  padding: [number, number, number, number]
}

export interface SourceMapping {
  file: string
  exportName: string
  startLine: number
  endLine: number
}

export type PropValue = string | number | boolean | null

export interface CanvasNodeBase {
  id: NodeId
  kind: 'frame' | 'group' | 'code-component' | 'text' | 'image' | 'shape' | 'instance'
  name: string
  parentId: NodeId | null
  childIds: NodeId[]
  bounds: CanvasRect
  /**
   * 회전 각도(도, 시계 방향). 회전 중심은 **바운딩 박스 중심**이다.
   *
   * 렌더 층 CSS transform으로만 두지 않는 이유: 내보내기·좌표 계산이 각도를 모르면
   * 화면에서만 돌아가고 산출물은 안 돌아간 채로 나간다. 선택 필드로 두면 "각도를
   * 안 쓰는 경로"가 조용히 생기므로 필수로 둔다.
   */
  rotation: number
  layout: LayoutConstraints
  visible: boolean
  locked: boolean
  tokenBindings: Record<string, string>
  /**
   * 토큰에서 **벗어난** 색(ECT3 detach). 키는 `tokenBindings`와 같다(`fill`·`background`·`color`).
   *
   * 왜 새 필드인가 — 리터럴 색을 담을 자리가 `ShapeNode.fill` 하나뿐이라 frame·text의
   * 배경/글자색을 detach하면 둘 곳이 없다. `tokenBindings`에 리터럴을 섞으면 방금 세운
   * 토큰 실재 검증(ECT1)이 무너진다.
   *
   * 왜 선택 필드인가 — 필수로 두면 **이미 저장된 문서가 안 열린다.** 없으면 없는 것이지
   * 잘못된 문서가 아니다. 우선순위는 바인딩 > 리터럴이므로 둘이 겹쳐도 모호하지 않다.
   */
  literalColors?: Record<string, string>
  source: SourceMapping | null
}

export interface FrameNode extends CanvasNodeBase {
  kind: 'frame'
  clipContent: boolean
}

export interface GroupNode extends CanvasNodeBase {
  kind: 'group'
}

export interface CodeComponentNode extends CanvasNodeBase {
  kind: 'code-component'
  source: SourceMapping
  props: Record<string, PropValue>
  variants: Record<string, string>
}

export interface TextNode extends CanvasNodeBase {
  kind: 'text'
  text: string
  textStyle: {
    fontFamily: string
    fontSize: number
    fontWeight: number
    lineHeight: number
  }
}

export interface ImageNode extends CanvasNodeBase {
  kind: 'image'
  assetId: string
  alt: string
  fit: 'cover' | 'contain' | 'fill'
  opacity: number
}

/**
 * 문서에 실린 소재. `ImageNode.assetId`가 이걸 가리킨다.
 *
 * 문서 바깥(별도 매니페스트)에 두면 문서만 오가는 경로 — 에이전트 브리지·스냅샷·
 * JSON 재가져오기 — 에서 이미지가 사라진다. 문서는 자족적이어야 한다.
 */
export interface CanvasAsset {
  uri: string
  mimeType: string
  width: number
  height: number
}

export interface ShapeNode extends CanvasNodeBase {
  kind: 'shape'
  shape: 'rectangle' | 'ellipse' | 'line'
  fill: string
  stroke: string | null
  strokeWidth: number
}

export interface InstanceNode extends CanvasNodeBase {
  kind: 'instance'
  componentId: NodeId
  overrides: Record<string, PropValue>
}

export type CanvasNode = FrameNode | GroupNode | CodeComponentNode | TextNode | ImageNode | ShapeNode | InstanceNode

export interface CanvasDocument {
  schemaVersion: 1
  id: string
  name: string
  revision: number
  rootIds: NodeId[]
  nodes: Record<NodeId, CanvasNode>
  selection: NodeId[]
  viewport: { pan: CanvasPoint; zoom: number }
  tokenSetId: string
  /** assetId → 소재. 이미지 노드가 없는 문서는 생략할 수 있다(기존 문서 호환). */
  assets?: Record<string, CanvasAsset>
  metadata: {
    createdAt: string
    updatedAt: string
    sourceRoot: string
  }
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}
