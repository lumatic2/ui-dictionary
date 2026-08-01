# Evidence — M12 사람용 사용법 문서화 (설치 경로 정합 + Quickstart)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m12-usage-docs-alignment.md` · Goal: `usage-and-site-surfacing` (1/2)
- Changeset: `changesets/20260801-m12-usage-docs-alignment/README.md`

## DoD 대조

| DoD 항목 | 증거 |
|---|---|
| 실패 없는 설치·주입 문서 경로 존재 | README §How to use(4단계+링크) + 사이트 Getting set up 정정 + templates/README.md 신설 |
| 존재하지 않는 패키지명 잔존 0 | `grep -rn "npm install ui-dictionary\|npx ui-dictionary"` — 소스·생성물 전체 0건(생성물은 build:catalog 재생성으로 해소) |
| 문서의 모든 명령 published 실구동 검증 | scratchpad 임시 프로젝트에서 `@askewly/design@0.3.0` 실설치 → `terms search`·`recipes list`·`tokens --tier semantic`·`init`·`add topbar-command-search` 전부 exit 0 + 실출력 정합(init 이 DESIGN.md·tokens.css·askewly.css 생성, add 가 발췌 tsx + Checks 노트 출력) |
| 실브라우저 확인 | vite preview :4330 → `/docs/getting-started-setup` — 정정된 코드블록(`npm install -D @askewly/design` / `npx askewly-design add topbar-command-search`) 실렌더 확인 |

## 관측 노트

- 문서 예시의 레시피 id 도 실존 id 로 정정(sidebar-navigation·form-layout·command-palette 는 비실존 → sidebar-application-shell·mobile-signup-field-stack·topbar-command-search).
- published 번들은 0.3.0 스냅숏(terms 536+ 표기) — 로컬 HEAD(563) 와 차이는 데이터 스냅숏 버전 규약(cli-registry-contract §2)대로 다음 publish 에서 해소되는 정상 상태. 문서는 published 기준 서술 유지.
- llms 게이트: entry-protocol 변경분 재생성 후 check-llms-sync PASS.
