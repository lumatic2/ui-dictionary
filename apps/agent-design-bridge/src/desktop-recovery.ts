import { createHash } from 'node:crypto'
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import type { CanvasSnapshot, TransactionAuditEntry } from '@askewly/agent-design-engine'

export type RecoveryMode = 'fresh' | 'recovered' | 'read-only'
export type RecoveryFaultStage = 'after-files-fsync' | 'after-generation-rename' | 'before-pointer-swap'

export interface RecoveredDesktopState {
  snapshot: CanvasSnapshot
  audits: TransactionAuditEntry[]
  mode: RecoveryMode
  generation: string
}

interface SnapshotEnvelope {
  format: 'askewly.desktop.recovery'
  version: 1
  snapshot: CanvasSnapshot
  auditCount: number
  checksum: string
}

function payload(snapshot: CanvasSnapshot, audits: TransactionAuditEntry[]): string {
  return JSON.stringify({ snapshot, audits })
}

function checksum(snapshot: CanvasSnapshot, audits: TransactionAuditEntry[]): string {
  return createHash('sha256').update(payload(snapshot, audits)).digest('hex')
}

function writeDurable(path: string, content: string): void {
  const descriptor = openSync(path, 'wx')
  try {
    writeFileSync(descriptor, content, 'utf8')
    fsyncSync(descriptor)
  } finally {
    closeSync(descriptor)
  }
}

function generationName(snapshot: CanvasSnapshot, digest: string): string {
  return `g${String(snapshot.cursor).padStart(12, '0')}-${digest.slice(0, 16)}`
}

export class DesktopRecoveryStore {
  private readonly generationsRoot: string
  private readonly currentPath: string

  constructor(
    private readonly root: string,
    private readonly fault?: (stage: RecoveryFaultStage) => void,
  ) {
    this.generationsRoot = join(root, 'generations')
    this.currentPath = join(root, 'CURRENT')
    mkdirSync(this.generationsRoot, { recursive: true })
  }

  commit(snapshot: CanvasSnapshot, audits: TransactionAuditEntry[]): string {
    const digest = checksum(snapshot, audits)
    const name = generationName(snapshot, digest)
    const finalDirectory = join(this.generationsRoot, name)
    if (!existsSync(finalDirectory)) {
      const temporary = join(this.generationsRoot, `.tmp-${name}-${process.pid}-${Date.now()}`)
      mkdirSync(temporary)
      try {
        const envelope: SnapshotEnvelope = {
          format: 'askewly.desktop.recovery',
          version: 1,
          snapshot: structuredClone(snapshot),
          auditCount: audits.length,
          checksum: digest,
        }
        writeDurable(join(temporary, 'snapshot.json'), JSON.stringify(envelope))
        writeDurable(join(temporary, 'audit.jsonl'), audits.map((entry) => JSON.stringify(entry)).join('\n') + (audits.length ? '\n' : ''))
        this.fault?.('after-files-fsync')
        renameSync(temporary, finalDirectory)
        this.fault?.('after-generation-rename')
      } catch (error) {
        rmSync(temporary, { recursive: true, force: true })
        throw error
      }
    }

    const pointer = `${this.currentPath}.tmp-${process.pid}-${Date.now()}`
    writeDurable(pointer, `${name}\n`)
    try {
      this.fault?.('before-pointer-swap')
      renameSync(pointer, this.currentPath)
    } catch (error) {
      rmSync(pointer, { force: true })
      throw error
    }
    this.prune(name)
    return name
  }

  recover(): RecoveredDesktopState | null {
    const candidates = this.candidates()
    if (candidates.length === 0) return null
    const preferred = this.currentGeneration()
    const ordered = preferred ? [preferred, ...candidates.filter((name) => name !== preferred)] : candidates
    let fallback = false
    for (const name of ordered) {
      try {
        const recovered = this.readGeneration(name)
        return { ...recovered, mode: fallback || name !== preferred ? 'read-only' : 'recovered', generation: name }
      } catch {
        fallback = true
        const source = join(this.generationsRoot, name)
        if (existsSync(source)) {
          renameSync(source, join(this.generationsRoot, `.corrupt-${name}-${Date.now()}`))
        }
      }
    }
    throw new Error('NO_VALID_RECOVERY_GENERATION')
  }

  private readGeneration(name: string): Pick<RecoveredDesktopState, 'snapshot' | 'audits'> {
    if (!/^g\d{12}-[a-f0-9]{16}$/.test(name)) throw new Error('INVALID_RECOVERY_GENERATION')
    const directory = join(this.generationsRoot, name)
    const envelope = JSON.parse(readFileSync(join(directory, 'snapshot.json'), 'utf8')) as Partial<SnapshotEnvelope>
    const auditText = readFileSync(join(directory, 'audit.jsonl'), 'utf8').trim()
    const audits = auditText ? auditText.split(/\r?\n/).map((line) => JSON.parse(line) as TransactionAuditEntry) : []
    if (
      envelope.format !== 'askewly.desktop.recovery' ||
      envelope.version !== 1 ||
      !envelope.snapshot ||
      envelope.auditCount !== audits.length ||
      envelope.checksum !== checksum(envelope.snapshot, audits)
    ) throw new Error('RECOVERY_CHECKSUM_MISMATCH')
    return { snapshot: envelope.snapshot, audits }
  }

  private currentGeneration(): string | null {
    try {
      const value = readFileSync(this.currentPath, 'utf8').trim()
      return /^g\d{12}-[a-f0-9]{16}$/.test(value) ? value : null
    } catch {
      return null
    }
  }

  private candidates(): string[] {
    return readdirSync(this.generationsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^g\d{12}-[a-f0-9]{16}$/.test(entry.name))
      .map((entry) => entry.name)
      .sort()
      .reverse()
  }

  private prune(current: string): void {
    for (const name of this.candidates().filter((name) => name !== current).slice(2)) {
      rmSync(join(this.generationsRoot, name), { recursive: true, force: true })
    }
  }
}
