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

---

## step-2 — CLI 표면 (2026-07-22)

### 임계값: 계획 4 → 실제 5 (승인 결정 반영)

plan 본문은 기본값 4로 적혀 있으나, **horizon 결정 로그 5번(사용자 승인 2026-07-22)은 5**다. plan이 승인 이전에 작성돼 옛 값을 담고 있었다. 승인된 값을 따랐고 근거는 plan 자신이 이미 적어둔 것과 같다:

> 우리 SSOT(`typography.scale`)가 이미 5단계라, 4를 그대로 쓰면 **토큰 정의를 다 쓰는 것만으로도 위반**이 된다.

`five-steps.tsx` fixture가 이 판단을 코드에 고정한다 — 우리 스케일 전부를 쓴 파일이 PASS여야 한다.

### 실표면 관측 (`node dist/index.js verify`)

| fixture | 단계 수 | 결과 |
|---|---|---|
| `three-steps.tsx` | 3 | `verify PASS — no file over 5 type sizes` |
| `five-steps.tsx` | **5 (경계)** | **PASS** — 우리 토큰 스케일 전부 |
| `six-steps.tsx` | **6 (경계)** | **FAIL** — `six-steps.tsx:10 [typography-scale-exceeded] font-size steps: 12, 14, 16, 20, 28, 40 (6 > limit 5)` |
| `six-steps.tsx` + `--typography-threshold 8` | 6 | **PASS** (옵션이 실제로 임계값을 바꾼다) |

보고 줄이 **10행**이다 — 6번째 값 `12px`(`text-xs`)이 처음 등장한 줄. 파일 첫 줄을 가리켰으면 무엇을 고칠지 말해주지 못한다.

### Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| D | `--typography-threshold` 옵션 무시 | **1건 실패** (`honours a raised threshold`) |
| E | 경계 비교 `>` → `>=` | **2건 실패** — 그중 하나가 `passes a file using exactly our full token scale` |

E가 이 step의 핵심 위험을 정확히 잡는다: 부호 하나가 틀리면 **디자인 시스템 스케일을 온전히 쓴 화면이 위반**이 된다.

### 부수 확인

- 주석 안의 `text-xs text-3xl …` 6종은 계수되지 않는다 — DOG1의 마스킹이 타이포 규칙에도 적용된다(같은 마스킹 산출물을 쓴다).
- 실패 안내문이 색 얘기만 하던 것을 타이포 항목까지 포함하도록 고쳤다.

### 게이트

- `packages/cli` 48 tests PASS (43 → +5)
- `tsc --noEmit` exit 0 · `npm run build` 성공 · 루트 `npm run verify` exit 0

---

## step-3 — 우리 자산에 돌려본다 (2026-07-22)

계획이 이 step에 맡긴 판정: **임계값 5가 현실적인가, 아니면 셈법(파일=화면)이 틀렸는가.**

대상: `examples/ui-vocabulary-site/src` (tsx·ts·css **99개 파일**)

### 분포 실측

```
단계수:  0→25  1→35  2→21  3→7  4→2  5→1  |  6→1  7→1  8→2  11→2  15→1  16→1
```

**91/99 (91.9%)가 임계값 5 이하.** 초과 8건(8.1%).

### 초과 8건의 정체

| 줄수 | 단계 | 12px 미만 값 | 파일 |
|---:|---:|---:|---|
| **23,508** | 16→15 | 3 | `App.tsx` |
| **3,207** | 16 | 5 | `components/home-page.tsx` |
| **5,140** | 11 | 5 | `components/term-visual.tsx` |
| 1,851 | 8 | 0 | `lib/documentation-pages.ts` |
| 467 | 11 | 2 | `components/article-documentation-layout.tsx` |
| 262 | 7 | 1 | `components/colors-page.tsx` |
| 257 | 6 | 0 | `components/term-page.tsx` |
| 98 | 8 | 1 | `components/recipe-gallery.tsx` |

- **5/8이 400줄 초과.** `App.tsx`는 **23,508줄**이다 — 이것을 "한 화면"이라 부를 수 없다.
- **4/8이 12px 미만 값을 2개 이상** 쓴다(7·8·9·10·11px). 이것은 디자인 실패가 아니라 **장식용 미니어처**다 — 쇼케이스 카드 안의 축소된 기기 목업.

### 400줄 이하만 보면

**89개 중 초과 3개 (3.4%).**

| 파일 | 단계 | 값 |
|---|---:|---|
| `recipe-gallery.tsx` (98줄) | 8 | 10, 12, 14, 16, 20, 30, 36, 40 |
| `colors-page.tsx` (262줄) | 7 | 10, 12, 14, 16, 20, 48, 72 |
| `term-page.tsx` (257줄) | 6 | 12, 14, 16, 20, 36, 48 |

### 판정 — 선언 / 실측 / 결론

