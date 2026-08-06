# Evidence — M31 스크림 토큰 + 전체면 반전 (step-1~5)

> 2026-08-06 · goal `dark-inversion-cleanup` · plan `plans/2026-08-06-m31-dark-inversion-cleanup.md`

## 관측 (step-5, human gate) — 통과

**대상**: `/recipes` → Overlays → Bottom Sheet Detents → "Open modal sheet"(스크림 있는 변형).
라이트/다크 각각 실브라우저 렌더 캡처, 사용자 관측 2026-08-06 "좋다".

**관측이 잡은 결함 1건 — 기계 게이트가 전부 통과한 상태였다.**

첫 다크 캡처에서 폰 화면이 평평했다. 시트와 뒤 화면이 구분되지 않았다. 원인:

| | 값 | |
|---|---|---|
| 다크 `--background` | `gray.12` = `oklch(0.16 0.015 270)` | |
| step-1 의 `--scrim` | `gray.12` = `oklch(0.16 0.015 270)` | **동일** |

같은 색을 같은 색 위에 얹은 것이라 **불투명도와 무관하게 합성 결과가 0**이다. 반전 버그(다크에서
백드롭이 밝아지던 것)는 사라졌지만 그 자리를 **무동작**이 대신하고 있었다. 계획 step-2 가 예상한
"분리감이 약할 수 있다"보다 나쁜 상태다 — 약한 게 아니라 아예 작동하지 않았다.

**수정**: `scrim = {color.primitive.black}`(primitive `black` 신설, `oklch(0 0 0)`).
스크림의 실제 제약은 "자기가 덮는 가장 어두운 표면보다 더 어두울 것"이고, 순수 검정이 양 모드에서
그 제약을 만족한다. CLI `renderBrandCss` 도 `c.dark.bg` → `oklch(0 0 0)` 으로 같이 정정 —
이식처 캔버스가 어두운 톤이면 정확히 같은 무동작이 재현되는 구조였다.

- 다크 수정 후 계산값: `oklab(0 0 0 / 0.5)` (실측)
- 라이트: `0.16 → 0` 로 미세하게 깊어질 뿐 육안 차이 없음 (관측 확인)

**교훈**: "라이트 픽셀 무변화"를 목표로 값을 고르면 다크에서 무동작이 될 수 있다. 스크림 계열 토큰의
제약은 *다른 토큰과 같은 값인가*가 아니라 *덮는 표면보다 어두운가*다.

## 기계 검증

| 항목 | 결과 |
|---|---|
| `node scripts/generate-tokens.mjs` 2회 | diff 무변화 (멱등) |
| 토큰 lint | parse·schema·alias·contrast 전건 PASS |
| `--scrim` 위치 | `:root` 에만 존재, `.dark{}` 에 **0건** (의도 — `hasDarkOverride` false) |
| 사이트 `npm run build` | exit 0 · prerender **759 불변** |
| `npx tsc --noEmit` (사이트) | exit 0 |
| CLI `npx tsc --noEmit` | exit 0 |
| CLI vitest | **83/83** (신규 3 — 단일 선언·`@theme` 매핑·누락 적발) |
| `npm run build:data` | 통과 (`askewly.css` 추출에 `--color-scrim` 실림) |
| llms-sync | PASS (watched 4 paths) |
| `@askewly/design verify` | 내 변경발 위반 **0건** (scrim 매칭 0) |
| registry 재생성 | diff 4파일 (asset 2 + 인덱스 2), 나머지 **53종 무변경** |

> ⚠ `verify` 를 이 레포 `src` 전체에 돌리면 **기존 위반 153건**이 나온다(glow-points hex·kakao 브랜드
> 상수 등, M31 이전부터 존재). 계획의 "verify 0건"은 이식 대상 디렉터리 기준 문구였고, 여기서는
> "내 변경이 새 위반을 넣지 않았는가"로 판정했다.

## Failure probe — 실패 모드 ① 실증

`@theme inline` 에서 `--color-scrim` 을 제거하고 빌드:

```
build exit 0 · prerender 759 routes · .bg-scrim 유틸 0개
```

빌드도 프리렌더도 정상 통과하는데 유틸만 조용히 사라진다 — 백드롭이 투명해지고 **어떤 게이트도 짖지 않는다.**
이것이 step-4 에서 `renderBrandCss` 의 변수 선언과 `@theme inline` 을 **반드시 함께** 넣은 이유다.

## 검사 구멍 폐쇄 (승계 계약 ④)

`requiredCssVars` 를 최상위 블록 `meta` 에서만 읽던 것을 `resolve()` 재귀 전체 수집으로 확장했다.
component tier asset 이 `registryDependencies` 로 딸려올 때 그 asset 의 토큰 요구가 **검사에서 통째로
빠져** 있었다 — "선언이 좁으면 검사는 통과하고 이식처에서 색이 빠진다"의 실물.

- `auth-gate-modal`·`bottom-sheet-detents` 에 `requiredCssVars` 신설(자기 파일 실측분)
- 블록 3종은 무변경 — `docs-site.json` 이식 파일 6개에 스크림 **0건**(실측)
- **잔여 공백**: 상류 shadcn primitive(`ui/button`·`ui/input`)는 선언을 갖지 않는다. M31 이전부터의
  공백이고 이번 범위 밖 — finding 큐로.

## 범위 준수

| | |
|---|---|
| 스크림 전환 | 8곳 / 7파일, 전부 1:1 치환, 불투명도 `/20 /35 /50 /72` 원값 보존 |
| 전체면 반전 | `term-visual.tsx` 4곳(3110·4652·5100·5115), `bg-foreground` 총 출현수 **25 불변** |
| 무변경 | C2 작은 컨트롤 · C3 데코 틴트 · `contrast-duo-card` · `ui/tooltip` · 블록 3종 |

## 사이트에 없는 대상 1건 (step-6 이월)

`auth-gate-modal` 은 **사이트 어디에서도 렌더되지 않는다** — registry 전용 harvest asset 이라
이식해야만 보인다. step-6 라이브 재현에서 확인한다. (전이 판독의 실발화 증거도 같은 이유로 step-6 이월 —
asset regDeps 가 라이브 절대 URL 이라 선언 배포 전에는 로컬에서 그 경로가 돌지 않는다.)

## 커밋

- `feat(tokens): scrim semantic 토큰 신설` (step-1)
- `fix(dark): 모달 백드롭 8곳 scrim 토큰 전환` (step-2)
- `fix(dark): 전체면 반전 목업 4곳 다크 판본` (step-3)
- `feat(cli): 이식 경로에 scrim 배선 + requiredCssVars 전이 판독` (step-4)
- `fix(tokens): scrim 을 순수 검정으로 — 다크에서 무동작이던 것` (step-5 관측 반영)
