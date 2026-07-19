import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import { exportHtml, exportJson, exportSvg, TemplateExportError } from './exporters.js'
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
      expect(exportSvg(project)).toContain(`viewBox="0 0 ${width} ${height}"`)
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
    // 컴파일러가 넣는 #000000 리터럴이 그대로 새어나가면 안 된다.
    expect(svg).not.toContain('#000000')
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
