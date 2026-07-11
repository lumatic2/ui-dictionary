import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(__dirname, 'styles.css'), 'utf-8')

describe('workspace toolbar density', () => {
  it('lets toolbar sections wrap onto new lines instead of overflowing horizontally', () => {
    const rule = css.match(/\.document-actions\s*\{[^}]*\}/)
    expect(rule).not.toBeNull()
    expect(rule?.[0]).toMatch(/flex-wrap:\s*wrap/)
  })

  it('keeps each toolbar group intact as a single wrap unit', () => {
    const rule = css.match(/\.toolbar-group\s*\{[^}]*\}/)
    expect(rule).not.toBeNull()
    expect(rule?.[0]).toMatch(/flex:\s*0 0 auto/)
  })
})
