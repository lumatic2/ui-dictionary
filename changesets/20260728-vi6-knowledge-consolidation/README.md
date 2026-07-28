# changeset — VI6 지식 층 통합

- Milestone: VI6 (goal `visual-impact-consolidation`)
- Plan: `plans/2026-07-28-vi6-knowledge-consolidation.md`
- 승인: 2026-07-28 사용자 ("추천대로 ㄱㄱ"), receipt `.harness/work.json` (chain VI7,VI8)

## step-1 — 전수 대조·판정 장부 (2026-07-28)

- 산출: `research/2026-07-28-vi6-kg-crosswalk.md` — KG 19노드(계수 정정: 인벤토리 18 표기는 실제 19) × 판정(흡수 8/링크 7/제외 4) × 사유 × 정본 지정.
- 방법: sonnet 위임 본문 다이제스트 18건 + 의심 노드 3건(허브·css-disclosure·ui-state-vocabulary) 오케스트레이터 직독 — 겹침은 본문 인용으로 대조.
- 핵심 판정: 티어/도구 선택 정본 = `knowledge/expressive-stack.md`. KG 허브에만 있던 접근성 짝규칙·전 수단 reduced-motion 전제를 흡수 대상으로 지정.
- 검증: 표 19행 grep=19 · 19노드 이름 전수 매칭(MISSING 0) · 판정 3분류 외 값 없음.
- KG 쪽 후속 3건(stale 내부 참조 등)은 장부 §KG 쪽 후속 → plan finding 큐.

## step-2 — knowledge 층 갱신 (2026-07-28)

- `knowledge/motion-principles.md` 신설 — KG 5노드 흡수(still appeal 게이트·목적 6분류·등장 안무·모션 타이포 가독성·호명 규칙), 절마다 KG 원본 경로+접근일.
- `knowledge/expressive-stack.md` — 결정표 disclosure grid-track 행 추가, 판정 절차 7(접근성 짝규칙+전 티어 reduced-motion)·8(원칙 위임) 추가, ④ 티어 인접 게이트 절(3D 에셋 파이프라인·AI 생성 선택 링크+요지) 신설.
- `knowledge/motion-references.md` — 공간형 랜딩 절(사례군+decorative-skin failure 게이트 흡수), Remotion 4노드 링크 절(매체 경계 명시).
- 검증: 장부 흡수 8·링크 7 전 항목 착지 대조 완료(제외 4는 사유만) · git diff 삽입 29줄/삭제 0 — 기존 결정표 행 무단 변경 0.

## step-3 — 통합 검증 + 파이프라인 반영 (2026-07-28)

- llms 생성기 실행(160 assets) — expressive-stack 갱신분 배포 사본 반영 확인.
- 갭 적발: motion-principles.md·motion-references.md 는 FIXED_ASSETS 미등재(llms 미배선) — finding 큐 이월.
- build ✓(1.13s) · lint exit 0. evidence: `evidence/visual-impact-consolidation/vi6-knowledge.md`.
