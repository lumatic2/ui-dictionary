# Agent Design Terminal Connection

The user starts Codex CLI or Claude CLI in a terminal they control. Both launch the same stdio MCP adapter and forward to one running project-local bridge. In the desktop app, Electron supervises that bridge and the canvas exposes only redacted lifecycle state plus **Copy Codex** / **Copy Claude** actions. The session token and complete command remain in Electron main/clipboard and are never returned to the renderer main world.

Required session values:

```text
AGENT_DESIGN_BRIDGE_URL=http://127.0.0.1:<port>
AGENT_DESIGN_SESSION_TOKEN=<ephemeral token printed by the bridge>
AGENT_DESIGN_ACTOR=codex|claude
```

The token is session-only. Do not commit it or place it in user-global configuration.

## Codex one-shot connection

Use Codex configuration overrides for the current launch. This avoids writing `~/.codex/config.toml`.

```powershell
$adapter = (Resolve-Path packages/agent-design-mcp/dist/cli.js).Path
codex `
  -c 'mcp_servers.agent-design.command="node"' `
  -c "mcp_servers.agent-design.args=['$adapter']" `
  -c 'mcp_servers.agent-design.env.AGENT_DESIGN_BRIDGE_URL="http://127.0.0.1:<port>"' `
  -c 'mcp_servers.agent-design.env.AGENT_DESIGN_SESSION_TOKEN="<session-token>"' `
  -c 'mcp_servers.agent-design.env.AGENT_DESIGN_ACTOR="codex"'
```

## Claude one-shot connection

Claude accepts an inline MCP config for the current launch. Agent Design generates this JSON and copies the complete command; it does not create `.mcp.json` or change user settings.

```powershell
$adapter = (Resolve-Path packages/agent-design-mcp/dist/cli.js).Path
$config = '{"mcpServers":{"agent-design":{"type":"stdio","command":"node","args":["<adapter-path>"],"env":{"AGENT_DESIGN_BRIDGE_URL":"http://127.0.0.1:<port>","AGENT_DESIGN_SESSION_TOKEN":"<session-token>","AGENT_DESIGN_ACTOR":"claude"}}}}'
claude --strict-mcp-config --mcp-config $config
```

Closing Agent Design invalidates the session token and gracefully stops the supervised bridge. Neither connection path spawns an agent or writes persistent MCP configuration.
