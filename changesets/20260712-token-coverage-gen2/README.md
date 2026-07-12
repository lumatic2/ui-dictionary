# 토큰 커버리지 2세대 — SD Step 6

Target: SD (`docs/plans/2026-07-12-sd-surface-depth.md`, Step 6).

## Scope

RL/MS가 새로 연 모바일 8종 + 밀집 데이터 3종 표면 컴포넌트를 읽고, 하드코딩된 dimension/z-index/touch-target/motion 값 중 시스템 개념으로서 ≥2곳에서 반복되는 것만 골라 `tokens/askewly.tokens.json` SSOT를 확장했다. 컴포넌트 자체는 수정하지 않았다(follow-up 범위). 상세 갭 분석과 판정 근거는 `docs/design-system/token-coverage-gen2.md` 참조.

## Contract

- `tokens/askewly.tokens.json`:
  - `dimension.radius.2xl` = 16px — 기존 `dimension.radius` 그룹에 추가(디바이스 프레임 내부/바텀시트 상단 코너).
  - `dimension.size.touch-target-min` = 44px — 신규 그룹(WCAG 2.5.5 / iOS HIG 최소 터치 타깃).
  - `dimension.z-index.sticky`(10) / `.elevated`(20) / `.overlay`(50) — 신규 그룹(sticky 헤더 vs 로컬 오버레이 vs 전역 모달 레이어링).
  - `motion.duration.overlay` = 200ms — 신규 최상위 그룹(모달/시트류 전환 속도, `$type: duration`).
- 모두 색상 외 dimension/typography 토큰과 동일하게 tier 구분 없는 flat 참조 변수(lint 스크립트가 color.* 외 경로에는 tier 규칙을 적용하지 않음).
- 컴포넌트 코드는 미변경. `radius.2xl`이 2곳(`device-frame.tsx`, `bottom-sheet-detents.tsx`)에서 값이 일치해 "≤3곳 기계적 교체" 예외를 만족했지만 보류했다 — Tailwind의 `rounded-2xl` 유틸리티가 아직 우리 `--radius-*` CSS 변수 체계에 배선되어 있지 않아(`index.css`가 별도로 `--radius-sm/md/lg/xl`만 재정의), 교체하려면 index.css 테마 배선까지 손대야 해서 범위를 벗어난다고 판단.

## Verification checklist

- [x] `node scripts/lint-tokens.mjs` → PASS, 0 errors (기존 orphan-primitive 경고 4건 그대로, 신규 토큰으로 인한 신규 에러/경고 없음).
- [x] `node scripts/generate-tokens.mjs` → exit 0. `tokens.css`는 무변경(신규 4개 그룹에 대한 CSS 변수 매핑을 아직 추가하지 않았으므로 예상된 결과). `DESIGN.md` frontmatter는 `dimension.radius.2xl` 한 줄만 갱신(기존 `serializeGroup(root.dimension.radius, ...)` 호출이 자동으로 반영 — 신규 `size`/`z-index`/`motion` 그룹은 frontmatter 직렬화 목록에 없으므로 미노출, 의도된 결과).
- [x] `python scripts/validate-recipes.py` → `recipes ok: 35` (변경 전과 동일, `tokens_used` 참조 영향 없음).
- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0 (`build:data` 562 terms 생성, `tsc -b && vite build` 클린).

## Result

`tokens/askewly.tokens.json`에 토큰 4개(그룹 3개 신규 + 기존 그룹 항목 1개) 추가. 파생 산출물(`tokens.css`, `DESIGN.md`) 정상 재생성 확인, recipe/site 검증 체인 회귀 없음. 갭 분석 리포트(`docs/design-system/token-coverage-gen2.md`)에 진짜 갭 4종과 비갭 판정 7종(디바이스 뷰포트 크기, 시트 detent 높이, pull-to-refresh 임계값, 스켈레톤 shimmer, safe-area inset, 아이콘 크기, 기타 개별 모션 속도) 근거를 남겼다. `git commit`/`push` 없음.
