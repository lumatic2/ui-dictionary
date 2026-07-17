# 흡수 기준 + toolshelf 기록 (VI5 Step 2)

- Date: 2026-07-17
- Milestone: VI5 Step 2 (plan: `plans/2026-07-17-vi5-component-layer-absorption.md`)
- Scope: `docs/design-system/absorption-criteria.md`(신규), llms 재생성(58 assets), toolshelf used 5건

## What

- 외부 표현 라이브러리 3분기 판정 규칙(A recipe화 / B 링크 참조 / C 보류) + 공통 불변식(스타일은 흡수 대상 아님 — DF-3).
- 실측 후보 9종 분류: Motion=A 완료(VI3 recipe 3종 근거), react-bits·magicui·cult-ui·WebGL-Fluid=B, animated-grid-lines·p5.js·스킬류=C.
- toolshelf used 기록 5건(react-bits·GSAP·magicui·cult-ui·WebGL-Fluid — 리서치·분류에 실소비).

## Verification

- [x] 3분기 전부에 실례 존재 (failure probe: A=Motion, B=react-bits 외 3, C=p5.js 외 2)
- [x] generate-llms-txt PASS (58 assets — restyle·absorption 2문서 노출)
- [x] shelf.py used 5건 기록 확인 (use_count 갱신)
- [x] 배포 curl: 2 문서 200 + 오경로 404 (push 후 기록)
