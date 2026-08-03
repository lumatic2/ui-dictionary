# M17 — DESIGN.md→슬라이드 테마 자동 배선 완료 보고

- Date: 2026-08-04 · Plan: `plans/2026-08-04-m17-slide-theme-generator.md` · Changeset: `changesets/20260804-m17-slide-theme-generator/`

## 1. 결과

`/pt` 로 어떤 프로젝트의 덱을 만들든 **그 레포의 DESIGN.md 를 탐지해 브랜드 테마를 자동 생성·제안**하는 배선 완성. 변환기 `design-md-to-theme.mjs` 가 flat(Stitch)·3-tier(tokens 중첩) 두 양식을 판독(참조 해석·oklch→hex·필수 3원천+파생 fallback·WCAG AA 자기검사)하고, SKILL.md §6 브랜드 탐지 단계가 워크플로우에 배선됐다. 실프로젝트 2케이스(ui-dictionary 3-tier·3d-repolis flat) 사용자 관측 PASS — ui-dictionary 덱이 자기 SSOT 생성물에서 출발하는 경로가 생겨 **M16 판정 A 실현**, slide-spec §5 결함 해소 기록. 기존 canonical 테마 3종 무변경(사용자 정정 — 교체 아님, 배선 추가).

## 2. 이슈와 해결

- **계획이 두 번 재작성됨** — 초안(askewly 정본 교체)·1차 재작성(4번째 canonical 테마) 모두 사용자 정정으로 기각, "프로젝트별 DESIGN.md 범용 배선"으로 확정. 교훈: 목표 문장("생성기")을 에이전트가 특정 구현 형태로 좁혀 계획함 — 형태가 여럿인 goal 은 계획 전에 기대 형태를 한 줄로 확인할 것.
- askew-app DESIGN.md 가 frontmatter 없는 표 기반(20개 중 3개 이탈) — 변환기가 계약대로 거부(조용한 기본값 금지), flat 관측 케이스를 3d-repolis 로 교체(probe 예정 대응).
- 실물 flat 파일 편차(bare `accent`·camelCase·border 부재) — 필수 원천을 3개(배경·본문·액센트)로 좁히고 나머지는 파생 fallback 으로 흡수.
- 관측 자료 제시 방식 사용자 피드백 — 경로 출력이 아니라 Artifact 로 띄워 제시(메모리 등재: show-results-visually).

## 3. 증거

- Evidence: `evidence/media-unification/m17-brand-deck-wiring.md` + `m17-shots/` 4장. 커밋: ui-dictionary `b23c2d8`·`5cb8025`, custom-skills `487bfea`·`55890eb`.
- 실표면: 관측 덱 3본을 실브라우저(Playwright) 렌더 — 콘솔 에러 0(favicon 404 1건은 정적 서버 루트 사정, 덱 무관), 사용자 관측 판정 2케이스 모두 PASS("좋아" 2026-08-04). 스크린샷 4장 evidence 보존 + Artifact 비교 페이지 제시.
- 재현: `cd ~/.claude/skills/pt && node scripts/design-md-to-theme.mjs --self-test` → 6/6 · `node scripts/design-md-to-theme.mjs <레포>/DESIGN.md out.json` → 29 vars + 대비표.
- 배선: SKILL.md §6 "프로젝트 브랜드 탐지" — /pt 스킬 로드 시 덱 제작 절차(§7-5)가 호출. 실발화 1회 증거 = step-3 E2E 가 이 절차를 그대로 밟아 2케이스 생성(evidence 기록). 완료 감사에서 배포본 self-test 6/6·탐지 단계 grep 2건 재확인.
- 크기 회고: 3 step·changeset 1개(cross-repo 커밋 4건)·human gate 1회 — milestone 적정. 목표(생성기 goal) 전체가 이 그릇이라 과소 그릇 아님.
