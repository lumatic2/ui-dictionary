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
  getCanvasSnapshot(request: { apiVersion: 1 }): Promise<DesktopCanvasSnapshot>
  applyCanvasOperation(request: { apiVersion: 1; operation: CanvasOperation }): Promise<DesktopCanvasSnapshot>
  undoCanvas(request: { apiVersion: 1 }): Promise<DesktopCanvasSnapshot>
  onCanvasSnapshot(listener: (snapshot: DesktopCanvasSnapshot, reason: DesktopCanvasSnapshotReason) => void): () => void
  getCollaborationFeed(request: { apiVersion: 1 }): Promise<DesktopCollaborationFeed>
  onCollaborationFeed(listener: (feed: DesktopCollaborationFeed) => void): () => void
  materializeNode(request: { apiVersion: 1; file: string; content: string }): Promise<DesktopCanvasSnapshot>
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

export type DesktopCanvasSnapshotReason = 'initial' | 'event' | 'transaction' | 'recovery'
export interface DesktopCanvasSnapshot {
  document: CanvasDocument
  revision: number
  hash: string
  cursor: number
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

export type DesktopFeedActor = 'codex' | 'claude' | 'human' | 'watcher'
export type DesktopFeedEntryKind = 'operations' | 'source-patch' | 'undo'

export interface DesktopCollaborationFeedEntry {
  transactionId: string
  actor: DesktopFeedActor
  kind: DesktopFeedEntryKind
  revision: number
  at: string
  changeCount: number
  nodeIds: string[]
}

export interface DesktopActorActivity {
  actor: DesktopFeedActor
  lastRevision: number
  lastActiveAt: string
}

export interface DesktopCollaborationFeed {
  entries: DesktopCollaborationFeedEntry[]
  actors: DesktopActorActivity[]
  cursorRevision: number
}

export function desktopHost(): AgentDesignDesktopHost | null {
  return window.agentDesignHost ?? null
}

declare global {
  interface Window {
    agentDesignHost?: AgentDesignDesktopHost
  }
}
import type { CanvasDocument, CanvasOperation } from '@askewly/canvas-core'
