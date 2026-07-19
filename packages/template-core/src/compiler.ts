import { assertValidDocument, type CanvasDocument, type CanvasNode, type LayoutConstraints } from '@askewly/canvas-core'
import { selectBlueprint } from './selection.js'
import { fitText } from './text-fitting.js'
import type { TemplateBlueprint, TemplateProject, TemplateRequest, TemplateSlot, AssetManifestEntry } from './types.js'
import { assertValidTemplateProject } from './validation.js'

const layout: LayoutConstraints = { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] }

export type TemplateCompileErrorCode =
  | 'MISSING_SLOT'
  | 'TEXT_OVERFLOW'
  | 'MISSING_ASSET'
  | 'INVALID_TOKEN_BINDING'
  | 'REPEAT_LIST_MISSING'
  | 'REPEAT_COUNT_OUT_OF_RANGE'
  | 'REPEAT_FIELD_MISSING'

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

/**
 * 슬롯 텍스트의 글자 크기·행간을 정한다.
 *
 * 그전에는 `fontSize = 슬롯높이 × 0.45` — 슬롯 **높이**만 보고 글자 수·폭을 보지 않아
 * 긴 문장이 캔버스 밖으로 잘렸다(TH7이 산출물 실물에서 적발). 이제 폭·줄 수를 함께 본다.
 *
 * 최소 크기로도 안 들어가면 `fitText`가 던진다 — 잘린 채 통과시키지 않는다.
 */
function fitSlotText(
  text: string,
  slot: Pick<TemplateSlot, 'id' | 'bounds' | 'maxLines'>,
): { fontSize: number; lineHeight: number } {
  // 상한은 예전 규칙을 그대로 둔다 — 짧은 텍스트는 지금 크기를 유지하고, 긴 것만 줄어든다.
  const maxFontSize = Math.max(18, Math.round(slot.bounds.height * 0.45))
  const fit = fitText(text, slot.bounds, {
    maxFontSize,
    maxLines: slot.maxLines,
    minFontSize: 18,
  })
  return { fontSize: fit.fontSize, lineHeight: fit.lineHeight }
}

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
          fontWeight: BOLD_SLOT_IDS.has(slot.id) ? 700 : 500,
          ...fitSlotText(value, slot),
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

  for (const group of blueprint.repeatGroups ?? []) {
    const units = request.lists?.[group.listKey]
    if (!units) {
      throw new TemplateCompileError(
        'REPEAT_LIST_MISSING',
        `${group.id} requires lists.${group.listKey}`,
      )
    }
    if (units.length < group.minUnits || units.length > group.maxUnits) {
      throw new TemplateCompileError(
        'REPEAT_COUNT_OUT_OF_RANGE',
        `${group.id} accepts ${group.minUnits}-${group.maxUnits} units, got ${units.length}`,
      )
    }

    const horizontal = group.axis === 'horizontal'
    const span = horizontal ? group.bounds.width : group.bounds.height
    const unitSpan = Math.round((span - group.gap * (units.length - 1)) / units.length)

    units.forEach((unit, index) => {
      const offset = index * (unitSpan + group.gap)

      for (const slot of group.unitSlots) {
        for (const binding of Object.values(slot.tokenBindings)) {
          if (!TOKEN_BINDING_PATTERN.test(binding)) {
            throw new TemplateCompileError('INVALID_TOKEN_BINDING', `${group.id}.${slot.id}: ${binding}`)
          }
        }

        const id = `${blueprint.id}:${group.id}:${index}:${slot.id}`
        const bounds = {
          x: group.bounds.x + slot.bounds.x + (horizontal ? offset : 0),
          y: group.bounds.y + slot.bounds.y + (horizontal ? 0 : offset),
          width: slot.bounds.width,
          height: slot.bounds.height,
        }
        const base = {
          id,
          name: `${group.id}-${index + 1}-${slot.id}`,
          parentId: rootId,
          childIds: [],
          bounds,
          layout,
          visible: true,
          locked: false,
          tokenBindings: slot.tokenBindings,
          source: null,
        }

        if (slot.kind === 'text') {
          const value = slot.contentKey ? unit[slot.contentKey]?.trim() : ''
          if (slot.required && !value) {
            throw new TemplateCompileError(
              'REPEAT_FIELD_MISSING',
              `${group.listKey}[${index}] requires ${slot.contentKey}`,
            )
          }
          if (slot.maxChars && value.length > slot.maxChars) {
            throw new TemplateCompileError(
              'TEXT_OVERFLOW',
              `${group.id}.${slot.id}[${index}] exceeds ${slot.maxChars} characters`,
            )
          }
          nodes[id] = {
            ...base,
            kind: 'text',
            text: value,
            textStyle: {
              fontFamily: 'system-ui',
              fontWeight: BOLD_SLOT_IDS.has(slot.id) ? 700 : 500,
              ...fitSlotText(value, { ...slot, bounds }),
            },
          }
        } else if (slot.kind === 'image') {
          const asset = assets.find((candidate) => candidate.role === slot.assetRole)
          if (!asset) {
            if (slot.required) {
              throw new TemplateCompileError(
                'MISSING_ASSET',
                `${group.id}.${slot.id} requires asset role ${slot.assetRole}`,
              )
            }
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

        nodes[rootId].childIds.push(id)
      }
    })
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
    // 장면이 자족적이도록 소재를 문서에 싣는다 — 문서만 오가는 경로에서도 이미지가 산다.
    assets: Object.fromEntries(
      assets.map((asset) => [
        asset.id,
        { uri: asset.uri, mimeType: asset.mimeType, width: asset.width, height: asset.height },
      ]),
    ),
    metadata: { createdAt: now, updatedAt: now, sourceRoot: '.' },
  })
  return assertValidTemplateProject({ schemaVersion: 1, request, assets, scene })
}
