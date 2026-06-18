# Reference Loop Contract — Claude Design × Claude Code Integration

## Goal

Claude Design(Anthropic Labs)과 Claude Code의 연동 기능을 실제 실험·문서화하여
이 레포(`design-manual`)의 워크플로우와 스킬 체계에 통합한다.

## Scope

- Claude Design 공식 문서 & 업데이트 추적
- `/design-sync`, `/design`, Handoff Bundle 실험 로그
- design-manual 하네스와의 통합 가능성 분석

## Source Queue (L1 — 읽기/분석)

1. `claude-design-launch` — Anthropic 공식 발표 (2026-04-17) ✅ processed
2. `claude-design-overhaul` — 대규모 업데이트 (2026-06 기준) ✅ processed
3. `claude-design-help-get-started` — 공식 Help Center: Get Started ✅ processed
4. `claude-design-help-design-system` — 공식 Help Center: Design System Setup ✅ processed
5. `claude-design-on-brand-update` — "Stays on brand" 업데이트 블로그 ✅ processed

## Next Action After L1

- L1 분석 5개 안정화 → 실험 계획 작성 (L2)
- 실험 승인 후 `/design-screen` 스킬에 Claude Design handoff 경로 추가

## Stop Rules

- 실제 Claude Design 접속 테스트는 사용자 승인 후에만 실행
- `references/loop/` 밖의 파일 변경은 사용자 게이트 통과 후
- 소스가 paywall/login-only이면 블로커 기록 후 중단
