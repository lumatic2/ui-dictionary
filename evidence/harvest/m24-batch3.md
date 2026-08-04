# M24 — harvest 배치 3 evidence (2026-08-04)

> 보고: docs/reports/2026-08-04-m24-harvest-batch3.md · plan: archive/plans/2026-08-04-m24-harvest-batch3.md · changeset: changesets/20260804-m24-harvest-batch3

## 게이트 확장 (step-1)

- `scripts/generate-registry.mjs` plain-asset 경로: ① 선언 npm allowlist(`item.dependencies` — 선언+실사용 대조, 패키지 루트 매칭) ② 등재 자산 참조(`@/components/<asset>` → registryDependencies URL). 기존 38건 diff 0.
- 자기시험 실행 출력:
  - T1 미선언 motion → `FAIL — item 'magnetic-hover-button' 순수성 위반 — 허용 외 import: motion/react`
  - T2 선언·미사용 → `FAIL — item 'actionable-toast': 선언됐지만 소스에 없는 dependencies: motion`
  - T3 미등재 참조 → `FAIL — item 'swipe-action-row-pattern': 미등재 컴포넌트 import '@/components/device-frame'`

## 승격 (step-2·3) — registry 38 → 48

| 자산 | 형태 | 비고 |
|---|---|---|
| device-frame | 부속 | 3종의 참조 대상, regDeps URL 파생 확인 |
| magnetic-hover-button / spring-drag-snap-card / staggered-entrance-group | asset | dependencies ["motion"] |
| swipe-action-row-pattern / pull-to-refresh-list-pattern / bottom-sheet-detents | asset | device-frame 참조 (regDeps 1~2) |
| product-coverflow / hero-composition / image-treatment | asset (추출) | home-page.tsx 정의 삭제·import 전환, 공유 훅 인라인·keyframe 내장·브랜드 변수 로컬 자급, lint ALLOWLIST +2 |

- 시각 회귀: 로컬 빌드 vs 라이브 프로드 풀페이지 대조 동일 (scratchpad m24-home-local/live.png).
- hex probe: 주입→`FAIL lint:colors — 1 > max 0`→원복 0.

## knowledge (step-4)

- `knowledge/graph-content-schema.md` + llms FIXED_ASSETS. probe: 등재 전 grep 0 → 후 1, check-llms-sync PASS.

## 신선 E2E (step-5)

- fetch 10종 전건 ok(로컬 registry :8931) · `npm i motion` · tsc 무오류 · 콘솔 에러 0.
- 시간차: t=2.5s/7.2s — Coverflow analytics→kanban · Hero Centered→Proof surface · Image Duotone→Warm Film · 와이프 중간 프레임 (scratchpad m24-e2e-t1/t2.png).
- 상호작용 실발화(Playwright): 마그네틱 (7.94,6.95)→none / 드래그 (24.8,-40)→(1.91,-3.09)→none / 스와이프 3→2 / 풀투리프레시 spin→Updated / 시트 collapsed→expanded→scrim 닫힘 / 스태거 [1,1,1,0.72].
- 사용자 관측 통과 ("응 통과") — 보드 artifact 5ae085df M24 섹션.

## 이월·finding

- 배치 4 후보: C1 three.js 씬 · C2 Palette Generator · C5 (Cursor-Reactive Field·brain 모달/HUD).
- finding 신규: probe 원복 `git checkout` → autocrlf CRLF 오염 (역편집/EOL 검사로 대체). 승계: CLI verify chart.tsx 속성 셀렉터 오탐.
