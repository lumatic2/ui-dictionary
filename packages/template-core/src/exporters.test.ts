import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import { blueprintOf } from './catalog.js'
import { exportHtml, exportJson, exportSvg, TemplateExportError } from './exporters.js'
import { printSheetGeometry } from './print-spec.js'
import { createTemplateProject } from './starter.js'
import { resolveTokenSet } from './tokens.js'
import { validateTemplateProject } from './validation.js'

/**
 * 내보내기 — 스튜디오에서 이관(TH3 step-3). 기존 계약을 그대로 지킨다.
 */

const projects = formatPackCatalog.map((blueprint) =>
  createTemplateProject({ blueprintId: blueprint.id }),
)

describe('내보내기 3종', () => {
  it.each(projects)('$request.id을 세 형식으로 낸다', (project) => {
    expect(JSON.parse(exportJson(project)).scene.id).toBe(project.scene.id)
    expect(exportHtml(project)).toContain('<main')
    expect(exportSvg(project)).toContain('<svg')
  })

  it('JSON은 왕복 가능한 정본이다 — 되읽으면 같은 프로젝트다', () => {
    for (const project of projects) {
      const restored = JSON.parse(exportJson(project))
      expect(restored).toEqual(project)
      expect(validateTemplateProject(restored).valid).toBe(true)
    }
  })

  it('HTML·SVG는 캔버스 크기를 그대로 쓴다', () => {
    for (const project of projects) {
      const { width, height } = project.request
      expect(exportHtml(project)).toContain(`width:${width}px`)
      // 인쇄용은 지면이 재단 크기보다 크다(도련 + 재단 표시). 화면용만 캔버스와 같다.
      const blueprint = blueprintOf(project)!
      if (blueprint.output.medium === 'screen') {
        expect(exportSvg(project)).toContain(`viewBox="0 0 ${width} ${height}"`)
      } else {
        const { margin, sheet } = printSheetGeometry(blueprint)!
        expect(exportSvg(project)).toContain(
          `viewBox="${-margin} ${-margin} ${sheet.width} ${sheet.height}"`,
        )
      }
    }
  })

  it('텍스트의 꺾쇠·따옴표가 이스케이프된다', () => {
    const project = createTemplateProject({
      blueprintId: 'business-card-minimal',
      content: { name: '<script>"위험"</script>' },
    })
    const html = exportHtml(project)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(exportSvg(project)).not.toContain('<script>')
  })

  it('글꼴 스택의 따옴표가 style 속성을 끊지 않는다', () => {
    // `Georgia, "Noto Serif KR", serif`를 날것으로 넣으면 style="..."이 그 자리에서 닫힌다.
    // TH4 산출물 게이트가 적발: 파서가 style을 앞부분만 읽어 글꼴이 사라졌다.
    const project = createTemplateProject({ blueprintId: 'business-card-minimal' })
    const html = exportHtml(project)
    expect(html).toContain('font-family:Georgia, &quot;Noto Serif KR&quot;, serif')
    expect(html).not.toContain('font-family:Georgia, "Noto Serif KR"')
  })

  it('반복 유닛 노드도 내보내기에 포함된다', () => {
    const project = createTemplateProject({ blueprintId: 'infographic-comparison' })
    const svg = exportSvg(project)
    for (const unit of ['첫 번째 항목', '두 번째 항목', '세 번째 항목']) {
      expect(svg).toContain(unit)
    }
  })
})

