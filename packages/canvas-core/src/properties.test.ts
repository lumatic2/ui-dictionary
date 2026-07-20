import { afterEach, describe, expect, it } from 'vitest'
import { createDocumentFixture, firstComponent } from './fixtures.js'
import { applyOperation, commitOperation, createHistory, invertOperation, redo, undo } from './operations.js'
import { recoverSnapshot, serializeSnapshot } from './persistence.js'
import { propertyFieldsForNode, registerTokenVocabulary, validateNodePropertyEdit } from './properties.js'

const at = '2026-07-10T09:47:00.000Z'

describe('typed property runtime', () => {
  it('derives kind-aware fields and commits typed props, variants, tokens, layout, and mode', () => {
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(propertyFieldsForNode(component).map((field) => `${field.scope}.${field.key}`)).toEqual(expect.arrayContaining([
      'prop.label', 'prop.disabled', 'variant.size', 'token.background', 'layout.mode',
    ]))
    document = applyOperation(document, { id: 'prop', at, type: 'set-node-property', nodeId: component.id, scope: 'prop', key: 'disabled', value: true })
    document = applyOperation(document, { id: 'variant', at, type: 'set-node-property', nodeId: component.id, scope: 'variant', key: 'size', value: 'lg' })
    document = applyOperation(document, { id: 'token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'surface.base' })
    document = applyOperation(document, { id: 'layout', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'horizontal', value: 'fill' })
    document = applyOperation(document, { id: 'mode', at, type: 'set-token-mode', tokenSetId: 'askewly.dark' })
    expect(firstComponent(document).props.disabled).toBe(true)
    expect(firstComponent(document).variants.size).toBe('lg')
    expect(firstComponent(document).tokenBindings.background).toBe('surface.base')
    expect(firstComponent(document).layout.horizontal).toBe('fill')
    expect(document.tokenSetId).toBe('askewly.dark')
  })

  it('rejects unknown, mismatched, and invalid property input before mutation', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(validateNodePropertyEdit(document, { nodeId: component.id, scope: 'prop', key: 'missing', value: true })).toContain('unknown prop')
    expect(() => applyOperation(document, { id: 'bad-type', at, type: 'set-node-property', nodeId: component.id, scope: 'prop', key: 'disabled', value: 'yes' })).toThrow('type mismatch')
    expect(() => applyOperation(document, { id: 'bad-token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'purple' })).toThrow('invalid token')
    expect(() => applyOperation(document, { id: 'bad-variant', at, type: 'set-node-property', nodeId: component.id, scope: 'variant', key: 'size', value: '' })).toThrow('invalid variant')
    expect(() => applyOperation(document, { id: 'bad-mode', at, type: 'set-token-mode', tokenSetId: 'dark' })).toThrow('invalid token mode')
  })

  it('applies uniform padding and gap through the layout scope', () => {
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    document = applyOperation(document, { id: 'gap', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'gap', value: 12 })
    document = applyOperation(document, { id: 'padding', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'padding', value: 20 })
    expect(firstComponent(document).layout.gap).toBe(12)
    expect(firstComponent(document).layout.padding).toEqual([20, 20, 20, 20])
    expect(propertyFieldsForNode(firstComponent(document)).map((field) => `${field.scope}.${field.key}`)).toEqual(expect.arrayContaining(['layout.gap', 'layout.padding']))
    expect(() => applyOperation(document, { id: 'bad-padding', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'padding', value: -1 })).toThrow('invalid layout padding')
  })

  it('commits Korean text as one operation and restores it through undo/redo', () => {
    const document = createDocumentFixture(1000)
    const history = commitOperation(createHistory(document), { id: 'ime-1', at, type: 'update-text', nodeId: 'node-00007', text: '한글 조합 완료' })
    expect(history.log).toHaveLength(1)
    expect(history.present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 조합 완료' })
    expect(undo(history).present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 캔버스 입력' })
    expect(redo(undo(history)).present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 조합 완료' })
  })
})

/**
 * ECT1 step-3 — 없는 토큰은 저장되지 않는다.
 *
 * EU5까지 이 검사가 없었다. 모양(`x.y`)만 맞으면 없는 토큰도 **저장됐고**, 결함은
 * 렌더 시점의 `data-token-unresolved`로만 남았다 — 화면은 아무 말도 하지 않았다.
 * "조용히 거부"가 아니라 "조용히 수용"이었다.
 */
describe('토큰 실재 검증 (ECT1 step-3)', () => {
  const vocabulary = (tokenSetId: string, name: string) =>
    tokenSetId === 'askewly.default' && ['surface.base', 'surface.muted', 'text.default'].includes(name)

  afterEach(() => registerTokenVocabulary(null))

  it('등록 전에는 모양 검사만 한다 — 이 계층은 어휘를 모른다', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    // "통과"가 아니라 "답할 수 없다"는 상태다. 등록하는 쪽이 이 구멍을 닫는다.
    expect(validateNodePropertyEdit(document, {
      nodeId: component.id, scope: 'token', key: 'background', value: 'surface.nonexistent',
    })).toBeNull()
  })

  it('등록 후에는 실재하지 않는 토큰을 거부한다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const error = validateNodePropertyEdit(document, {
      nodeId: component.id, scope: 'token', key: 'background', value: 'surface.nonexistent',
    })
    expect(error).toContain('surface.nonexistent')
    // 사유는 role="alert"로 사용자에게 그대로 나간다 — 내부 용어가 아니어야 한다.
    expect(error).toContain('토큰 세트에 없습니다')
  })

  it('실재하는 토큰은 그대로 저장된다', () => {
    registerTokenVocabulary(vocabulary)
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(validateNodePropertyEdit(document, {
      nodeId: component.id, scope: 'token', key: 'background', value: 'surface.muted',
    })).toBeNull()
    document = applyOperation(document, {
      id: 'token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'surface.muted',
    })
    expect(firstComponent(document).tokenBindings.background).toBe('surface.muted')
  })

  it('저장 경로(applyOperation)도 막는다 — 검증만 통과시키고 쓰기를 열어두지 않는다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'surface.nonexistent',
    })).toThrow(/surface\.nonexistent/)
    // 문서는 건드려지지 않았다.
    expect(firstComponent(document).tokenBindings.background).not.toBe('surface.nonexistent')
  })

  it('모양이 틀린 값은 어휘와 무관하게 여전히 거부된다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(validateNodePropertyEdit(document, {
      nodeId: component.id, scope: 'token', key: 'background', value: 'notatoken',
    })).toContain('invalid token reference')
  })

  it('이미 미해결 바인딩이 든 문서는 그대로 열린다 — 소급 무효화하지 않는다', () => {
    // 저장 시점만 막는다. 여기서 읽기까지 막으면 사용자가 자기 문서를 못 연다.
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    component.tokenBindings.background = 'surface.gone'
    const reopened = recoverSnapshot(serializeSnapshot(document, []))
    expect(reopened.present.nodes[component.id].tokenBindings.background).toBe('surface.gone')
  })

  it('모르는 세트에서는 아무 토큰도 실재하지 않는다', () => {
    registerTokenVocabulary(vocabulary)
    const document = { ...createDocumentFixture(1000), tokenSetId: 'nope.set' }
    expect(validateNodePropertyEdit(document, {
      nodeId: firstComponent(document).id, scope: 'token', key: 'background', value: 'surface.muted',
    })).toContain('토큰 세트에 없습니다')
  })
})

