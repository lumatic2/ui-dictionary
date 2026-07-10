import { contextBridge, ipcRenderer } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseBridgeStatus,
  parseHostRequest,
  parseTerminalCommandRequest,
  type BridgeStatus,
  type HostInfo,
  type HostRequest,
  type TerminalCommandRequest,
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
})

contextBridge.exposeInMainWorld('agentDesignHost', hostApi)
