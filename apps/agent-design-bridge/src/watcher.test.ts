import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { afterEach, describe, expect, it } from 'vitest'
import { BridgeSession, sourceHash } from './session.js'
import { SourceWatcher } from './watcher.js'

const roots: string[] = []
const watchers: SourceWatcher[] = []
const nextTurn = () => new Promise<void>((resolve) => setImmediate(resolve))
const waitForWatcherReady = () => new Promise<void>((resolve) => setTimeout(resolve, 50))

afterEach(async () => {
  for (const watcher of watchers.splice(0)) watcher.close()
  await nextTurn()
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

async function setup() {
  const root = mkdtempSync(join(tmpdir(), 'agent-design-watcher-'))
  roots.push(root)
  const document = createDocumentFixture(1000)
  const component = firstComponent(document)
  const file = join(root, component.source.file)
  mkdirSync(dirname(file), { recursive: true })
  const before = `export function Fixture1() { return <article data-agent-design-id="${component.id}">Before</article> }\n`
  writeFileSync(file, before)
  const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
  const watcher = new SourceWatcher(session, { debounceMs: 10 })
  watchers.push(watcher)
  watcher.start()
  await waitForWatcherReady()
  return { session, component, file, before }
}

function nextWatcherEvent(session: BridgeSession): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { unsubscribe(); reject(new Error('watcher event timeout')) }, 2000)
    const unsubscribe = session.subscribe((event) => {
      if (event.actor !== 'watcher') return
      clearTimeout(timeout)
      unsubscribe()
      resolve()
    })
  })
}

describe('source watcher reverse synchronization', () => {
  it('promotes a stable direct file edit into one watcher transaction', async () => {
    const { session, component, file } = await setup()
    const event = nextWatcherEvent(session)
    writeFileSync(file, `export function Fixture1() { return <article data-agent-design-id="${component.id}" data-agent-design-name="Live hero">Watcher update</article> }\n`)
    await event
    expect(session.snapshot().document.nodes[component.id]).toMatchObject({ name: 'Live hero', props: { label: 'Watcher update' } })
    expect(session.snapshot()).toMatchObject({ revision: 1, cursor: 1 })
    expect(session.auditLog()).toHaveLength(1)
  })

  it('suppresses the filesystem echo of a bridge-origin source transaction', async () => {
    const { session, component, file, before } = await setup()
    const snapshot = session.snapshot()
    const after = `export function Fixture1() { return <article data-agent-design-id="${component.id}">Bridge update</article> }\n`
    session.applySourcePatch({
      transactionId: 'tx-bridge-source', actor: 'codex', baseRevision: snapshot.revision, beforeHash: snapshot.hash,
      file: component.source.file, beforeFileHash: sourceHash(before), content: after, at: '2026-07-10T06:10:00.000Z',
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(readFileSync(file, 'utf8')).toBe(after)
    expect(session.snapshot()).toMatchObject({ revision: 1, cursor: 1 })
    expect(session.auditLog()).toHaveLength(1)
  })
})
