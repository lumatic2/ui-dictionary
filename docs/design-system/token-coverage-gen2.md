# 토큰 커버리지 2세대 — SD Step 6

Date: 2026-07-12
Milestone: SD (`docs/plans/2026-07-12-sd-surface-depth.md`, Step 6)

## 방법

RL/MS가 새로 연 표면 중 모바일 8종(`device-frame`, `bottom-tab-bar`, `bottom-sheet-detents`, `pull-to-refresh-list-pattern`, `large-title-collapsing-header`, `mobile-signup-field-stack`, `swipe-action-row-pattern`, `action-sheet-destructive-confirmation`)과 밀집 데이터 3종(`permission-matrix-editor-grid`, `audit-log-filterable-export-feed`, `interactive-data-table`) 컴포넌트 11개 전체를 읽고, 컴포넌트가 우회(work around)한 하드코딩 값을 추출했다. 이후 `grep -rlE`로 각 후보 값이 `examples/ui-vocabulary-site/src/components/` 전체(신규 11종 + 기존 컴포넌트)에서 몇 곳에 나타나는지 재검증해, "이 11개 표면에서만 우연히 겹친 값"과 "사이트 전체 관례로 이미 반복되는 시스템 개념"을 구분했다.

판정 기준:
- **(a) 진짜 토큰 갭**: 서로 다른 컴포넌트 ≥2곳에서 동일한 수치가 동일한 시스템 개념(터치 타깃, 레이어링, 코너 반경, 모션 속도 등)을 표현하는데 SSOT에 대응 토큰이 없는 경우.
- **(b) 비갭**: 값이 해당 컴포넌트 1곳에만 존재하거나(디바이스 뷰포트 크기, 시트 detent 높이, pull-to-refresh 임계값 등), 이미 Tailwind 기본 유틸리티로 충분히 관례화되어 있어 이번 배치가 새로 드러낸 갭이 아닌 경우.

## 발견 갭 (a) — SSOT 반영함

| concept | 현재 하드코딩 위치 | 제안 토큰 경로 | tier |
|---|---|---|---|
| 터치 타깃 최소 크기 (WCAG 2.5.5 / iOS HIG 44pt) | `large-title-collapsing-header.tsx` 뒤로가기 버튼 `size-11`, `mobile-signup-field-stack.tsx` 입력 3개 + 제출 버튼 `h-11 min-h-11` — 기존 `search-autocomplete.tsx`, `showcase-card.tsx`, `term-visual.tsx`, `home-page.tsx`, `landing-hero.tsx`에도 동일 관례가 이미 반복되고 있었음(신규 표면이 그 관례를 재확인) | `dimension.size.touch-target-min` = 44px | 신규 `dimension.size` 그룹 (primitive/semantic 구분 불필요 — 색상 이외 토큰은 lint 상 tier 규칙 없음, 기존 `dimension.space`/`dimension.radius`와 동일한 flat 레퍼런스 성격) |
| 레이어링(z-index) 스케일 | `bottom-sheet-detents.tsx`/`action-sheet-destructive-confirmation.tsx` 루트 오버레이 `z-10`, `large-title-collapsing-header.tsx` sticky 헤더 `z-10`, `permission-matrix-editor-grid.tsx` sticky 헤더 행 `z-20`·sticky 코너 셀 `z-10`, `ui/dialog.tsx`/`ui/sheet.tsx`/`ui/popover.tsx`/`ui/tooltip.tsx`/다수 전면 스크림 `z-50` | `dimension.z-index.sticky`=10, `dimension.z-index.elevated`=20, `dimension.z-index.overlay`=50 | 신규 `dimension.z-index` 그룹 |
| 시트/오버레이 코너 반경 (기존 스케일 상한 `xl`=12px보다 큰 값) | `device-frame.tsx` 내부 뷰포트 `rounded-2xl`, `bottom-sheet-detents.tsx` 시트 상단 `rounded-t-2xl` (Tailwind 기본 스케일 16px, 우리 토큰 최대치 xl=12px 밖) | `dimension.radius.2xl` = 16px | 기존 `dimension.radius` 그룹에 추가 (semantic 태그 없이 참조 변수) |
| 모달/시트 열림·닫힘 모션 속도 | `bottom-sheet-detents.tsx`의 `transition-[height] duration-200`과 `ui/dialog.tsx`의 `duration-200`이 동일 200ms로 겹침(같은 "모달류 표면 전환" 개념) | `motion.duration.overlay` = 200ms | 신규 최상위 `motion.duration` 그룹 ($type: duration) |

## 비갭 판정 (b) — SSOT 미반영, 근거

