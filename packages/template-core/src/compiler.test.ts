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
