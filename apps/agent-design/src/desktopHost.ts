export type DesktopBridgeState = 'idle' | 'starting' | 'ready' | 'backoff' | 'failed' | 'stopping'

export interface DesktopBridgeStatus {
  apiVersion: 1
  state: DesktopBridgeState
  projectId: string | null
  restartCount: number
  cursor: number
  revision: number
  lastErrorCode: string | null
  recoveryMode: 'fresh' | 'recovered' | 'read-only' | null
}

export interface AgentDesignDesktopHost {
  readonly apiVersion: 1
  getHostInfo(request: { apiVersion: 1 }): Promise<unknown>
  getBridgeStatus(request: { apiVersion: 1 }): Promise<DesktopBridgeStatus>
  copyTerminalCommand(request: { apiVersion: 1; actor: 'codex' | 'claude' }): Promise<{ copied: true }>
  onBridgeStatus(listener: (status: DesktopBridgeStatus) => void): () => void
  selectProject(request: { apiVersion: 1 }): Promise<ProjectSelectionResult>
  recentProjects(request: { apiVersion: 1 }): Promise<TrustedProjectSummary[]>
  openRecentProject(request: { apiVersion: 1; projectId: string }): Promise<TrustedProjectSummary>
  openPreview(request: { apiVersion: 1; projectId: string }): Promise<PreviewStatus>
  hidePreview(request: { apiVersion: 1 }): Promise<PreviewStatus>
  catalogFiles(request: { apiVersion: 1; projectId: string }): Promise<TrustedFileSummary[]>
  revealProject(request: { apiVersion: 1; projectId: string }): Promise<{ opened: true }>
  openFile(request: { apiVersion: 1; projectId: string; fileId: string }): Promise<{ opened: true }>
  exportDiagnostics(request: { apiVersion: 1 }): Promise<{ exported: boolean }>
}

export interface TrustedProjectSummary {
  id: string
  displayName: string
  lastOpenedAt: string
}

export interface ProjectSelectionResult {
  canceled: boolean
  project: TrustedProjectSummary | null
}

export interface PreviewStatus {
  visible: boolean
  projectId: string | null
  state: 'idle' | 'loading' | 'ready' | 'error'
}

export interface TrustedFileSummary {
  id: string
  label: string
}

export function desktopHost(): AgentDesignDesktopHost | null {
  return window.agentDesignHost ?? null
}

declare global {
  interface Window {
    agentDesignHost?: AgentDesignDesktopHost
  }
}
