import { describe, expect, it } from 'vitest'
import { squirrelStartupPlan } from '../src/squirrel-startup'

describe('Squirrel startup lifecycle', () => {
  it('creates and removes the packaged shortcut through the parent Update.exe', () => {
    const executable = 'C:\\Users\\test\\AppData\\Local\\agent_design\\app-0.1.0\\AgentDesign.exe'
    expect(squirrelStartupPlan(['AgentDesign.exe', '--squirrel-install'], executable, 'win32')).toEqual({
      event: '--squirrel-install',
      updateExecutable: 'C:\\Users\\test\\AppData\\Local\\agent_design\\Update.exe',
      args: ['--createShortcut=AgentDesign.exe'],
    })
    expect(squirrelStartupPlan(['AgentDesign.exe', '--squirrel-uninstall'], executable, 'win32')?.args).toEqual(['--removeShortcut=AgentDesign.exe'])
    expect(squirrelStartupPlan(['AgentDesign.exe', '--squirrel-firstrun'], executable, 'win32')?.args).toEqual(['--createShortcut=AgentDesign.exe'])
  })

  it('ignores normal and non-Windows starts and quits obsolete versions without spawning', () => {
    expect(squirrelStartupPlan(['AgentDesign.exe'], 'C:\\AgentDesign.exe', 'win32')).toBeNull()
    expect(squirrelStartupPlan(['AgentDesign.exe', '--squirrel-install'], '/tmp/AgentDesign', 'linux')).toBeNull()
    expect(squirrelStartupPlan(['AgentDesign.exe', '--squirrel-obsolete'], 'C:\\AgentDesign.exe', 'win32')).toEqual({ event: '--squirrel-obsolete', updateExecutable: null, args: [] })
  })
})
