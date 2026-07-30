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
| push·실배포 (사용자 승인 "ㄱㄱ" 2026-07-31) | PASS — dbedbe7..3a8bfd6, CF Pages 약 4분 후 라이브 |
| 실배포 스팟 체크 | PASS — 홈 FOUC 스크립트 존재·토글 다크 전환·`/terms/dark-mode` 직접 진입 다크 유지·llms.txt+knowledge 문서 서빙. 배포 직후 구 청크 캐시 404 1회(하드 리로드 해소 — 배포 스왑 과도기 현상, 신규 세션 무관) |
| 사람 관측 왕복 | **통과 (2회차)** — 1회차(2026-07-31): 랜딩 결함 3종 적발(마커 텍스트 렌더·데모 크롬 침몰·쇼케이스/푸터 인버스 뒤집힘) → 수리·재배포. 도중 사용자 결정 갱신: 기본 테마 = 라이트(OS 무관). 2회차: "이정도면 됐어" 통과 |
