# changeset — VI7 도구 층 배치

- Milestone: VI7 (goal `visual-impact-consolidation`)
- Plan: `plans/2026-07-28-vi7-toolshelf-placement.md`
- 승인: VI6 영수증 `--chain VI7,VI8` 연쇄 집행 + VI7 자체 영수증(chain VI8) 등록 2026-07-28

## step-1 — 15카드 전수 판정 장부 (2026-07-28)

- 산출: `research/2026-07-28-vi7-toolshelf-placement.md` — 15행 전수: 티어 × 3분기(A완료 1·A대기 2·B 8·C 4) × 사유 × 출처 URL.
- 갤러리형 4건은 티어 비배치 "레퍼런스 소스" 표기(failure probe 대응). VI8 입력 = GSAP 스크롤 시퀀스·Paper Shaders 그라디언트.
- 검증: 표 15행 grep=15 · 카드명 전수 매칭 MISSING 0.

## step-2 — 정본 반영 + llms 배선 (2026-07-28)

- `docs/design-system/absorption-criteria.md` — 신규 판정 9행 추가(기존 행 무변경) + Changelog.
- `knowledge/motion-references.md` — 관찰 갤러리 절(60fps·landing.love·Brainwave, B 판정 명시).
- `scripts/generate-llms-txt.mjs` — FIXED_ASSETS Knowledge 절에 motion-principles·motion-references 등재 (VI6 finding 해소).
- 검증: `node scripts/generate-llms-txt.mjs` 성공(160→162 assets) · llms.txt 에 두 링크 grep 확인.

## step-3 — shelf used + 통합 검증 (2026-07-28)

- shelf used --ok 8건 (실참조 카드), build ✓ 1.03s · lint exit 0.
- evidence: `evidence/visual-impact-consolidation/vi7-placement.md`.
