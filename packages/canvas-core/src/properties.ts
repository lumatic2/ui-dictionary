import type { CanvasDocument, CanvasNode, LayoutMode, PropValue, SizingMode } from './types.js'

export type NodePropertyScope = 'prop' | 'override' | 'variant' | 'token' | 'layout'

export interface NodePropertyEdit {
  nodeId: string
  scope: NodePropertyScope
  key: string
  value: PropValue
}

export interface PropertyField {
  scope: NodePropertyScope
  key: string
  label: string
  value: PropValue
  valueType: 'string' | 'number' | 'boolean' | 'select'
  options?: string[]
}

/**
 * 토큰 이름이 그 세트에 **실재하는가**를 답하는 조회 함수.
 *
 * canvas-core는 런타임 의존이 없고 어휘(편집기/템플릿)를 알지 못한다 — 알아선 안 된다.
 * 그래서 어휘를 아는 쪽(앱)이 조회 함수를 등록한다.
 *
 * 등록 전에는 **모양 검사만** 한다. 이건 이 계층이 답할 수 없는 질문에 대해
 * "모른다"로 남는 것이지 "통과"가 아니다 — 등록하는 쪽이 그 구멍을 닫는다.
 */
export type TokenVocabularyLookup = (tokenSetId: string, tokenName: string) => boolean

let tokenVocabulary: TokenVocabularyLookup | null = null

/** 어휘를 아는 쪽이 부른다. `null`이면 모양 검사만 하던 상태로 돌아간다(테스트 격리용). */
export function registerTokenVocabulary(lookup: TokenVocabularyLookup | null): void {
  tokenVocabulary = lookup
}

const layoutModes = new Set<LayoutMode>(['absolute', 'horizontal', 'vertical'])
const sizingModes = new Set<SizingMode>(['fixed', 'hug', 'fill'])
const safeKey = /^[a-zA-Z][a-zA-Z0-9._-]*$/
const tokenReference = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/

function sameValueType(current: PropValue, next: PropValue): boolean {
  return current === null || next === null || typeof current === typeof next
}

export function validateNodePropertyEdit(document: CanvasDocument, edit: NodePropertyEdit): string | null {
  const node = document.nodes[edit.nodeId]
  if (!node) return `missing node ${edit.nodeId}`
  if (!safeKey.test(edit.key)) return `invalid property key ${edit.key}`
  if (edit.scope === 'prop') {
    if (node.kind !== 'code-component') return 'props require a code-component node'
    if (!(edit.key in node.props)) return `unknown prop ${edit.key}`
    if (!sameValueType(node.props[edit.key], edit.value)) return `prop ${edit.key} type mismatch`
  } else if (edit.scope === 'override') {
    if (node.kind !== 'instance') return 'overrides require an instance node'
    if (!(edit.key in node.overrides)) return `unknown override ${edit.key}`
    if (!sameValueType(node.overrides[edit.key], edit.value)) return `override ${edit.key} type mismatch`
  } else if (edit.scope === 'variant') {
    if (node.kind !== 'code-component') return 'variants require a code-component node'
    if (!(edit.key in node.variants)) return `unknown variant ${edit.key}`
    if (typeof edit.value !== 'string' || !edit.value.trim() || !safeKey.test(edit.value)) return `invalid variant ${edit.key}`
  } else if (edit.scope === 'token') {
    if (typeof edit.value !== 'string' || !tokenReference.test(edit.value)) return `invalid token reference ${String(edit.value)}`
    // 모양이 맞아도 없는 토큰일 수 있다. EU5까지 이 검사가 없어서 오타가 조용히 *저장*됐고,
    // 결함은 렌더 시점의 data-token-unresolved로만 남았다 — 화면은 아무 말도 하지 않았다.
    // 사유는 그대로 role="alert"로 사용자에게 나가므로 사용자 언어로 적는다.
    if (tokenVocabulary && !tokenVocabulary(document.tokenSetId, edit.value)) {
      return `'${edit.value}' 토큰은 이 문서의 토큰 세트에 없습니다`
    }
  } else if (edit.scope === 'layout') {
    if (edit.key === 'mode' && (typeof edit.value !== 'string' || !layoutModes.has(edit.value as LayoutMode))) return 'invalid layout mode'
    if ((edit.key === 'horizontal' || edit.key === 'vertical') && (typeof edit.value !== 'string' || !sizingModes.has(edit.value as SizingMode))) return 'invalid sizing mode'
    if ((edit.key === 'gap' || edit.key === 'padding') && (typeof edit.value !== 'number' || !Number.isFinite(edit.value) || edit.value < 0)) return `invalid layout ${edit.key}`
    if (!['mode', 'horizontal', 'vertical', 'gap', 'padding'].includes(edit.key)) return `unknown layout property ${edit.key}`
  }
  return null
}

