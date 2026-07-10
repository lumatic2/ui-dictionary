# Agent Design Terminal Connection

The user starts Codex CLI or Claude CLI in a terminal they control. Both launch the same stdio MCP adapter and forward to one running project-local bridge.

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

## Claude project-scoped connection

Claude supports an explicit project scope. Run from the trusted project root:

```powershell
$adapter = (Resolve-Path packages/agent-design-mcp/dist/cli.js).Path
claude mcp add --scope project agent-design `
  -e "AGENT_DESIGN_BRIDGE_URL=http://127.0.0.1:<port>" `
  -e "AGENT_DESIGN_SESSION_TOKEN=<session-token>" `
  -e "AGENT_DESIGN_ACTOR=claude" `
  -- node $adapter
claude mcp get agent-design
```

Remove the project entry after a manual smoke if the bridge is not running. AUC4 will replace these development commands with supervised desktop lifecycle and session bootstrap.
