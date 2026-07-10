import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import type { AgentDesignDesktopHost, DesktopBridgeStatus } from './desktopHost'

afterEach(() => {
  cleanup()
  delete window.agentDesignHost
})

describe('desktop bridge surface', () => {
  it('shows only redacted lifecycle state and asks main to copy terminal commands', async () => {
    const ready: DesktopBridgeStatus = {
      apiVersion: 1,
      state: 'ready',
      projectId: 'project:fixture',
      restartCount: 1,
      cursor: 4,
      revision: 4,
      lastErrorCode: null,
    }
    const copyTerminalCommand = vi.fn(async () => ({ copied: true as const }))
    const host: AgentDesignDesktopHost = {
      apiVersion: 1,
      getHostInfo: vi.fn(),
      getBridgeStatus: vi.fn(async () => ready),
      copyTerminalCommand,
      onBridgeStatus: vi.fn(() => () => undefined),
    }
    window.agentDesignHost = host

    const view = render(<App />)
    await waitFor(() => expect(view.getByTestId('desktop-bridge-status').textContent).toContain('desktop ready · restart 1'))
    expect(view.getByTestId('desktop-bridge-status').textContent).not.toMatch(/token|127\.0\.0\.1|C:\\/i)
    fireEvent.click(view.getByRole('button', { name: 'Copy Codex' }))
    fireEvent.click(view.getByRole('button', { name: 'Copy Claude' }))
    await waitFor(() => expect(copyTerminalCommand).toHaveBeenCalledTimes(2))
    expect(copyTerminalCommand).toHaveBeenNthCalledWith(1, { apiVersion: 1, actor: 'codex' })
    expect(copyTerminalCommand).toHaveBeenNthCalledWith(2, { apiVersion: 1, actor: 'claude' })
  })
})