export function readNodeProperty(node: CanvasNode, scope: NodePropertyScope, key: string): PropValue {
  if (scope === 'prop' && node.kind === 'code-component') return node.props[key]
  if (scope === 'override' && node.kind === 'instance') return node.overrides[key]
  if (scope === 'variant' && node.kind === 'code-component') return node.variants[key]
  if (scope === 'token') return node.tokenBindings[key] ?? null
  if (scope === 'layout' && key === 'padding') return node.layout.padding[0]
  if (scope === 'layout' && ['mode', 'horizontal', 'vertical', 'gap'].includes(key)) return node.layout[key as 'mode' | 'horizontal' | 'vertical' | 'gap']
  throw new Error(`property ${scope}.${key} is not available on ${node.kind}`)
}

export function applyNodeProperty(document: CanvasDocument, edit: NodePropertyEdit): void {
  const error = validateNodePropertyEdit(document, edit)
  if (error) throw new Error(error)
  const node = document.nodes[edit.nodeId]
  if (edit.scope === 'prop' && node.kind === 'code-component') node.props[edit.key] = edit.value
  else if (edit.scope === 'override' && node.kind === 'instance') node.overrides[edit.key] = edit.value
  else if (edit.scope === 'variant' && node.kind === 'code-component') node.variants[edit.key] = String(edit.value)
  else if (edit.scope === 'token') node.tokenBindings[edit.key] = String(edit.value)
  else if (edit.scope === 'layout' && edit.key === 'padding') node.layout.padding = [edit.value, edit.value, edit.value, edit.value] as [number, number, number, number]
  else if (edit.scope === 'layout') (node.layout as unknown as Record<string, PropValue>)[edit.key] = edit.value
}

function valueType(value: PropValue): PropertyField['valueType'] {
  return value === null ? 'string' : typeof value as 'string' | 'number' | 'boolean'
}

export function propertyFieldsForNode(node: CanvasNode): PropertyField[] {
  const fields: PropertyField[] = [
    { scope: 'layout', key: 'mode', label: 'Layout', value: node.layout.mode, valueType: 'select', options: [...layoutModes] },
    // 'Width'/'Height'로 부르면 기하 섹션의 실제 너비·높이 숫자와 이름이 겹쳐 서로를 가린다.
    // 이 값은 크기가 아니라 크기를 **정하는 방식**(fixed|hug|fill)이다.
    { scope: 'layout', key: 'horizontal', label: '가로 사이징', value: node.layout.horizontal, valueType: 'select', options: [...sizingModes] },
    { scope: 'layout', key: 'vertical', label: '세로 사이징', value: node.layout.vertical, valueType: 'select', options: [...sizingModes] },
    { scope: 'layout', key: 'gap', label: 'Gap', value: node.layout.gap, valueType: 'number' },
    { scope: 'layout', key: 'padding', label: 'Padding', value: node.layout.padding[0], valueType: 'number' },
    ...Object.entries(node.tokenBindings).map(([key, value]): PropertyField => ({ scope: 'token', key, label: `Token · ${key}`, value, valueType: 'string' })),
  ]
  if (node.kind === 'code-component') {
    fields.push(...Object.entries(node.props).map(([key, value]): PropertyField => ({ scope: 'prop', key, label: `Prop · ${key}`, value, valueType: valueType(value) })))
    fields.push(...Object.entries(node.variants).map(([key, value]): PropertyField => ({ scope: 'variant', key, label: `Variant · ${key}`, value, valueType: 'string' })))
  }
  if (node.kind === 'instance') fields.push(...Object.entries(node.overrides).map(([key, value]): PropertyField => ({ scope: 'override', key, label: `Override · ${key}`, value, valueType: valueType(value) })))
  return fields
}

export function validateTokenMode(tokenSetId: string): boolean {
  return tokenReference.test(tokenSetId)
}
