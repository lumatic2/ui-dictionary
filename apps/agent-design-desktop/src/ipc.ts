import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseFileActionRequest,
  parseCanvasMutationRequest,
  parseCanvasSnapshot,
  parseCollaborationFeed,
  parseHostRequest,
  parsePreviewStatus,
  parseProjectSelectionResult,
  parseSourcePatchRequest,
  parseTerminalCommandRequest,
  parseTrustedFileSummary,
  parseTrustedProjectSummary,
  type BridgeStatus,
  type CanvasSnapshot,
  type CollaborationFeed,
  type HostInfo,
  type PreviewStatus,
  type ProjectSelectionResult,
  type TerminalActor,
  type TrustedFileSummary,
  type TrustedProjectSummary,
} from './contract'
import { isTrustedRendererUrl } from './security'

export interface HostIpcServices {
  bridgeStatus(): BridgeStatus
  copyTerminalCommand(actor: TerminalActor): void | Promise<void>
  selectProject(): Promise<ProjectSelectionResult>
  recentProjects(): Promise<TrustedProjectSummary[]>
  openRecentProject(projectId: string): Promise<TrustedProjectSummary>
  openPreview(projectId: string): Promise<PreviewStatus>
  hidePreview(): PreviewStatus
  catalogFiles(projectId: string): Promise<TrustedFileSummary[]>
  revealProject(projectId: string): Promise<void>
  openFile(projectId: string, fileId: string): Promise<void>
  exportDiagnostics(): Promise<boolean>
  canvasSnapshot(): CanvasSnapshot
  applyCanvasOperation(operation: unknown): Promise<CanvasSnapshot>
  undoCanvas(): Promise<CanvasSnapshot>
  collaborationFeed(): CollaborationFeed
  materializeNode(file: string, content: string): Promise<CanvasSnapshot>
}

const idleServices: HostIpcServices = {
  bridgeStatus: () => ({
    apiVersion: 1,
    state: 'idle',
    projectId: null,
    restartCount: 0,
    cursor: 0,
    revision: 0,
    lastErrorCode: null,
    recoveryMode: null,
  }),
  copyTerminalCommand: () => {
    throw new Error('bridge terminal bootstrap is not ready')
  },
  selectProject: async () => ({ canceled: true, project: null }),
  recentProjects: async () => [],
  openRecentProject: async () => { throw new Error('project service is not ready') },
  openPreview: async () => { throw new Error('preview service is not ready') },
  hidePreview: () => ({ visible: false, projectId: null, state: 'idle' }),
  catalogFiles: async () => [],
  revealProject: async () => undefined,
  openFile: async () => undefined,
  exportDiagnostics: async () => false,
  canvasSnapshot: () => { throw new Error('canvas relay is not ready') },
  applyCanvasOperation: async () => { throw new Error('canvas relay is not ready') },
  undoCanvas: async () => { throw new Error('canvas relay is not ready') },
  collaborationFeed: () => ({ entries: [], actors: [], cursorRevision: 0 }),
  materializeNode: async () => { throw new Error('canvas relay is not ready') },
}

export function isTrustedIpcSender(event: IpcMainInvokeEvent): boolean {
  return (
    event.senderFrame !== null &&
    event.senderFrame === event.sender.mainFrame &&
    isTrustedRendererUrl(event.senderFrame.url)
  )
}

