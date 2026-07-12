import { describe, expect, it } from 'vitest'
import { buildTerminalCommand } from '../src/terminal-command'

const connection = {
  bridgeUrl: 'http://127.0.0.1:43123',
  token: 'session-token-not-written-to-config',
  adapterPath: "C:\\Program Files\\AskewlyDesign\\mcp\\cli.js",
}

describe('session-scoped terminal commands', () => {
  it('builds Codex one-shot overrides without persistent configuration', () => {
    const command = buildTerminalCommand('codex', connection)
    expect(command).toContain('codex -c')
    expect(command).toContain(connection.bridgeUrl)
    expect(command).toContain(connection.token)
    expect(command).toContain('AGENT_DESIGN_ACTOR')
    expect(command).toContain('codex')
    expect(command).not.toMatch(/config\.toml|mcp add|Set-Content|Out-File/i)
  })

  it('builds Claude strict inline MCP config without creating .mcp.json', () => {
    const command = buildTerminalCommand('claude', connection)
    expect(command).toContain('claude --strict-mcp-config --mcp-config')
    expect(command).toContain(connection.bridgeUrl)
    expect(command).toContain(connection.token)
    expect(command).toContain('AGENT_DESIGN_ACTOR')
    expect(command).toContain('claude')
    expect(command).not.toMatch(/\.mcp\.json|mcp add|Set-Content|Out-File/i)
  })
})
