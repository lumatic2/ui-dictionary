# SQ2 — 구조 결함 O5·O6·O7 수리 evidence (2026-07-28)

> Milestone: SQ2 (goal `site-quality`) · Plan: `plans/2026-07-28-sq2-structural-defects.md` · Changeset: `changesets/20260728-sq2-structural-defects/`

## 1. 결함별 수리 실측 (dev 실브라우저, Playwright)

| 결함 | 수리 전 | 수리 후 (실측) |
|---|---|---|
| O5 Get Started | 히어로 primary CTA 프로덕션 통째 숨김(`SHOW_UNFILLED`), 착지 `/download` 껍데기 | 히어로 CTA 부활 → `/get-started` 시작 가이드 실콘텐츠 착지. CTA 클릭 착지·직접 URL 진입·카드→/patterns/marketing 이동·`/llms.txt` 링크 실측 PASS |
| O6 Docs 랜딩 | `/docs` → "Getting set up" 문서 직행, 소개·허브 없음 | `/docs` → 소개+허브(그룹 카드 5장) 착지. 카드→문서 착지·`/docs/:slug` 딥링크·legacy `?page=docs&filter=…` 리다이렉트·topnav Docs→허브 실측 PASS. 허브 밑 용어 수백 행 덤프 억제(1차 스크린샷에서 적발 후 수정) |
| O7 좌측 내비 | 기본 컴포넌트 용어로 가는 사이드바 경로 없음 | Application UI 축 "Components" 그룹(용어 16종, term 링크 타입) 신설. 사이드바→`/terms/accordion`·`/terms/dropdown-menu` 실도달, Marketing 축 비오염 확인 |

## 2. 회귀 게이트

- tsc·lint·build(0.97s) exit 0.
- 디자인 verify `src/components` **비악화**: 7건 = SQ1 이월 타이포 그대로 (색 위반 0 유지, 신규 파일 `get-started-page.tsx` 위반 0 — 타이포 5단계 이내).
- Playwright 스모크 4라우트(/ · /get-started · /docs · /terms/accordion) 렌더 PASS · 콘솔 에러 0.
- 스크린샷: 세션 scratchpad `sq2_step1_get_started.png`·`sq2_step2_docs_hub.png`·`sq2_step3_appui_sidebar.png`.

## 3. 실배포 확인 (push 55a7a93 후)

- `ui.askewly.com` 신규 번들(index-jQLID8f8.js) 반영 (폴링 8회차).
- 라이브 실브라우저: `/get-started` 렌더(문서 제목 "Get Started — Askewly Design"·본문 확인, 직접 URL 진입 = SPA 폴백 함수 동작) · `/docs` 허브 렌더 · 홈 히어로 "Get Started" CTA 표시 · `/patterns/application-ui` 사이드바 Components 그룹 표시 · 콘솔 에러 0. HTTP: /get-started·/docs·/terms/accordion 전부 200.

## 4. 사람 관측 (DoD)

- 2026-07-28 사용자 관측 1회 **통과** ("통과. 마감하고 다음 계획 쓰자") — O5·O6·O7 라이브 확인 완료. DoD 전 항목 충족.
