# Style Signature 역산 초안 + 인터뷰 질문지

- Date: 2026-07-17
- Milestone: AD2 Step 1 (`docs/plans/2026-07-17-ad2-style-signature.md`)
- Scope: `docs/design-system/style-signature.md`(신규, draft)

## What

- 기존 자산 역산으로 "유성 스타일" 시그니처 초안 작성: 7축(컬러 운용·타이포·레이아웃 밀도·형태·모션·카피·의도적 비대칭), 각 축에 근거 자산 인용 + 관측 가능 판정 기준.
- 판정 체크리스트 v0 (10항, 필수 3항 — "8/10 + 필수 전부" 통과 기준 제안).
- 사용자 인터뷰 질문지 6문항 — 역산 함정("이미 만든 것=취향") 검증용 비선호·예외 발굴 포함 (skeptic 관점 반영).
- principles.md(보편 품질)와 역할 분리 명시. draft 상태로 llms.txt 미노출 (확정 후 Step 2에서 노출).

## Verification

- [x] 각 축 기준이 실제 자산 근거 인용 (DESIGN.md §1–§8, principles.md #2/#4/#6/#8, tokens SSOT gray-270 ramp, CLAUDE.md 카피 규약) — 무근거 항목 0
- [x] 체크리스트 항목이 PASS/FAIL 판정 가능한 관측 기준으로 서술 (형용사 나열 아님)
- [ ] 사용자 인터뷰 → 확정 (Step 2 진입 조건)
