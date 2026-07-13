import { win32 as path } from 'node:path'

export type SquirrelStartupPlan = Readonly<{
  event: '--squirrel-install' | '--squirrel-updated' | '--squirrel-uninstall' | '--squirrel-obsolete' | '--squirrel-firstrun'
  updateExecutable: string | null
  args: readonly string[]
}>

export function squirrelStartupPlan(argv: readonly string[], executablePath: string, platform = process.platform): SquirrelStartupPlan | null {
  if (platform !== 'win32') return null
  const event = argv[1]
  if (event !== '--squirrel-install' && event !== '--squirrel-updated' && event !== '--squirrel-uninstall' && event !== '--squirrel-obsolete' && event !== '--squirrel-firstrun') return null
  if (event === '--squirrel-obsolete') return Object.freeze({ event, updateExecutable: null, args: Object.freeze([]) })
  const action = event === '--squirrel-uninstall' ? '--removeShortcut' : '--createShortcut'
  return Object.freeze({
    event,
    updateExecutable: path.resolve(path.dirname(executablePath), '..', 'Update.exe'),
    args: Object.freeze([`${action}=${path.basename(executablePath)}`]),
  })
}
