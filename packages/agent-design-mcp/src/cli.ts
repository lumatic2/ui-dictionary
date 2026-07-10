#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createAgentDesignMcp } from './server.js'

const bridgeUrl = process.env.AGENT_DESIGN_BRIDGE_URL
const token = process.env.AGENT_DESIGN_SESSION_TOKEN
const actor = process.env.AGENT_DESIGN_ACTOR

if (!bridgeUrl || !token || (actor !== 'codex' && actor !== 'claude')) {
  process.stderr.write('AGENT_DESIGN_BRIDGE_URL, AGENT_DESIGN_SESSION_TOKEN, and AGENT_DESIGN_ACTOR=codex|claude are required.\n')
  process.exitCode = 1
} else {
  const server = createAgentDesignMcp({ bridgeUrl, token, actor })
  await server.connect(new StdioServerTransport())
}
