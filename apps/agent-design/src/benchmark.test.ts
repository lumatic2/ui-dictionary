import { describe, expect, it } from 'vitest'
import { appModeFromSearch } from './benchmark'

describe('application mode boundary', () => {
  it('defaults every URL to production', () => {
    expect(appModeFromSearch('')).toBe('production')
    expect(appModeFromSearch('?benchmark=0')).toBe('production')
  })

  it('requires the explicit benchmark flag', () => {
    expect(appModeFromSearch('?benchmark=1')).toBe('benchmark')
  })
})