/**
 * ECT1 검증 후속 — 토큰이 문서에 들어가는 **모든 경로**가 같은 규칙을 통과한다.
 *
 * 독립 검증이 ECT1 주장을 refuted했다(2026-07-21): `set-node-property`는 막았지만
 * `update-node`의 `patch.tokenBindings`는 검사 0으로 통과했다. 그리고 그쪽이 하필
 * 라이브 브리지로 **에이전트가 문서를 고치는 표면**이었다 — 이 milestone이 닫겠다고 한 바로 그곳.
 *
 * 경로마다 규칙을 따로 두면 한 경로만 막힌다. 규칙을 `validateTokenBinding` 하나로 모았고,
 * 여기서 두 경로를 같은 공격으로 두드린다.
 */
describe('토큰 검증은 경로를 가리지 않는다 (ECT1 검증 후속)', () => {
  const vocabulary = (tokenSetId: string, name: string) =>
    tokenSetId === 'askewly.default' && ['surface.base', 'surface.muted'].includes(name)

  afterEach(() => registerTokenVocabulary(null))

  it('create-node로 처음부터 가짜 토큰을 박는 것도 거부한다', () => {
    // 독립 검증 2차가 뚫은 경로. update-node를 막았더니 여기가 열려 있었다.
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const parentId = document.rootIds[0]
    const evil = {
      ...structuredClone(document.nodes[parentId]),
      id: 'evil-node-1', parentId, childIds: [],
      tokenBindings: { background: 'totally.fake.token' },
    }
    expect(() => applyOperation(document, {
      id: 'create', at, type: 'create-node', node: evil as never, parentId, index: 0,
    })).toThrow(/totally\.fake\.token/)
    expect(document.nodes['evil-node-1']).toBeUndefined()
  })

  it('batch로 감싸도 거부한다 — 길목은 하나다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'batch', at, type: 'batch', operations: [
        { id: 'inner', at, type: 'update-node', nodeId: component.id,
          patch: { tokenBindings: { background: 'totally.fake.token' } } },
      ],
    })).toThrow(/totally\.fake\.token/)
  })

  it('손대지 않은 기존 죽은 바인딩은 다른 연산을 막지 않는다', () => {
    // 델타 검사인 이유. 문서 전체를 보면 사용자가 자기 문서에서 아무 것도 못 하게 된다.
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    component.tokenBindings.background = 'surface.longgone'
    const moved = applyOperation(document, {
      id: 'rename', at, type: 'update-node', nodeId: component.id, patch: { name: '이름만 바꾼다' },
    })
    expect(moved.nodes[component.id].name).toBe('이름만 바꾼다')
    expect(moved.nodes[component.id].tokenBindings.background).toBe('surface.longgone')
  })

  it('update-node의 patch.tokenBindings도 없는 토큰을 거부한다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'patch', at, type: 'update-node', nodeId: component.id,
      patch: { tokenBindings: { background: 'totally.fake.token' } },
    })).toThrow(/totally\.fake\.token/)
    expect(firstComponent(document).tokenBindings.background).not.toBe('totally.fake.token')
  })

  it('update-node의 patch.tokenBindings는 모양도 본다', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'patch', at, type: 'update-node', nodeId: component.id,
      patch: { tokenBindings: { background: 'notatoken' } },
    })).toThrow(/invalid token reference/)
  })

  it('실재하는 토큰은 update-node로도 들어간다', () => {
    registerTokenVocabulary(vocabulary)
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    document = applyOperation(document, {
      id: 'patch', at, type: 'update-node', nodeId: component.id,
      patch: { tokenBindings: { background: 'surface.muted' } },
    })
    expect(firstComponent(document).tokenBindings.background).toBe('surface.muted')
  })

  it('토큰이 없는 patch는 영향받지 않는다 — 이름·bounds 갱신은 그대로', () => {
    registerTokenVocabulary(vocabulary)
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    document = applyOperation(document, {
      id: 'patch', at, type: 'update-node', nodeId: component.id, patch: { name: '새 이름' },
    })
    expect(firstComponent(document).name).toBe('새 이름')
  })

  it('두 경로가 같은 사유 문자열을 낸다 — 규칙이 하나라는 증거', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const viaProperty = validateNodePropertyEdit(document, {
      nodeId: component.id, scope: 'token', key: 'background', value: 'surface.gone',
    })
    let viaPatch = ''
    try {
      applyOperation(document, {
        id: 'patch', at, type: 'update-node', nodeId: component.id,
        patch: { tokenBindings: { background: 'surface.gone' } },
      })
    } catch (error) { viaPatch = (error as Error).message }
    expect(viaPatch).toContain(viaProperty!)
  })
})

