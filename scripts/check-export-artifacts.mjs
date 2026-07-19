import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLValidator } from 'fast-xml-parser'
import { parse as parseHtml } from 'parse5'
import {
  createTemplateProject,
  exportHtml,
  exportJson,
  exportSvg,
  formatPackCatalog,
} from '../packages/template-core/dist/index.js'

/**
 * 내보내기 산출물 게이트 — exporter를 **실제로 실행**해 산출물을 만들고, 범용 파서로 읽어 검사한다.
 *
 * TPS5가 남긴 부채: `verify-template-production-system.mjs`가 매니페스트에
 * `exports: ['json','html','svg']`를 문자열로 적었다. 내보내기를 한 번도 실행하지 않았다.
 *
 * TH9의 교훈을 여기 적용한다 — exporter가 만든 문자열을 exporter의 규칙으로 되읽으면
 * 그 검사는 동어반복이다. 그래서 ① 구조는 **범용 파서**(XML/HTML)로 보고,
 * ② 내용 단언의 근거는 산출물이 아니라 **입력**(요청 내용·토큰 값·청사진 치수)에서 가져온다.
 */

const TOKEN_SET_ID = 'askewly.warm'
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = resolve(repoRoot, 'tmp/th4-exports')

/** 산출물 하나에 대한 검사 결과. `problems`가 비어 있어야 통과다. */
function inspectJson(text, project) {
  const problems = []
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    return { problems: [`JSON 파싱 실패: ${error.message}`] }
  }
  for (const key of ['schemaVersion', 'request', 'assets', 'scene']) {
    if (!(key in parsed)) problems.push(`JSON에 '${key}'가 없다`)
  }
  const nodeCount = Object.keys(parsed.scene?.nodes ?? {}).length
  const expected = Object.keys(project.scene.nodes).length
  if (nodeCount !== expected) problems.push(`JSON 노드 수 ${nodeCount} ≠ 장면 ${expected}`)
  return { problems }
}

function inspectSvg(text, project) {
  const problems = []
  const valid = XMLValidator.validate(text)
  if (valid !== true) {
    return { problems: [`SVG가 well-formed XML이 아니다: ${valid.err?.msg ?? 'unknown'}`] }
  }
  if (!text.startsWith('<svg ')) problems.push('SVG 루트가 <svg>가 아니다')
  // 화면 요소는 장면에서 유도한다 — exporter 출력끼리 비교하지 않는다.
  const painted = countPaintedElements(text)
  const expected = paintableNodes(project).length
  if (painted !== expected) problems.push(`SVG 화면 요소 ${painted} ≠ 그려야 할 노드 ${expected}`)
  return { problems }
}

/** backdrop `<rect x="0" y="0" ...>` 1개를 뺀 나머지 그리기 요소 수. */
function countPaintedElements(svg) {
  const matches = svg.match(/<(text|image|rect)[ \/>]/g) ?? []
  return matches.length - 1
}

function inspectHtml(text, project) {
  const problems = []
  const document = parseHtml(text)
  const main = findElement(document, 'main')
  if (!main) return { problems: ['HTML에 <main> 프레임이 없다'] }
  const children = (main.childNodes ?? []).filter((node) => node.tagName)
  const expected = paintableNodes(project).length
  if (children.length !== expected) {
    problems.push(`HTML 자식 요소 ${children.length} ≠ 그려야 할 노드 ${expected}`)
  }
  return { problems }
}

function findElement(node, tagName) {
  if (node.tagName === tagName) return node
  for (const child of node.childNodes ?? []) {
    const found = findElement(child, tagName)
    if (found) return found
  }
  return null
}

const paintableNodes = (project) => Object.values(project.scene.nodes).filter((node) => node.parentId)

const INSPECTORS = {
  json: { exporter: exportJson, inspect: inspectJson, extension: 'json' },
  html: { exporter: exportHtml, inspect: inspectHtml, extension: 'html' },
  svg: { exporter: exportSvg, inspect: inspectSvg, extension: 'svg' },
}

async function run() {
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  const artifacts = []
  const failures = []

  for (const blueprint of formatPackCatalog) {
    const project = createTemplateProject({ blueprintId: blueprint.id, tokenSetId: TOKEN_SET_ID })

    for (const [format, spec] of Object.entries(INSPECTORS)) {
      const text = spec.exporter(project)
      const path = resolve(outputDir, `${blueprint.id}.${spec.extension}`)
      await writeFile(path, text, 'utf8')

      const { problems } = spec.inspect(text, project)
      artifacts.push({ blueprint: blueprint.id, format, bytes: Buffer.byteLength(text, 'utf8') })
      for (const problem of problems) failures.push(`${blueprint.id} / ${format}: ${problem}`)
    }
  }

  return { artifacts, failures }
}

/**
 * 게이트 자기검사 — 검사기가 훼손을 실제로 잡는지 확인한다.
 *
 * probe를 별도 파일로 빼지 않고 게이트 안에 상주시킨다. 밖에 두면 안 도는 채로 썩는다
 * (은퇴한 경로를 가리킨 채 죽어 있던 `check-line-length.mjs` 선례).
 */
function selfCheck() {
  const project = createTemplateProject({ blueprintId: formatPackCatalog[0].id, tokenSetId: TOKEN_SET_ID })
  const misses = []

  const truncatedSvg = exportSvg(project).slice(0, 400)
  if (inspectSvg(truncatedSvg, project).problems.length === 0) misses.push('잘린 SVG를 통과시킨다')

  const brokenSvg = exportSvg(project).replace('</svg>', '')
  if (inspectSvg(brokenSvg, project).problems.length === 0) misses.push('닫히지 않은 SVG를 통과시킨다')

  const strippedHtml = exportHtml(project).replace(/<div[^>]*>.*?<\/div>/, '')
  if (inspectHtml(strippedHtml, project).problems.length === 0) misses.push('요소가 빠진 HTML을 통과시킨다')

  const brokenJson = exportJson(project).slice(0, -1)
  if (inspectJson(brokenJson, project).problems.length === 0) misses.push('잘린 JSON을 통과시킨다')

  return misses
}

const misses = selfCheck()
if (misses.length) {
  console.error('export-artifacts: FAIL — 검사기가 훼손을 잡지 못한다')
  for (const miss of misses) console.error(`  자기검사: ${miss}`)
  process.exit(1)
}

const { artifacts, failures } = await run()

if (failures.length) {
  console.error(`export-artifacts: FAIL — 산출물 결함 ${failures.length}건`)
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}

console.log(`export-artifacts: PASS (산출물 ${artifacts.length}개 생성·파싱, 자기검사 ${4}건 통과)`)
