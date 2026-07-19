import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import { hasPrintSpecs } from './print-spec.js'
import { templateFormats, type TemplateBlueprint } from './types.js'

/**
 * TH2 step 2 — 청사진 구별 검증 (프리모템 2의 예방 장치).
 *
 * "구별되게 만들라"는 지시는 좌표를 옮기는 것으로 쉽게 퇴화한다. 이 테스트는 그 퇴화를
 * **통과 불가능하게** 만든다: 같은 포맷의 두 청사진은 슬롯 개수 또는 그리드 열 수가
 * 반드시 달라야 하며, 좌표 차이만으로는 통과할 수 없다.
 */

/** 반복 그룹은 유닛 슬롯 종류 수를 더한다 — 실제 노드 수는 데이터에 따라 더 늘어난다. */
function structuralSlotCount(blueprint: TemplateBlueprint): number {
  const repeated = (blueprint.repeatGroups ?? []).reduce(
    (total, group) => total + group.unitSlots.length,
    0,
  )
  return blueprint.slots.length + repeated
}

/** 같은 포맷·같은 매체의 청사진 — 구별 요구가 성립하는 단위다. */
function byFormat(format: string, medium = 'screen'): TemplateBlueprint[] {
  return formatPackCatalog.filter(
    (blueprint) => blueprint.format === format && blueprint.output.medium === medium,
  )
}

describe('청사진 구별', () => {
  it('카탈로그가 8개이고 id가 중복되지 않는다', () => {
    expect(formatPackCatalog).toHaveLength(8)
    expect(new Set(formatPackCatalog.map((blueprint) => blueprint.id)).size).toBe(8)
  })

  it('포맷마다 화면용 청사진 아키타입이 2개다', () => {
    // 구별 요구는 **같은 매체 안**에서 성립한다. 인쇄판은 같은 아키타입의 다른 지면이지
    // 세 번째 아키타입이 아니므로 이 계수에 넣지 않는다.
    for (const format of templateFormats) {
      expect(byFormat(format)).toHaveLength(format === 'business-card' ? 0 : 2)
    }
  })

  it('포맷마다 인쇄용 청사진이 있다', () => {
    // 인쇄 발주가 목표인 이상 어떤 포맷도 인쇄판 없이 남지 않는다.
    for (const format of templateFormats) {
      expect(hasPrintSpecs(format), `${format}에 인쇄용 청사진이 없다`).toBe(true)
    }
  })

  it('파생 생성기의 흔적(-split)이 남아 있지 않다', () => {
    expect(formatPackCatalog.filter((blueprint) => blueprint.id.endsWith('-split'))).toHaveLength(0)
  })

  it.each(templateFormats)(
    '%s의 두 청사진은 슬롯 개수 또는 그리드 열 수가 다르다',
    (format) => {
      const [a, b] = byFormat(format, format === 'business-card' ? 'print' : 'screen')

      const slotCountDiffers = structuralSlotCount(a) !== structuralSlotCount(b)
      const gridDiffers = a.gridColumns !== b.gridColumns

      expect(
        slotCountDiffers || gridDiffers,
        `${a.id}와 ${b.id}가 구조적으로 같다 — 슬롯 ${structuralSlotCount(a)}/${structuralSlotCount(b)}, 열 ${a.gridColumns}/${b.gridColumns}. 좌표만 옮긴 변주는 두 번째 아키타입이 아니다.`,
      ).toBe(true)
    },
  )

  it('좌표만 다른 쌍은 이 검증을 통과할 수 없다', () => {
    // 프리모템 2가 경고한 퇴화를 직접 재현해, 게이트가 실제로 막는지 확인한다.
    const original = byFormat('business-card', 'print')[0]
    const coordinateOnlyClone: TemplateBlueprint = {
      ...structuredClone(original),
      id: `${original.id}-shifted`,
      slots: original.slots.map((slot) => ({
        ...slot,
        bounds: { ...slot.bounds, x: slot.bounds.x + 24, width: Math.max(80, slot.bounds.width - 48) },
      })),
    }

    const slotCountDiffers =
      structuralSlotCount(original) !== structuralSlotCount(coordinateOnlyClone)
    const gridDiffers = original.gridColumns !== coordinateOnlyClone.gridColumns

    expect(slotCountDiffers || gridDiffers).toBe(false)
  })

  it('각 포맷의 기본 선택(우선순위 최고)은 A안이다', () => {
    const top = (format: string) =>
      formatPackCatalog
        .filter((blueprint) => blueprint.format === format)
        .sort((left, right) => right.priority - left.priority)[0].id

    expect(top('business-card')).toBe('business-card-minimal')
    expect(top('product-poster')).toBe('product-poster-hero')
    expect(top('infographic')).toBe('infographic-stats')
  })
})

describe('청사진별 무결성 요건', () => {
  it('단일 초점 인포그래픽은 수치·단위를 요구하고, 비교형은 요구하지 않는다', async () => {
    const { compileTemplate } = await import('./compiler.js')
    const { validateFormatIntegrity } = await import('./catalog.js')

    const base = {
      format: 'infographic' as const,
      output: { medium: 'screen', reason: '테스트 fixture — 인쇄 규격 대상 아님', safeMarginPx: 24 },
      width: 1200,
      height: 1600,
      tokenSetId: 'brand.test',
    }
    // stat/unit이 비어 있는 콘텐츠 — 단일 초점에는 결격, 비교형에는 무관해야 한다.
    const content = {
      title: '형식별 편집 레이어',
      source: 'Askewly 고정 fixture',
      stat: '',
      unit: '',
      explanation: '구조화된 장면은 모든 편집 레이어를 보존한다.',
    }
    const lists = {
      comparisons: [
        { label: '명함', value: '5 슬롯' },
        { label: '포스터', value: '5 슬롯' },
      ],
    }

    const stats = formatPackCatalog.find((item) => item.id === 'infographic-stats')!
    const comparison = formatPackCatalog.find((item) => item.id === 'infographic-comparison')!

    // 단일 초점은 stat이 필수라 컴파일 단계에서 이미 거부된다.
    expect(() =>
      compileTemplate({ ...base, id: 'stats', content, lists }, [], stats),
    ).toThrowError(expect.objectContaining({ code: 'MISSING_SLOT' }))

    // 비교형은 stat 없이도 컴파일되고 무결성 검사도 통과한다.
    const comparisonProject = compileTemplate({ ...base, id: 'cmp', content, lists }, [], comparison)
    expect(validateFormatIntegrity(comparisonProject)).toEqual([])
  })

  it('비교형도 출처 누락은 거부한다', async () => {
    const { compileTemplate } = await import('./compiler.js')
    const { validateFormatIntegrity } = await import('./catalog.js')

    const comparison = formatPackCatalog.find((item) => item.id === 'infographic-comparison')!
    const project = compileTemplate(
      {
        id: 'cmp-no-source',
        format: 'infographic',
        width: 1200,
        height: 1600,
        tokenSetId: 'brand.test',
        content: { title: '제목', source: 'placeholder' },
        lists: { comparisons: [{ label: 'a', value: '1' }, { label: 'b', value: '2' }] },
      },
      [],
      comparison,
    )

    project.request.content.source = ''
    expect(validateFormatIntegrity(project)).toContain('SOURCE_REQUIRED')
  })
})
