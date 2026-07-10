import { describe, expect, it } from 'vitest'
import { HOST_API_VERSION, parseHostRequest } from '../src/contract'

describe('host authority contract', () => {
  it('accepts versioned opaque project and session identifiers', () => {
    expect(
      parseHostRequest({
        apiVersion: HOST_API_VERSION,
        projectId: 'project:alpha-1',
        sessionId: 'session.42',
      }),
    ).toEqual({ apiVersion: 1, projectId: 'project:alpha-1', sessionId: 'session.42' })
  })

  it.each([
    null,
    { apiVersion: 2 },
    { apiVersion: 1, path: 'C:\\secret' },
    { apiVersion: 1, command: 'powershell' },
    { apiVersion: 1, projectId: '../escape' },
    { apiVersion: 1, sessionId: '' },
  ])('rejects unversioned or authority-bearing input %#', (input) => {
    expect(() => parseHostRequest(input)).toThrow()
  })
})
