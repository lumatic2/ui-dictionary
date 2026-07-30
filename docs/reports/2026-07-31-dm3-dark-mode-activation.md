# DM3 — 다크모드 활성화 (완료)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-dm3-dark-mode-activation.md` · Changeset: `changesets/20260731-dm3-dark-mode-activation/`

## 1. 결과

실배포 사이트(ui.askewly.com)에 3-상태 다크모드(라이트/다크/시스템)가 켜졌다. 기본값은 라이트(OS 무관 — 사용자 확정), topbar 토글로 전환하며 755개 프리렌더 라우트 전부 FOUC 없이 첫 페인트부터 올바른 테마로 뜬다. 데모 카드 프리뷰는 사이트 테마를 추종하되 카드별 오버라이드가 유지되고, 다크 쇼케이스·푸터는 양 테마 다크 고정, 오너 언락·검색·내비 무회귀. 사람 관측 2회차 통과로 goal `dark-mode` 완주.

## 2. 이슈와 해결

- **사람 관측 1회차가 랜딩 결함 3종 적발** — ① DM2 위임 에이전트가 넣은 `hardcoded-color-ok` 마커 주석이 JSX 자식 위치에서 화면 텍스트로 렌더(라이트에도 보이던 회귀) → 208줄 제거·home-page.tsx 스캐너 allowlist 전환 ② 토큰 카드 위 데모 크롬(Commerce 스텝·Total 등) slate 하드코딩 침몰 → 토큰화 ③ 다크 쇼케이스 섹션·푸터가 인버스 토큰(bg-foreground) 치환 탓에 다크에서 희게 뒤집혀 내부 고정-다크 대시보드와 충돌 → 양 테마 다크 고정(slate-950/white) 복원.
- 관측 왕복 중 사용자 결정 갱신: 기본 테마 = 라이트(구 결정 "무선택 시 시스템 추종" 대체) — FOUC 스크립트·useSiteTheme 반영, OS-다크 에뮬레이션으로 검증.
- 배포 직후 구 청크 캐시 404 1회 — 배포 스왑 과도기 현상(하드 리로드 해소, 신규 세션 무관).

## 3. 증거

- Evidence: `evidence/dark-mode/dm3-activation.md` — step-1(토글 순환·유지·폴백·FOUC·데모 추종)·step-2(다크 대비 lint 2종·8표면 순회·수리 0)·step-3(로컬 게이트·실배포 스팟·관측 왕복) 표 전건.
- 실표면: 실배포에서 토글 다크 전환·`/terms/dark-mode` 프리렌더 직접 진입 다크 유지·새 FOUC 스크립트(기본 라이트) 라이브 확인 + OS-다크 에뮬레이션에서 무저장 첫 페인트 라이트 assertion 통과 + **사람 관측 2회차 통과**(1회차 결함 3종 → 수리 → "이정도면 됐어").
- 재현: `cd examples/ui-vocabulary-site && npm run lint && npm run build` 후 `npx vite preview` → 토글 3-상태 순환·하드 리로드.
- 크기 회고: changeset 1개·커밋 6건(배선·장부·evidence·관측 수리 2·기본값 변경) — steps=3 계획 정합. 관측 왕복이 실질 결함을 잡아 게이트 가치 실증.
