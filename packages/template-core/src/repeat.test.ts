import { describe, expect, it } from 'vitest'
import { TemplateCompileError, compileTemplate } from './compiler.js'
import type { AssetManifestEntry, TemplateBlueprint, TemplateRequest } from './types.js'

/**
 * TH2 step 1 — 반복 유닛 계약.
 *
 * 단일 초점 청사진과 다중 병렬 청사진은 슬롯 **개수와 반복 구조** 자체가 다르다.
 * 이 테스트는 목록 길이만큼 유닛이 생기는지와, 목록이 계약을 어길 때 명시 거부되는지를 본다.
 */

const assets: AssetManifestEntry[] = [
  {
    id: 'product',
    role: 'product',
    uri: 'x.webp',
    mimeType: 'image/webp',
    width: 400,
    height: 400,
    provenance: { provider: 'local', source: 'fixture' },
  },
]

const comparisonBlueprint: TemplateBlueprint = {
  id: 'infographic-comparison-test',
  format: 'infographic',
  output: { medium: 'screen', reason: '테스트 fixture — 인쇄 규격 대상 아님', safeMarginPx: 24 },
  width: 1200,
  height: 1600,
  density: 'balanced',
  priority: 1,
  gridColumns: 3,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1200, height: 1600 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'title',
      kind: 'text',
      contentKey: 'title',
      required: true,
      bounds: { x: 100, y: 100, width: 1000, height: 140 },
      tokenBindings: { color: 'text.primary' },
      maxChars: 80,
    },
    {
      id: 'source',
      kind: 'text',
      contentKey: 'source',
      required: true,
      bounds: { x: 100, y: 1430, width: 1000, height: 60 },
      tokenBindings: { color: 'text.muted' },
      maxChars: 160,
    },
  ],
  repeatGroups: [
    {
      id: 'units',
      listKey: 'comparisons',
      bounds: { x: 100, y: 320, width: 1000, height: 1000 },
      axis: 'vertical',
      gap: 40,
      minUnits: 2,
      maxUnits: 4,
      unitSlots: [
        {
          id: 'label',
          kind: 'text',
          contentKey: 'label',
          required: true,
          bounds: { x: 0, y: 0, width: 1000, height: 80 },
          tokenBindings: { color: 'text.primary' },
          maxChars: 40,
        },
        {
          id: 'value',
          kind: 'text',
          contentKey: 'value',
          required: true,
          bounds: { x: 0, y: 90, width: 1000, height: 120 },
          tokenBindings: { color: 'brand.primary' },
          maxChars: 20,
        },
      ],
    },
  ],
}

const baseRequest: TemplateRequest = {
  id: 'repeat-1',
  format: 'infographic',
  width: 1200,
  height: 1600,
  tokenSetId: 'askewly.warm',
  content: { title: '형식별 편집 레이어', source: 'Askewly 고정 fixture' },
  lists: {
    comparisons: [
      { label: '명함', value: '5 슬롯' },
      { label: '제품 포스터', value: '5 슬롯' },
      { label: '인포그래픽', value: '5 슬롯' },
    ],
  },
}

function compile(request: TemplateRequest) {
  return compileTemplate(request, assets, comparisonBlueprint)
}

describe('반복 유닛 계약', () => {
  it('목록 길이만큼 유닛 슬롯이 생긴다', () => {
    const project = compile(baseRequest)
    const unitNodes = Object.keys(project.scene.nodes).filter((id) => id.includes(':units:'))

    // 유닛 3개 × 유닛당 슬롯 2개
    expect(unitNodes).toHaveLength(6)
    expect(project.scene.nodes['infographic-comparison-test:units:0:label']).toMatchObject({
      kind: 'text',
      text: '명함',
    })
    expect(project.scene.nodes['infographic-comparison-test:units:2:value']).toMatchObject({
      kind: 'text',
      text: '5 슬롯',
    })
  })

  it('유닛이 겹치지 않고 축을 따라 배치된다', () => {
    const project = compile(baseRequest)
    const labelY = [0, 1, 2].map(
      (index) => project.scene.nodes[`infographic-comparison-test:units:${index}:label`].bounds.y,
    )

    expect(labelY[0]).toBeLessThan(labelY[1])
    expect(labelY[1]).toBeLessThan(labelY[2])
    // 유닛 높이 = (1000 - 40*2) / 3 = 307 → 다음 유닛은 307+40 = 347 아래
    expect(labelY[1] - labelY[0]).toBe(347)
  })

  it('반복 유닛도 root의 자식으로 등록된다', () => {
    const project = compile(baseRequest)
    const root = project.scene.nodes['infographic-comparison-test:root']

    expect(root.childIds).toContain('infographic-comparison-test:units:0:label')
    expect(new Set(root.childIds).size).toBe(root.childIds.length)
  })

  it('목록이 없으면 REPEAT_LIST_MISSING으로 거부한다', () => {
    const request = { ...baseRequest, lists: undefined }
    expect(() => compile(request)).toThrowError(
      expect.objectContaining({ code: 'REPEAT_LIST_MISSING' }),
    )
  })

  it('유닛 개수가 범위를 벗어나면 REPEAT_COUNT_OUT_OF_RANGE로 거부한다', () => {
    const tooFew = { ...baseRequest, lists: { comparisons: [{ label: '명함', value: '5' }] } }
    const tooMany = {
      ...baseRequest,
      lists: {
        comparisons: Array.from({ length: 5 }, (_, index) => ({
          label: `항목 ${index}`,
          value: `${index}`,
        })),
      },
    }

    expect(() => compile(tooFew)).toThrowError(
      expect.objectContaining({ code: 'REPEAT_COUNT_OUT_OF_RANGE' }),
    )
    expect(() => compile(tooMany)).toThrowError(
      expect.objectContaining({ code: 'REPEAT_COUNT_OUT_OF_RANGE' }),
    )
  })

  it('유닛에 필수 항목이 빠지면 REPEAT_FIELD_MISSING으로 거부한다', () => {
    const request = {
      ...baseRequest,
      lists: {
        comparisons: [
          { label: '명함', value: '5 슬롯' },
          { label: '포스터', value: '  ' },
        ],
      },
    }

    expect(() => compile(request)).toThrowError(
      expect.objectContaining({ code: 'REPEAT_FIELD_MISSING' }),
    )
  })

  it('던지는 오류는 TemplateCompileError다', () => {
    expect(() => compile({ ...baseRequest, lists: undefined })).toThrowError(TemplateCompileError)
  })
})
