# Claude 전역 디자인 라우팅 배선

- Date: 2026-07-17
- Milestone: AD1 Step 2 (`docs/plans/2026-07-17-ad1-default-routing.md`)
- Scope: `~/.claude/CLAUDE.md`(cross-repo — "## 디자인 라우팅 (Askewly Design)" 섹션 신설)

## What

- 전역 `~/.claude/CLAUDE.md`의 MCP 라우팅 절 아래에 **디자인 라우팅 규칙** 신설 (Context7 라우팅 규칙과 동형): UI·화면·컴포넌트·스타일링 작업 시작 전에 진입 프로토콜(`https://ui.askewly.com/llms/docs/design-system/entry-protocol.md`)을 먼저 fetch → 작업 유형별 순서(토큰→anti-patterns→recipes) 준수 → 리터럴 하드코딩 금지 → recipe 갭은 보고에 남김 → fetch 실패는 loud.
- 다른 디자인 스킬(/design 계열·frontend-design)을 쓸 때도 프로토콜 조회가 선행함을 명시 — 스킬 무관 단일 강제 지점.

## 실사 발견 (scope 변경)

- plan의 "custom-skills 디자인 스킬(design-harness·design-bootstrap) 갱신 + setup.sh 재배포" 절반은 **대상 부재로 축소**: `~/projects/custom-skills`에 design-* 스킬 소스가 현존하지 않음(AG2 2026-07-07 당시와 다름 — 이후 정리로 제거/이동된 듯). 배포본 `~/.claude/skills`에도 없고, skills-disabled의 design-consultation 등은 비활성. 활성 design 계열은 플러그인/외부 소스라 편집 불가.
- 결과: 전역 CLAUDE.md 규칙이 단일 강제 지점이며, 문구에 "다른 디자인 스킬 사용 시에도 선행"을 넣어 스킬 갱신 없이 동등 효과를 확보. ui-dictionary `CLAUDE.md`의 design-bootstrap/custom-skills 서술은 stale — 별도 정리 후보로 기록.
- `~/.claude`는 git 레포가 아님 — rollback은 신설 섹션 수동 제거 (plan의 "git revert" 서술 정정).

## Verification

- [x] `~/.claude/CLAUDE.md`에 섹션 존재 grep (배선 자체)
- [x] 실사: 스킬 갱신 대상 부재 확인 (custom-skills·~/.claude/skills·plugins 3면 조사)
- [x] E2E: 신규 Claude 세션(sonnet, 스크래치 외부 레포, askewly 미언급 지시) 3라운드 —
  - r1(규칙만): 라우팅 발화 PASS(프로토콜+anti-patterns fetch), 토큰 파생 FAIL(오경로 구성 + silent 404 통과 → 발명 팔레트)
  - r2(규칙만): 라우팅 미발화 — 규칙 단독은 비결정적임을 관측 (사용자 확정 격상 조건 충족)
  - r3(hook 격상 후): **PASS** — llms.txt→프로토콜→tokens.css→anti-patterns→recipe 체인 소비, 오경로 1회 자가 교정(loud 404 작동), 산출물 색상 14/14 전부 tokens.css 파생·발명 0·var() 48회
- [x] hook 격상 (2026-07-17 사용자 사전 확정 경로): `~/.claude/hooks/design_routing_inject.py` 신설 + settings.json UserPromptSubmit 등록, match/no-match 단위 테스트 PASS. evidence: 스크래치 `e2e-claude*/log.jsonl`
