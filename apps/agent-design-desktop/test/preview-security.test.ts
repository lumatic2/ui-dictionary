import { describe, expect, it } from 'vitest'
import { PREVIEW_CSP, PREVIEW_WEB_PREFERENCES } from '../src/preview-security'

describe('project preview security contract', () => {
  it('runs without Node, preload, webview, insecure content, or network capability', () => {
    expect(PREVIEW_WEB_PREFERENCES).toMatchObject({
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    })
    expect(PREVIEW_CSP).toContain("default-src 'none'")
    expect(PREVIEW_CSP).toContain("connect-src 'none'")
    expect(PREVIEW_CSP).toContain("worker-src 'none'")
    expect(PREVIEW_CSP).not.toMatch(/https:|http:|ws:|unsafe-eval/)
  })
})
