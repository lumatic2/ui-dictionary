# changeset: dm3-dark-mode-activation

- Milestone: DM3 — 다크모드 활성화 (plan: `plans/2026-07-31-dm3-dark-mode-activation.md`)
- Date: 2026-07-31

## step-1 — 3-상태 테마 배선 + FOUC 방지

- `preview-theme.ts` 재작성: `useSiteTheme()` 신설(라이트/다크/시스템 — localStorage `askewly-theme`, 시스템=키 제거+matchMedia change 리스너, `<html>.dark` 적용) + `useSystemPreviewTheme()` 을 OS 직독에서 **`<html>.dark` MutationObserver 관찰**로 교체 — 데모 프리뷰 "system" 이 사이트 전역 테마 추종(2026-07-31 사용자 확정).
- `App.tsx`: 2026-07-28 차단 useEffect 제거 → `useSiteTheme` 배선, `SiteThemeToggle` topbar 노출(데스크톱 xl 내비 + 미만 뷰포트).
- `index.html`: head FOUC 인라인 스크립트(Tailwind 공식 패턴 — 프리렌더 셸 템플릿이라 755 라우트 전체 적용), theme-color 이중 meta(media 분기). `index.css`: `:root.dark { color-scheme: dark }`.
- 검증: 토글 3-상태 순환·새로고침 유지·시스템 폴백·쓰레기 localStorage 값 폴백·프리렌더 라우트(/terms/dark-mode) 직접 진입 다크 유지·dist HTML 스크립트 존재·tsc·build·콘솔 0에러.

## step-2 — 다크 표면 품질 점검 (수리 0건)

- 기존 다크 대비 lint 2종 PASS: `scripts/lint-tokens.mjs`(light/dark AA 4.5:1)·`scripts/lint`(design-lint contrast — deps 설치 후 4단 PASS).
- 다크 순회 8표면 육안 통과: 홈·패턴 허브·카탈로그(데모 프리뷰 전역 추종 확인)·get-started·colors·docs 아티클·용어 상세·검색. Failure probe: 상시-다크 코드 패널 가독 성립 · 전역 다크+데모 라이트 오버라이드 혼합 화면 성립. 라이트 무회귀 확인.
- 관측 메모: 홈 히어로 장식 블록이 다크에서 인버스(밝은 블록) — 의도적 대비 장식으로 성립 판정, 최종은 사람 관측.

## step-3 — 통합·실배포·사람 관측 왕복 (goal 마감)

- 로컬 게이트 전건 PASS 후 사용자 승인 push → CF Pages 실배포 스팟 체크 PASS (FOUC 스크립트·토글·프리렌더 직접 진입·llms 서빙).
- **사람 관측 1회차: 랜딩 결함 3종 적발** — ① 마커 주석 JSX 텍스트 렌더(208줄 제거, home-page allowlist 전환) ② 토큰 카드 위 데모 크롬 slate 침몰(토큰화) ③ 다크 쇼케이스·푸터 인버스 뒤집힘(양 테마 다크 고정 복원). 수리 중 사용자 결정 갱신: **기본 테마 = 라이트(OS 무관)** — FOUC 스크립트·useSiteTheme 반영, OS-다크 에뮬레이션 검증.
- **2회차 관측 통과** (2026-07-31 "이정도면 됐어"). 잔여 판정(라이트 아트보드 데모)도 수용.
