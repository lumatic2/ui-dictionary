# 20260710 Principles Canonical

## Target

- ROADMAP milestone: SCD1 - Principles 증류 (사람용 + 에이전트용), Step 1
- Plan: `docs/plans/2026-07-10-scd1-principles.md`

## Scope

- Add `docs/design-system/principles.md` as the agent-facing canonical statement of Askewly Design principles.
- Distill only rules already evidenced by the PRD, design-system contracts, published documentation, recipe anti-patterns, `DESIGN.md`, and `CLAUDE.md`.
- Cite repository source paths under every principle so later edits can be audited against their evidence.

## Contract

- Source of truth: `docs/design-system/principles.md`.
- Human-facing documentation and `llms.txt` are derived consumers handled in SCD1 Steps 2-3.
- No new visual direction is invented in this changeset; unresolved brand language remains subject to the Step 4 user approval gate.
- Out of scope: public Docs navigation, production exposure, recipe expansion, deploy, and ROADMAP completion.

## Verification

- [x] Every principle has at least two existing repository evidence paths (8/8 sections checked).
- [x] Every cited repository path exists (PowerShell path check PASS).
- [x] Canonical document contains explicit agent application and rejection guidance (`Agent application` in 8/8 sections).
- [x] Targeted diff is limited to the canonical document, changeset record/index, and harness session registration (`git status --short`).

## Result

- Canonical draft contains eight traceable principles plus a six-point consumer checklist. It remains behind the SCD1 user-approval gate.
