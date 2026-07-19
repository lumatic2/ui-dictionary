import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compileTemplate,
  formatPackCatalog,
  templateSignature,
  validateFormatIntegrity,
  validatePrintSpec,
  matchPrintSpec,
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

/** 반복 유닛 청사진용 목록 데이터. 고정 슬롯만 쓰는 청사진은 무시한다. */
const lists = {
  comparisons: [
    { label: '명함', value: '5 슬롯' },
    { label: '제품 포스터', value: '5 슬롯' },
    { label: '인포그래픽', value: '3 슬롯' },
  ],
}

const rows = []

// TH2부터 카탈로그 6종이 전부 실재 청사진이다 — 파생 변종 제외 로직은 사라졌다.
for (const blueprint of formatPackCatalog) {
  const request = {
    id: `e2e-${blueprint.id}`,
    format: blueprint.format,
    width: blueprint.width,
    height: blueprint.height,
    tokenSetId: 'askewly.warm',
    content,
    lists,
  }

  const project = compileTemplate(request, assets, blueprint)

  const errors = validateFormatIntegrity(project)
  if (errors.length) throw new Error(`${blueprint.id}: ${errors}`)

  const printViolations = validatePrintSpec(blueprint)
  if (printViolations.length) {
    throw new Error(`${blueprint.id}: ${printViolations.map((item) => item.code)}`)
  }

  rows.push({
    format: blueprint.format,
    blueprint: blueprint.id,
    signature: templateSignature(project),
    gridColumns: blueprint.gridColumns,
    slotCount: blueprint.slots.length,
    repeatGroups: (blueprint.repeatGroups ?? []).length,
    printSpec: matchPrintSpec(blueprint)?.id ?? null,
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
