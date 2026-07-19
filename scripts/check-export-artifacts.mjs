import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { parse as parseHtml } from 'parse5'
import {
  createTemplateProject,
  exportHtml,
  exportJson,
  exportSvg,
  formatPackCatalog,
  printSpecs,
  resolveTokenSet,
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

// ─── 기대값 — 근거를 산출물이 아니라 입력에서 가져온다 ────────────────────────

/**
 * 청사진 선언 + 요청 내용 + 토큰 세트에서 "산출물에 있어야 할 것"을 유도한다.
 *
 * 셋 다 exporter가 만든 값이 아니다. 청사진은 손으로 쓴 선언이고, 내용은 요청이며,
 * 색·글꼴은 `tokens.ts`가 정본이다. exporter가 무엇을 냈는지는 보지 않는다.
 */
function expectationsFor(blueprint, project) {
  const set = resolveTokenSet(project.request.tokenSetId)
  if (!set) throw new Error(`토큰 세트 '${project.request.tokenSetId}'를 찾을 수 없다`)

  const texts = []
  const colors = new Set()
  const fonts = new Set()
  const assetUris = new Set()

  const canvas = set.tokens['surface.canvas']?.value
  if (canvas) colors.add(canvas)

  const readSlot = (slot, content) => {
    for (const binding of [slot.tokenBindings?.fill, slot.tokenBindings?.color]) {
      const value = binding ? set.tokens[binding]?.value : null
      if (value) colors.add(value)
    }
    const family = slot.tokenBindings?.fontFamily
      ? set.tokens[slot.tokenBindings.fontFamily]?.value
      : null
    if (family) fonts.add(family)

    if (slot.kind === 'text' && slot.contentKey) {
      const value = content?.[slot.contentKey]
      if (value) texts.push({ slot: slot.id, value })
    }
    if (slot.kind === 'image' && slot.assetRole) {
      const asset = project.assets.find((entry) => entry.role === slot.assetRole)
      if (asset) assetUris.add(asset.uri)
    }
  }

  for (const slot of blueprint.slots) readSlot(slot, project.request.content)

  for (const group of blueprint.repeatGroups ?? []) {
    const list = project.request.lists?.[group.listKey] ?? []
    const units = list.slice(0, group.maxUnits)
    for (const unit of units) for (const slot of group.unitSlots) readSlot(slot, unit)
  }

  return { texts, colors: [...colors], fonts: [...fonts], assetUris: [...assetUris], set }
}

/** 공백을 지운 비교용 문자열. SVG는 줄바꿈으로 tspan이 쪼개지므로 이어붙여 본다. */
const squash = (value) => value.replace(/\s+/g, '')

/** 기대 텍스트·색·글꼴·자산이 산출물에 실재하는지. 형식 무관 공통 판정. */
function checkPresence(expectations, { text, attributes }) {
  const problems = []
  const haystack = squash(text)
  const blob = attributes.join('|')

  for (const entry of expectations.texts) {
    if (!haystack.includes(squash(entry.value))) {
      problems.push(`요청 내용 '${entry.slot}'(${entry.value})가 산출물에 없다`)
    }
  }
  for (const color of expectations.colors) {
    if (!blob.includes(color)) problems.push(`토큰 색 ${color}이 산출물에 없다`)
  }
  for (const font of expectations.fonts) {
    if (!blob.includes(font)) problems.push(`토큰 글꼴 ${font}이 산출물에 없다`)
  }
  for (const uri of expectations.assetUris) {
    if (!blob.includes(uri)) problems.push(`자산 URI ${uri}가 산출물에 없다`)
  }
  return problems
}

/** SVG를 XML 트리로 읽어 텍스트와 속성값을 모은다. */
function readSvgDocument(svg) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true })
  const text = []
  const attributes = []
  const walk = (nodes) => {
    for (const node of nodes ?? []) {
      for (const [key, value] of Object.entries(node)) {
        if (key === ':@') {
          for (const attribute of Object.values(value)) attributes.push(String(attribute))
        } else if (key === '#text') {
          text.push(String(value))
        } else if (Array.isArray(value)) {
          walk(value)
        }
      }
    }
  }
  walk(parser.parse(svg))
  return { text: text.join(''), attributes }
}

