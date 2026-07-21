# Codex 전역 디자인 라우팅 배선 + 양 에이전트 E2E

- Date: 2026-07-17
- Milestone: AD1 Step 3 (`docs/plans/2026-07-17-ad1-default-routing.md`)
- Scope: `~/.codex/AGENTS.md`(cross-repo — "## 디자인 라우팅 (Askewly Design)" 섹션 신설)

## What

- Codex 전역 정본 `~/.codex/AGENTS.md`(hand-maintained live instruction, 직접 편집이 정규 경로)의 MCP 라우팅 절 아래에 Claude와 동일한 **디자인 라우팅 규칙** 신설 — "Claude `~/.claude/CLAUDE.md` 와 동일 출처" 표기(이 파일의 기존 동기화 관례).
- `~/.codex/skills` 배포 미러: design-* 스킬은 Claude 쪽과 동일하게 부재(skills-disabled만 존재) — 스킬 경유 배선 없음, 전역 지침이 단일 지점 (Step 2와 동일 구조).

## Verification

- [x] `~/.codex/AGENTS.md`에 섹션 존재 grep (배선 자체)
- [x] E2E(Claude): changeset #100 참조 — r3(hook 격상 후) 완전 PASS, 색상 14/14 토큰 파생·발명 0
- [x] E2E(Codex): 4런 — r1·r2·r3(workspace-write sandbox): 라우팅 발화 3/3 관측(프로토콜 fetch 시도), 그러나 sandbox 내 HTTPS가 전부 "Authentication failed"(network_access=true여도 TLS 차단) + apply_patch sandbox 오류로 토큰 소비 실패. r4(danger-full-access, 환경 결함 격리): **완전 PASS** — llms.txt→프로토콜→anti-patterns→taxonomy 체인 소비, 색상 16/16 토큰 파생·발명 0·var() 94회. evidence: `~/e2e-codex-tmp/log-full.txt` 판독 기록(본 README·ledger)
- [x] 실패 모드: 전 런 askewly 미언급 지시로만 판정, 오경로 fetch 404 확인(Claude r3에서 오경로 1회 자가 교정 관측)

## 잔여 (AD1 범위 밖 — 유지보수 후보)

- Codex Windows `workspace-write` sandbox에서 HTTPS fetch 불가(schannel "Authentication failed") — 라우팅 배선이 아니라 Codex 샌드박스 환경 결함. headless `codex exec` 한정이며 사용자 대화형 사용과 조건이 다름. 해소 전까지 headless Codex 디자인 작업은 토큰 소비가 막힐 수 있음 → ROADMAP 유지보수 후보로 등재.
