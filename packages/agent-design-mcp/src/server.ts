import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { catalog, projectComponents, searchRegistry } from '@askewly/component-registry'
import { z } from 'zod'
import { BridgeClient, BridgeRequestError, type AdapterActor } from './bridgeClient.js'
import { LiveContextSubscription } from './liveContext.js'

type ProjectDocument = Parameters<typeof projectComponents>[0]

const operationSchema = z.object({
  id: z.string().min(1),
  at: z.string().min(1),
  type: z.string().min(1),
}).passthrough()

function result(value: Record<string, unknown>) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }], structuredContent: value }
}

function failure(error: unknown) {
  const value = error instanceof BridgeRequestError
    ? { error: { status: error.status, code: error.code, message: error.message } }
    : { error: { status: 500, code: 'ADAPTER_ERROR', message: error instanceof Error ? error.message : 'adapter failed' } }
  return { ...result(value), isError: true }
}

export function createAgentDesignMcp(options: {
  bridgeUrl: string
  token: string
  actor: AdapterActor
  /** Inject a subscription (for tests) or pass `false` to disable the live cache and always use REST. */
  liveContext?: LiveContextSubscription | false
}): McpServer {
  const client = new BridgeClient({ url: options.bridgeUrl, token: options.token, actor: options.actor })
  const server = new McpServer({ name: `agent-design-${options.actor}`, version: '0.1.0' })
  const liveContext = options.liveContext === false
    ? null
    : options.liveContext ?? new LiveContextSubscription({
      bridgeUrl: options.bridgeUrl,
      token: options.token,
      fetchContext: () => client.context(),
    })
  liveContext?.start()
  server.server.onclose = () => liveContext?.stop()

  server.registerTool('get_context', {
    title: 'Get AskewlyDesign context',
    description: 'Read the current canvas selection, revision, hash, and project source root before proposing a design mutation.',
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => {
    if (liveContext?.isHealthy()) {
      const cached = liveContext.snapshot()
      if (cached) return result(cached as unknown as Record<string, unknown>)
    }
    try { return result(await client.context()) } catch (error) { return failure(error) }
  })

  server.registerTool('list_components', {
    title: 'List available components',
    description: 'List the curated component registry catalog plus components already used in the current project document, optionally filtered by a search query.',
    inputSchema: { query: z.string().optional() },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (input) => {
    try {
      const snapshot = await client.snapshot()
      const document = snapshot.document as ProjectDocument
      const entries = [...catalog, ...projectComponents(document)]
      const components = searchRegistry(entries, input.query ?? '')
      return result({ components })
    } catch (error) { return failure(error) }
  })

  server.registerTool('apply_operations', {
    title: 'Apply canvas operations',
    description: 'Atomically apply typed operations to the current AskewlyDesign document using the exact base revision and hash from get_context.',
    inputSchema: {
      transactionId: z.string().min(1),
      baseRevision: z.number().int().nonnegative(),
      beforeHash: z.string().min(1),
      operations: z.array(operationSchema).min(1),
    },
  }, async (input) => {
    try { return result(await client.applyOperations(input)) } catch (error) { return failure(error) }
  })

  server.registerTool('apply_source_patch', {
    title: 'Apply a source patch',
    description: 'Atomically replace a registered project source file and reconcile the canvas. Project-root and before-hash checks are mandatory.',
    inputSchema: {
      transactionId: z.string().min(1),
      baseRevision: z.number().int().nonnegative(),
      beforeHash: z.string().min(1),
      beforeFileHash: z.string().min(1),
      file: z.string().min(1),
      content: z.string(),
    },
  }, async (input) => {
    try { return result(await client.applySourcePatch(input)) } catch (error) { return failure(error) }
  })

  server.registerTool('verify', {
    title: 'Verify AskewlyDesign state',
    description: 'Verify that the bridge still has the expected canonical revision and hash.',
    inputSchema: { revision: z.number().int().nonnegative().optional(), hash: z.string().min(1).optional() },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (input) => {
    try { return result(await client.verify(input)) } catch (error) { return failure(error) }
  })

  server.registerTool('undo', {
    title: 'Undo latest AskewlyDesign transaction',
    description: 'Undo the latest committed agent transaction as a new guarded canonical revision.',
    inputSchema: {
      transactionId: z.string().min(1),
      baseRevision: z.number().int().nonnegative(),
      beforeHash: z.string().min(1),
    },
  }, async (input) => {
    try { return result(await client.undo(input)) } catch (error) { return failure(error) }
  })

  return server
}
