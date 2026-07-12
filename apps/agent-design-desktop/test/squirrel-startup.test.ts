import { describe, expect, it } from 'vitest'
import { squirrelStartupPlan } from '../src/squirrel-startup'

describe('Squirrel startup lifecycle', () => {
  it('creates and removes the packaged shortcut through the parent Update.exe', () => {
    const executable = 'C:\\Users\\test\\AppData\\Local\\askewly_design\\app-0.1.0\\AskewlyDesign.exe'
    expect(squirrelStartupPlan(['AskewlyDesign.exe', '--squirrel-install'], executable, 'win32')).toEqual({
      event: '--squirrel-install',
      updateExecutable: 'C:\\Users\\test\\AppData\\Local\\askewly_design\\Update.exe',
      args: ['--createShortcut=AskewlyDesign.exe'],
    })
    expect(squirrelStartupPlan(['AskewlyDesign.exe', '--squirrel-uninstall'], executable, 'win32')?.args).toEqual(['--removeShortcut=AskewlyDesign.exe'])
    expect(squirrelStartupPlan(['AskewlyDesign.exe', '--squirrel-firstrun'], executable, 'win32')?.args).toEqual(['--createShortcut=AskewlyDesign.exe'])
  })

  it('ignores normal and non-Windows starts and quits obsolete versions without spawning', () => {
    expect(squirrelStartupPlan(['AskewlyDesign.exe'], 'C:\\AskewlyDesign.exe', 'win32')).toBeNull()
    expect(squirrelStartupPlan(['AskewlyDesign.exe', '--squirrel-install'], '/tmp/AskewlyDesign', 'linux')).toBeNull()
    expect(squirrelStartupPlan(['AskewlyDesign.exe', '--squirrel-obsolete'], 'C:\\AskewlyDesign.exe', 'win32')).toEqual({ event: '--squirrel-obsolete', updateExecutable: null, args: [] })
  })
})
