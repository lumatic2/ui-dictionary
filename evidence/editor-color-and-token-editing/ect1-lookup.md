# EVIDENCE — ECT1 토큰이 조회되고, 실재가 검증된다

- Milestone: ECT1 (`plans/2026-07-21-ect1-token-lookup-and-validation.md`)
- Horizon: 편집기에서 색이 색으로 보이고, 바꿔진다 (`plans/horizons/2026-07-editor-color-and-token-editing.md`)
- 완료일: 2026-07-21
- 상태: **완료 — 3/3 leaf, changeset 206·207·208**

## DoD 대조

| DoD 항목 | 실측 | 판정 |
|---|---|---|
| 화면이 물어볼 수 있는 토큰 목록 API | `DocumentTokens.listTokens()` — 세트 원본 객체를 직접 읽는다 | PASS |
| 두 어휘 격리 보장 | 상대 어휘 고유 이름 0건(양방향), 겹치는 이름은 값이 갈린다 | PASS |
| 편집기·템플릿 어휘가 같은 메타데이터 모양 | 편집기 토큰 19개 전부 `kind` 보유, `null` 0건 | PASS |
| 실재하지 않는 토큰은 저장되지 않는다 | 검증 + `applyOperation` 양쪽에서 거부, 사유 문자열 반환 | PASS |

## 계획이 반증된 것 — 두 어휘의 이름은 겹친다

계획과 기존 코드 주석은 **"두 어휘는 겹치지 않는다"**고 단언했다(`documentTokens.ts:12`).
실측 결과 **틀렸다.**

| 이름 | 템플릿(`askewly.warm`) | 편집기(`askewly.default`) |
|---|---|---|
| `text.muted` | `#8d8172` | `oklch(0.46 0.03 270)` |
| `text.secondary` | `#685d50` | `oklch(0.25 0.03 270)` |

격리는 실재하지만 **이름이 아니라 출처로** 이뤄진다 — 문서는 자기 세트에서만 값을 얻는다.
주석을 사실로 고치고, 검증을 "상대 어휘 **고유** 이름 0건 + 겹치는 이름은 값이 갈린다"로 바꿨다.

**horizon 닫는 기준 3의 관측 방법이 이 발견으로 바뀐다** — "이름 교차 0건"으로는 잴 수 없다.
`plans/horizons/2026-07-editor-color-and-token-editing.md`의 기준 3을 정정했다.

## EU5 finding 4의 정체 — 조용히 거부가 아니라 조용히 수용

EU5 evidence는 "오타는 조용히 거부된다"고 적었다. 실사 결과 **반대였다.**
`validateNodePropertyEdit`의 token 분기는 `x.y` 모양만 봤고(`properties.ts:24,46`),
없는 토큰도 **저장됐다.** 결함은 렌더 시점 `data-token-unresolved`로만 남고 화면은 아무 말도 안 했다.

이제 저장 시점에 거부하고 사유가 `role="alert"`로 사용자에게 나간다:
`'surface.nonexistent' 토큰은 이 문서의 토큰 세트에 없습니다`

## 계층 결정 — canvas-core는 어휘를 모른다

`canvas-core`는 런타임 의존이 0이고 어휘를 알아선 안 된다. 그래서 어휘를 아는 앱이
조회 함수를 등록한다(`registerTokenVocabulary`). 등록 전에는 모양 검사만 한다 —
이건 "통과"가 아니라 **"이 계층은 답할 수 없다"**이고, 등록하는 쪽이 그 구멍을 닫는다.

**등록 자체를 테스트로 고정했다.** canvas-core 테스트는 가짜 어휘를 손으로 등록해 통과하므로
"앱이 진짜 어휘를 실제로 건네는지"는 못 본다. 등록을 빠뜨리면 canvas-core 테스트가 전부 초록인 채
편집기에만 구멍이 남는다 — EU5가 정확히 그런 종류의 결함이었다. `App` 모듈을 들이면 검증이
켜지는 것을 테스트가 관측한다.

## Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| 어휘 오염 | 템플릿 열거에 편집기 토큰을 합집합으로 섞음 | 테스트 2건 실패, 원복 시 전건 통과 |
| 잘못된 `$type` | SSOT `color.semantic.border.$type`을 `duration`으로 | 생성기 예외 + 사유 문자열 |
| 등록 누락 | `registerTokenVocabulary(documentTokenExists)` 한 줄 주석 처리 | 배선 테스트 1건 실패 |
| 계획과 다르게 실패 | SSOT에서 토큰 삭제 후 재생성 | **의도한 것을 확인 못 함** — 아래 |

### probe A는 계획과 다르게 실패했다

계획은 "SSOT에서 토큰을 지우면 열거에서도 사라진다"를 적었으나, 실제로는 열거까지 가지 못하고
생성기가 먼저 죽었다(`SEMANTIC_COLOR_MAPPINGS`가 CSS 변수 이름을 손으로 나열 → `TokenError`).
**둘 다 안전 쪽이지만 같은 명제가 아니다.** 의도한 명제는 step-1의 "하드코딩된 목록이 아니다"
테스트가 대신 들고 있다. 재해석하지 않고 갈라 적는다.

## 회귀 게이트

| 커맨드 | 결과 |
|---|---|
| `npx vitest run` (canvas-core) | 80 passed / 10 files |
| `npm test` (apps/agent-design) | 152 passed / 14 files |
| `npm run typecheck` | exit 0 |
| `npm run verify` (레포) | exit 0 |

## finding 큐 → 다음 행선지

1. `SEMANTIC_COLOR_MAPPINGS`(손으로 적은 19줄)와 `buildSemanticColorMap`(`walkLeaves` 순회)이
   **같은 집합을 두 방식으로 표현한다.** ECT4의 "허용 키 정본은 하나"와 성격이 같은 문제다.
2. 어휘 등록은 앱 경로에만 걸려 있다 — 에이전트/브리지 등 `App`을 안 들이는 경로는
   여전히 모양 검사만 한다. 그 경로에서도 저장이 일어나는지는 확인하지 않았다.
3. 검증 사유 문자열이 이 파일에서만 한국어다(주변 메시지는 영어). 사용자에게 나가는 문자열과
   개발자용 문자열이 같은 함수에서 섞여 나온다 — ECT2의 사용자 언어 라벨 작업과 함께 볼 것.
