# Taste ledger + RL 상호 배선 (TC1 Step 2)

- Date: 2026-07-17
- Milestone: TC1 Step 2 (plan: `plans/2026-07-17-tc1-taste-loop-contract.md`)
- Scope: `research/taste/ledger.md`(신규), `research/reference-loop.md`(Changelog에 taste 경로 포인터)

## What

- 관찰 단위 장부 스켈레톤 — 계약의 7필드 스키마와 1:1, 미소화 표기 규칙 헤더 명시.
- RL↔taste 상호 포인터 배선(증설 관계 명문).

## Verification

- [x] 상호 포인터 grep: reference-loop→taste-loop 1, taste-loop→reference-loop 2
- [x] ledger 헤더 스키마 = 계약 7필드 1:1 대조
