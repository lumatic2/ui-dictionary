# 성능·모바일·SEO 패스

- Date: 2026-07-12
- Milestone: PX Step 5 (`docs/plans/2026-07-12-px-public-experience.md`) — Step 3과 병렬 실행, 파일 무충돌
- Scope: `index.html`, `src/lib/page-meta.ts` (신규), `src/App.tsx` 훅 호출 1건

## What

- 정적 head 보강: `og:url`(https://ui.askewly.com/), `og:site_name` 추가 (title/description/og:title·description·type/twitter:card/theme-color는 기존 존재 — 무접촉).
- 동적 per-page 메타: `usePageMeta` 훅 — pageMode별 `document.title`("{Section} — Askewly Design", home은 bare) + meta description 갱신. term=용어명, docs=아티클 title/lead, plus=섹션 title/description. 라우팅 라이브러리·helmet 의존성 없음.
- 모바일 375px 오버플로 점검: home/docs/Patterns/Recipes/Colors 전부 scrollWidth 360 ≤ 375 PASS — 수정 불요.
- 번들 기록: main chunk 3,087.75 kB (gzip 708.85 kB) — code-splitting은 범위 밖, 유지보수 후보로 기록.

## Verification

- [x] `npm run build` PASS (294 modules — stale dist 재현 이슈는 rm -rf dist 후 해소, 워커 기록)
- [x] `npm run lint` 6-warning baseline 유지
- [x] `curl :4180 | grep og:` 정적 태그 관측 (워커)
- [x] 브라우저: home→Recipes→Colors→docs 페이지별 title 전환 관측 (워커)
- [x] 오케스트레이터 게이트: diff 전수 검토 — 계약 일치, 최소 구현. 결합 빌드는 Step 3 커밋 시 재실행.
