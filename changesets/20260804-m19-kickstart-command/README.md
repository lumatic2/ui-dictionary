# 20260804-m19-kickstart-command

> M19 — 킥스타트 원커맨드. Plan: `plans/2026-08-04-m19-kickstart-command.md` (승인 chain 2026-08-04)

## step-1 — 정본 문서 배선 (2026-08-04, 커밋 `10841c3`)

- block-contract §8 「Kickstart consumption」(6단 계약 + 조용한 폴백 금지) · design-brief 규모 게이트에 축약 모드 행(블록 출발일 때만 풀 브리프에 우선) · entry-protocol A-0 에 에이전트 호출 경로(3문항→플래그 전달) — 스킬은 entry-protocol 을 fetch 하므로 이 배선이 곧 호출자. llms 재생성·sync PASS.

## step-2·3 — CLI `init --block` 구현 (2026-08-04)

- `packages/cli/src/kickstart.ts` 신설(+index.ts init 옵션 등록): 축약 브리프(readline 3문항·`--yes`·플래그 주입) → DESIGN.md 생성(tmpl flat colors 양식·hex 전용) → askewly-brand.css 토큰층 파생(light/dark + @theme) → 블록 fetch·재귀 이식(A-2.5 직접 구현 — asset URL + shadcn primitives + cn 보증) → 요구 변수 기계 대조(registry `meta.requiredCssVars`, 미정의 exit 1) → verify 자동 실행.
- registry 보강: `generate-registry.mjs` 가 항목 선언 `requiredCssVars` 를 `meta` 로 파생, saas-app-shell 에 28변수 선언. verify SKIP_FILES 에 askewly-brand.css 추가(생성 토큰 파일 규약).
- **failure probe 실현 2건**: ① M17 슬라이드 변환기 파서 A 가 hex 전용 — hsl 팔레트가 안 읽힘 → 팔레트 hex 전환(양식 정본 무변경, 생성기가 맞춘다), 변환 PASS(29변수·대비 AA) ② 미존재 블록명이 DESIGN.md 를 먼저 쓰고 실패(반쪽 산출물) → fetch 선행으로 clean fail.
- 검증: CLI 빌드 PASS · 무옵션 init 회귀 PASS(3파일) · `--yes` 전 구간(34파일 이식·28/28 변수·verify PASS) · 플래그 주입 반영(warm-editorial/amber/geist-sans → DESIGN.md) · 실패 모드 3종 exit 1(옵션 밖 tone·미존재 블록 clean fail·DESIGN.md 충돌) · 요구 변수 고의 결손 단위시험 PASS · M17 변환기 호환 PASS.
