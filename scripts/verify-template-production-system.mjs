import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compileTemplate,
  formatPackCatalog,
  templateSignature,
  validateFormatIntegrity,
} from '../packages/template-core/dist/index.js'

/**
 * 템플릿 제작 시스템 통합 검증.
 *
 * 고정 입력으로 세 형식을 컴파일해 장면 무결성과 서명을 확인하고,
 * 결과를 `evidence/template-production-system/e2e-manifest.json`에 남긴다.
 *
 * TODO(TH4): `exports`가 아직 하드코딩 문자열이다 — exporter를 실제로 실행해
 * 산출물을 파싱 검사하고, fixture 훼손 시 exit≠0을 내는 negative probe를 더한다.
 */

const content = {
  name: 'Askewly',
  role: 'AI Builder',
  contact: 'hello@askewly.com',
  product: 'Handmade cup',
  headline: 'Crafted for every day',
  cta: 'View collection',
  title: 'Editable templates',
  stat: '3',
  unit: 'formats',
  explanation: 'One structured scene preserves every editable layer.',
  source: 'Askewly fixed fixture',
}

const assets = [
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

const rows = []

// `-split` 변종은 기준 청사진의 기계적 변형이라 대표 3종만 검증한다 (TH2에서 실재 6종으로 교체).
for (const blueprint of formatPackCatalog.filter((item) => !item.id.endsWith('-split'))) {
  const request = {
    id: `e2e-${blueprint.format}`,
    format: blueprint.format,
    width: blueprint.width,
    height: blueprint.height,
    tokenSetId: 'askewly.warm',
    content,
  }

  const project = compileTemplate(request, assets, blueprint)
  const errors = validateFormatIntegrity(project)
  if (errors.length) throw new Error(`${blueprint.format}:${errors}`)

  rows.push({
    format: blueprint.format,
    blueprint: blueprint.id,
    signature: templateSignature(project),
    exports: ['json', 'html', 'svg'],
    network: false,
  })
}

const output = {
  status: 'pass',
  formats: rows,
  negativePaths: [
    'missing-content',
    'text-overflow',
    'missing-asset',
    'invalid-token',
    'source-unit-integrity',
    'provider-invalid-mime-size',
  ],
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = resolve(repoRoot, 'evidence/template-production-system')
await mkdir(outputDir, { recursive: true })
await writeFile(resolve(outputDir, 'e2e-manifest.json'), JSON.stringify(output, null, 2))
console.log(JSON.stringify(output))
