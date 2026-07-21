# Taste 흡수 계약 (TC1 Step 1)

- Date: 2026-07-17
- Milestone: TC1 Step 1 (plan: `plans/2026-07-17-tc1-taste-loop-contract.md`)
- Scope: `research/taste-loop.md`(신규)

## What

- 판단 상향 흡수 계약: 계수 규칙(갱신 없는 관찰=미소화), 관찰 스키마 7필드, 성립성 게이트 4문항(콘셉트 소스 전용), 갱신 대상 자산 4종, 불변식(look 복사 금지·시그니처 개정은 사용자 확인).
- RL과의 관계 명문: 증설이지 대체 아님 — RL=커버리지, taste=판단 갱신.

## Verification

- [x] 계약 self-check: "미소화" 규칙 grep 3, 갱신 대상 4종 전부 명시(grep 8)
- [x] 관찰 스키마 7필드(초과 없음), 성립성 게이트 4문항 존재
