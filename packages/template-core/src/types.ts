import type { CanvasDocument } from '@askewly/canvas-core'

export const templateFormats = ['business-card', 'product-poster', 'infographic'] as const
export type TemplateFormat = typeof templateFormats[number]

export interface TemplateRequest {
  id: string
  format: TemplateFormat
  width: number
  height: number
  tokenSetId: string
  content: Record<string, string>
}

export interface AssetManifestEntry {
  id: string
  uri: string
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml'
  width: number
  height: number
  provenance: { provider: 'local' | 'stock' | 'generated'; source: string }
}

export interface TemplateProject {
  schemaVersion: 1
  request: TemplateRequest
  assets: AssetManifestEntry[]
  scene: CanvasDocument
}

export interface TemplateValidationResult {
  valid: boolean
  errors: Array<{ code: string; message: string }>
}
