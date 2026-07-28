# VI6 — 지식 층 통합 완료 노트 (2026-07-28)

## 1. 결과

KG 비주얼 임팩트 노드 19건(계수 정정: 인벤토리 표기 18은 실제 19)을 전수 대조해 **흡수 8 · 링크 7 · 제외 4**로 판정하고, 흡수분을 knowledge 층에 집행했다. 정본 지정: 티어·도구 판정 = `knowledge/expressive-stack.md`, 모션 품질 원칙 = `knowledge/motion-principles.md`(신설). expressive-stack 에는 disclosure grid-track 결정표 행과 접근성 짝규칙·전 티어 reduced-motion 판정 절차가, motion-references 에는 공간형 랜딩 채택 게이트(decorative-skin failure)와 Remotion 링크 절(매체 경계)이 추가됐다. 기존 결정표 21행 무단 변경 0 (삽입 29줄/삭제 0).

## 2. 이슈와 해결

- **llms 미배선 갭 (failure probe 적중)**: 신설 `motion-principles.md` 와 기존 `motion-references.md` 가 llms 생성기 `FIXED_ASSETS` 에 없다 — step-3 write surface 계약(evidence 한정)에 따라 수리하지 않고 finding 큐 이월(VI7/VI8 에서 배선).
- **KG 측 후속 3건**: hub 노드 내부 참조 stale(없는 경로 2건) · hub 에 expressive-stack 참조 추가 검토 · 노드 2건 review 미완 — plan finding 큐 기록, 후속 `/kg` 세션 소관.
- 계수 정정 1건(18→19)은 장부·evidence 에 명시.

## 3. 증거

- 장부: `research/2026-07-28-vi6-kg-crosswalk.md` (19행 전수, MISSING 0, 의심 3노드 본문 인용 대조)
- evidence: `evidence/visual-impact-consolidation/vi6-knowledge.md` · changeset: `changesets/20260728-vi6-knowledge-consolidation/`
- 커밋: bfbaf9b(step-1) · 6aa09d1(step-2) · 28a4cc5(step-3)
- 검증: build ✓ 1.13s · lint exit 0 · llms 생성기 160 assets, 배포 사본에 disclosure 행 grep=1
- 실표면: none — 산출이 agent-facing 문서 층이라 이번 경계엔 사용자가 만질 표면 변경이 없다. 실서비스 llms 반영은 세션 말 일괄 push 후 curl 확인 항목.
- 재현: `node scripts/generate-llms-txt.mjs` → `cd examples/ui-vocabulary-site && npm run build && npm run lint`
- 크기 회고: changeset 디렉터리 1개(step 3절) — steps 2·3이 독립 응집 변경 + 통합 검증이라 milestone-grade 유지, 인플레 없음.
