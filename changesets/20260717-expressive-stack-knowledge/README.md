# Expressive Stack knowledge 정본 + 티어 결정 표 (VI1 Step 2)

- Date: 2026-07-17
- Milestone: VI1 Step 2 (plan: `docs/plans/2026-07-17-vi1-expressive-stack-map.md`)
- Scope: `knowledge/expressive-stack.md`(신규 정본), `scripts/generate-llms-txt.mjs`(Knowledge 섹션 추가), llms 재생성(47 assets)

## What

- 4 렌더링 티어 정의 + **기법→티어 결정 표 21행**("이 효과는 뭘로 만드나") + 판정 절차 5규칙(하위 티어 우선·티어 상승 근거 의무·③④ reduced-motion 의무·④ lazy-load 의무·시그니처 원칙 5 접점).
- 근거는 research doc(동결) 인용 — 정본은 판정 규칙만 보유(중복 서술 금지 관례).
- llms.txt에 Knowledge 섹션 신설 — 에이전트가 fetch 가능.

## Verification

- [x] `node scripts/generate-llms-txt.mjs` PASS — 47 assets, llms.txt에 expressive-stack 노출 grep
- [x] failure probe: "하위 티어 우선" 기본 판정 규칙 grep 1
- [x] site `npm run build` PASS
- [x] 배포 curl: knowledge 200 + 오경로 404 (push 후 기록)
