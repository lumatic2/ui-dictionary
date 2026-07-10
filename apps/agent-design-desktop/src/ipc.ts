import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseHostRequest,
  parseProjectSelectionResult,
  parseTrustedProjectSummary,
  parseTerminalCommandRequest,
  type BridgeStatus,
  type HostInfo,
  type ProjectSelectionResult,
  type TerminalActor,
  type TrustedProjectSummary,
} from './contract'
import { isTrustedRendererUrl } from './security'

export interface HostIpcServices {
  bridgeStatus(): BridgeStatus
  copyTerminalCommand(actor: TerminalActor): void | Promise<void>
  selectProject(): Promise<ProjectSelectionResult>
  recentProjects(): Promise<TrustedProjectSummary[]>
  openRecentProject(projectId: string): Promise<TrustedProjectSummary>
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

  return () => {
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getHostInfo)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.getBridgeStatus)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.copyTerminalCommand)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.selectProject)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.recentProjects)
    ipcMain.removeHandler(HOST_IPC_CHANNELS.openRecentProject)
  }
}