/** HTML을 parse5 트리로 읽어 텍스트와 속성값을 모은다(style 속성 포함). */
function readHtmlDocument(html) {
  const text = []
  const attributes = []
  const walk = (node) => {
    if (node.nodeName === '#text') text.push(node.value)
    for (const attribute of node.attrs ?? []) attributes.push(attribute.value)
    for (const child of node.childNodes ?? []) walk(child)
  }
  walk(parseHtml(html))
  return { text: text.join(''), attributes }
}

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

function inspectSvg(text, project, expectations, blueprint) {
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

  const document = readSvgDocument(text)
  problems.push(...checkPresence(expectations, document))
  problems.push(...checkSheetGeometry(text, blueprint))
  return { problems }
}

/**
 * 지면 기하 검사 — 기대값을 **규격 mm 표에서 유도한다.**
 *
 * exporter가 계산한 값을 되읽어 비교하면 서로 같은 말을 하는 검사가 된다. 여기서는
 * `printSpecs`의 mm과 청사진 치수만 가지고 독립적으로 계산한다: 재단선 바깥은
 * 도련 한 겹 + 재단 표시 한 겹이므로, 지면은 재단 크기보다 사방 2×도련만큼 크다.
 */
function checkSheetGeometry(text, blueprint) {
  const problems = []
  if (blueprint.output.medium !== 'print') {
    // 화면용에 인쇄 요건이 새어 들어가면 안 된다.
    if (text.includes('<line ')) problems.push('화면용 SVG에 재단 표시가 있다')
    if (!new RegExp(`width="${blueprint.width}"`).test(text)) {
      problems.push(`SVG 폭이 청사진 ${blueprint.width}과 다르다`)
    }
    return problems
  }

  const spec = printSpecs[blueprint.output.printSpecId]
  if (!spec) return [`선언한 규격 ${blueprint.output.printSpecId}가 규격 표에 없다`]

  const portrait = blueprint.height > blueprint.width
  const trimWidthMm = portrait ? Math.min(spec.trim.width, spec.trim.height) : Math.max(spec.trim.width, spec.trim.height)
  const bleed = Math.round(spec.bleedMm / (trimWidthMm / blueprint.width))
  const sheet = { width: blueprint.width + bleed * 4, height: blueprint.height + bleed * 4 }

  if (!new RegExp(`width="${sheet.width}" height="${sheet.height}"`).test(text)) {
    problems.push(`SVG 지면이 규격에서 유도한 ${sheet.width}×${sheet.height}과 다르다`)
  }
  if (!text.includes(`viewBox="${-bleed * 2} ${-bleed * 2} ${sheet.width} ${sheet.height}"`)) {
    problems.push('viewBox 원점이 재단선 바깥 여백만큼 밀려 있지 않다')
  }
  // 배경이 도련까지 나가는가 — 재단 오차로 흰 띠가 생기는 결함을 막는 유일한 장치다.
  if (!text.includes(`<rect x="${-bleed}" y="${-bleed}" width="${blueprint.width + bleed * 2}" height="${blueprint.height + bleed * 2}"`)) {
    problems.push(`배경이 도련(${spec.bleedMm}mm ≈ ${bleed}px)까지 확장되지 않았다`)
  }
  // exporter 자체 backdrop이 도련 상자를 그리므로, 위 검사만으로는 **장면의** 배경 노드가
  // 재단선에서 멈춘 걸 잡지 못한다(probe가 이 구멍을 드러냈다). 재단 크기 그대로인
  // 전면 사각형이 남아 있으면 그게 확장되지 않은 배경이다.
  if (text.includes(`<rect x="0" y="0" width="${blueprint.width}" height="${blueprint.height}"`)) {
    problems.push('배경이 재단선에서 멈춰 있다 — 도련까지 확장되지 않았다')
  }
  const marks = text.match(/<line /g) ?? []
  if (marks.length !== 8) problems.push(`재단 표시가 8개가 아니라 ${marks.length}개다`)
  return problems
}

/** backdrop `<rect x="0" y="0" ...>` 1개를 뺀 나머지 그리기 요소 수. */
function countPaintedElements(svg) {
  const matches = svg.match(/<(text|image|rect)[ \/>]/g) ?? []
  return matches.length - 1
}

