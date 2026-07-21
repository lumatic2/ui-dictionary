# 한 줄 다중 위반 전수 보고 — 삼항 분기가 규칙을 삼켰다

> 2026-07-22 · milestone DOG1 step-3 · changeset #249

## 왜

`verify.ts`가 줄마다 **첫 매치 하나만** 기록하고 있었다:

```ts
const rule = HEX_RULE.test(text) ? "hex-literal"
           : COLOR_FN_RULE.test(text) ? "raw-color-fn"
           : null
```

삼항이라 hex가 걸리면 `raw-color-fn`은 **아예 검사되지 않는다.** step-1 기준선이 이걸 실측했다:

```
const a = "#111" + "rgb(1,2,3)"   → 위반 1건 (hex-literal 만)
```

`rgb(1,2,3)`이 조용히 사라진다. exit code는 어차피 1이라 **실패 여부는 안 바뀌지만 보고가 불완전하다** — 고칠 때 사람이 한 건만 고치고 넘어간다. DOG6이 지향하는 자가 수정 루프에서는 이게 더 나쁘다: 에이전트가 받은 목록대로 고친 뒤 "다 고쳤다"고 판단하는데 위반이 남아 있다.

## 무엇을

규칙을 배열로 빼고 **각 규칙을 독립 검사**한다.

```ts
const RULES = [
  { name: "hex-literal",  pattern: HEX_RULE },
  { name: "raw-color-fn", pattern: COLOR_FN_RULE },
]
```

보고 단위는 **줄 × 규칙**이다(줄 × 발생 횟수가 아니다). 한 줄에 hex가 셋이면 `hex-literal` 1건으로 보고한다 — 줄 발췌가 이미 그 줄 전체를 보여주므로 같은 규칙을 반복해 세는 것은 노이즈다. 규칙이 서로 다르면 고치는 방법도 다르므로 그때만 나눈다.

배열로 뺀 부수 효과: **규칙 추가가 삼항 사슬을 건드리지 않는다.** DOG3의 타이포 검사기가 붙을 자리이기도 하다.

## 관측

| fixture | step-1 기준선 | step-3 | 판정 |
|---|---|---|---|
| `oneline.tsx` | 위반 **1** (`hex-literal` 만) | 위반 **2** (`:4 hex-literal` + `:4 raw-color-fn`) | 누락 해소 |
| `svg.tsx` / `comment.tsx` / `clean.tsx` | 0 | 0 | 유지 |
| `svg-outside.tsx` / `comment-outside.tsx` | 2 | 2 | 유지 |

## Failure probe — 실제로 돌렸다

삼항 분기 동작으로 되돌렸다(`hex`가 걸리면 `raw-color-fn`을 검사 목록에서 제외):

```
× reports every rule matched on one line, not just the first
Tests  1 failed | 13 passed (14)
```

정확히 그 테스트 하나만 실패한다 — 다른 테스트를 건드리지 않고 이 변경만 잡는다는 뜻이다. 원복 후 32/32 PASS.

## Contract

- source of truth: `packages/cli/src/verify.ts`
- deploy/sync target: 없음 (배포는 DOG2)
- compatibility: 기존 테스트 3건 + step-2 테스트 9건 전부 그대로 PASS. `Violation` 타입 불변.
- out of scope: 같은 줄 같은 규칙의 발생 횟수 분리, 열(column) 보고

## 검증

- [x] `npx vitest run` (packages/cli) **32 passed** — 30 → +2
- [x] `npx tsc --noEmit` exit 0
- [x] `npm run build` 성공
- [x] 루트 `npm run verify` exit 0
- [x] fixture 6종 CLI 실행 관측 — 위 표와 일치
- [x] Failure probe 실행, 1건 실패 확인 후 원복
