# changeset: dm1-dark-mode-knowledge

- Milestone: DM1 — 다크모드 지식·용어 자산화 (plan: `plans/2026-07-31-dm1-dark-mode-knowledge.md`)
- Date: 2026-07-31

## step-1 — knowledge/dark-mode.md + llms 배선

- `knowledge/dark-mode.md` 신설 — 정의(재설계된 별도 팔레트 ≠ 반전), 인접 개념 경계 4종(night shift·forced-colors·inverted colors·dark theme), 디자인 판정 규칙 5(순검정 금지·elevation=표면 밝기·채도 하향·semantic 토큰 강제·이미지 별도 판정), 웹 구현 판정 규칙 6(3-상태·FOUC head 인라인·color-scheme·theme-color media·transition 토글 한정·수동 토글 정합), 참조 구현 4건. 출처 URL+접근일 전건 (`research/2026-07-31-dark-mode-goal-dark-mode.md` 기반).
- `scripts/generate-llms-txt.mjs` Knowledge 섹션에 등재 → 재생성: llms.txt 50행 노출·knowledge 4파일 복사(기존 3건 무손실).
- Failure probe: 오타 경로 등재 시 `SSOT source missing` throw·exit 1 확인(원복 완료).
