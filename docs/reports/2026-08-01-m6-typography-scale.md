# M6 — 타이포 스케일 전수 등재 + Tailwind 배선 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m6-typography-scale.md` · Changeset: `changesets/20260801-m6-typography-scale/`

## 1. 결과

typography.scale 이 실화면이 렌더하는 9단계(10/12/14/16/20/30/40/48/72)를 전수 기술하게 됐고, 값이 Tailwind 기본값과 같은 단계(2xs/xs/3xl/5xl/7xl)는 `@theme` 배선으로 `text-5xl` 같은 유틸리티가 SSOT 값을 참조한다 — 클래스 무변경·computed 무변화(렌더 무손실 실측). 신규 `text-2xs` 유틸로 셸 6파일의 `text-[10px]` 임의값을 치환했고, Typography 아티클·llms 가 9단계를 반영한다. `xl`(28)은 "실화면 미사용" 기록으로 유지.

## 2. 이슈와 해결

- 계획의 "값 동일 = px 등재" 를 실행에서 **rem 등재로 보강** — px 강제 시 사용자 루트 폰트 확대 설정에서 렌더가 달라져(접근성 회귀) Tailwind 기본값의 rem 을 그대로 채택. 무손실 계약의 엄밀한 해석으로 판단(스코프 내 기술 결정, 진행 로그 기록).
- Tailwind v4 크기·행간 쌍 파손 리스크(failure probe)는 실현 안 됨 — 번들 실측에서 `--text-*--line-height` 쌍이 기본값으로 보존.
- M5 의 llms 정합 게이트가 M6 재생성 정합을 실제로 감시(lint 체인에서 PASS 관측) — 게이트 신설의 가치 즉시 실증.
- 완료 감사: 드리프트 = rem 보강 1건(기록 완료). 순조로움 의심 — computed 무손실을 클래스 논증이 아니라 4화면 실렌더 fontSize/lineHeight 실측으로 확인.

## 3. 증거

- Evidence: `evidence/finding-cleanup/m6-typography-scale.md`
- 실표면: 빌드 산출물 실구동(vite preview + Playwright) — text-2xs computed 10px, colors/get-started/recipes/terms h1 computed 전후 동일(72/48/36/48 + 행간), 번들 `.text-5xl{font-size:var(--font-size-5xl)}` SSOT 경유 assertion 성공.
- 재현: `node scripts/generate-tokens.mjs && cd examples/ui-vocabulary-site && npm run lint && npm run build && npx @askewly/design verify src/components --ext tsx`.
- 크기 회고: changeset 1개·커밋 2건 — steps=2 계획 정합. SSOT·생성기·@theme 확장과 문서·치환·통합 검증은 독립 응집 변경.
