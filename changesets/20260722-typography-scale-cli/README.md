# 타이포 검사기 CLI 배선 — 부호 하나가 시스템을 위반으로 만든다

> 2026-07-22 · milestone DOG3 step-2 · changeset #255

## 왜

step-1의 정규화 규칙은 순수 함수였다. 아무도 부르지 않으면 규칙은 규칙이 아니다.

## 무엇을

`askewly-design verify`가 색 규칙과 **나란히** 타이포 규칙을 돈다.

- 규칙명 `typography-scale-exceeded`, 보고 형식은 기존 색 위반과 같은 모양
- 보고 줄 = **임계값을 깨뜨린 값이 처음 등장한 줄**. 파일 첫 줄을 가리키면 무엇을 고칠지 말해주지 못한다
- 발췌 = 검출된 전체 목록 (`font-size steps: 12, 14, 16, 20, 28, 40 (6 > limit 5)`)
- `--typography-threshold <n>` 옵션 (양의 정수 검증, 아니면 exit 2)
- 실패 안내문에 타이포 항목 추가

**계수는 파일 단위**다(색은 줄 단위). 묻는 것이 "이 화면이 몇 개의 크기를 쓰나"라서다. DOG1의 마스킹 산출물을 그대로 쓰므로 **주석·SVG 안의 크기는 세지 않는다** — 렌더되지 않는 것은 화면의 단계가 아니다.

## 임계값: 계획 4 → 실제 5

plan 본문은 기본값 4로 적혀 있으나 **horizon 결정 로그 5번(사용자 승인)은 5**다. plan이 승인 이전에 작성돼 옛 값을 담았다. 근거는 plan 자신이 이미 적어둔 것과 같다 — 우리 SSOT가 5단계라 4를 쓰면 **토큰 정의를 다 쓰는 것만으로 위반**이 된다.

남의 숫자(Kraft의 4)를 우리 토큰에 대조하지 않고 옮겼으면 **규칙이 자기가 지켜야 할 시스템과 모순**됐다. 이 판단을 `five-steps.tsx` fixture가 코드에 고정한다.

## 실표면 관측

| fixture | 단계 | 결과 |
|---|---|---|
| `three-steps.tsx` | 3 | PASS |
| `five-steps.tsx` | **5 (경계)** | **PASS** — 우리 스케일 전부 |
| `six-steps.tsx` | **6 (경계)** | **FAIL** `:10 [typography-scale-exceeded] … (6 > limit 5)` |
| `six-steps.tsx` `--typography-threshold 8` | 6 | PASS |

## Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| D | 옵션 무시하고 기본값만 사용 | 1건 실패 |
| E | 경계 비교 `>` → `>=` | **2건 실패**, 그중 `passes a file using exactly our full token scale` |

E가 이 step의 핵심 위험을 정확히 잡는다.

## Contract

- source of truth: `packages/cli/src/typography.ts`(규칙·기본값) + `src/verify.ts`(배선)
- deploy/sync target: npm — **재배포 필요**(규칙 변경은 배포해야 남의 프로젝트에 닿는다). step-3 이후 `0.2.0`으로 릴리스.
- compatibility: `verifyDir` 3번째 인자는 선택적. 기존 호출부 무변경. `Violation.rule` 유니온에 값 추가.
- out of scope: 자기 자산 실측(step-3), 릴리스

## 검증

- [x] 실표면 4종 관측 — 위 표와 일치
- [x] `packages/cli` 48 tests PASS (43 → +5)
- [x] `tsc --noEmit` exit 0 · `npm run build` 성공 · 루트 `npm run verify` exit 0
- [x] Failure probe D·E 실행 후 원복
- [x] 주석 안 크기 비계수 확인(DOG1 마스킹 재사용)
