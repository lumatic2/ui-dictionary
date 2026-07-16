# Codex 전역 디자인 라우팅 배선 + 양 에이전트 E2E

- Date: 2026-07-17
- Milestone: AD1 Step 3 (`docs/plans/2026-07-17-ad1-default-routing.md`)
- Scope: `~/.codex/AGENTS.md`(cross-repo — "## 디자인 라우팅 (Askewly Design)" 섹션 신설)

## What

- Codex 전역 정본 `~/.codex/AGENTS.md`(hand-maintained live instruction, 직접 편집이 정규 경로)의 MCP 라우팅 절 아래에 Claude와 동일한 **디자인 라우팅 규칙** 신설 — "Claude `~/.claude/CLAUDE.md` 와 동일 출처" 표기(이 파일의 기존 동기화 관례).
- `~/.codex/skills` 배포 미러: design-* 스킬은 Claude 쪽과 동일하게 부재(skills-disabled만 존재) — 스킬 경유 배선 없음, 전역 지침이 단일 지점 (Step 2와 동일 구조).

## Verification

- [x] `~/.codex/AGENTS.md`에 섹션 존재 grep (배선 자체)
- [ ] E2E(Claude): 신규 세션·외부 프로젝트에서 askewly design 미언급 디자인 지시 → 프로토콜 자동 fetch 관측 + 색 리터럴 0 (**배포 선행 필요**)
- [ ] E2E(Codex): 동일 조건 관측 (**배포 선행 필요**)
- [ ] 실패 모드: 미언급 지시로만 판정(언급 시 무효), 오경로 fetch 404 확인(404.html 배포 후)