/**
 * ECT3 step-2 — 묶인 것을 푼다(Figma식 detach).
 *
 * 사용자 결정: 탈출구 있음. 기본은 토큰이고 명시적 detach로 벗어나면 리터럴을 쓴다.
 * **푸는 것이지 바꾸는 게 아니다** — detach 순간 화면 색은 그대로여야 한다.
 */
describe('토큰에서 벗어나고 되돌아온다 (ECT3 step-2)', () => {
  const vocabulary = (tokenSetId: string, name: string) =>
    tokenSetId === 'askewly.default' && ['surface.base', 'surface.muted'].includes(name)

  afterEach(() => registerTokenVocabulary(null))

  const detach = (nodeId: string, key: string, literal: string) =>
    ({ id: 'detach', at, type: 'detach-token-binding' as const, nodeId, key, literal })
  const attach = (nodeId: string, key: string, name: string) =>
    ({ id: 'attach', at, type: 'attach-token-binding' as const, nodeId, key, name })

  it('풀면 바인딩이 사라지고 그 색이 리터럴로 남는다 — 색은 안 변한다', () => {
    registerTokenVocabulary(vocabulary)
    let document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    document = applyOperation(document, attach(id, 'background', 'surface.muted'))
    document = applyOperation(document, detach(id, 'background', '#123456'))
    const node = document.nodes[id]
    expect(node.tokenBindings.background).toBeUndefined()
    expect(node.literalColors?.background).toBe('#123456')
  })

  it('색 없는 detach는 거부한다 — 색을 잃어버리는 detach는 없다', () => {
    const document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    expect(() => applyOperation(document, detach(id, 'background', ''))).toThrow(/detaching to/)
  })

  it('다시 묶으면 리터럴이 사라진다 — 두 출처가 같이 남지 않는다', () => {
    registerTokenVocabulary(vocabulary)
    let document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    document = applyOperation(document, detach(id, 'background', '#123456'))
    document = applyOperation(document, attach(id, 'background', 'surface.base'))
    const node = document.nodes[id]
    expect(node.tokenBindings.background).toBe('surface.base')
    expect(node.literalColors?.background).toBeUndefined()
  })

  it('다시 묶을 때도 토큰 실재를 검사한다 — 이 경로로 새지 않는다', () => {
    registerTokenVocabulary(vocabulary)
    const document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    expect(() => applyOperation(document, attach(id, 'background', 'surface.nonexistent'))).toThrow(/토큰 세트에 없습니다/)
  })

  it('undo가 detach를 정확히 되돌린다', () => {
    registerTokenVocabulary(vocabulary)
    let history = createHistory(createDocumentFixture(1000))
    const id = firstComponent(history.present).id
    history = commitOperation(history, attach(id, 'background', 'surface.muted'))
    history = commitOperation(history, detach(id, 'background', '#123456'))
    expect(history.present.nodes[id].literalColors?.background).toBe('#123456')

    history = undo(history)
    expect(history.present.nodes[id].tokenBindings.background).toBe('surface.muted')
    expect(history.present.nodes[id].literalColors?.background).toBeUndefined()

    history = redo(history)
    expect(history.present.nodes[id].literalColors?.background).toBe('#123456')
    expect(history.present.nodes[id].tokenBindings.background).toBeUndefined()
  })

  it('undo가 attach도 정확히 되돌린다 — 리터럴로 복귀', () => {
    registerTokenVocabulary(vocabulary)
    let history = createHistory(createDocumentFixture(1000))
    const id = firstComponent(history.present).id
    history = commitOperation(history, detach(id, 'background', '#abcdef'))
    history = commitOperation(history, attach(id, 'background', 'surface.base'))
    history = undo(history)
    expect(history.present.nodes[id].literalColors?.background).toBe('#abcdef')
    expect(history.present.nodes[id].tokenBindings.background).toBeUndefined()
  })

  it('이미 벗어난 키에 다시 쓰면 리터럴만 갱신된다 — 원시 색 편집이 같은 연산을 탄다', () => {
    let document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    document = applyOperation(document, detach(id, 'background', '#111111'))
    document = applyOperation(document, detach(id, 'background', '#222222'))
    expect(document.nodes[id].literalColors?.background).toBe('#222222')
    expect(document.nodes[id].tokenBindings.background).toBeUndefined()
  })

  it('되돌릴 색 출처가 없으면 역함수가 조용히 넘어가지 않는다', () => {
    const document = createDocumentFixture(1000)
    const id = firstComponent(document).id
    // background 바인딩도 리터럴도 없는 상태에서의 detach 역함수
    const bare = structuredClone(document)
    delete bare.nodes[id].tokenBindings.background
    expect(() => invertOperation(bare, detach(id, 'background', '#000000'))).toThrow(/colour source/)
  })
})