| 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 임계값 5가 현실적인가 | 우리 SSOT가 5단계라 4는 자기모순 | 92%가 5 이하 통과. "한 화면일 법한" 크기(≤400줄)만 보면 **96.6% 통과** | **임계값 5 유지** |
| 파일 = 화면이 맞는가 | 위험 인지 상태로 채택(plan 명시) | 초과의 **5/8이 400줄 초과 다중 컴포넌트 파일** | **이것이 진짜 한계다** |

**임계값은 틀리지 않았다. 경계가 틀렸다.**

23,508줄짜리 `App.tsx`가 15단계를 쓰는 것은 그 파일이 화면 하나가 아니기 때문이지, 타이포 규율이 무너져서가 아니다. 임계값을 올려서 이 파일을 통과시키면 **진짜 화면의 남용까지 함께 통과**한다.

### 남은 결함 (finding 큐)

- **파일 = 화면 경계의 한계.** 다중 컴포넌트 파일에서 오탐이 난다. 해소하려면 "화면"을 컴포넌트·라우트 단위로 잡아야 하는데, 그건 정적 분석으로 경계를 긋는 별도 설계 문제다. **이번 범위 밖으로 명시하고 남긴다** — DOG7 사람 관측에서 "오탐이 성가신가"의 1순위 관측 대상이다.
- **장식용 미니어처(<12px)를 셈에서 뺄 것인가.** 4/8이 여기 해당한다. 다만 "장식"을 기계가 판정할 근거가 없어(크기만으로는 본문과 구분 불가) 지금은 규칙을 만들지 않는다. 사람 관측 입력으로 남긴다.

### 게이트

- 실행 관측만 수행(코드 변경 없음). `packages/cli` 48 tests PASS 유지.

---

## 릴리스 `0.2.0` — Trusted Publishing 실증 (2026-07-22)

새 검사 규칙 추가는 minor(`docs/design-system/cli-release-procedure.md`). 이 릴리스가 **OIDC의 첫 실증**을 겸했다.

### OIDC 배포 성공

GitHub Actions `publish-cli` 수동 실행(run `29852373791`) → `배포` 단계 **성공**. 토큰을 쓰지 않았다.

결정적 증거는 **provenance attestation**이다:

```
$ npm view @askewly/design dist.attestations
{ url: '.../attestations/@askewly%2fdesign@0.2.0',
  provenance: { predicateType: 'https://slsa.dev/provenance/v1' } }
```

토큰 배포에는 provenance가 붙지 않는다. **Trusted Publishing이 실제로 동작했다.**

`npm view @askewly/design versions` → `[ '0.1.0', '0.2.0' ]`

### ⚠ 그러나 검증 단계가 실패했다 — 워크플로 결함 2건

같은 run의 `전파 확인 + 레포 밖 실증` 단계가 exit 1로 끝났다. **패키지가 아니라 내 워크플로가 틀렸다.**

| # | 결함 | 관측 |
|---|---|---|
| 1 | **패키지 존재만 확인하고 버전은 안 봤다** | `try 1: HTTP 200` — 0.1.0 때문에 즉시 통과. 정작 `0.2.0`은 아직 전파 전이라 `npm error ETARGET No matching version found for @askewly/design@0.2.0` |
| 2 | **exit code 오독** | `npx` 실패와 "린터가 위반을 찾음"이 둘 다 exit 1이라 서로를 가렸다. `bad` 검사는 `위반 검출 OK`로 **거짓 안심**, `clean` 검사는 `깨끗한 코드에 위반이 잡혔다(오탐)`으로 **거짓 경보** |

DOG2의 전파 지연 교훈을 적용한다면서 **한 칸 얕게** 적용했다 — 물어야 할 것은 "패키지가 있나"가 아니라 "이 **버전**을 받을 수 있나"였다.

### 수정

- 전파 확인을 `npm view @askewly/design@$VERSION` 으로 — **버전 단위 조회**
- **설치와 검사를 분리** — `npm install` 이 먼저 실패하면 그 자리에서 멈춘다. 그 뒤 exit code는 오직 린터에서만 온다
- 두 검사의 exit code를 변수로 받아 `기대 1 / 기대 0`을 명시 비교

### 수정 로직 로컬 실증 (배포본 0.2.0 대상)

| 검사 | 결과 |
|---|---|
| 버전 단위 전파 확인 | `0.2.0 조회 성공` |
| `npm install @askewly/design@0.2.0` | 성공 |
| `verify bad` | exit **1** (기대 1) |
| `verify clean` | exit **0** (기대 0) |

**배포본의 타이포 규칙 동작 확인** (레포 밖, 공개 레지스트리에서 받은 패키지):

```
verify typo  → six-steps.tsx:10 [typography-scale-exceeded] font-size steps: 12, 14, 16, 20, 28, 40 (6 > limit 5)
verify typo5 → PASS (5단계 경계)
verify typo --typography-threshold 8 → PASS
```

수정된 CI 경로 자체는 **다음 릴리스에서 실행된다** — 버전을 낭비해 CI를 시험하지 않는다.
