#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { catalog, projectComponents, searchRegistry } from '@askewly/component-registry'
import { BridgeClient, BridgeRequestError, type AdapterActor } from './bridgeClient.js'

type ProjectDocument = Parameters<typeof projectComponents>[0]

const EXIT_OK = 0
const EXIT_USAGE = 1
const EXIT_AUTH = 2
const EXIT_CONFLICT = 3
const EXIT_CONNECTION = 4

class CliError extends Error {
  constructor(public readonly code: string, message: string, public readonly exitCode: number) {
    super(message)
    this.name = 'CliError'
  }
}

function requireEnv(): { bridgeUrl: string; token: string; actor: AdapterActor } {
  const bridgeUrl = process.env.AGENT_DESIGN_BRIDGE_URL
  const token = process.env.AGENT_DESIGN_SESSION_TOKEN
  const actor = process.env.AGENT_DESIGN_ACTOR
  if (!bridgeUrl || !token || (actor !== 'codex' && actor !== 'claude')) {
    throw new CliError('USAGE', 'AGENT_DESIGN_BRIDGE_URL, AGENT_DESIGN_SESSION_TOKEN, and AGENT_DESIGN_ACTOR=codex|claude are required.', EXIT_USAGE)
  }
  return { bridgeUrl, token, actor }
}

async function readInput(args: string[]): Promise<Record<string, unknown> | undefined> {
  const fileFlagIndex = args.indexOf('--file')
  let raw: string
  if (fileFlagIndex !== -1) {
    const filePath = args[fileFlagIndex + 1]
    if (!filePath) throw new CliError('USAGE', '--file requires a path', EXIT_USAGE)
    raw = await readFile(filePath, 'utf8')
  } else {
    if (process.stdin.isTTY) return undefined
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    raw = Buffer.concat(chunks).toString('utf8')
  }
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  try {
    return JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    throw new CliError('USAGE', 'input must be valid JSON', EXIT_USAGE)
  }
}

function requireField<T>(input: Record<string, unknown> | undefined, field: string): T {
  if (!input || !(field in input)) throw new CliError('USAGE', `missing required field: ${field}`, EXIT_USAGE)
  return input[field] as T
}

async function runContext(client: BridgeClient): Promise<Record<string, unknown>> {
  return client.context()
}

async function runApply(client: BridgeClient, args: string[]): Promise<Record<string, unknown>> {
  const input = await readInput(args)
  return client.applyOperations({
    transactionId: requireField(input, 'transactionId'),
    baseRevision: requireField(input, 'baseRevision'),
    beforeHash: requireField(input, 'beforeHash'),
    operations: requireField(input, 'operations'),
  })
}

async function runUndo(client: BridgeClient, args: string[]): Promise<Record<string, unknown>> {
  const input = await readInput(args)
  return client.undo({
    transactionId: requireField(input, 'transactionId'),
    baseRevision: requireField(input, 'baseRevision'),
    beforeHash: requireField(input, 'beforeHash'),
  })
}

async function runVerify(client: BridgeClient, args: string[]): Promise<Record<string, unknown>> {
  const input = await readInput(args)
  return client.verify({ revision: input?.revision as number | undefined, hash: input?.hash as string | undefined })
}

async function runComponents(client: BridgeClient, args: string[]): Promise<Record<string, unknown>> {
  const queryFlagIndex = args.indexOf('--query')
  let query: string | undefined
  if (queryFlagIndex !== -1) {
    query = args[queryFlagIndex + 1]
    if (!query) throw new CliError('USAGE', '--query requires a value', EXIT_USAGE)
  }
  const snapshot = await client.snapshot()
  const document = snapshot.document as ProjectDocument
  const entries = [...catalog, ...projectComponents(document)]
  const components = searchRegistry(entries, query ?? '')
  return { components }
}

function classify(error: unknown): { exitCode: number; code: string; message: string } {
  if (error instanceof CliError) return { exitCode: error.exitCode, code: error.code, message: error.message }
  if (error instanceof BridgeRequestError) {
    if (error.status === 401 || error.status === 403) return { exitCode: EXIT_AUTH, code: error.code, message: error.message }
    if (error.status === 409) return { exitCode: EXIT_CONFLICT, code: error.code, message: error.message }
    return { exitCode: EXIT_USAGE, code: error.code, message: error.message }
  }
  if (error instanceof Error) {
    const cause = (error as { cause?: { code?: string } }).cause
    const connectionCodes = new Set(['ECONNREFUSED', 'ENOTFOUND', 'EHOSTUNREACH', 'ECONNRESET'])
    if ((cause?.code && connectionCodes.has(cause.code)) || error.message.includes('fetch failed')) {
      return { exitCode: EXIT_CONNECTION, code: 'CONNECTION_FAILED', message: error.message }
    }
    return { exitCode: EXIT_USAGE, code: 'CLI_ERROR', message: error.message }
  }
  return { exitCode: EXIT_USAGE, code: 'CLI_ERROR', message: 'unknown error' }
}

async function main(): Promise<void> {
  const [subcommand, ...rest] = process.argv.slice(2)
  const { bridgeUrl, token, actor } = requireEnv()
  const client = new BridgeClient({ url: bridgeUrl, token, actor })
  let value: Record<string, unknown>
  switch (subcommand) {
    case 'context':
      value = await runContext(client)
      break
    case 'apply':
      value = await runApply(client, rest)
      break
    case 'undo':
      value = await runUndo(client, rest)
      break
    case 'verify':
      value = await runVerify(client, rest)
      break
    case 'components':
      value = await runComponents(client, rest)
      break
    default:
      throw new CliError('USAGE', `unknown subcommand: ${subcommand ?? '(none)'}. expected one of: context, apply, undo, verify, components`, EXIT_USAGE)
  }
  process.stdout.write(`${JSON.stringify(value)}\n`)
  process.exitCode = EXIT_OK
}

main().catch((error: unknown) => {
  const { exitCode, code, message } = classify(error)
  process.stderr.write(`${JSON.stringify({ error: { code, message } })}\n`)
  process.exitCode = exitCode
})
