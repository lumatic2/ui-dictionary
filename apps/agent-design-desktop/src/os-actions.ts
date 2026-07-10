import { TrustedProjectRegistry, type TrustedFileSummary } from './project-registry'

export class GuardedOsActions {
  constructor(
    private readonly registry: TrustedProjectRegistry,
    private readonly openPath: (path: string) => Promise<string>,
  ) {}

  catalogFiles(projectId: string): Promise<TrustedFileSummary[]> {
    return this.registry.catalogSourceFiles(projectId)
  }

  async revealProject(projectId: string): Promise<void> {
    const error = await this.openPath(await this.registry.resolveRoot(projectId))
    if (error) throw new Error(`OS_OPEN_FAILED:${error}`)
  }

  async openFile(projectId: string, fileId: string): Promise<void> {
    const error = await this.openPath(await this.registry.resolveFileReference(projectId, fileId))
    if (error) throw new Error(`OS_OPEN_FAILED:${error}`)
  }
}
