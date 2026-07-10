import type { CanvasDocument } from '@askewly/canvas-core' with { 'resolution-mode': 'import' }
import type { BridgeStartConfig } from './bridge-supervisor'
import { TrustedProjectRegistry, type TrustedProjectSummary } from './project-registry'

export interface ProjectSupervisor {
  start(config: BridgeStartConfig): void
  stop(): Promise<void>
}

function initialDocument(project: TrustedProjectSummary, now: string): CanvasDocument {
  const rootId = 'project-root'
  return {
    schemaVersion: 1,
    id: `agent-design-${project.id.slice('project:'.length)}`,
    name: project.displayName,
    revision: 0,
    rootIds: [rootId],
    nodes: {
      [rootId]: {
        id: rootId,
        kind: 'frame',
        name: project.displayName,
        parentId: null,
        childIds: [],
        bounds: { x: 0, y: 0, width: 1440, height: 900 },
        layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
        visible: true,
        locked: false,
        tokenBindings: { background: 'surface.canvas' },
        source: null,
        clipContent: true,
      },
    },
    selection: [rootId],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt: now, updatedAt: now, sourceRoot: '.' },
  }
}

export class ProjectController {
  constructor(
    private readonly registry: TrustedProjectRegistry,
    private readonly supervisor: ProjectSupervisor,
    private readonly now = () => new Date().toISOString(),
  ) {}

  async trustAndOpen(selectedRoot: string): Promise<TrustedProjectSummary> {
    const project = await this.registry.trust(selectedRoot)
    await this.open(project)
    return project
  }

  async openRecent(projectId: string): Promise<TrustedProjectSummary> {
    const project = (await this.registry.recent()).find((candidate) => candidate.id === projectId)
    if (!project) throw new Error('PROJECT_NOT_TRUSTED')
    await this.open(project)
    return project
  }

  recent(): Promise<TrustedProjectSummary[]> {
    return this.registry.recent()
  }

  private async open(project: TrustedProjectSummary): Promise<void> {
    const projectRoot = await this.registry.resolveRoot(project.id)
    await this.supervisor.stop()
    this.supervisor.start({
      projectId: project.id,
      projectRoot,
      recoveryRoot: this.registry.dataRoot(project.id),
      document: initialDocument(project, this.now()),
    })
  }
}
