import { createHash } from 'node:crypto'
import { open, mkdir, readFile, realpath, rename, stat } from 'node:fs/promises'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'

interface TrustedProjectRecord {
  id: string
  displayName: string
  canonicalRoot: string
  device: string
  inode: string
  trustedAt: string
  lastOpenedAt: string
}

interface RegistryFile {
  format: 'askewly.trusted-projects'
  version: 1
  projects: TrustedProjectRecord[]
}

export interface TrustedProjectSummary {
  id: string
  displayName: string
  lastOpenedAt: string
}

function normalizedIdentityPath(path: string): string {
  return process.platform === 'win32' ? path.toLocaleLowerCase('en-US') : path
}

function projectId(canonicalRoot: string): string {
  return `project:${createHash('sha256').update(normalizedIdentityPath(canonicalRoot)).digest('hex').slice(0, 24)}`
}

function contained(root: string, candidate: string): boolean {
  const child = relative(root, candidate)
  return child === '' || (!child.startsWith('..') && !isAbsolute(child))
}

async function atomicWrite(path: string, content: string): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`
  const handle = await open(temporary, 'wx')
  try {
    await handle.writeFile(content, 'utf8')
    await handle.sync()
  } finally {
    await handle.close()
  }
  await rename(temporary, path)
}

function parseRegistry(serialized: string): RegistryFile {
  const value = JSON.parse(serialized) as Partial<RegistryFile>
  if (value.format !== 'askewly.trusted-projects' || value.version !== 1 || !Array.isArray(value.projects)) {
    throw new Error('unsupported trusted project registry')
  }
  for (const project of value.projects) {
    if (
      typeof project?.id !== 'string' ||
      typeof project.displayName !== 'string' ||
      typeof project.canonicalRoot !== 'string' ||
      typeof project.device !== 'string' ||
      typeof project.inode !== 'string' ||
      typeof project.trustedAt !== 'string' ||
      typeof project.lastOpenedAt !== 'string'
    ) throw new Error('invalid trusted project record')
  }
  return value as RegistryFile
}

export class TrustedProjectRegistry {
  private readonly registryPath: string
  private readonly projectsRoot: string

  constructor(private readonly userDataRoot: string, private readonly now = () => new Date().toISOString()) {
    this.registryPath = join(userDataRoot, 'trusted-projects.json')
    this.projectsRoot = join(userDataRoot, 'projects')
  }

  async initialize(): Promise<void> {
    await mkdir(this.projectsRoot, { recursive: true })
    try {
      await readFile(this.registryPath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      await atomicWrite(this.registryPath, JSON.stringify({ format: 'askewly.trusted-projects', version: 1, projects: [] } satisfies RegistryFile))
    }
  }

  async trust(selectedRoot: string): Promise<TrustedProjectSummary> {
    if (!isAbsolute(selectedRoot)) throw new Error('PROJECT_ROOT_MUST_BE_ABSOLUTE')
    const canonicalRoot = await realpath(selectedRoot)
    const identity = await stat(canonicalRoot, { bigint: true })
    if (!identity.isDirectory()) throw new Error('PROJECT_ROOT_NOT_DIRECTORY')
    const registry = await this.load()
    const id = projectId(canonicalRoot)
    const timestamp = this.now()
    const existing = registry.projects.find((project) => project.id === id)
    const record: TrustedProjectRecord = {
      id,
      displayName: basename(canonicalRoot),
      canonicalRoot,
      device: identity.dev.toString(),
      inode: identity.ino.toString(),
      trustedAt: existing?.trustedAt ?? timestamp,
      lastOpenedAt: timestamp,
    }
    registry.projects = [record, ...registry.projects.filter((project) => project.id !== id)]
    await this.save(registry)
    await mkdir(this.dataRoot(id), { recursive: true })
    return this.summary(record)
  }

  async recent(): Promise<TrustedProjectSummary[]> {
    return [...(await this.load()).projects]
      .sort((left, right) => right.lastOpenedAt.localeCompare(left.lastOpenedAt))
      .map((project) => this.summary(project))
  }

  async resolveRoot(id: string): Promise<string> {
    const record = (await this.load()).projects.find((project) => project.id === id)
    if (!record) throw new Error('PROJECT_NOT_TRUSTED')
    const canonicalRoot = await realpath(record.canonicalRoot)
    const identity = await stat(canonicalRoot, { bigint: true })
    if (
      normalizedIdentityPath(canonicalRoot) !== normalizedIdentityPath(record.canonicalRoot) ||
      identity.dev.toString() !== record.device ||
      identity.ino.toString() !== record.inode
    ) throw new Error('PROJECT_ROOT_CHANGED')
    return canonicalRoot
  }

  async resolveExisting(id: string, projectRelativePath: string): Promise<string> {
    if (isAbsolute(projectRelativePath)) throw new Error('PROJECT_PATH_MUST_BE_RELATIVE')
    const root = await this.resolveRoot(id)
    const candidate = await realpath(resolve(root, projectRelativePath))
    if (!contained(root, candidate)) throw new Error('PROJECT_PATH_ESCAPE')
    return candidate
  }

  dataRoot(id: string): string {
    if (!/^project:[a-f0-9]{24}$/.test(id)) throw new Error('INVALID_PROJECT_ID')
    return join(this.projectsRoot, id.slice('project:'.length))
  }

  private async load(): Promise<RegistryFile> {
    await this.initialize()
    try {
      return parseRegistry(await readFile(this.registryPath, 'utf8'))
    } catch (error) {
      const quarantine = `${this.registryPath}.corrupt-${Date.now()}`
      await rename(this.registryPath, quarantine).catch(() => undefined)
      await atomicWrite(this.registryPath, JSON.stringify({ format: 'askewly.trusted-projects', version: 1, projects: [] } satisfies RegistryFile))
      throw new Error('TRUSTED_PROJECT_REGISTRY_CORRUPT', { cause: error })
    }
  }

  private async save(registry: RegistryFile): Promise<void> {
    await mkdir(this.userDataRoot, { recursive: true })
    await atomicWrite(this.registryPath, JSON.stringify(registry))
  }

  private summary(record: TrustedProjectRecord): TrustedProjectSummary {
    return Object.freeze({ id: record.id, displayName: record.displayName, lastOpenedAt: record.lastOpenedAt })
  }
}
