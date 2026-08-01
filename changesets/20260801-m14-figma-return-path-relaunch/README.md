# changeset: m14-figma-return-path-relaunch

Milestone: M14 — Figma 귀환 경로 재가동 + 왕복 2회차 실증
Plan: `plans/2026-08-01-m14-figma-return-path-relaunch.md`

## step-1 — 채널 복구 + 현행 실측

- Figma 원격 MCP 재등록(`claude mcp add --scope user figma https://mcp.figma.com/mcp`) + 사용자 OAuth(SKKU) — human gate 1 통과.
- 실측: whoami SKKU ✓ · 파일 `xY42P22E7CtnvuxX8ZzZec` 생존 ✓ · `askewly/*` 컬렉션 2개(38+21) 무손실 ✓ · 도구 노출에 세션 재시작 불필요(FB1 대비 변화).
- 산출물: `research/2026-08-01-m14-figma-channel-recheck.md`
