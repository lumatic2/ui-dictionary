import { describe, expect, it } from 'vitest'
import { exactChanges, unifiedDiff } from './audit.js'

describe('exact audit diff', () => {
  it('records exact JSON pointer before and after values', () => {
    expect(exactChanges({ node: { name: 'Before', locked: false } }, { node: { name: 'After', locked: false }, revision: 1 })).toEqual([
      { path: '/node/name', before: 'Before', after: 'After' },
      { path: '/revision', after: 1 },
    ])
  })

  it('emits a lossless source replacement diff', () => {
    expect(unifiedDiff('src/App.tsx', 'old\n', 'new\n')).toContain('--- a/src/App.tsx\n+++ b/src/App.tsx\n@@ -1,2 +1,2 @@\n-old\n-\n+new\n+')
  })
})
