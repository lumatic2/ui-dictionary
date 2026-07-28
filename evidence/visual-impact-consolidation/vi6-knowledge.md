# VI6 — 지식 층 통합 evidence (2026-07-28)

> Milestone: VI6 (goal `visual-impact-consolidation`) · Plan: `plans/2026-07-28-vi6-knowledge-consolidation.md` · Changeset: `changesets/20260728-vi6-knowledge-consolidation/`

## 1. 전수성 — KG 노드 처리 결과

계수 정정: 인벤토리 표기 "18노드"는 실제 **19노드**(핵심 16+인접 3). 전수 판정 장부 = `research/2026-07-28-vi6-kg-crosswalk.md`.

| 판정 | 수 | 착지 |
|---|---|---|
| 흡수 | 8 | expressive-stack(결정표 행 1·판정 절차 7·8) · motion-principles.md 신설(5노드) · motion-references.md(공간형 랜딩 게이트) |
| 링크 | 7 | expressive-stack ④ 인접 게이트 2 · motion-references Remotion 절 4 · motion-principles 관련 절 1 |
| 제외 | 4 | 영상 프로덕션 2 · 제작 도구 워크플로우 1 · 오프라인 공간 1 (사유 장부 기재) |

기계 확인: 장부 표 행 grep=19 · 19노드 이름 전수 매칭 MISSING 0 · 판정 3분류 외 값 없음. 겹침 의심 3노드(허브·css-disclosure·ui-state-vocabulary)는 본문 직독 인용으로 대조(장부 §겹침 대조).

**정본 지정**: 화면 표현 기법의 티어·도구 판정 = `knowledge/expressive-stack.md`. 모션 품질 원칙 = `knowledge/motion-principles.md`(신설). KG 는 일반 지식 원본 유지 — KG 측 후속 3건은 plan finding 큐.

## 2. 흡수 집행 — 회귀 없음

- git diff (step-2): 삽입 29줄 / 삭제 0 — **기존 결정표 21행 무단 변경 0**.
- 흡수 8·링크 7 전 항목 착지 대조 완료 (changeset README step-2 절).

## 3. llms 파이프라인 반영

- `node scripts/generate-llms-txt.mjs` 실행: `wrote examples/ui-vocabulary-site/public/llms.txt (160 assets copied)`.
- 배포 사본 `public/llms/knowledge/expressive-stack.md` 에 신규 disclosure 행 포함 확인 (`grid-template-rows` grep=1).
- **갭 (failure probe 적중)**: 생성기 `FIXED_ASSETS` Knowledge 절에 `expressive-stack.md` 만 등재 — 신설 `motion-principles.md` 와 기존 `motion-references.md` 는 llms 미배선. step-3 write surface(evidence 한정) 계약에 따라 수리하지 않고 finding 큐 이월 (VI7/VI8 에서 결정표·recipe 배선 작업과 함께 해소).

## 4. 회귀 게이트

- `npm run build` (examples/ui-vocabulary-site): ✓ built in 1.13s — PASS.
- `npm run lint`: exit 0 (warning 은 기존 home-page.tsx fast-refresh 건 — 이번 변경 무관).
- 실배포 확인: push 는 세션 말 일괄(deploy batching 관례) — push 후 `https://ui.askewly.com/llms/knowledge/expressive-stack.md` curl 로 disclosure 행 확인 예정.
