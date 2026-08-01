# M12 · 사람용 사용법 문서화 (설치 경로 정합 + Quickstart) — 완료 보고

Date: 2026-08-01 · Goal: `usage-and-site-surfacing` (연쇄 1/2) · Plan: `plans/2026-08-01-m12-usage-docs-alignment.md`

## 1. 결과

사람이 실패 없이 설치·주입까지 도달하는 문서 경로가 생겼다. ① 사이트가 제시하던 유일한 설치 명령이 존재하지 않는 패키지(`ui-dictionary`, npm 404)를 가리키던 버그를 3파일+생성물에서 정정(`@askewly/design`·`askewly-design`) — 예시 레시피 id 3개도 비실존→실존 id 로 교체 ② README §How to use(4단계 Quickstart) + `templates/README.md` 인덱스 신설 + design-md-guide 외부 의존 경고 ③ 문서의 모든 명령을 published 0.3.0 실설치로 E2E 대조 — 전부 exit 0·출력 정합.

## 2. 이슈와 해결

- 오기가 계획 초안의 1파일이 아니라 3파일+빌드 생성물 1곳에 물질화돼 있었다 — fresh 검증자가 사전 적발, 생성물은 build:catalog 재생성으로 해소.
- 설치 명령만이 아니라 예시 레시피 id(sidebar-navigation 등 3개)도 비실존 — 표기 정합 범위로 함께 정정(계획 명시 밖 소폭 확장, 같은 결함 클래스).
- published 번들은 0.3.0 스냅숏(terms 536+) — 로컬 HEAD(563) 와의 차이는 버전 규약상 정상, 문서는 published 기준 서술.

## 3. 증거

- changeset: `changesets/20260801-m12-usage-docs-alignment` · Evidence: `evidence/usage-and-site-surfacing/m12-usage-docs-alignment.md`
- 검증: grep 잔존 0 · site build(prerender 755) · check-llms-sync PASS.
- 실표면: scratchpad 임시 프로젝트에 published `@askewly/design` 실설치 후 문서화된 5개 명령(`terms search`·`recipes list`·`tokens`·`init`·`add topbar-command-search`) 실제 실행 — 전부 exit 0, init 산출 3파일·add 주입 tsx 실생성 확인 — 통과. 실브라우저(vite preview :4330)로 `/docs/getting-started-setup` 정정 코드블록 실렌더 확인 — 통과.
- 재현: `grep -rn "npx ui-dictionary" .` (0건) · scratchpad 에서 `npm i -D @askewly/design && npx askewly-design add topbar-command-search`.
- 크기 회고: step 3·changeset 1(절 3개) — 정합 수정+가이드 신설+E2E 가 각각 독립 응집 변경으로 그릇 정합.
