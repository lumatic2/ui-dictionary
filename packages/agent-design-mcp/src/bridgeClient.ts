export type AdapterActor = 'codex' | 'claude'

export interface BridgeClientOptions {
  url: string
  token: string
  actor: AdapterActor
}

export class BridgeRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'BridgeRequestError'
  }
}

export class BridgeClient {
  constructor(private readonly options: BridgeClientOptions) {}

  private async request(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.options.url}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${this.options.token}`,
        'content-type': 'application/json',
        ...init?.headers,
      },
    })
    const body = (await response.json()) as Record<string, unknown>
    if (!response.ok) {
      const error = body.error as { code?: string; message?: string } | undefined
      throw new BridgeRequestError(response.status, error?.code ?? 'BRIDGE_ERROR', error?.message ?? `bridge returned ${response.status}`)
    }
    return body
  }

  context() {
    return this.request('/context')
  }

  applyOperations(input: { transactionId: string; baseRevision: number; beforeHash: string; operations: unknown[] }) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        id: input.transactionId,
        actor: this.options.actor,
        baseRevision: input.baseRevision,
        beforeHash: input.beforeHash,
        operations: input.operations,
      }),
    })
  }

  applySourcePatch(input: { transactionId: string; baseRevision: number; beforeHash: string; file: string; content: string }) {
    return this.request('/source-patches', { method: 'POST', body: JSON.stringify({ ...input, actor: this.options.actor }) })
  }

  verify(input: { revision?: number; hash?: string }) {
    return this.request('/verify', { method: 'POST', body: JSON.stringify(input) })
  }

  undo(input: { transactionId: string; baseRevision: number; beforeHash: string }) {
    return this.request('/undo', {
      method: 'POST',
      body: JSON.stringify({
        id: input.transactionId,
        actor: this.options.actor,
        baseRevision: input.baseRevision,
        beforeHash: input.beforeHash,
        at: new Date().toISOString(),
      }),
    })
  }
}
