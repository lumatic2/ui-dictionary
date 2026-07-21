# DOG3 — 타이포 단계 evidence

> horizon `design-output-gates` · milestone DOG3
> 기록(record). step 진행에 따라 섹션을 추가하고 앞 관측은 고치지 않는다.

## step-1 — 무엇을 '단계'로 셀 것인가 (2026-07-22)

### 설계 문제

이 스택에서 font-size는 네 가지 형태로 나타난다: Tailwind 이름 유틸리티, 임의값(`text-[13px]`), 인라인 `style`, CSS `font-size` 선언. **넷을 하나의 비교 가능한 공간에 놓아야** 셈이 성립한다.

결정: **모든 표현을 px 정수로 정규화하고 distinct set을 센다.**

| 형태 | 해석 |
|---|---|
| 스케일 안 이름(`text-lg`) | **토큰 SSOT를 읽어** 해석 — 하드코딩 금지 |
| 스케일 밖 이름(`text-xs`·`text-4xl`) | Tailwind v4 기본값 조회 테이블 |
| 임의값(`text-[13px]`·`text-[0.9rem]`) | 직접 환산 (rem×16) |
| 인라인 `style={{fontSize}}` / CSS `font-size` | 직접 환산 |
| 반응형·상태 접두사(`md:`·`hover:`) | **접두사를 벗기고 기저 이름으로 합침** |
| 크기가 아닌 `text-` 유틸리티(`text-center`·`text-primary`) | 세지 않음 |

**반응형을 합치는 이유**: 한 시점에 한 브레이크포인트만 렌더된다. `md:text-lg`는 별도 단계가 아니라 같은 단계의 다른 조건이다.

**"한 화면" = 파일 하나.** DOG1의 색 검사가 이미 파일 단위라 경계를 맞췄다.

### SSOT 우선 확인

우리 스케일과 Tailwind 기본값이 **겹치는 이름에서 값이 다르다**:

| 이름 | 우리 SSOT | Tailwind 기본 |
|---|---|---|
| `sm` | 14 | 14 |
| `base` | 16 | 16 |
| **`lg`** | **20** | **18** |
| **`xl`** | **28** | **20** |
| **`2xl`** | **40** | **24** |

우리 값이 이긴다 — 토큰 SSOT를 두는 이유가 그것이다. 테스트가 `lg === 20 && lg !== 18`로 이 우선순위를 고정한다.

### fixture 관측

| fixture | 기대 | 실측 |
|---|---|---|
| `named-utility.tsx` (`text-sm`·`text-lg`·`text-xl`) | `{14, 20, 28}` | 일치 |
| `out-of-scale.tsx` (`text-xs`·`text-4xl`) | `{12, 36}` | 일치 |
| `arbitrary-and-inline.tsx` (`text-[13px]`·`fontSize:"0.875rem"`) | `{13, 14}` | 일치 |
| `responsive.tsx` (`text-base`·`md:text-lg`·`text-lg`) | `{16, 20}` | 일치 |
| `variant-only.tsx` (`text-base`·`md:text-lg`·`lg:text-xl`) | `{16, 20, 28}` | 일치 |
| `mixed.css` (`14px`·`1.5rem`) | `{14, 24}` | 일치 |

### ⚠ Failure probe가 테스트 결함을 잡았다

계획이 지정한 probe 3종을 돌렸다.

| probe | 조작 | 결과 |
|---|---|---|
| A | rem 환산 계수 16 → 10 | **5건 실패** ✓ |
| B | 반응형 접두사 미처리 | **0건 실패** ✗ |
| C | 조회 테이블 `4xl` 값 조작 | **2건 실패** ✓ |

**B가 통과했다 — 테스트가 아무것도 지키지 않고 있었다.**

원인은 fixture 설계다. `responsive.tsx`에 `md:text-lg`와 **순수 `text-lg`가 둘 다** 있어서, 접두사 처리를 통째로 없애도 뒤엣것이 20px을 채운다. 계수 결과가 `{16, 20}`로 같아 테스트가 못 잡는다.

→ `variant-only.tsx` 신설: 20과 28에 **접두사를 통하지 않고는 도달할 수 없게** 만들었다. 다시 probe B를 돌리니 정확히 그 테스트 1건이 실패한다.

> 이 horizon에서 probe가 자기 무용함을 드러낸 **두 번째** 사례다(DOG1 step-2는 치환 자체가 no-op이었다). 규율이 값을 하고 있다: **probe가 통과하면 probe나 테스트를 의심한다.**

### 게이트

- `packages/cli` 43 tests PASS (32 → +11)
- `tsc --noEmit` exit 0
