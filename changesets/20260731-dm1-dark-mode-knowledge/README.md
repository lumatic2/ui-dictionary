# changeset: dm1-dark-mode-knowledge

- Milestone: DM1 — 다크모드 지식·용어 자산화 (plan: `plans/2026-07-31-dm1-dark-mode-knowledge.md`)
- Date: 2026-07-31

## step-1 — knowledge/dark-mode.md + llms 배선

- `knowledge/dark-mode.md` 신설 — 정의(재설계된 별도 팔레트 ≠ 반전), 인접 개념 경계 4종(night shift·forced-colors·inverted colors·dark theme), 디자인 판정 규칙 5(순검정 금지·elevation=표면 밝기·채도 하향·semantic 토큰 강제·이미지 별도 판정), 웹 구현 판정 규칙 6(3-상태·FOUC head 인라인·color-scheme·theme-color media·transition 토글 한정·수동 토글 정합), 참조 구현 4건. 출처 URL+접근일 전건 (`research/2026-07-31-dark-mode-goal-dark-mode.md` 기반).
- `scripts/generate-llms-txt.mjs` Knowledge 섹션에 등재 → 재생성: llms.txt 50행 노출·knowledge 4파일 복사(기존 3건 무손실).
- Failure probe: 오타 경로 등재 시 `SSOT source missing` throw·exit 1 확인(원복 완료).

## step-2 — terms.yml '다크모드' 등재 + 시각 variant

- `docs/ui-vocabulary/terms.yml` 에 `dark-mode` 항목 등재 (category style·group style-tokens, aliases: 다크 모드/다크 테마/dark mode/Dark theme/Dark appearance, sources: apple-hig·mdn-css·material-m3) + `theme-token` 항목에 역방향 related 추가.
- `term-visual.tsx` 에 `dark-mode` variant 신설 — Light/Dark 병치 미니 다이어그램(다크 쪽: slate-900 표면·그림자 대신 밝은 표면 elevation — 의도적 리터럴 색, 데모 콘텐츠).
- 검증: strict-duplicates 0 · validate 563 ok · build(755 routes) · lint · audit:visuals(fallback/generic 아님) · 브라우저 상세 렌더 + 검색 정확 일치 티어 + 콘솔 0에러. 상세 → `evidence/dark-mode/dm1-knowledge.md`.
