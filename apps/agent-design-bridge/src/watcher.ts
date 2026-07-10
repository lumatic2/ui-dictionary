import { randomUUID } from 'node:crypto'
import { readFileSync, watch, type FSWatcher } from 'node:fs'
import { relative } from 'node:path'
import { BridgeSession, resolveProjectPath } from './session.js'

export interface SourceWatcherOptions {
  debounceMs?: number
  onError?: (error: unknown) => void
}

export class SourceWatcher {
  private readonly watchers: FSWatcher[] = []
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly cache = new Map<string, string>()
  private unsubscribe: (() => void) | null = null

  constructor(private readonly session: BridgeSession, private readonly options: SourceWatcherOptions = {}) {}

  start(): void {
    for (const source of this.session.sourceFiles()) {
      if (source.hash === null) continue
      const absolute = resolveProjectPath(this.session.projectRoot, source.file)
      this.cache.set(absolute, readFileSync(absolute, 'utf8'))
      this.watchers.push(watch(absolute, { persistent: false }, () => this.schedule(absolute)))
    }
    this.unsubscribe = this.session.subscribe((event) => {
      if (!event.sourcePatch) return
      const absolute = resolveProjectPath(this.session.projectRoot, event.sourcePatch.file)
      try { this.cache.set(absolute, readFileSync(absolute, 'utf8')) } catch (error) { this.options.onError?.(error) }
    })
  }

  private schedule(absolute: string): void {
    const existing = this.timers.get(absolute)
    if (existing) clearTimeout(existing)
    this.timers.set(absolute, setTimeout(() => {
      this.timers.delete(absolute)
      try {
        const beforeContent = this.cache.get(absolute)
        const content = readFileSync(absolute, 'utf8')
        if (beforeContent === undefined || content === beforeContent) return
        const file = relative(this.session.projectRoot, absolute).replaceAll('\\', '/')
        this.session.reconcileExternalSource({
          transactionId: `watcher:${randomUUID()}`,
          file,
          beforeContent,
          content,
          at: new Date().toISOString(),
        })
        this.cache.set(absolute, content)
      } catch (error) {
        try { this.cache.set(absolute, readFileSync(absolute, 'utf8')) } catch { /* file error is already reported below */ }
        this.options.onError?.(error)
      }
    }, this.options.debounceMs ?? 60))
  }

  close(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
    for (const timer of this.timers.values()) clearTimeout(timer)
    this.timers.clear()
    for (const watcher of this.watchers.splice(0)) watcher.close()
  }
}
