import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { describe, expect, it } from 'vitest'
import { reconcileDocumentFromSource } from './sourceReconcile.js'

describe('supported React source reconciliation', () => {
  it('maps stable JSX identity and static content into the canonical component', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const source = `export function Fixture1() { return <article data-agent-design-id="${component.id}" data-agent-design-name="Hero card">Updated CTA</article> }`
    const next = reconcileDocumentFromSource(document, component.source.file, source, '2026-07-10T06:00:00.000Z')
    expect(next.nodes[component.id]).toMatchObject({ name: 'Hero card', props: { label: 'Updated CTA' } })
    expect(next.revision).toBe(1)
  })

  it('does not treat dynamic JSX children as a static label', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const source = `export function Fixture1({ label }) { return <article data-agent-design-id="${component.id}">{label}</article> }`
    const next = reconcileDocumentFromSource(document, component.source.file, source, '2026-07-10T06:00:00.000Z')
    expect((next.nodes[component.id] as typeof component).props.label).toBe(component.props.label)
  })
})
