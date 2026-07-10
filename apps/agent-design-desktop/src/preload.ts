import { contextBridge, ipcRenderer } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseHostRequest,
  type HostInfo,
  type HostRequest,
} from './contract'

const hostApi = Object.freeze({
  apiVersion: HOST_API_VERSION,
  getHostInfo(request: HostRequest): Promise<HostInfo> {
    const parsed = parseHostRequest(request)
    return ipcRenderer.invoke(HOST_IPC_CHANNELS.getHostInfo, parsed) as Promise<HostInfo>
  },
})

contextBridge.exposeInMainWorld('agentDesignHost', hostApi)
