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

## step-3 — 승격 스냅숏 장부 기계화

- `scripts/figma-push-snapshot.mjs` — 노드 서브트리 속성 스냅숏 use_figma 페이로드 생성(텍스트 줄바꿈은 charCode 수치 기록, U+2028 리터럴 자기검사 내장).
- `scripts/figma-return-diff.mjs` — push 장부 vs 회수 스냅숏 전수 대조(변경/추가/삭제, 은닉 줄바꿈 검출). `--self-test` 4항 PASS.
- 라이브 E2E: 파일럿 프레임 6:3 스냅숏 26노드 캡처(변수 바인딩 ID 포함) 성공.

## step-4a — ShowcaseAtlas 승격 + 스냅숏 장부 + 배리에이션 보드 (체크포인트)

- 승격: "Atlas Pilot 2026-08-01" 페이지(35:2), 프레임 "ShowcaseAtlas / Desktop 1440"(35:3, 1440×2572) — 헤더+12카드, 색 전부 semantic variables 바인딩. 구축 중 잡은 결함 2건(제목 clip→wrap, 헤더 2줄화→그리드 60px 시프트)은 스크린샷 검증으로 폐구.
- parity 한계(사람 단계 보정 대상 아님, 기록): 라이브 데모 12종은 placeholder 프레임("live demo (id)"), lucide 아이콘은 스트로크 rect 대체, hover 상태 미이관.
- push 스냅숏 장부: `evidence/figma-return-path/m14-push-snapshot.json` (102노드 — use_figma 결과 20kb 절단 때문에 3청크 회수 후 병합, finding).
- 배리에이션 보드(40:2): Row A 카드 radius 4/6/8 · Row B 데모 배경 base/muted/raised — 사용자는 픽만 하면 됨.
