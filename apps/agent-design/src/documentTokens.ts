import { listTokenSets, resolveTokenSet, type TokenKind } from '@askewly/template-core'
import { editorTokenMaps, FALLBACK_BACKGROUND_TOKEN, type TokenSetId } from './editorTokens'

/**
 * 문서 토큰 해석 — 두 어휘가 한 캔버스에 공존한다.
 *
 * - **편집기 문서**(`askewly.default`/`askewly.dark`)는 chrome 어휘를 쓴다:
 *   `surface.base`·`text.default`·`action.primary`.
 * - **템플릿 문서**(`askewly.warm`/`askewly.ink`)는 디자인 어휘를 쓴다:
 *   `surface.canvas`·`text.primary`·`brand.primary`·`type.heading`.
 *
 * 두 어휘는 **일부 이름을 공유한다** — `text.muted`·`text.secondary`가 양쪽에 있고 값은 다르다
 * (ECT1 step-1 실측. 그전 주석은 "겹치지 않는다"고 단언했으나 사실이 아니었다).
 * 그래서 별칭으로 잇지 않고 **출처로 가른다** — 문서는 자기 세트에서만 값을 얻는다.
 * 템플릿을 편집기 chrome 색으로 칠하면 디자인이 아니라 편집기가 보인다.
 *
 * 어느 쪽도 아닌 세트는 `unknown`이다. 그럴듯한 기본색으로 덮지 않는다 —
 * 조용한 폴백이 TPS3~TH3에서 결함을 세 milestone 동안 숨겼다.
 */

export type TokenSource = 'template' | 'editor' | 'unknown'

/**
 * 세트가 실제로 가진 토큰 하나.
 *
 * `kind`가 `null`인 것은 "종류가 없다"가 아니라 **"아직 모른다"**다. 편집기 어휘는
 * 생성물(`editorTokens.ts`)이 평면 `Record<string,string>`이라 종류를 싣고 오지 않는다.
 * 여기서 색으로 단정하면 나중에 글꼴 토큰이 하나 들어오는 순간 조용히 틀린다 —
 * 화면은 그걸 색 목록에 태연히 올릴 것이다. 모르는 건 모른다고 말한다.
 * (ECT1 step-2에서 생성기가 SSOT로부터 채운다.)
 */
export interface TokenEntry {
  name: string
  kind: TokenKind | null
  value: string
}

export interface DocumentTokens {
  source: TokenSource
  /** 바인딩 이름 → 값. 해석 실패는 `null` — 호출부가 폴백을 지어내지 않게 한다. */
  resolve: (binding: string | undefined) => string | null
  /**
   * 이 세트가 가진 토큰 전부. **자기 어휘만** 담는다.
   *
   * 화면이 목록을 손으로 적으면 목록과 실재가 어긋난다 — 이미 한 번 났다
   * (`listDocumentTokenSets` 주석의 드롭다운 사고). 물어볼 곳을 여기 하나로 둔다.
   */
  listTokens: () => TokenEntry[]
  /**
   * 배경 해석. 편집기 문서는 바인딩이 없을 때 중립 배경으로 폴백하던 기존 계약을 유지한다
   * (기존 문서·테스트가 그 동작에 의존한다). 템플릿 문서는 폴백하지 않는다.
   */
  resolveBackground: (binding: string | undefined) => string | null
}

export function documentTokens(tokenSetId: string): DocumentTokens {
  const templateSet = resolveTokenSet(tokenSetId)
  if (templateSet) {
    const resolve = (binding: string | undefined) =>
      binding ? (templateSet.tokens[binding]?.value ?? null) : null
    return {
      source: 'template',
      resolve,
      // 세트 객체를 그대로 읽는다 — 별도 목록을 두면 그 둘이 갈라진다.
      listTokens: () =>
        Object.entries(templateSet.tokens).map(([name, definition]) => ({
          name,
          kind: definition.kind,
          value: definition.value,
        })),
      resolveBackground: resolve,
    }
  }

  const editorMap = editorTokenMaps[tokenSetId as TokenSetId]
  if (editorMap) {
    return {
      source: 'editor',
      resolve: (binding) => (binding ? (editorMap[binding] ?? null) : null),
      listTokens: () =>
        Object.entries(editorMap).map(([name, value]) => ({ name, kind: null, value })),
      // 바인딩이 **없을 때만** 중립 배경으로 떨어진다(기존 편집기 문서 계약).
      // 바인딩이 있는데 그 세트에 없으면 폴백하지 않는다 — 그게 템플릿이 회색이 된 원인이었다.
      resolveBackground: (binding) =>
        binding === undefined
          ? editorMap[FALLBACK_BACKGROUND_TOKEN]
          : (editorMap[binding] ?? null),
    }
  }

  // 모르는 세트는 빈 목록이다. 그럴듯한 기본 팔레트를 내주면 화면이 없는 토큰을 권하게 된다.
  return {
    source: 'unknown',
    resolve: () => null,
    listTokens: () => [],
    resolveBackground: () => null,
  }
}

export interface TokenSetChoice {
  id: string
  label: string
  source: Exclude<TokenSource, 'unknown'>
}

const EDITOR_SET_LABELS: Record<string, string> = {
  'askewly.default': '편집기 · 밝게',
  'askewly.dark': '편집기 · 어둡게',
}

/**
 * 문서에 붙일 수 있는 **실재하는** 토큰 세트 목록.
 *
 * UI가 옵션을 손으로 적으면 목록과 실재가 어긋난다 — 실제로 어긋났다. 드롭다운이
 * 편집기 세트 둘만 적어둔 탓에, `askewly.warm` 템플릿을 열면 그 값이 옵션에 없어
 * 첫 항목이 선택돼 보였다. **문서 상태를 잘못 보고하는 화면**이다.
 */
export function listDocumentTokenSets(): TokenSetChoice[] {
  return [
    ...Object.keys(editorTokenMaps).map((id): TokenSetChoice => ({
      id,
      label: EDITOR_SET_LABELS[id] ?? id,
      source: 'editor',
    })),
    ...listTokenSets().map((set): TokenSetChoice => ({
      id: set.id,
      label: `템플릿 · ${set.label}`,
      source: 'template',
    })),
  ]
}

/** 그 세트가 실재하는가. 모양 검사(`validateTokenMode`)는 이걸 대신하지 못한다. */
export function isKnownTokenSet(tokenSetId: string): boolean {
  return documentTokens(tokenSetId).source !== 'unknown'
}
