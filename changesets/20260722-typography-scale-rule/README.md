# 타이포 단계 정규화 규칙 — 네 형태를 한 공간에 놓는다

> 2026-07-22 · milestone DOG3 step-1 · changeset #254

## 왜

"한 화면에 타이포 단계가 몇 개인가"를 세려면 먼저 **무엇이 한 단계인가**를 정해야 한다. 이 스택에서 font-size는 네 가지로 나타난다: Tailwind 이름 유틸리티, 임의값, 인라인 style, CSS 선언. 서로 다른 표현을 그대로 세면 같은 크기가 여러 번 잡힌다.

## 무엇을

`packages/cli/src/typography.ts` — 모든 표현을 **px 정수로 정규화하고 distinct set**을 센다.

핵심 결정 셋:

**① 스케일 안 이름은 토큰 SSOT를 읽는다.** 하드코딩하지 않는다. 우리 값과 Tailwind 기본값이 겹치는 이름에서 다르기 때문이다 — `lg` 20 vs 18, `xl` 28 vs 20, `2xl` 40 vs 24. **우리 값이 이긴다**(토큰 SSOT를 두는 이유). 스케일 밖 이름(`xs`·`3xl`~`9xl`)만 Tailwind 조회 테이블로 간다.

**② 반응형·상태 접두사는 벗겨서 기저 이름으로 합친다.** 한 시점에 한 브레이크포인트만 렌더되므로 `md:text-lg`는 별도 단계가 아니다.

**③ "한 화면" = 파일 하나.** DOG1의 색 검사가 이미 파일 단위라 경계를 맞췄다.

크기가 아닌 `text-` 유틸리티(`text-center`·`text-primary`)는 스케일에 없는 이름이라 자연히 걸러진다.

## Failure probe — 하나가 테스트 결함을 드러냈다

| probe | 조작 | 결과 |
|---|---|---|
| A | rem 환산 계수 조작 | 5건 실패 ✓ |
| B | 반응형 접두사 미처리 | **0건 실패** ✗ |
| C | 조회 테이블 값 조작 | 2건 실패 ✓ |

**B가 통과했다.** `responsive.tsx`에 `md:text-lg`와 순수 `text-lg`가 둘 다 있어, 접두사 처리를 없애도 뒤엣것이 같은 20px을 채웠다. 테스트가 그 코드를 지키지 않고 있었다.

`variant-only.tsx`를 신설해 20·28에 **접두사 없이는 도달할 수 없게** 만들었다. 다시 돌리니 그 테스트 1건이 정확히 실패한다.

> 이 horizon에서 probe가 자기 무용함을 드러낸 **두 번째** 사례다. DOG1 step-2는 치환이 no-op이었고, 여기서는 fixture가 결함을 가렸다. 둘 다 "통과했으니 됐다"로 넘어갔으면 검증한 척이 됐다.

## Contract

- source of truth: `tokens/askewly.tokens.json`(우리 스케일) + `packages/cli/src/typography.ts`(Tailwind 조회 테이블·정규화 규칙)
- deploy/sync target: 없음 — CLI 표면 배선은 step-2
- compatibility: 순수 함수 신설. 기존 코드 무변경.
- out of scope: 임계값 게이트·CLI 커맨드(step-2), 자기 자산 실측(step-3)

## 검증

- [x] fixture 6종 계수 결과가 기대와 일치
- [x] SSOT 우선 확인 — `lg === 20 && lg !== 18`(Tailwind 기본값이 아님을 명시적으로 고정)
- [x] `packages/cli` 43 tests PASS (32 → +11)
- [x] `tsc --noEmit` exit 0
- [x] Failure probe 3종 실행 — B의 무용함 적발·fixture 보강 후 재확인
