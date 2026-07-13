import { mkdir, mkdtemp, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { TrustedProjectRegistry } from '../src/project-registry'
import { ProjectController, type ProjectSupervisor } from '../src/project-controller'
import type { BridgeStartConfig } from '../src/bridge-supervisor'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

async function fixture() {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'agent-design-trust-')))
  roots.push(root)
  const userData = join(root, 'user-data')
  const project = join(root, 'project')
  const outside = join(root, 'outside')
  await mkdir(join(project, 'src'), { recursive: true })
  await mkdir(outside)
  await writeFile(join(project, 'src', 'App.tsx'), 'export function App() {}')
  await writeFile(join(outside, 'secret.txt'), 'outside')
  const registry = new TrustedProjectRegistry(userData, () => '2026-07-11T01:00:00.000Z')
  await registry.initialize()
  return { root, userData, project, outside, registry }
}

describe('trusted project registry', () => {
  it('returns redacted summaries and rechecks contained real paths', async () => {
    const { project, registry } = await fixture()
    const summary = await registry.trust(project)
    expect(summary).toMatchObject({ displayName: 'project', lastOpenedAt: '2026-07-11T01:00:00.000Z' })
    expect(JSON.stringify(summary)).not.toContain(project)
    await expect(registry.resolveRoot(summary.id)).resolves.toBe(project)
    await expect(registry.resolveExisting(summary.id, 'src/App.tsx')).resolves.toBe(join(project, 'src', 'App.tsx'))
    await expect(registry.resolveExisting(summary.id, '../outside/secret.txt')).rejects.toThrow('PROJECT_PATH_ESCAPE')
  })

  it('rejects a junction that resolves outside the trusted root', async () => {
    const { project, outside, registry } = await fixture()
    const summary = await registry.trust(project)
    await symlink(outside, join(project, 'linked-outside'), 'junction')
    await expect(registry.resolveExisting(summary.id, 'linked-outside/secret.txt')).rejects.toThrow('PROJECT_PATH_ESCAPE')
  })

  it('rejects replacement of a previously trusted root identity', async () => {
    const { root, project, registry } = await fixture()
    const summary = await registry.trust(project)
    await rename(project, join(root, 'project-old'))
    await mkdir(project)
    await expect(registry.resolveRoot(summary.id)).rejects.toThrow('PROJECT_ROOT_CHANGED')
  })

  it('quarantines a corrupt registry instead of trusting its paths', async () => {
    const { userData, registry } = await fixture()
    await writeFile(join(userData, 'trusted-projects.json'), '{broken')
    await expect(registry.recent()).rejects.toThrow('TRUSTED_PROJECT_REGISTRY_CORRUPT')
    await expect(registry.recent()).resolves.toEqual([])
  })

  it('starts the supervisor from a main-owned trusted root and recovery directory', async () => {
    const { project, userData, registry } = await fixture()
    const starts: BridgeStartConfig[] = []
    const supervisor: ProjectSupervisor = {
      stop: async () => undefined,
      start: (config) => { starts.push(config) },
    }
    const controller = new ProjectController(registry, supervisor, () => '2026-07-11T01:00:00.000Z')
    const summary = await controller.trustAndOpen(project)
    expect(starts).toHaveLength(1)
    expect(starts[0]).toMatchObject({ projectId: summary.id, projectRoot: project, document: { name: 'project' } })
    expect(starts[0]?.document.nodes['project-app']).toMatchObject({ kind: 'code-component', source: { file: 'src/App.tsx', exportName: 'App' } })
    expect(starts[0]?.recoveryRoot).toBe(join(userData, 'projects', summary.id.slice('project:'.length)))
    expect(JSON.stringify(summary)).not.toContain(project)
  })

  it('derives a multi-component document from marked sources when opening a project', async () => {
    const { project, registry } = await fixture()
    await mkdir(join(project, 'src', 'components'), { recursive: true })
    await writeFile(join(project, 'src', 'components', 'Hero.tsx'), 'export function Hero() { return <section data-agent-design-id="hero" data-agent-design-name="Hero" data-agent-design-label="Hero headline">Hero</section> }\n')
    await writeFile(join(project, 'src', 'components', 'Footer.tsx'), 'export function Footer() { return <footer data-agent-design-id="footer" data-agent-design-name="Footer" data-agent-design-label="Footer">Footer</footer> }\n')
    const starts: BridgeStartConfig[] = []
    const supervisor: ProjectSupervisor = {
      stop: async () => undefined,
      start: (config) => { starts.push(config) },
    }
    const controller = new ProjectController(registry, supervisor, () => '2026-07-12T04:00:00.000Z')
    await controller.trustAndOpen(project)
    expect(starts).toHaveLength(1)
    const nodes = starts[0]!.document.nodes
    const components = Object.values(nodes).filter((node) => node.kind === 'code-component')
    expect(components.map((node) => node.name).sort()).toEqual(['Footer', 'Hero'])
    expect(components.every((node) => node.source !== null && node.source.file.startsWith('src/components/'))).toBe(true)
    expect(nodes['project-app']).toBeUndefined()
  })
})
