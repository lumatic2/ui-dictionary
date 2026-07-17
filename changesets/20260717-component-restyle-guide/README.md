# 부품 층 재스타일 가이드 (VI5 Step 1)

- Date: 2026-07-17
- Milestone: VI5 Step 1 (plan: `plans/2026-07-17-vi5-component-layer-absorption.md`)
- Scope: `docs/design-system/component-restyle.md`(신규), `scripts/generate-llms-txt.mjs`(Contracts 목록 추가)

## What

- "shadcn 룩 탈출" 계약: 동작 계약 불가침 + look만 프로젝트 토큰으로 재매핑하는 5단계 절차 + 기본값 흔적 체크리스트 6항.
- DF-3 대원칙 명문: 재스타일 목적지는 항상 작업 프로젝트 토큰 — 어떤 외부 팔레트(askewly 포함)도 주입 금지.

## Verification

- [x] DF-3 위반 검수: "프로젝트" 토큰 지향 명시 grep 다수 + askewly 팔레트 값·hex 리터럴 0
- [x] 자체 사이트 실코드와 절차 정합(shadcn CSS 변수 체계 사용 중 — 변수 정의 재매핑 경로 유효)
- [x] llms 노출 (다음 step 재생성에 합류)
