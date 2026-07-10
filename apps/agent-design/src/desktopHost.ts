export type DesktopBridgeState = 'idle' | 'starting' | 'ready' | 'backoff' | 'failed' | 'stopping'

export interface DesktopBridgeStatus {
  apiVersion: 1
  state: DesktopBridgeState
  projectId: string | null
  restartCount: number
  cursor: number
  revision: number
  lastErrorCode: string | null
}

export interface AgentDesignDesktopHost {
  readonly apiVersion: 1
  getHostInfo(request: { apiVersion: 1 }): Promise<unknown>
  getBridgeStatus(request: { apiVersion: 1 }): Promise<DesktopBridgeStatus>
  copyTerminalCommand(request: { apiVersion: 1; actor: 'codex' | 'claude' }): Promise<{ copied: true }>
  onBridgeStatus(listener: (status: DesktopBridgeStatus) => void): () => void
}

export function desktopHost(): AgentDesignDesktopHost | null {
  return window.agentDesignHost ?? null
}

declare global {
  interface Window {
    agentDesignHost?: AgentDesignDesktopHost
  }
}
