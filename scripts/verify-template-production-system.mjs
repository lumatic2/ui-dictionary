import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compileTemplate,
  createTemplateProject,
  exportHtml,
  exportJson,
  exportSvg,
  formatPackCatalog,
  templateSignature,
  validateFormatIntegrity,
  validatePrintSpec,
  validateTemplateProject,
  matchPrintSpec,
} from '../packages/template-core/dist/index.js'

/**
 * 템플릿 제작 시스템 통합 검증.
 *
 * 고정 입력으로 세 형식을 컴파일해 장면 무결성과 서명을 확인하고,
 * 결과를 `evidence/template-production-system/e2e-manifest.json`에 남긴다.
 *
 * TH4에서 매니페스트를 **실측화**했다. 그전에는 `exports: ['json','html','svg']`와
 * `negativePaths` 6종이 손으로 적은 문자열이었다 — 내보내기를 한 번도 실행하지 않고,
 * 거부 경로가 실제로 거부하는지도 확인하지 않았다. 계약 선언을 측정 기록으로 착각하게 만든다.
 *
 * 이제 두 필드 다 **실행 결과로만** 채워진다. 손으로 적는 필드는 없다.
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
    exports: runExports(project),
    network: false,
  })
}

/** 내보내기를 **실제로 실행**해 산출물 크기와 해시를 남긴다. 문자열 선언이 아니다. */
function runExports(project) {
  return Object.entries({ json: exportJson, html: exportHtml, svg: exportSvg }).map(
    ([format, exporter]) => {
      const text = exporter(project)
      return {
        format,
        bytes: Buffer.byteLength(text, 'utf8'),
        sha256: createHash('sha256').update(text).digest('hex').slice(0, 12),
      }
    },
  )
}

/**
 * 거부 경로 — 각 probe는 **반드시 던져야** 한다. 던지지 않으면 이 스크립트가 실패한다.
 *
 * 목록만 적고 실행하지 않으면 "거부한다고 선언했으나 실은 통과하는" 상태를 못 본다.
 */
const negativeProbes = [
  {
    id: 'missing-content',
    run: () => createTemplateProject({ blueprintId: 'business-card-minimal', content: { name: '' } }),
  },
  {
    id: 'text-overflow',
    run: () =>
      createTemplateProject({
        blueprintId: 'business-card-minimal',
        content: { name: '가'.repeat(200) },
      }),
  },
  {
    id: 'missing-asset',
    run: () => {
      const project = createTemplateProject({ blueprintId: 'business-card-minimal' })
      const stripped = { ...project, assets: [] }
      const result = validateTemplateProject(stripped)
      if (result.valid) throw new Error('NOT_REJECTED')
      throw new Error(result.errors[0].code)
    },
  },
  {
    id: 'invalid-token',
    run: () => createTemplateProject({ blueprintId: 'business-card-minimal', tokenSetId: 'nope' }),
  },
  {
    id: 'repeat-count-out-of-range',
    run: () =>
      createTemplateProject({
        blueprintId: 'infographic-comparison',
        lists: { comparisons: [{ label: '하나', value: '1' }] },
      }),
  },
]

const negativePaths = negativeProbes.map((probe) => {
  try {
    probe.run()
  } catch (error) {
    const code = error.code ?? error.message.split('\n')[0].split(':')[0]
    if (code === 'NOT_REJECTED') return { id: probe.id, rejected: false, code: null }
    return { id: probe.id, rejected: true, code }
  }
  return { id: probe.id, rejected: false, code: null }
})

const leaked = negativePaths.filter((path) => !path.rejected)
if (leaked.length) {
  console.error(`verify: FAIL — 거부해야 할 경로가 통과했다: ${leaked.map((p) => p.id).join(', ')}`)
  process.exit(1)
}

const output = {
  status: 'pass',
  formats: rows,
  negativePaths,
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = resolve(repoRoot, 'evidence/template-production-system')
await mkdir(outputDir, { recursive: true })
await writeFile(resolve(outputDir, 'e2e-manifest.json'), JSON.stringify(output, null, 2))
console.log(JSON.stringify(output))