export function registerHostIpc(appVersion: string, services: HostIpcServices = idleServices): () => void {
  ipcMain.handle(HOST_IPC_CHANNELS.getHostInfo, (event, rawRequest): HostInfo => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    const platform = process.platform
    if (platform !== 'win32' && platform !== 'darwin' && platform !== 'linux') {
      throw new Error(`unsupported platform: ${platform}`)
    }
    return Object.freeze({
      apiVersion: HOST_API_VERSION,
      appVersion,
      platform,
      capabilities: Object.freeze(['desktop-host'] as const),
    })
  })

  ipcMain.handle(HOST_IPC_CHANNELS.getBridgeStatus, (event, rawRequest): BridgeStatus => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return services.bridgeStatus()
  })

  ipcMain.handle(HOST_IPC_CHANNELS.copyTerminalCommand, async (event, rawRequest) => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseTerminalCommandRequest(rawRequest)
    await services.copyTerminalCommand(request.actor)
    return Object.freeze({ copied: true })
  })

  ipcMain.handle(HOST_IPC_CHANNELS.getCanvasSnapshot, (event, rawRequest): CanvasSnapshot => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return parseCanvasSnapshot(services.canvasSnapshot())
  })

  ipcMain.handle(HOST_IPC_CHANNELS.applyCanvasOperation, async (event, rawRequest): Promise<CanvasSnapshot> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseCanvasMutationRequest(rawRequest)
    return parseCanvasSnapshot(await services.applyCanvasOperation(request.operation))
  })

  ipcMain.handle(HOST_IPC_CHANNELS.undoCanvas, async (event, rawRequest): Promise<CanvasSnapshot> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return parseCanvasSnapshot(await services.undoCanvas())
  })

  ipcMain.handle(HOST_IPC_CHANNELS.getCollaborationFeed, (event, rawRequest): CollaborationFeed => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return parseCollaborationFeed(services.collaborationFeed())
  })

  ipcMain.handle(HOST_IPC_CHANNELS.materializeNode, async (event, rawRequest): Promise<CanvasSnapshot> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseSourcePatchRequest(rawRequest)
    return parseCanvasSnapshot(await services.materializeNode(request.file, request.content))
  })

  ipcMain.handle(HOST_IPC_CHANNELS.selectProject, async (event, rawRequest): Promise<ProjectSelectionResult> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return parseProjectSelectionResult(await services.selectProject())
  })

  ipcMain.handle(HOST_IPC_CHANNELS.recentProjects, async (event, rawRequest): Promise<TrustedProjectSummary[]> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return (await services.recentProjects()).map(parseTrustedProjectSummary)
  })

  ipcMain.handle(HOST_IPC_CHANNELS.openRecentProject, async (event, rawRequest): Promise<TrustedProjectSummary> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseHostRequest(rawRequest)
    if (!request.projectId) throw new TypeError('projectId is required')
    return parseTrustedProjectSummary(await services.openRecentProject(request.projectId))
  })

  ipcMain.handle(HOST_IPC_CHANNELS.openPreview, async (event, rawRequest): Promise<PreviewStatus> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseHostRequest(rawRequest)
    if (!request.projectId) throw new TypeError('projectId is required')
    return parsePreviewStatus(await services.openPreview(request.projectId))
  })

  ipcMain.handle(HOST_IPC_CHANNELS.hidePreview, (event, rawRequest): PreviewStatus => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return parsePreviewStatus(services.hidePreview())
  })

  ipcMain.handle(HOST_IPC_CHANNELS.catalogFiles, async (event, rawRequest): Promise<TrustedFileSummary[]> => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseHostRequest(rawRequest)
    if (!request.projectId) throw new TypeError('projectId is required')
    return (await services.catalogFiles(request.projectId)).map(parseTrustedFileSummary)
  })

  ipcMain.handle(HOST_IPC_CHANNELS.revealProject, async (event, rawRequest) => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseHostRequest(rawRequest)
    if (!request.projectId) throw new TypeError('projectId is required')
    await services.revealProject(request.projectId)
    return Object.freeze({ opened: true })
  })

  ipcMain.handle(HOST_IPC_CHANNELS.openFile, async (event, rawRequest) => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    const request = parseFileActionRequest(rawRequest)
    await services.openFile(request.projectId, request.fileId)
    return Object.freeze({ opened: true })
  })

  ipcMain.handle(HOST_IPC_CHANNELS.exportDiagnostics, async (event, rawRequest) => {
    if (!isTrustedIpcSender(event)) throw new Error('untrusted IPC sender')
    parseHostRequest(rawRequest)
    return Object.freeze({ exported: await services.exportDiagnostics() })
  })

  return () => {
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getHostInfo)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getBridgeStatus)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.copyTerminalCommand)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getCanvasSnapshot)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.applyCanvasOperation)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.undoCanvas)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getCollaborationFeed)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.selectProject)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.recentProjects)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.openRecentProject)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.openPreview)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.hidePreview)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.catalogFiles)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.revealProject)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.openFile)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.exportDiagnostics)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.materializeNode)
  }
}
