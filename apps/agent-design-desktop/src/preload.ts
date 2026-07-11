import { contextBridge, ipcRenderer } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseBridgeStatus,
  parseCanvasMutationRequest,
  parseCanvasSnapshot,
  parseCollaborationFeed,
  parseFileActionRequest,
  parseHostRequest,
  parsePreviewStatus,
  parseProjectSelectionResult,
  parseTerminalCommandRequest,
  parseTrustedFileSummary,
  parseTrustedProjectSummary,
  type BridgeStatus,
  type CanvasSnapshot,
  type CanvasSnapshotReason,
  type CollaborationFeed,
  type HostInfo,
  type HostRequest,
  type FileActionRequest,
  type PreviewStatus,
  type ProjectSelectionResult,
  type TerminalCommandRequest,
  type TrustedFileSummary,
  type TrustedProjectSummary,
} from './contract'

const hostApi = Object.freeze({
  apiVersion: HOST_API_VERSION,
  getHostInfo(request: HostRequest): Promise<HostInfo> {
    const parsed = parseHostRequest(request)
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.getHostInfo, parsed) as Promise<HostInfo>
  },
  async getBridgeStatus(request: HostRequest): Promise<BridgeStatus> {
    const parsed = parseHostRequest(request)
    return parseBridgeStatus(await ipcRenderer.invoke(HOST_IPC_CHANNELS.getBridgeStatus, parsed))
  },
  async copyTerminalCommand(request: TerminalCommandRequest): Promise<{ copied: true }> {
    const parsed = parseTerminalCommandRequest(request)
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.copyTerminalCommand, parsed) as Promise<{ copied: true }>
  },
  onBridgeStatus(listener: (status: BridgeStatus) => void): () => void {
    if (typeof listener !== 'function') throw new TypeError('bridge status listener must be a function')
    const wrapped = (_event: Electron.IpcRendererEvent, rawStatus: unknown) => listener(parseBridgeStatus(rawStatus))
    ipcRenderer.on(HOST_IPC_CHANNELS.bridgeStatusChanged, wrapped)
    return () => ipcRenderer.removeListener(HOST_IPC_CHANNELS.bridgeStatusChanged, wrapped)
  },
  async getCanvasSnapshot(request: HostRequest): Promise<CanvasSnapshot> {
    return parseCanvasSnapshot(await ipcRenderer.invoke(HOST_IPC_CHANNELS.getCanvasSnapshot, parseHostRequest(request)))
  },
  async applyCanvasOperation(request: unknown): Promise<CanvasSnapshot> {
    const parsed = parseCanvasMutationRequest(request)
    return parseCanvasSnapshot(await ipcRenderer.invoke(HOST_IPC_CHANNELS.applyCanvasOperation, parsed))
  },
  async undoCanvas(request: HostRequest): Promise<CanvasSnapshot> {
    return parseCanvasSnapshot(await ipcRenderer.invoke(HOST_IPC_CHANNELS.undoCanvas, parseHostRequest(request)))
  },
  onCanvasSnapshot(listener: (snapshot: CanvasSnapshot, reason: CanvasSnapshotReason) => void): () => void {
    if (typeof listener !== 'function') throw new TypeError('canvas snapshot listener must be a function')
    const wrapped = (_event: Electron.IpcRendererEvent, rawSnapshot: unknown, reason: unknown) => {
      if (reason !== 'initial' && reason !== 'event' && reason !== 'transaction' && reason !== 'recovery') throw new TypeError('invalid canvas snapshot reason')
      listener(parseCanvasSnapshot(rawSnapshot), reason)
    }
    ipcRenderer.on(HOST_IPC_CHANNELS.canvasSnapshotChanged, wrapped)
    return () => ipcRenderer.removeListener(HOST_IPC_CHANNELS.canvasSnapshotChanged, wrapped)
  },
  async getCollaborationFeed(request: HostRequest): Promise<CollaborationFeed> {
    return parseCollaborationFeed(await ipcRenderer.invoke(HOST_IPC_CHANNELS.getCollaborationFeed, parseHostRequest(request)))
  },
  onCollaborationFeed(listener: (feed: CollaborationFeed) => void): () => void {
    if (typeof listener !== 'function') throw new TypeError('collaboration feed listener must be a function')
    const wrapped = (_event: Electron.IpcRendererEvent, rawFeed: unknown) => listener(parseCollaborationFeed(rawFeed))
    ipcRenderer.on(HOST_IPC_CHANNELS.collaborationFeedChanged, wrapped)
    return () => ipcRenderer.removeListener(HOST_IPC_CHANNELS.collaborationFeedChanged, wrapped)
  },
  async selectProject(request: HostRequest): Promise<ProjectSelectionResult> {
    return parseProjectSelectionResult(await ipcRenderer.invoke(HOST_IPC_CHANNELS.selectProject, parseHostRequest(request)))
  },
  async recentProjects(request: HostRequest): Promise<TrustedProjectSummary[]> {
    const value = await ipcRenderer.invoke(HOST_IPC_CHANNELS.recentProjects, parseHostRequest(request)) as unknown
    if (!Array.isArray(value)) throw new TypeError('recent projects response must be an array')
    return value.map(parseTrustedProjectSummary)
  },
  async openRecentProject(request: HostRequest): Promise<TrustedProjectSummary> {
    const parsed = parseHostRequest(request)
    if (!parsed.projectId) throw new TypeError('projectId is required')
    return parseTrustedProjectSummary(await ipcRenderer.invoke(HOST_IPC_CHANNELS.openRecentProject, parsed))
  },
  async openPreview(request: HostRequest): Promise<PreviewStatus> {
    const parsed = parseHostRequest(request)
    if (!parsed.projectId) throw new TypeError('projectId is required')
    return parsePreviewStatus(await ipcRenderer.invoke(HOST_IPC_CHANNELS.openPreview, parsed))
  },
  async hidePreview(request: HostRequest): Promise<PreviewStatus> {
    return parsePreviewStatus(await ipcRenderer.invoke(HOST_IPC_CHANNELS.hidePreview, parseHostRequest(request)))
  },
  async catalogFiles(request: HostRequest): Promise<TrustedFileSummary[]> {
    const parsed = parseHostRequest(request)
    if (!parsed.projectId) throw new TypeError('projectId is required')
    const value = await ipcRenderer.invoke(HOST_IPC_CHANNELS.catalogFiles, parsed) as unknown
    if (!Array.isArray(value)) throw new TypeError('trusted file response must be an array')
    return value.map(parseTrustedFileSummary)
  },
  async revealProject(request: HostRequest): Promise<{ opened: true }> {
    const parsed = parseHostRequest(request)
    if (!parsed.projectId) throw new TypeError('projectId is required')
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.revealProject, parsed) as Promise<{ opened: true }>
  },
  async openFile(request: FileActionRequest): Promise<{ opened: true }> {
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.openFile, parseFileActionRequest(request)) as Promise<{ opened: true }>
  },
  async exportDiagnostics(request: HostRequest): Promise<{ exported: boolean }> {
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.exportDiagnostics, parseHostRequest(request)) as Promise<{ exported: boolean }>
  },
})

contextBridge.exposeInMainWorld('agentDesignHost', hostApi)
