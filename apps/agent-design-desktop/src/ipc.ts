import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import {
  HOST_API_VERSION,
  HOST_IPC_CHANNELS,
  parseHostRequest,
  type HostInfo,
} from './contract'
import { isTrustedRendererUrl } from './security'

export function isTrustedIpcSender(event: IpcMainInvokeEvent): boolean {
  return (
    event.senderFrame !== null &&
    event.senderFrame === event.sender.mainFrame &&
    isTrustedRendererUrl(event.senderFrame.url)
  )
}

export function registerHostIpc(appVersion: string): () => void {
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

  return () => ipcMain.removeHandler(HOST_IPC_CHANNELS.getHostInfo)
}
