# 20260712 Reference Loop Procedure

## Target

- ROADMAP milestone: RL - Reference Loop Pipeline, Step 1
- Plan: `docs/plans/2026-07-12-rl-reference-loop-pipeline.md`

## Scope

- Standard 5-stage batch procedure document for pattern/recipe reference absorption (`docs/research/reference-loop.md`): collect → dedup → adapt → verify → absorb, mapped to real commands and existing contracts.
- Candidate staging template (`docs/research/loop/inbox.yml`) matching the fixed schema from the plan.
- Batch ledger template (`docs/research/loop/ledger.md`) with the batch/date/surface/collected/duplicates_filtered/promoted/verification/amendments columns, no entries yet.
- This changeset creates new documentation only. It does not implement `scripts/audit-recipe-candidates.mjs` (Step 2) or run any batch (Steps 3-5).

## Contract

- `reference-loop.md` does not restate `docs/ui-vocabulary/authoring-workflow.md`'s term-promotion steps in detail — it points to that document for term promotion (§5) and follows its dedup resolution rules verbatim.
- `reference-loop.md` does not restate `docs/research/design-system-reference-strategy.md`'s Capture Protocol or Source Tier detail — it summarizes tiering and points to that document as SSOT.
- Recipe adaptation guidance stays consistent with `docs/design-system/recipe-format.md` (frontmatter fields, 8 fixed body sections, token-reference rules) and `docs/design-system/agent-asset-model.md`'s 4-layer principle (source_ref → example → code_asset → agent_recipe).
- `docs/research/loop/inbox.yml` schema matches the plan's schema verbatim (batch/surface/candidates with id/name/pattern_group/proposed_artifact/source/summary/anatomy/transferable/non_transferable/dedup_hints).
- llms.txt registration is documented as a manual `FIXED_ASSETS` addition in `scripts/generate-llms-txt.mjs`; automatic discovery is explicitly deferred to the FW milestone.
- Deployment gate: batch completion is not a push trigger. git push stays session-batched with prior summary report and user approval, per existing convention.

## Verification

- [x] 절차-계약 정합 확인: `reference-loop.md`가 `agent-asset-model.md`의 4층 원칙, `recipe-format.md`의 frontmatter/8섹션/토큰 규칙과 모순되지 않는다. (오케스트레이터 독립 검토 PASS — 적응 단계가 recipe-format 8섹션·semantic 토큰 참조·code_asset SSOT 규칙을 그대로 인용)
- [x] `docs/research/loop/inbox.yml`이 YAML로 파싱된다. (오케스트레이터 재실행: `PARSE OK {'batch': '', 'surface': '', 'candidates': []}`)
- [x] ledger 스키마(`ledger.md` 표 헤더)가 `reference-loop.md` §ledger 규약 서술과 일치한다. (8컬럼 동일 대조 PASS)
- [x] `reference-loop.md`가 `docs/ui-vocabulary/authoring-workflow.md`와 용어 흡수 절차를 중복 서술하지 않고 포인터만 남긴다. (§3 적응 단계가 authoring-workflow §5 포인터로 위임 확인)

## Result

- 4/4 PASS (2026-07-12, 오케스트레이터 독립 게이트). 절차 문서·inbox·ledger가 기존 계약(agent-asset-model/recipe-format/pattern-taxonomy/authoring-workflow/reference-strategy)을 변경 없이 소비하는 레이어로 확인됨.
- 참고: `changesets/CHANGESET_TEMPLATE.md`는 레포에 존재하지 않아(harness 스킬 가정과 상이) 기존 changeset 선례 구조를 따랐음.
