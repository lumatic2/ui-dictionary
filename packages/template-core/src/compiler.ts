import { assertValidDocument, type CanvasDocument, type CanvasNode, type LayoutConstraints } from '@askewly/canvas-core'
import { selectBlueprint } from './selection.js'
import type { TemplateBlueprint, TemplateProject, TemplateRequest, AssetManifestEntry } from './types.js'
import { assertValidTemplateProject } from './validation.js'

const layout: LayoutConstraints = { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] }

export type TemplateCompileErrorCode =
  | 'MISSING_SLOT'
  | 'TEXT_OVERFLOW'
  | 'MISSING_ASSET'
  | 'INVALID_TOKEN_BINDING'

export class TemplateCompileError extends Error {
  constructor(
    public readonly code: TemplateCompileErrorCode,
    message: string,
  ) {
    super(message)
  }
}

/** semantic token 참조 형식: `group.name` 또는 `group.sub.name` (소문자·하이픈 허용). */
const TOKEN_BINDING_PATTERN = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/

/** 강조 슬롯은 굵게, 나머지는 보통 두께로 조판한다. */
const BOLD_SLOT_IDS = new Set(['headline', 'title', 'name'])

export function compileTemplate(request: TemplateRequest, assets: AssetManifestEntry[], blueprint: TemplateBlueprint = selectBlueprint(request)): TemplateProject {
  const rootId = `${blueprint.id}:root`
  const childIds = blueprint.slots.map((slot) => `${blueprint.id}:${slot.id}`)
  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      kind: 'frame',
      name: blueprint.id,
      parentId: null,
      childIds,
      bounds: { x: 0, y: 0, width: blueprint.width, height: blueprint.height },
      layout,
      visible: true,
      locked: false,
      tokenBindings: { background: 'surface.canvas' },
      source: null,
      clipContent: true,
    },
  }
  for (const slot of blueprint.slots) {
    for (const binding of Object.values(slot.tokenBindings)) {
      if (!TOKEN_BINDING_PATTERN.test(binding)) {
        throw new TemplateCompileError('INVALID_TOKEN_BINDING', `${slot.id}: ${binding}`)
      }
    }
    const id = `${blueprint.id}:${slot.id}`
    const base = {
      id,
      name: slot.id,
      parentId: rootId,
      childIds: [],
      bounds: slot.bounds,
      layout,
      visible: true,
      locked: false,
      tokenBindings: slot.tokenBindings,
      source: null,
    }

    if (slot.kind === 'text') {
      const value = slot.contentKey ? request.content[slot.contentKey]?.trim() : ''
      if (slot.required && !value) {
        throw new TemplateCompileError('MISSING_SLOT', `${slot.id} requires ${slot.contentKey}`)
      }
      if (slot.maxChars && value.length > slot.maxChars) {
        throw new TemplateCompileError('TEXT_OVERFLOW', `${slot.id} exceeds ${slot.maxChars} characters`)
      }
      nodes[id] = {
        ...base,
        kind: 'text',
        text: value,
        textStyle: {
          fontFamily: 'system-ui',
          fontSize: Math.max(18, Math.round(slot.bounds.height * 0.45)),
          fontWeight: BOLD_SLOT_IDS.has(slot.id) ? 700 : 500,
          lineHeight: Math.max(24, Math.round(slot.bounds.height * 0.58)),
        },
      }
    } else if (slot.kind === 'image') {
      const asset = assets.find((candidate) => candidate.role === slot.assetRole)
      if (!asset && slot.required) {
        throw new TemplateCompileError('MISSING_ASSET', `${slot.id} requires asset role ${slot.assetRole}`)
      }
      if (!asset) {
        // 선택 이미지 슬롯에 소재가 없으면 노드를 만들지 않고 root 자식 목록에서도 뺀다.
        nodes[rootId].childIds = nodes[rootId].childIds.filter((childId) => childId !== id)
        continue
      }
      nodes[id] = { ...base, kind: 'image', assetId: asset.id, alt: slot.id, fit: 'cover', opacity: 1 }
    } else {
      nodes[id] = {
        ...base,
        kind: 'shape',
        shape: slot.shape ?? 'rectangle',
        fill: '#000000',
        stroke: null,
        strokeWidth: 0,
      }
    }
  }
  // 컴파일은 결정론적이어야 하므로 타임스탬프를 고정한다 — 실제 시각을 쓰면 서명이 매 실행마다 바뀐다.
  const now = '2026-07-19T00:00:00.000Z'
  const scene: CanvasDocument = assertValidDocument({
    schemaVersion: 1,
    id: request.id,
    name: blueprint.id,
    revision: 0,
    rootIds: [rootId],
    nodes,
    selection: [],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: request.tokenSetId,
    metadata: { createdAt: now, updatedAt: now, sourceRoot: '.' },
  })
  return assertValidTemplateProject({ schemaVersion: 1, request, assets, scene })
}
