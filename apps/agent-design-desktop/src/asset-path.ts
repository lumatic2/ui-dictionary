import { realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve } from 'node:path'

function isContained(root: string, candidate: string): boolean {
  const child = relative(root, candidate)
  return child === '' || (!child.startsWith('..') && !isAbsolute(child))
}

export async function resolveAppAsset(root: string, rawPathname: string): Promise<string> {
  const canonicalRoot = await realpath(root)
  const decoded = decodeURIComponent(rawPathname)
  const relativePath = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '')
  const candidate = await realpath(resolve(canonicalRoot, relativePath))
  if (!isContained(canonicalRoot, candidate)) {
    throw new Error('app asset escapes renderer root')
  }
  return candidate
}
