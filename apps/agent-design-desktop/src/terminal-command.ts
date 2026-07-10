import type { TerminalActor } from './contract'

export type { TerminalActor } from './contract'

export interface TerminalConnection {
  bridgeUrl: string
  token: string
  adapterPath: string
}

function powershellLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function adapterEnvironment(connection: TerminalConnection, actor: TerminalActor): Record<string, string> {
  return {
    AGENT_DESIGN_BRIDGE_URL: connection.bridgeUrl,
    AGENT_DESIGN_SESSION_TOKEN: connection.token,
    AGENT_DESIGN_ACTOR: actor,
  }
}

export function buildTerminalCommand(actor: TerminalActor, connection: TerminalConnection): string {
  if (actor === 'codex') {
    const settings = [
      'mcp_servers.agent-design.command="node"',
      `mcp_servers.agent-design.args=${JSON.stringify([connection.adapterPath])}`,
      ...Object.entries(adapterEnvironment(connection, actor)).map(
        ([key, value]) => `mcp_servers.agent-design.env.${key}=${JSON.stringify(value)}`,
      ),
    ]
    return `codex ${settings.map((setting) => `-c ${powershellLiteral(setting)}`).join(' ')}`
  }

  const config = JSON.stringify({
    mcpServers: {
      'agent-design': {
        type: 'stdio',
        command: 'node',
        args: [connection.adapterPath],
        env: adapterEnvironment(connection, actor),
      },
    },
  })
  return `claude --strict-mcp-config --mcp-config ${powershellLiteral(config)}`
}
