# changeset: m14-figma-return-path-relaunch

Milestone: M14 — Figma 귀환 경로 재가동 + 왕복 2회차 실증
Plan: `plans/2026-08-01-m14-figma-return-path-relaunch.md`

## step-1 — 채널 복구 + 현행 실측

- Figma 원격 MCP 재등록(`claude mcp add --scope user figma https://mcp.figma.com/mcp`) + 사용자 OAuth(SKKU) — human gate 1 통과.
- 실측: whoami SKKU ✓ · 파일 `xY42P22E7CtnvuxX8ZzZec` 생존 ✓ · `askewly/*` 컬렉션 2개(38+21) 무손실 ✓ · 도구 노출에 세션 재시작 불필요(FB1 대비 변화).
- 산출물: `research/2026-08-01-m14-figma-channel-recheck.md`

## step-2 — SSOT 드리프트 재동기화

- 생성기 보수: rem→px ×16 환산 + 신규 경로 scope 3건(`dimension/size`·`z-index`·`motion/duration`) — 보수 없인 생성기 TypeError·타이포 오염.
- 실행: 1차 primitive 35created/38updated·semantic 18/21 → 2차 idempotent 0/0 양쪽 PASS, rem 표본 8종 대조 PASS.
- 기록: `research/figma-variables-sync-2026-07.md` Changelog 절.
