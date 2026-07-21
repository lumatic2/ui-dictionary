# changeset: 전역 "디자인 판정" 절 제거 (기록)

- Date: 2026-07-18
- Milestone: SE2 step-1 (`plans/2026-07-18-se2-global-removal-e2e.md`)
- 사용자 확정: "완전 제거" (2026-07-18 AskUserQuestion) — 진입은 `askewly-design` skill 단일 경로

## 변경 (전역 파일 — git 밖, 본 changeset은 기록)

- `~/.claude/CLAUDE.md` — "## 디자인 판정 (Askewly Style Signature)" 절 삭제
- `~/.codex/AGENTS.md` — 동일 절 삭제

## 검증 checklist

- [x] 양 파일 `grep "디자인 판정"` 0건
- [x] 인접 절(MCP 라우팅·로컬 도구) 무손상 확인
- [x] Failure probe: ui-dictionary 레포 CLAUDE.md의 style-signature 참조는 유지(본 레포 작업 무영향)

## Rollback (원문 보존)

`~/.claude/CLAUDE.md` (MCP 라우팅 절과 로컬 도구 절 사이):

```markdown
## 디자인 판정 (Askewly Style Signature)

- 디자인·UI 작업의 결과물은 보고 전에 스타일 시그니처로 자가 판정한다: `https://ui.askewly.com/llms/docs/design-system/style-signature.md` — 운용 원칙 5(해당 프로젝트 토큰 파생·액센트는 신호·절제된 계층·상태 완비·실험적 터치는 수동) + 비선호 5(좌측 컬러 라인 카드·한글 단어 잘림·어색한 줄바꿈·이모지 아이콘·대충 그린 CSS). **askewly 팔레트·토큰을 다른 프로젝트에 주입하지 않는다** — 스타일은 작업 프로젝트의 디자인 시스템 소유(2026-07-17 확정: 스타일 고정 금지, 전 프로젝트 동질화 방지).
- askewly 토큰/레시피(`https://ui.askewly.com/llms.txt`)는 ① 작업 프로젝트에 디자인 시스템·토큰이 없을 때 기본값으로, ② 사용자가 askewly design을 명시로 요청할 때만 fetch한다.
```

`~/.codex/AGENTS.md`는 동일 내용에 "— Claude `~/.claude/CLAUDE.md` 와 동일 출처." 꼬리 문장이 붙은 판이었음.
