import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GuardedOsActions } from '../src/os-actions'
import { TrustedProjectRegistry } from '../src/project-registry'

const roots: string[] = []
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))))

describe('guarded OS actions', () => {
  it('opens only registry-owned project and file references', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-design-os-'))
    roots.push(root)
    const project = join(root, 'project')
    await mkdir(join(project, 'src'), { recursive: true })
    await writeFile(join(project, 'src', 'App.tsx'), 'export function App() {}')
    await writeFile(join(project, 'run.exe'), 'not executable through the catalog')
    const registry = new TrustedProjectRegistry(join(root, 'user-data'))
    const trusted = await registry.trust(project)
    const openPath = vi.fn(async () => '')
    const actions = new GuardedOsActions(registry, openPath)
    const files = await actions.catalogFiles(trusted.id)
    expect(files).toEqual([{ id: expect.stringMatching(/^file:[a-f0-9]{24}$/), label: 'src/App.tsx' }])
    await actions.revealProject(trusted.id)
    await actions.openFile(trusted.id, files[0]!.id)
    expect(openPath).toHaveBeenNthCalledWith(1, project)
    expect(openPath).toHaveBeenNthCalledWith(2, join(project, 'src', 'App.tsx'))
    await expect(actions.openFile(trusted.id, 'file:aaaaaaaaaaaaaaaaaaaaaaaa')).rejects.toThrow('FILE_NOT_REGISTERED')
  })
})
