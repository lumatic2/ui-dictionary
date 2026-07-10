import { describe, expect, it } from 'vitest'
import {
  CONTENT_SECURITY_POLICY,
  LOCKED_WEB_PREFERENCES,
  createMainWindowOptions,
  isTrustedRendererUrl,
} from '../src/security'

describe('desktop renderer security', () => {
  it('locks Node authority out of every renderer context', () => {
    expect(createMainWindowOptions('C:\\preload.cjs').webPreferences).toMatchObject({
      ...LOCKED_WEB_PREFERENCES,
      preload: 'C:\\preload.cjs',
    })
  })

  it.each([
    'https://example.com',
    'file:///C:/project/index.html',
    'app://attacker/index.html',
    'app://renderer:443/index.html',
    'app://user@renderer/index.html',
    'not a url',
  ])('rejects untrusted renderer URL %s', (url) => {
    expect(isTrustedRendererUrl(url)).toBe(false)
  })

  it('allows only the registered renderer origin', () => {
    expect(isTrustedRendererUrl('app://renderer/index.html')).toBe(true)
  })

  it('uses a default-deny CSP with loopback-only bridge connectivity', () => {
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'none'")
    expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'")
    expect(CONTENT_SECURITY_POLICY).toContain('ws://127.0.0.1:*')
    expect(CONTENT_SECURITY_POLICY).not.toContain('https:')
    expect(CONTENT_SECURITY_POLICY).not.toContain('unsafe-eval')
  })
})
