import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import { exportHtml, exportJson, exportSvg } from './exporters.js'
import { createTemplateProject } from './starter.js'
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

  it('반복 유닛 노드도 내보내기에 포함된다', () => {
    const project = createTemplateProject({ blueprintId: 'infographic-comparison' })
    const svg = exportSvg(project)
    for (const unit of ['첫 번째 항목', '두 번째 항목', '세 번째 항목']) {
      expect(svg).toContain(unit)
    }
  })
})
