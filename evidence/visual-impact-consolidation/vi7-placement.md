# VI7 — 도구 층 배치 evidence (2026-07-28)

> Milestone: VI7 (goal `visual-impact-consolidation`) · Plan: `plans/2026-07-28-vi7-toolshelf-placement.md` · Changeset: `changesets/20260728-vi7-toolshelf-placement/`

## 1. 판정 집계 (15카드 전수)

장부: `research/2026-07-28-vi7-toolshelf-placement.md` — 15행 전수(grep=15, 카드명 MISSING 0), 전 행 출처 URL+접근일.

| 3분기 | 수 | 항목 |
|---|---|---|
| A 완료 | 1 | motion (VI3 recipe 3종 기존) |
| A 대기 | 2 | GSAP(② 스크롤 시퀀스) · shaders(④ 토큰화 그라디언트) — **VI8 입력** |
| B 링크 | 8 | WebGL-Fluid · react-bits · magicui · Brainwave · 3d-spatial-pack · 60fps.design · landing.love · remotion |
| C 보류 | 4 | jquery.ripples · simple-water-waves · spark · animated-grid-lines |

티어 배치 대상 10, 갤러리·레퍼런스 소스 4(티어 비배치 명시), 범위 밖 매체 1.

## 2. 정본 반영

- `docs/design-system/absorption-criteria.md` 실측 표 신규 9행 + Changelog (기존 행 무변경 — diff 삽입만).
- `knowledge/motion-references.md` §관찰 갤러리 신설 (B 판정 3건 + 판정 이력 명시).

## 3. llms 배선 (VI6 finding 해소)

- `scripts/generate-llms-txt.mjs` FIXED_ASSETS Knowledge 절에 `motion-principles.md`·`motion-references.md` 등재.
- 재생성: `wrote … (162 assets)` (160→162) · `public/llms.txt` 49~50행에 두 링크 grep 확인 — knowledge 3문서 전부 배선 완료.

## 4. shelf used + 회귀 게이트

- `shelf used --ok` 8건 기록: GSAP(3)·motion·shaders·react-bits(2)·magicui(2)·60fps-design·landing-love·3d-spatial-landing-reference-pack — 실참조 카드만 (C 판정 4건은 카드 열람 없이 기존 요약 판정이라 미기록).
- build ✓ 1.03s · lint exit 0 (경고는 기존 home-page.tsx 건).
- 실배포 확인은 세션 말 push 후 (`https://ui.askewly.com/llms.txt` 에 두 링크).