describe('내보내기 충실도 — 화면과 같은 값을 담는가', () => {
  it('6청사진의 SVG·HTML에 그 청사진이 쓰는 토큰의 실제 색 값이 들어간다', () => {
    const warm = resolveTokenSet('askewly.warm')!

    for (const blueprint of formatPackCatalog) {
      const project = createTemplateProject({ blueprintId: blueprint.id })
      const svg = exportSvg(project)
      const html = exportHtml(project)

      // 이 청사진이 실제로 참조하는 바인딩만 검사한다 — 안 쓰는 토큰을 요구하면 거짓 통과가 된다.
      const bindings = new Set<string>()
      for (const node of Object.values(project.scene.nodes)) {
        for (const binding of Object.values(node.tokenBindings)) {
          if (binding && warm.tokens[binding]?.kind === 'color') bindings.add(binding)
        }
      }
      expect(bindings.size).toBeGreaterThan(0)

      for (const binding of bindings) {
        const value = warm.tokens[binding].value
        expect(svg, `${blueprint.id} svg / ${binding}`).toContain(value)
        expect(html, `${blueprint.id} html / ${binding}`).toContain(value)
      }
    }
  })

  it('토큰 세트를 바꾸면 내보낸 값도 함께 바뀐다', () => {
    const warm = exportSvg(createTemplateProject({ blueprintId: 'business-card-minimal' }))
    const ink = exportSvg(
      createTemplateProject({ blueprintId: 'business-card-minimal', tokenSetId: 'askewly.ink' }),
    )

    expect(warm).toContain('#2f7d4f')
    expect(ink).toContain('#7fd4a0')
    expect(ink).not.toContain('#2f7d4f')
  })

  it('타이포가 산출물에 실린다', () => {
    const svg = exportSvg(createTemplateProject({ blueprintId: 'business-card-minimal' }))
    expect(svg).toContain('font-weight="700"')
    expect(svg).toContain('Georgia')
  })

  it('도형 채움은 리터럴이 아니라 토큰이 정한다', () => {
    const svg = exportSvg(createTemplateProject({ blueprintId: 'business-card-minimal' }))
    // 컴파일러가 넣는 #000000 리터럴이 채움으로 새어나가면 안 된다.
    // (재단 표시 선은 검정이 맞다 — 그건 작품이 아니라 인쇄 지시다.)
    expect(svg).not.toContain('fill="#000000"')
  })

  it('토큰이 해석되지 않으면 검은색으로 때우지 않고 거부한다', () => {
    const project = createTemplateProject({ blueprintId: 'business-card-minimal' })
    project.request.tokenSetId = 'warm.craft'

    expect(() => exportSvg(project)).toThrowError(TemplateExportError)
    expect(() => exportHtml(project)).toThrowError(TemplateExportError)
  })

  it('세트에 없는 바인딩을 참조하면 노드를 지목해 거부한다', () => {
    const project = createTemplateProject({ blueprintId: 'business-card-minimal' })
    const nodeId = Object.keys(project.scene.nodes).find(
      (id) => project.scene.nodes[id].tokenBindings?.color,
    )!
    project.scene.nodes[nodeId].tokenBindings.color = 'text.ghost'

    try {
      exportSvg(project)
      throw new Error('던졌어야 한다')
    } catch (error) {
      expect((error as TemplateExportError).code).toBe('TOKEN_NOT_DEFINED')
      expect((error as TemplateExportError).message).toContain(nodeId)
    }
  })
})

describe('도련과 재단 표시 (TH11 step-3)', () => {
  const printProject = () => createTemplateProject({ blueprintId: 'business-card-vertical' })
  const screenProject = () => createTemplateProject({ blueprintId: 'product-poster-hero' })

  it('인쇄용 SVG 지면이 재단 크기 + 도련 + 표시 자리만큼 크다', () => {
    const project = printProject()
    const svg = exportSvg(project)
    const geometry = printSheetGeometry(blueprintOf(project)!)!

    // 규격 mm에서 유도한다 — exporter 출력끼리 비교하지 않는다.
    // 세로 명함 600px = 50mm이므로 3mm 도련 = 36px, 표시 자리도 36px.
    expect(geometry.bleed).toBe(36)
    expect(geometry.margin).toBe(72)
    expect(svg).toContain(`width="${600 + 144}"`)
    expect(svg).toContain(`height="${1050 + 144}"`)
  })

  it('배경이 재단선을 넘어 도련까지 확장된다', () => {
    const svg = exportSvg(printProject())
    // backdrop이 -36에서 시작해 672(600+72) 폭으로 나간다 — 재단 오차가 나도 흰 띠가 없다.
    expect(svg).toContain('<rect x="-36" y="-36" width="672" height="1122"')
  })

  it('재단 표시가 네 모서리에 선 8개로 그려진다', () => {
    const marks = exportSvg(printProject()).match(/<line /g) ?? []
    expect(marks).toHaveLength(8)
  })

  it('재단 표시가 도련 안으로 들어오지 않는다', () => {
    // 도련 안에 그리면 그 선이 작품과 함께 인쇄된다. 선은 -72..-36 구간에만 있어야 한다.
    const svg = exportSvg(printProject())
    const lines = [...svg.matchAll(/<line x1="(-?\d+)" y1="(-?\d+)" x2="(-?\d+)" y2="(-?\d+)"/g)]
    expect(lines).toHaveLength(8)
    for (const [, x1, y1, x2, y2] of lines) {
      const horizontal = y1 === y2
      const [from, to] = horizontal ? [Number(x1), Number(x2)] : [Number(y1), Number(y2)]
      const limit = horizontal ? 600 : 1050
      const insideBleed = (value: number) => value > -36 && value < limit + 36
      expect(insideBleed(from) || insideBleed(to), `${x1},${y1} → ${x2},${y2}`).toBe(false)
    }
  })

  it('화면용 산출물은 그대로다 — 인쇄 요건을 얹지 않는다', () => {
    const svg = exportSvg(screenProject())
    expect(svg).toContain('viewBox="0 0 1080 1350"')
    expect(svg).not.toContain('<line ')
  })
})
