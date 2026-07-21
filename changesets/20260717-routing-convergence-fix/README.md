# 라우팅 스타일 수렴 교정 — 판정만 남기고 스타일 주입 제거

- Date: 2026-07-17
- Milestone: AD3 (기회주의 관측 DF-3의 교정 — `docs/plans/2026-07-17-ad3-realwork-dogfooding.md`)
- Scope: `~/.claude/CLAUDE.md`·`~/.codex/AGENTS.md`(디자인 절 개정), `~/.claude/settings.json`(hook 제거 — `design_routing_inject.py` 파일은 보존), ledger DF-3

## What

- 사용자 실사용 피드백: AD1 라우팅이 askewly 토큰을 전 프로젝트에 강제해 **모든 디자인이 동질화** + hook 노이즈 과다.
- 교정: "디자인 라우팅(스타일 주입)" → "디자인 판정(시그니처)" — 원칙 5·비선호 5 자가 판정만 전역 유지, askewly 토큰·레시피는 ① 무토큰 프로젝트 기본값 ② 명시 요청 시로 한정. hook 비활성.
- 교훈: 판단 주입(judgment)과 스타일 주입(style)은 다른 것 — Objective 포지셔닝("디자인 판단력을 주입")과도 정합.

## Verification

- [x] hook 제거 확인 (settings.json UserPromptSubmit 2→1)
- [x] 양 전역 파일 개정 grep ("디자인 판정 (Askewly Style Signature)")
- [x] ledger DF-3 장부화 (갭: entry-protocol 재정렬 → AD4 입력)
