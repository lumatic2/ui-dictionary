import { describe, expect, it } from 'vitest'
import { studioProjects } from './fixtures.js'
import { exportHtml, exportJson, exportSvg } from './exporters.js'
describe('exports',()=>{it.each(Object.values(studioProjects))('exports $request.format',project=>{expect(JSON.parse(exportJson(project)).scene.id).toBe(project.scene.id);expect(exportHtml(project)).toContain('<main');expect(exportSvg(project)).toContain('<svg')})})
