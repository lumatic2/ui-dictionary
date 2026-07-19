import { formatPackCatalog } from './blueprints/registry.js'
import { createTemplateProject } from './starter.js'
import { measureOverflow, TextFitError } from './text-fitting.js'
import type { TemplateProject } from './types.js'
import { describe, expect, it } from 'vitest'
import { compileTemplate, TemplateCompileError } from './compiler.js'
import { selectBlueprint } from './selection.js'
import { templateSignature } from './signature.js'
import type { AssetManifestEntry, TemplateFormat, TemplateRequest } from './types.js'

const requests: Record<TemplateFormat, TemplateRequest> = {
  'business-card': { id: 'card', format: 'business-card', width: 1050, height: 600, tokenSetId: 'brand.test', content: { name: '전유성', role: 'AI Builder', contact: 'hello@askewly.com' } },
  'product-poster': { id: 'poster', format: 'product-poster', width: 1080, height: 1350, tokenSetId: 'brand.test', content: { product: '흙과 손 매일컵', headline: '손이 빚은 하루의 그릇', cta: '이번 가마 보기' } },
  infographic: { id: 'info', format: 'infographic', width: 1200, height: 1600, tokenSetId: 'brand.test', content: { title: '편집 가능한 템플릿', stat: '3 formats', explanation: '하나의 구조화 장면에서 세 형식을 만듭니다.', source: 'Askewly Design fixture' } },
}
const assets: AssetManifestEntry[] = [
  { id: 'portrait', role: 'portrait', uri: './portrait.svg', mimeType: 'image/svg+xml', width: 240, height: 440, provenance: { provider: 'local', source: 'fixture' } },
  { id: 'product', role: 'product', uri: './product.webp', mimeType: 'image/webp', width: 840, height: 690, provenance: { provider: 'local', source: 'fixture' } },
]

describe('blueprint selection and deterministic compiler', () => {
  it.each(Object.values(requests))('selects and compiles $format deterministically', (request) => {
    const first = compileTemplate(request, assets)
    const second = compileTemplate(structuredClone(request), structuredClone(assets))
    expect(selectBlueprint(request).format).toBe(request.format)
    expect(templateSignature(first)).toBe(templateSignature(second))
  })

  it('rejects unsupported size without a silent fallback', () => {
    expect(() => selectBlueprint({ ...requests['business-card'], width: 999 })).toThrow(/no business-card blueprint/)
  })

  it('rejects overflow, missing asset, and invalid token binding', () => {
    expect(() => compileTemplate({ ...requests['product-poster'], content: { ...requests['product-poster'].content, headline: '가'.repeat(71) } }, assets)).toThrow(TemplateCompileError)
    expect(() => compileTemplate(requests['product-poster'], assets.filter((asset) => asset.role !== 'product'))).toThrow(/requires asset role product/)
    const bad = structuredClone(selectBlueprint(requests.infographic)); bad.slots[0].tokenBindings.fill = 'invalid'
    expect(() => compileTemplate(requests.infographic, assets, bad)).toThrow(/invalid/)
  })
})

describe('텍스트 맞춤 (TH9)', () => {
  it('긴 텍스트는 잘리지 않고 크기가 줄고 줄이 늘어난다', () => {
    const short = createTemplateProject({ blueprintId: 'product-poster-editorial' })
    const long = createTemplateProject({
      blueprintId: 'product-poster-editorial',
      content: { headline: '아주 길고 긴 헤드라인 문장을 넣어 크기가 실제로 줄어드는지 확인합니다' },
    })

    const size = (project: TemplateProject) =>
      (project.scene.nodes['product-poster-editorial:headline'] as { textStyle: { fontSize: number } })
        .textStyle.fontSize

    expect(size(long)).toBeLessThan(size(short))
  })

  it('6청사진 어디에도 넘치는 텍스트가 없다', () => {
    for (const blueprint of formatPackCatalog) {
      const project = createTemplateProject({ blueprintId: blueprint.id })
      for (const node of Object.values(project.scene.nodes)) {
        if (node.kind !== 'text') continue
        const report = measureOverflow(node.text, node.textStyle.fontSize, node.bounds)
        expect(report.width + report.height, `${blueprint.id} / ${node.id}`).toBe(0)
      }
    }
  })

  it('최소 크기로도 안 들어가면 잘린 채 통과하지 않고 거부한다', () => {
    expect(() =>
      createTemplateProject({
        blueprintId: 'business-card-minimal',
        // 명함 연락처 슬롯(가로 640 × 세로 44)에 절대 안 들어가는 길이.
        content: { contact: '이 문장은 명함의 좁은 연락처 슬롯에 최소 크기로도 절대 들어가지 않는 아주 긴 한국어 문장입니다 정말로 길어요 계속 이어집니다' },
      }),
    ).toThrowError(TextFitError)
  })
})
