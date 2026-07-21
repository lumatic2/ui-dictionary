import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import { compileTemplate } from './compiler.js'
import { templateSignature } from './signature.js'
import type { AssetManifestEntry, TemplateBlueprint } from './types.js'

/**
 * TH1 회귀 방어망.
 *
 * 가독성 복구(압축 해제)가 동작을 바꾸지 않았음을 증명한다. `signatures.json`은
 * 복구 **전에** 캡처한 기준선이며, 이 테스트가 실패하면 포맷 변경이 조용히
 * 로직을 바꾼 것이므로 해당 step을 되돌려야 한다.
 */

interface SignatureLock {
  content: Record<string, string>
  signatures: Record<string, string>
}

const lockPath = fileURLToPath(new URL('./__fixtures__/signatures.json', import.meta.url))
const lock = JSON.parse(readFileSync(lockPath, 'utf8')) as SignatureLock

const assets: AssetManifestEntry[] = [
  {
    id: 'product',
    role: 'product',
    uri: './fixture.svg',
    mimeType: 'image/svg+xml',
    width: 1000,
    height: 800,
    provenance: { provider: 'local', source: 'offline-fixture' },
  },
]

function blueprintById(id: string): TemplateBlueprint {
  const blueprint = formatPackCatalog.find((candidate) => candidate.id === id)
  if (!blueprint) throw new Error(`기준선이 가리키는 청사진이 카탈로그에 없다: ${id}`)
  return blueprint
}

function signatureFor(blueprint: TemplateBlueprint): string {
  const project = compileTemplate(
    {
      id: `e2e-${blueprint.format}`,
      format: blueprint.format,
      width: blueprint.width,
      height: blueprint.height,
      tokenSetId: 'askewly.warm',
      content: lock.content,
    },
    assets,
    blueprint,
  )
  return templateSignature(project)
}

describe('가독성 복구 전후 서명 대조', () => {
  for (const [blueprintId, expected] of Object.entries(lock.signatures)) {
    it(`${blueprintId}의 서명이 기준선과 같다`, () => {
      expect(signatureFor(blueprintById(blueprintId))).toBe(expected)
    })
  }

  it('기준선 값이 틀리면 대조가 실패한다', () => {
    const [blueprintId] = Object.keys(lock.signatures)
    expect(signatureFor(blueprintById(blueprintId))).not.toBe('tpl-00000000')
  })
})
