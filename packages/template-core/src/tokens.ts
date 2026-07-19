import type { TemplateProject } from './types.js'

/**
 * 토큰 세트 — 색·타이포의 **정본**.
 *
 * TPS3까지 `tokenSetId`는 request에 실려 다니기만 하고 아무것도 조회하지 않는 죽은 문자열이었다.
 * 스튜디오는 별도 팔레트를 하드코딩해 두고 이 값을 무시했다(TH3 적발).
 * 여기가 그 조회 대상이다 — 렌더러는 리터럴을 갖지 않고 이 세트에서 값을 얻는다.
 *
 * 조회 실패는 **조용히 넘어가지 않는다.** 폴백 색을 쓰면 결함이 화면에서 사라지고,
 * 그게 TPS3에서 "선언은 있는데 구현이 없는" 상태를 세 milestone 동안 숨겼다.
 */

export type TokenKind = 'color' | 'fontFamily'

export interface TokenDefinition {
  kind: TokenKind
  value: string
}

export interface TokenSet {
  id: string
  label: string
  tokens: Record<string, TokenDefinition>
}

const warm: TokenSet = {
  id: 'askewly.warm',
  label: '따뜻한 크래프트',
  tokens: {
    'surface.canvas': { kind: 'color', value: '#f7f2e8' },
    'brand.primary': { kind: 'color', value: '#2f7d4f' },
    'text.primary': { kind: 'color', value: '#2b241b' },
    'text.secondary': { kind: 'color', value: '#685d50' },
    'text.muted': { kind: 'color', value: '#8d8172' },
    'type.heading': { kind: 'fontFamily', value: 'Georgia, "Noto Serif KR", serif' },
    'type.display': { kind: 'fontFamily', value: 'Inter, "Noto Sans KR", sans-serif' },
  },
}

const ink: TokenSet = {
  id: 'askewly.ink',
  label: '짙은 잉크',
  tokens: {
    'surface.canvas': { kind: 'color', value: '#1c2320' },
    'brand.primary': { kind: 'color', value: '#7fd4a0' },
    'text.primary': { kind: 'color', value: '#f4efe4' },
    'text.secondary': { kind: 'color', value: '#c3bcae' },
    'text.muted': { kind: 'color', value: '#8d867a' },
    'type.heading': { kind: 'fontFamily', value: 'Georgia, "Noto Serif KR", serif' },
    'type.display': { kind: 'fontFamily', value: 'Inter, "Noto Sans KR", sans-serif' },
  },
}

export const tokenSets: Record<string, TokenSet> = {
  [warm.id]: warm,
  [ink.id]: ink,
}

export function listTokenSets(): TokenSet[] {
  return Object.values(tokenSets)
}

export function resolveTokenSet(tokenSetId: string): TokenSet | null {
  return tokenSets[tokenSetId] ?? null
}

/** 세트에서 단일 토큰 값을 꺼낸다. 없으면 `null` — 호출부가 폴백을 정하게 하지 않는다. */
export function resolveTokenValue(set: TokenSet | null, binding: string): string | null {
  return set?.tokens[binding]?.value ?? null
}

/** 노드의 `tokenBindings` 키가 요구하는 토큰 종류. 키가 늘면 여기에 추가한다. */
const EXPECTED_KIND: Record<string, TokenKind> = {
  /** 루트 프레임의 캔버스 바탕 — 컴파일러가 항상 `surface.canvas`로 건다. */
  background: 'color',
  fill: 'color',
  color: 'color',
  fontFamily: 'fontFamily',
}

export type TokenIssue =
  | { code: 'TOKEN_SET_NOT_FOUND'; tokenSetId: string; message: string }
  | { code: 'TOKEN_NOT_DEFINED'; binding: string; nodeId: string; message: string }
  | { code: 'TOKEN_KIND_MISMATCH'; binding: string; nodeId: string; message: string }
  | { code: 'TOKEN_BINDING_UNKNOWN'; binding: string; nodeId: string; message: string }

export interface TokenResolution {
  /** 조회에 성공한 세트. 세트 자체가 없으면 `null`. */
  set: TokenSet | null
  /** binding 이름 → 실제 값. 실패한 binding은 **키가 없다**(폴백 값을 넣지 않는다). */
  values: Record<string, string>
  issues: TokenIssue[]
}

/**
 * 장면 전체의 토큰 바인딩을 실제 값으로 해석한다.
 *
 * `overrides`는 세트 값을 덮어쓰는 편집분이다(binding → 값). 세트에 없는 binding은
 * override로도 만들어내지 않는다 — 정의되지 않은 토큰을 값으로 승격시키면 진단이 무의미해진다.
 */
export function resolveProjectTokens(
  project: TemplateProject,
  overrides: Record<string, string> = {},
): TokenResolution {
  const tokenSetId = project.request.tokenSetId
  const set = resolveTokenSet(tokenSetId)

  if (!set) {
    return {
      set: null,
      values: {},
      issues: [
        {
          code: 'TOKEN_SET_NOT_FOUND',
          tokenSetId,
          message: `토큰 세트 '${tokenSetId}'가 없습니다. 등록된 세트: ${Object.keys(tokenSets).join(', ')}`,
        },
      ],
    }
  }

  const values: Record<string, string> = {}
  const issues: TokenIssue[] = []
  const seen = new Set<string>()

  for (const node of Object.values(project.scene.nodes)) {
    for (const [property, binding] of Object.entries(node.tokenBindings ?? {})) {
      if (!binding) continue

      const key = `${node.id}:${property}:${binding}`
      if (seen.has(key)) continue
      seen.add(key)

      const expected = EXPECTED_KIND[property]
      if (!expected) {
        issues.push({
          code: 'TOKEN_BINDING_UNKNOWN',
          binding,
          nodeId: node.id,
          message: `'${node.name}'의 바인딩 속성 '${property}'는 렌더러가 모르는 속성입니다.`,
        })
        continue
      }

      const definition = set.tokens[binding]
      if (!definition) {
        issues.push({
          code: 'TOKEN_NOT_DEFINED',
          binding,
          nodeId: node.id,
          message: `'${node.name}'이 참조하는 '${binding}'이 세트 '${set.id}'에 없습니다.`,
        })
        continue
      }

      if (definition.kind !== expected) {
        issues.push({
          code: 'TOKEN_KIND_MISMATCH',
          binding,
          nodeId: node.id,
          message: `'${binding}'은 ${definition.kind} 토큰인데 '${property}' 속성은 ${expected}를 요구합니다.`,
        })
        continue
      }

      values[binding] = overrides[binding] ?? definition.value
    }
  }

  return { set, values, issues }
}
