# Evidence — DM3: 다크모드 활성화

- Date: 2026-07-31
- Plan: `plans/2026-07-31-dm3-dark-mode-activation.md`
- Changeset: `changesets/20260731-dm3-dark-mode-activation/`

## step-1 — 3-상태 배선 + FOUC

| 검증 | 결과 |
|---|---|
| 토글 3-상태 순환 (topbar) | PASS — 라이트/다크/시스템, aria-pressed 반영 |
| 명시 선택 localStorage 유지 | PASS — dark 저장 후 라우트 이동·새로고침에도 다크 유지 |
| 시스템 선택 | PASS — 키 제거 + prefers-color-scheme 추종 |
| 쓰레기 localStorage 값 폴백 | PASS — "garbage-value" → 시스템 상태로 폴백, 에러 없음 |
| FOUC — 프리렌더 직접 진입 | PASS — `/terms/dark-mode` 직접 진입 시 head 인라인 스크립트가 첫 페인트 전 다크 적용 (dist 755 라우트 전부 스크립트 포함 확인) |
| 데모 프리뷰 전역 추종 | PASS — `useSystemPreviewTheme` = `<html>.dark` MutationObserver, 카탈로그 데모가 사이트 다크 추종 + per-example 라이트 오버라이드 동작 |
| tsc·build·콘솔 | PASS — 콘솔 에러 0 |

## step-2 — 다크 품질 점검 (수리 0건)

| 검증 | 결과 |
|---|---|
| 다크 대비 lint (`scripts/lint-tokens.mjs`) | PASS — light/dark 양 테마 AA 4.5:1 |
| design-lint (`scripts/lint`, DESIGN.md) | PASS — parse/schema/alias/contrast 4단 |
| 다크 순회 8표면 육안 | PASS — 홈·패턴 허브·카탈로그·get-started·colors·docs 아티클·용어 상세·검색 |
| Failure probe ① 상시-다크 코드 패널 | PASS — 다크 배경 위 경계·가독 성립 |
| Failure probe ② 전역 다크+데모 라이트 혼합 | PASS — 성립 |
| 라이트 무회귀 | PASS — 라이트 복귀 화면 기존과 동일(신규 요소는 토글뿐) |
| 관측 메모 | 홈 히어로 장식 블록 다크 인버스 — 의도적 대비 장식으로 성립 판정 (최종: 사람 관측) |

## step-3 — 통합 (로컬 게이트)

| 검증 | 결과 |
|---|---|
| `npm run lint` (oxlint + lint:colors --max 0) | PASS — 0 violations |
| `npm run build` + prerender | PASS — 755 routes |
| tsc·lint-tokens | PASS |
| 실배포 스팟 체크·사람 관측 | **대기** — push 승인 후 실시 (deploy-batching: 사전 보고 후 일괄) |