- **디바이스 뷰포트 크기 (390×844 / 768×1024)** — `device-frame.tsx` 한 곳에만 존재하는 Apple 표준 사이즈 상수. 다른 컴포넌트가 재사용하지 않음(전부 `<DeviceFrame>`을 통해서만 소비) → 컴포넌트 고유값.
- **바텀시트 detent 높이 (45% / 85%)** — `bottom-sheet-detents.tsx` 한 곳. 시트별로 자연스럽게 달라질 수 있는 값이라 시스템 상수화하지 않음.
- **Pull-to-refresh 임계값 (`THRESHOLD_PX`=64, `MAX_PULL_PX`=96)** — `pull-to-refresh-list-pattern.tsx` 한 곳. 제스처 튜닝값으로 재사용 근거 없음.
- **스켈레톤 shimmer 지속시간** — 조사 결과 신규 표면 어디에도 커스텀 duration으로 구현된 스켈레톤이 없었다(`category-product-grid.tsx`/`ui/skeleton.tsx`/`term-visual.tsx`가 전부 Tailwind 기본 `animate-pulse` 유틸리티를 그대로 사용, 숫자 하드코딩 없음). 프롬프트가 예시로 든 개념이지만 실제로는 하드코딩된 갭이 존재하지 않아 반영하지 않음.
- **Safe-area inset** — 신규 모바일 컴포넌트(`device-frame`, `bottom-tab-bar`, `pull-to-refresh-list-pattern` 등) 중 어느 것도 실제 `env(safe-area-inset-*)`를 구현하지 않는다(상태바는 고정 `py-1.5`, 탭바 하단은 홈 인디케이터 여백 없음). `safe-area-inset`이라는 이름은 `term-visual.tsx`의 시각 데모(`SafeAreaVisual`)에만 존재하고 이는 장식용 예시일 뿐 실제 하드코딩된 수치 갭이 아니다. **토큰 갭이 아니라 컴포넌트 구현 갭**이므로 이번 SSOT 확장 대상에서 제외 — 후속 컴포넌트 작업 후보로만 기록.
- **아이콘 크기 (`size-4`/`size-5`)** — 신규 11개 표면 전반과 사이트 전체에 이미 광범위하게 퍼진 기존 관례. 이번 배치가 새로 드러낸 갭이 아니라 이전부터 있던 미토큰화 상태이므로 SD Step 6 범위(신규 표면이 드러낸 갭) 밖으로 판단, 반영하지 않음.
- **기타 모션 속도 (150ms pull-to-refresh 인디케이터, 300/500ms `ui/sheet.tsx` 열림/닫힘)** — 각각 한 곳에서만 쓰이는 서로 다른 값이라 "반복되는 동일 개념"이 아님. `motion.duration.overlay`(200ms)만 정확히 2곳 이상에서 값이 일치해 토큰화했다.

## 적용 결과

`tokens/askewly.tokens.json`에 아래 4개 그룹/토큰을 추가했다(3-tier 규약 — 색상 외 dimension/typography 토큰은 기존 파일 관례대로 tier 구분 없는 flat 참조 변수로 유지):

- `dimension.radius.2xl` = 16px (기존 `dimension.radius` 그룹에 항목 추가)
- `dimension.size.touch-target-min` = 44px (신규 그룹)
- `dimension.z-index.sticky` / `.elevated` / `.overlay` = 10 / 20 / 50 (신규 그룹)
- `motion.duration.overlay` = 200ms (신규 최상위 그룹)

컴포넌트 코드는 수정하지 않았다. `radius.2xl`은 정확히 2곳(`device-frame.tsx`, `bottom-sheet-detents.tsx`)에서 일치해 "≤3곳 기계적 교체" 예외 조건을 만족하지만, 적용을 보류했다: Tailwind의 `rounded-2xl` 유틸리티는 현재 우리 `--radius-*` CSS 변수 체계와 연결되어 있지 않다(`examples/ui-vocabulary-site/src/index.css`가 `--radius-sm/md/lg/xl`만 `--radius` 기준 `calc()`로 재정의하고 있고, `tokens.css`가 생성하는 동명 변수와는 별개 배선 — 기존에 이미 존재하는 드리프트). `radius.2xl`을 실제로 컴포넌트가 소비하게 하려면 `index.css`의 Tailwind 테마 변수 배선까지 함께 손대야 해서 "기계적 교체"의 범위를 넘어간다고 판단했다. 나머지 세 그룹(`size`, `z-index`, `motion.duration`)은 아직 어떤 CSS 변수 매핑도 갖지 않는 신규 개념이라 처음부터 즉시 교체 대상이 아니다.

**후속 작업(이번 범위 밖)**:
1. 4개 신규 토큰 그룹을 실제로 컴포넌트가 소비하도록 `scripts/generate-tokens.mjs`의 매핑 배열(`RADIUS_MAPPINGS` 등)과 `examples/ui-vocabulary-site/src/index.css`의 Tailwind 테마 변수 배선을 확장.
2. `device-frame`/`bottom-tab-bar`/`pull-to-refresh-list-pattern`에 실제 safe-area inset(`env(safe-area-inset-*)`) 구현 추가 — 토큰이 아니라 컴포넌트 레벨 작업.
3. 위 컴포넌트들의 `rounded-2xl`/`z-10`/`z-20`/`h-11` 등을 새 토큰 참조로 교체.

## Changelog

- 2026-07-12: 최초 작성 (SD Step 6). 갭 4종 반영(`radius.2xl`, `size.touch-target-min`, `z-index.*`, `motion.duration.overlay`), 비갭 7종 판정 기록.
