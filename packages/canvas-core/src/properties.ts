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

/**
 * 리터럴 색으로 쓸 수 있는 값인가 — **화면에 실제로 칠해질 수 있는 것만** 통과시킨다.
 *
 * 독립 검증(refuted, 2026-07-21): 형식 검사가 "빈 문자열 아님" 하나뿐이라
 * `javascript:alert(1)`·`#zzz`·10만 자 문자열이 전부 저장됐다. 스크립트로 실행되지는
 * 않지만(React가 CSSOM 속성 대입을 쓰므로 파싱 실패 값은 조용히 버려진다) **문서에는
 * 저장되고 화면은 옛 색 그대로 남는다** — 문서와 화면이 어긋난 채 undo 이력에까지 들어간다.
 *
 * 허용: `#RGB[A]`·`#RRGGBB[AA]`, 그리고 색 함수(rgb·hsl·oklch 등)의 괄호 안이
 * 숫자·단위·구분자로만 이뤄진 것. `url(...)`·`javascript:`·`expression(...)`은 걸린다.
 */
const hexColor = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const colorFunctions = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color'])
const colorFunctionCall = /^([a-z]+)\(([^()]*)\)$/
const colorFunctionArgs = /^[0-9a-zA-Z.%,\s/+-]*$/

export function validateLiteralColor(value: unknown): string | null {
  if (typeof value !== 'string') return '색 값은 문자열이어야 합니다'
  const trimmed = value.trim()
  if (!trimmed) return '색 값이 비어 있습니다'
  // 길이 상한 — 파싱 실패 값이 문서를 부풀리는 걸 막는다.
  if (trimmed.length > 64) return '색 값이 너무 깁니다'
  if (hexColor.test(trimmed)) return null
  const call = colorFunctionCall.exec(trimmed)
  if (call && colorFunctions.has(call[1]) && colorFunctionArgs.test(call[2])) return null
  return `'${trimmed}'은(는) 쓸 수 있는 색이 아닙니다`
}

/**
 * 노드가 토큰을 묶을 수 있는 속성 — **이 집합의 정본은 여기 하나다.**
 *
 * 같은 목록이 네 군데 따로 살고 있었다: `template-core`의 `EXPECTED_KIND`,
 * `CanvasSurface.nodeStyle`의 하드코딩, 같은 파일의 미해결 검사 배열, 인스펙터 라벨.
 * 한쪽에 키를 더하면 나머지가 조용히 뒤처진다.
 *
 * 이 horizon은 "규칙이 여러 곳에 흩어져서 한 곳만 막힌다"에 **네 번** 당했다
 * (토큰: update-node→create-node, 키보드: Tab-out, 리터럴: patch·create-node).
 * 그래서 ECT4는 단일 출처를 선택지가 아니라 **통과 조건**으로 잡는다.
 *
 * `canvas-core`에 두는 이유: `tokenBindings`가 여기 정의된 개념이고,
 * `template-core`·앱이 모두 이 패키지에 의존한다(반대 방향은 없다).
 */
export const TOKEN_BINDING_KINDS = {
  background: 'color',
  fill: 'color',
  color: 'color',
  fontFamily: 'fontFamily',
} as const satisfies Record<string, 'color' | 'fontFamily'>

export type TokenBindingKey = keyof typeof TOKEN_BINDING_KINDS

/** 색으로 칠해지는 바인딩 키만. 인스펙터·렌더러가 "색이냐"를 물을 때 쓴다. */
export const COLOR_BINDING_KEYS = (Object.keys(TOKEN_BINDING_KINDS) as TokenBindingKey[])
  .filter((key) => TOKEN_BINDING_KINDS[key] === 'color')

const layoutModes = new Set<LayoutMode>(['absolute', 'horizontal', 'vertical'])
const sizingModes = new Set<SizingMode>(['fixed', 'hug', 'fill'])
const safeKey = /^[a-zA-Z][a-zA-Z0-9._-]*$/
const tokenReference = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/

function sameValueType(current: PropValue, next: PropValue): boolean {
  return current === null || next === null || typeof current === typeof next
}

/**
 * 토큰 바인딩 값 하나가 쓰일 수 있는가 — **토큰이 문서에 들어가는 모든 경로가 이걸 쓴다.**
 *
 * 규칙을 경로마다 따로 두면 한 경로만 막힌다. 실제로 그랬다: ECT1이 `set-node-property`를
 * 막았지만 `update-node`의 `patch.tokenBindings`는 검사 없이 통과했고, 그쪽이 하필
 * 라이브 브리지로 에이전트가 쓰는 표면이었다(독립 검증 refuted, 2026-07-21).
 */
export function validateTokenBinding(tokenSetId: string, value: unknown): string | null {
  if (typeof value !== 'string' || !tokenReference.test(value)) return `invalid token reference ${String(value)}`
  // 사유는 role="alert"로 사용자에게 그대로 나가므로 사용자 언어로 적는다.
  if (tokenVocabulary && !tokenVocabulary(tokenSetId, value)) {
    return `'${value}' 토큰은 이 문서의 토큰 세트에 없습니다`
  }
  return null
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
    // 모양이 맞아도 없는 토큰일 수 있다. EU5까지 이 검사가 없어서 오타가 조용히 *저장*됐고,
    // 결함은 렌더 시점의 data-token-unresolved로만 남았다 — 화면은 아무 말도 하지 않았다.
    return validateTokenBinding(document.tokenSetId, edit.value)
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
    { scope: 'layout', key: 'mode', label: '배치', value: node.layout.mode, valueType: 'select', options: [...layoutModes] },
    // 'Width'/'Height'로 부르면 기하 섹션의 실제 너비·높이 숫자와 이름이 겹쳐 서로를 가린다.
    // 이 값은 크기가 아니라 크기를 **정하는 방식**(fixed|hug|fill)이다.
    { scope: 'layout', key: 'horizontal', label: '가로 사이징', value: node.layout.horizontal, valueType: 'select', options: [...sizingModes] },
    { scope: 'layout', key: 'vertical', label: '세로 사이징', value: node.layout.vertical, valueType: 'select', options: [...sizingModes] },
    { scope: 'layout', key: 'gap', label: '간격', value: node.layout.gap, valueType: 'number' },
    { scope: 'layout', key: 'padding', label: '안쪽 여백', value: node.layout.padding[0], valueType: 'number' },
    ...Object.entries(node.tokenBindings).map(([key, value]): PropertyField => ({ scope: 'token', key, label: `Token · ${key}`, value, valueType: 'string' })),
  ]
  if (node.kind === 'code-component') {
    fields.push(...Object.entries(node.props).map(([key, value]): PropertyField => ({ scope: 'prop', key, label: `속성 · ${key}`, value, valueType: valueType(value) })))
    fields.push(...Object.entries(node.variants).map(([key, value]): PropertyField => ({ scope: 'variant', key, label: `변형 · ${key}`, value, valueType: 'string' })))
  }
  if (node.kind === 'instance') fields.push(...Object.entries(node.overrides).map(([key, value]): PropertyField => ({ scope: 'override', key, label: `덮어쓰기 · ${key}`, value, valueType: valueType(value) })))
  return fields
}

export function validateTokenMode(tokenSetId: string): boolean {
  return tokenReference.test(tokenSetId)
}