function inspectHtml(text, project, expectations, blueprint) {
  const problems = []
  const main = findElement(parseHtml(text), 'main')
  if (!main) return { problems: ['HTML에 <main> 프레임이 없다'] }
  const children = (main.childNodes ?? []).filter((node) => node.tagName)
  const expected = paintableNodes(project).length
  if (children.length !== expected) {
    problems.push(`HTML 자식 요소 ${children.length} ≠ 그려야 할 노드 ${expected}`)
  }

  problems.push(...checkPresence(expectations, readHtmlDocument(text)))
  const frame = (main.attrs ?? []).find((attribute) => attribute.name === 'style')?.value ?? ''
  if (!frame.includes(`width:${blueprint.width}px`)) {
    problems.push(`HTML 프레임 폭이 청사진 ${blueprint.width}과 다르다`)
  }
  if (!frame.includes(`height:${blueprint.height}px`)) {
    problems.push(`HTML 프레임 높이가 청사진 ${blueprint.height}과 다르다`)
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
    const expectations = expectationsFor(blueprint, project)

    for (const [format, spec] of Object.entries(INSPECTORS)) {
      const text = spec.exporter(project)
      const path = resolve(outputDir, `${blueprint.id}.${spec.extension}`)
      await writeFile(path, text, 'utf8')

      const { problems } = spec.inspect(text, project, expectations, blueprint)
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
  const blueprint = formatPackCatalog[0]
  const project = createTemplateProject({ blueprintId: blueprint.id, tokenSetId: TOKEN_SET_ID })
  const expectations = expectationsFor(blueprint, project)
  const misses = []
  let probes = 0
  const passes = (inspect, text) => {
    probes += 1
    return inspect(text, project, expectations, blueprint).problems.length === 0
  }

  // ① 형식 훼손 — 범용 파서가 잡아야 한다.
  if (passes(inspectSvg, exportSvg(project).slice(0, 400))) misses.push('잘린 SVG를 통과시킨다')
  if (passes(inspectSvg, exportSvg(project).replace('</svg>', ''))) misses.push('닫히지 않은 SVG를 통과시킨다')
  if (passes(inspectHtml, exportHtml(project).replace(/<div[^>]*>.*?<\/div>/, ''))) {
    misses.push('요소가 빠진 HTML을 통과시킨다')
  }
  if (passes(inspectJson, exportJson(project).slice(0, -1))) misses.push('잘린 JSON을 통과시킨다')

  // ② 내용 훼손 — 형식은 멀쩡한데 값이 틀린 경우. 입력 유래 단언이 유일한 방어선이다.
  const color = expectations.colors[0]
  if (passes(inspectSvg, exportSvg(project).replaceAll(color, '#ff00ff'))) {
    misses.push(`SVG의 토큰 색 ${color} 치환을 통과시킨다`)
  }
  if (passes(inspectHtml, exportHtml(project).replaceAll(color, '#ff00ff'))) {
    misses.push(`HTML의 토큰 색 ${color} 치환을 통과시킨다`)
  }

  const phrase = expectations.texts[0]?.value
  if (phrase && passes(inspectSvg, exportSvg(project).replaceAll(phrase, ''))) {
    misses.push(`SVG의 요청 문자열 '${phrase}' 삭제를 통과시킨다`)
  }
  if (phrase && passes(inspectHtml, exportHtml(project).replaceAll(phrase, ''))) {
    misses.push(`HTML의 요청 문자열 '${phrase}' 삭제를 통과시킨다`)
  }

  const uri = expectations.assetUris[0]
  if (uri && passes(inspectSvg, exportSvg(project).replaceAll(uri, ''))) {
    misses.push('SVG의 자산 URI 삭제를 통과시킨다')
  }
  if (uri && passes(inspectHtml, exportHtml(project).replaceAll(uri, ''))) {
    misses.push('HTML의 자산 URI 삭제를 통과시킨다')
  }

  // 훼손 대상이 애초에 없으면 probe가 조용히 사라진다 — 그것도 실패다.
  if (!color) misses.push('기대 토큰 색이 0개다 — 색 probe가 무의미하다')
  if (!phrase) misses.push('기대 요청 문자열이 0개다 — 내용 probe가 무의미하다')
  if (!uri) misses.push('기대 자산 URI가 0개다 — 자산 probe가 무의미하다')

  return { misses, probes }
}

const { misses, probes } = selfCheck()
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

console.log(`export-artifacts: PASS (산출물 ${artifacts.length}개 생성·파싱, 자기검사 ${probes}건 통과)`)
