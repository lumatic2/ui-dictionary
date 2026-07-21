# 검사기 회귀 코퍼스 — 고치기 전에 잰다

> 2026-07-22 · milestone DOG1 step-1 · changeset #247

## 왜

`design-output-gates` horizon의 착수 실사가 색 검사기(`packages/cli/src/verify.ts`)에서 결함 3종을 냈다. 고치기 전에 **지금 상태를 재서 고정한다** — 직전 horizon의 교훈이 정확히 이것이다:

> 읽어서 내린 실사가 4번 틀렸고 넷 다 실행하자마자 드러났다. 다음 실사 기본값은 실행해서 재기.

기준선 없이 고치면 "고쳤다"를 증명할 대조군이 없다.

## 무엇을

**fixture 4종** — `packages/cli/test/fixtures/verify-regression/`

| 파일 | 역할 | 기대(고친 뒤) |
|---|---|---|
| `svg.tsx` | 오탐 케이스 — SVG 내부 `fill`/`stroke` | 위반 0 |
| `comment.tsx` | 오탐 케이스 — 줄 주석·블록 주석 안의 색 | 위반 0 |
| `oneline.tsx` | 누락 케이스 — 한 줄에 hex + `rgb()` | 위반 **2** |
| `clean.tsx` | 정상 케이스 — 토큰만 사용 | 위반 0 |

`clean.tsx`가 이 코퍼스의 **양방향 게이트**다. step-2에서 예외를 넓게 뚫어 오탐을 없애더라도 진짜 위반을 놓치면 안 되는데, 그 하한을 이 파일과 기존 테스트 3건이 잡는다.

**evidence** — `evidence/design-output-gates/dog1-linter-precision.md` step-1 절에 무수정 코드의 출력을 그대로 기록.

## 관측 (현재 코드, 무수정)

| fixture | 실측 | 판정 |
|---|---|---|
| `svg.tsx` | 위반 2 (`hex-literal` + `raw-color-fn`) | 오탐 |
| `comment.tsx` | 위반 2 (`hex-literal` + `raw-color-fn`) | 오탐 |
| `oneline.tsx` | 위반 **1** (`raw-color-fn` 유실) | 누락 |
| `clean.tsx` | 위반 0, exit 0 | 정상 |

horizon 실사 표 1·2·3번과 전부 일치.

## 이 step이 넓힌 것

horizon 실사는 오탐을 **hex 리터럴**로만 확인했다. fixture를 규칙별로 갈라 보니 **`raw-color-fn`도 똑같이 오탐**이다(`svg.tsx:7`, `comment.tsx:6`).

→ 오탐은 규칙 하나의 버그가 아니라 **두 규칙 모두가 문맥을 안 보는 구조적 문제**다. step-2의 예외는 규칙별로 붙이지 말고 **스캔 전 단계에서 문맥을 걷어내야** 한다. 규칙별로 붙이면 규칙이 늘 때마다 같은 오탐이 재발한다. — 이 판단이 step-2 설계의 입력이다.

## Contract

- source of truth: `packages/cli/src/verify.ts` (검사 규칙), fixture는 `packages/cli/test/fixtures/verify-regression/`
- deploy/sync target: 없음 — 이 step은 코드를 바꾸지 않는다. 배포는 DOG2.
- compatibility: 기존 `packages/cli/test/verify.test.ts` 3건은 그대로 둔다(회귀 하한).
- out of scope: 규칙 수정(step-2·3), 타이포 검사기(DOG3), 스킬 배선(DOG6).

## 검증

- [x] fixture 4종을 **파일별로 격리해** 무수정 코드로 실행, 출력을 evidence에 그대로 기록
- [x] horizon 실사 표 1·2·3번과 대조 — 3/3 일치
- [x] `clean.tsx` exit 0 확인 (양방향 게이트 하한 성립)
- [x] 재현 절차를 evidence에 커맨드로 남김 (Failure probe = 재현 불가 시 이 step 무효)
- [x] 루트 `npm run verify` exit 0 — 의도적 위반 fixture가 레포 게이트를 깨지 않음을 확인(루트 verify는 색 검사기를 돌리지 않는다)
- [x] `packages/cli` 기존 테스트 PASS (무변경 확인)
