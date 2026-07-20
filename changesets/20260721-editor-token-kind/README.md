# 207 — editor-token-kind

- 날짜: 2026-07-21
- milestone: ECT1 (`plans/2026-07-21-ect1-token-lookup-and-validation.md`) step-2
- horizon: editor-color-and-token-editing

## 무엇을 왜

step-1은 편집기 토큰의 `kind`를 `null`로 두었다 — 생성물이 평면 `Record<string,string>`이라
종류를 싣고 오지 않았고, 거기서 `'color'`로 단정하면 나중에 글꼴 토큰 하나가 들어오는 순간
색 목록에 조용히 섞이기 때문이다. step-2가 그 자리를 SSOT에서 채운다.

생성기가 DTCG `$type`을 **조상에서 유도**해(그룹에 선언되고 자손이 상속하는 규약)
`editorTokenKinds`를 함께 내보낸다. 기존 `editorTokenMaps`는 그대로 두고 덧붙이는 형태라
평면 맵을 읽던 호출부는 손대지 않았다.

이제 두 어휘가 종류를 같은 모양으로 말한다 — ECT2의 색 선택기가 필터를 한 벌만 짜면 된다.

## 매핑 안 되는 종류는 추측하지 않고 크게 실패한다

`DTCG_TO_TOKEN_KIND`에 없는 `$type`을 만나면 생성기가 예외를 던진다.
여기서 기본값을 고르는 건 "글꼴 토큰이 색 목록에 뜨는" 결함을 만드는 방법이다.
새 종류가 생기면 사람이 편집기 동작을 결정해야 한다.

## 변경 파일

- `apps/agent-design/scripts/generate-editor-tokens.mjs` — `declaredType()`(DTCG 조상 유도), `DTCG_TO_TOKEN_KIND`, `buildSemanticKindMap()`, `EditorTokenKind` 타입·`editorTokenKinds` 출력
- `apps/agent-design/src/editorTokens.ts` — 생성물 (26줄 순수 추가)
- `apps/agent-design/src/documentTokens.ts` — 열거가 `editorTokenKinds`를 쓴다
- `apps/agent-design/src/documentTokens.test.ts` — step-1의 "아직 모른다" 테스트를 뒤집고, 두 어휘 색 필터 대칭 테스트 추가

## Verification

| 항목 | 결과 |
|---|---|
| 편집기 토큰 19개 전부 `kind` 보유, `null` 0건 | PASS |
| `kind` 값이 생성물 `editorTokenKinds`와 일치 (손으로 적은 게 아님) | PASS |
| 두 어휘 모두 색만 필터 가능, 템플릿 글꼴 토큰은 색 필터에서 빠짐 | PASS |
| 생성기 재실행 산출물 = 커밋본 (CSS·SSOT drift 0) | PASS |
| **Failure probe B** — `$type`을 `duration`으로 바꿔 재생성 → 예외 + 사유 문자열 | PASS |
| `npm test` | 150 passed / 14 files |
| `npm run typecheck` | exit 0 |
| `npm run verify` | exit 0 |

### Failure probe A — 계획과 다르게 실패했다 (정직 기록)

계획은 "SSOT에서 토큰 하나를 지우고 재생성하면 열거 결과에서도 사라진다"를 적었다.
실제로는 **열거까지 가지 못하고 생성기가 먼저 죽었다** — `SEMANTIC_COLOR_MAPPINGS`가
CSS 변수 이름을 손으로 나열하고 있어서 `TokenError: unknown token path`가 먼저 난다.

의도한 것(열거가 SSOT를 따라간다)은 확인하지 못했고, 대신 다른 것(생성기가 SSOT 삭제에
조용히 넘어가지 않는다)을 확인했다. **둘 다 안전 쪽이지만 같은 명제가 아니다.**
열거가 SSOT를 따라간다는 증거는 step-1의 "하드코딩된 목록이 아니다" 테스트가 대신 들고 있다.

finding: `SEMANTIC_COLOR_MAPPINGS`(19줄)와 `buildSemanticColorMap`(walkLeaves)이 같은 집합을
두 방식으로 표현한다. 한쪽은 손으로 적고 한쪽은 순회한다 — ECT4의 "허용 키 정본은 하나" 작업과 성격이 같다.
