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
  kind: 'frame' | 'group' | 'code-component' | 'text' | 'instance'
  name: string
  parentId: NodeId | null
  childIds: NodeId[]
  bounds: CanvasRect
  layout: LayoutConstraints
  visible: boolean
  locked: boolean
  tokenBindings: Record<string, string>
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

export interface InstanceNode extends CanvasNodeBase {
  kind: 'instance'
  componentId: NodeId
  overrides: Record<string, PropValue>
}

export type CanvasNode = FrameNode | GroupNode | CodeComponentNode | TextNode | InstanceNode

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
