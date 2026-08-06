# M36 — `color-palette-generator` 이식 표면 restyle · 완료 보고서

> 2026-08-06 · goal `findings-sweep` (단독) · plan: `archive/plans/2026-08-06-m36-palette-generator-restyle.md`
> changeset: `changesets/20260806-m36-palette-generator-restyle/` · evidence: `evidence/findings-sweep/m36-palette-generator-restyle.md`

## 1. 결과

M32 가 남긴 이식 결함 — asset `color-palette-generator` 가 소비처에 없는 `--askewly-violet` 을 요구해
**포커스 링이 투명해지던 것** — 을 닫았다. chrome 을 semantic 토큰으로 restyle 하고(치환 6+50+12+1, 스와치 위
오버레이 6곳은 의도 고정색으로 주석 명시), `requiredCssVars` 를 실측 전사(5→14종, 브랜드 토큰 소멸)하고,
documented-gap 테스트를 실 registry 판독으로 반전했다. 라이브 반영 후 빈 vite 소비처에서 키보드 Tab 포커스 링
`rgb(98,49,196) 2px` 를 실측 — 결함 해소의 직접 증거. 사이트 라이트는 무변화, 다크는 chrome 이 처음 테마를 따른다
(사용자 관측 통과). 동반 수리: M35 잔여 llms drift 1건 해소.

## 2. 이슈와 해결

- **`--print-measured` 가 파괴적** — 실측 조회용 모드가 `public/r/` 를 지운 뒤 index 를 안 쓰고 끝나
  `registry.json` 이 소실됐고, 이어 돈 `generate-llms-txt` 가 index 부재를 조용히 빈 목록으로 받아 레시피 STOP
  배너 32건을 오류 없이 날렸다. 재생성 순서 복구로 전량 원복, `docs/findings.md` §G 신규 등재 2건(파괴성 + 조용한 소실).
- **gap 테스트 no-op 판정** — M32 의 gap 고정 테스트는 registry 를 읽지 않는 하드코딩이라 restyle 후에도 실패하지
  않았다(계획 probe 의 예상 분기). 실 registry 판독으로 교체하고 주입 왕복 probe 로 무는 것을 확인.
- 계획 검증자 반증 1건(승인 전 반영) — "생성기가 선언을 갱신한다"는 전제가 거짓(대조만 하고 쓰지 않음, 초과 통과)
  → 실측 전사 + 집합 일치 diff 로 절차 교체. 실행에서 그대로 유효했다.

## 3. 증거

- 커밋: `3746aad`(restyle) · `1a5e14c`(선언·테스트·llms) · `37e3103`(evidence·findings) — push 완료.
- 검증: vitest **90/90**(완료 감사 재실행 포함) · `lint:colors` 0 · build+prerender 759 PASS · llms-sync PASS ·
  registry 재생성 멱등 · 선언==실측 집합 일치(excess 0).
- 실표면: 라이브 registry(`ui.askewly.com/r/color-palette-generator.json`) 폴링 10회 ≈ 5분 후 반영 확인 —
  `ring-ring` 6·`askewly-violet` 0·선언 14종(완료 감사에서 재확인). 빈 vite 소비처에 라이브 JSON 이식 후 실브라우저
  키보드 Tab: `:focus-visible` 매치 + ring `rgb(98,49,196) 0 0 0 2px` 실측, 렌더·콘솔 정상. 사이트 `/colors` 라이트·다크
  실브라우저 관측(전/후 다크 비교 포함) 사용자 통과.
- 재현: `node scripts/generate-registry.mjs`(게이트+멱등) · `cd packages/cli && npx vitest run` ·
  `curl -s https://ui.askewly.com/r/color-palette-generator.json | grep -c ring-ring` · 소비처 재현은 evidence §step-2.
- 배선: none — 장치 신설 없음(신규 테스트 2건은 기존 vitest 스위트가 호출, 이번 run 에서 실발화 확인).
- 크기 회고: steps=2·changeset 1건·human gate 1회 — milestone 라벨 정합. goal 이 원래 2-milestone 연쇄였다가
  사용자 보류로 1건이 됐다(과소 그릇 아님 — 사용자 의도 반영).
