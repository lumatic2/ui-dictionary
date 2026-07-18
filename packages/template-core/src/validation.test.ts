import { describe, expect, it } from 'vitest'
import { businessCardFixture, flatArtworkFixture } from './fixtures.js'
import { validateTemplateProject } from './validation.js'

describe('template contract', () => {
  it('accepts an editable structured scene', () => {
    expect(validateTemplateProject(businessCardFixture())).toEqual({ valid: true, errors: [] })
  })

  it('rejects a flattened image as a template', () => {
    const result = validateTemplateProject(flatArtworkFixture())
    expect(result.valid).toBe(false)
    expect(result.errors.map((error) => error.code)).toContain('FLAT_ARTWORK_NOT_EDITABLE')
  })

  it('rejects missing content and broken asset references', () => {
    const project = businessCardFixture()
    project.request.content.contact = ''
    const portrait = project.scene.nodes.portrait
    if (portrait.kind === 'image') portrait.assetId = 'missing'
    expect(validateTemplateProject(project).errors.map((error) => error.code)).toEqual(expect.arrayContaining(['MISSING_CONTENT', 'BROKEN_ASSET_REFERENCE']))
  })
})
