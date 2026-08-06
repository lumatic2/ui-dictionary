# 20260806-m36-palette-generator-restyle

> milestone M36 — `color-palette-generator` 이식 표면 restyle (goal `findings-sweep`)
> plan: `plans/2026-08-06-m36-palette-generator-restyle.md` · evidence: `evidence/findings-sweep/m36-palette-generator-restyle.md`

## step-1 — chrome restyle (`3746aad`)

`examples/ui-vocabulary-site/src/components/color-palette-generator.tsx` 의 chrome 을 semantic 토큰으로 치환
(`ring-askewly-violet`→`ring-ring` 6 · `slate-*`→`border/card/popover/muted/foreground` 50 · `bg-white`→`bg-card|popover` ·
툴팁/토스트→`bg-foreground text-background` · export 백드롭→`bg-scrim/72` · `border-blue-500`→`border-ring`).
스와치·그라디언트 위 오버레이 6곳은 고정색 유지(주석). 라이트 무변화·다크 추종, 사용자 관측 통과.

## step-2 — 선언 전사 + 테스트 반전 + 라이브 실증 (`1a5e14c`)

- `registry.json` `meta.requiredCssVars` 5→14종, `--print-measured` 실측과 집합 일치(`--askewly-violet` 소멸).
- `packages/cli/test/kickstart.test.ts` — documented-gap 테스트(no-op 확인됨)를 실 registry 판독 2건으로 반전.
- `public/r/` 재생성(멱등) + M35 llms drift(`figma-bridge-contract.md`) 해소, llms-sync PASS.
- 라이브 폴링 10회 ≈ 5분 후 반영 확인, 소비처 시뮬레이션에서 포커스 링 `rgb(98,49,196)` 실측.

## 남긴 것

- `--print-measured` 의 파괴성(`public/r/` 삭제 후 index 미기록)과 `generate-llms-txt` 의 조용한 배너 소실 —
  `docs/findings.md` 신규 등재.
