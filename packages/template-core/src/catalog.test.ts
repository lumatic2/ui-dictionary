import { describe, expect, it } from 'vitest'
import { compileTemplate } from './compiler.js'
import { formatPackCatalog } from './blueprints/registry.js'
import { listBlueprints, validateFormatIntegrity } from './catalog.js'
import type { AssetManifestEntry, TemplateRequest } from './types.js'

const assets: AssetManifestEntry[] = [
  {
    id: 'product',
    role: 'product',
    uri: 'x.webp',
    mimeType: 'image/webp',
    width: 1000,
    height: 800,
    provenance: { provider: 'local', source: 'fixture' },
  },
]

const content = {
  name: 'Askewly',
  role: 'Builder',
  contact: 'a@b.co',
  product: 'Cup',
  headline: 'Crafted daily',
  cta: 'Buy',
  title: 'Template facts',
  stat: '3',
  unit: 'formats',
  explanation: 'Structured scenes',
  source: 'Askewly fixture',
}

/** 반복 유닛 청사진용 목록 데이터. 고정 슬롯만 쓰는 청사진은 이걸 무시한다. */
const lists = {
  comparisons: [
    { label: '명함', value: '5 슬롯' },
    { label: '제품 포스터', value: '5 슬롯' },
    { label: '인포그래픽', value: '5 슬롯' },
  ],
}

describe('six-format catalog', () => {
  it('exposes 6 blueprints and compiles all', () => {
    expect(listBlueprints()).toHaveLength(6)

    for (const blueprint of formatPackCatalog) {
      const request: TemplateRequest = {
        id: blueprint.id,
        format: blueprint.format,
        width: blueprint.width,
        height: blueprint.height,
        tokenSetId: 'brand.test',
        content,
        lists,
      }
      const project = compileTemplate(request, assets, blueprint)
      expect(validateFormatIntegrity(project)).toEqual([])
    }
  })

  it('rejects missing infographic source/unit', () => {
    const blueprint = formatPackCatalog.find((item) => item.format === 'infographic')!
    const project = compileTemplate(
      {
        id: 'bad',
        format: 'infographic',
        width: blueprint.width,
        height: blueprint.height,
        tokenSetId: 'x',
        content,
      },
      assets,
      blueprint,
    )

    project.request.content.source = ''
    project.request.content.unit = ''

    expect(validateFormatIntegrity(project)).toEqual(
      expect.arrayContaining(['SOURCE_REQUIRED', 'UNIT_REQUIRED']),
    )
  })
})
