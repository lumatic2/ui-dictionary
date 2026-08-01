# HANDOFF

## 이어서 할 일
> 2026-08-02 세션 종료 시 기록 (goal `figma-return-path` 완주: M14 재가동+왕복 2회차 · M15 정본화·배선)

- **active goal 0 — 다음은 `/harness-plan`.** 남은 큐(우선순위 사용자 소유): 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도) · D2 Presenton 벤치(수요 미확인) · Around 재판정(이식 milestone 개방 시) · 구 보류 후보 B 이식 축/C 매체 통합 검증(2026-08-01 핸드오프 참조).
- **라이브 llms 확인**: push(`345ec42..114ed91`) 완료 — `curl -s https://ui.askewly.com/llms.txt | grep figma-bridge-contract` 1건 이상이면 닫힘. 세션 종료 시 배포 전파 대기 중(0건이면 Vercel 배포만 재확인).
- 후속 후보(M14 finding 큐 이월, `archive/plans/2026-08-01-m14-figma-return-path-relaunch.md`): ① `figma-push-snapshot.mjs` 청크 옵션화(use_figma 반환 20kb 절단 우회 내장) ② 계약 §2.2 "변수 description에 SSOT $description 복사" 생성기 미구현(7월부터 잔존).
- Figma 파일 상태: "Askewly Design Tokens"(`xY42P22E7CtnvuxX8ZzZec`)에 "Atlas Pilot 2026-08-01" 페이지(승격 섹션 35:3 + 배리에이션 보드 40:2) 잔존 — 왕복 기록물로 보존, 정리 여부는 사용자 결정.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 제작 표면 왕복 축의 "귀환 경로" 실증 완료 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-02 완주: M14(채널 복구·재동기화 rem 보수·회수 기계화·무변경 왕복 0/0/0) + M15(계약 §3 두 lane·llms 등재·figma-codex-workflow promoted 배포)
- 다음 차례: `/harness-plan` — 큐에서 goal 선택 또는 새 방향

### 현재 상태 / 주의점
- main 클린·push 완료(`114ed91`). custom-skills도 push 완료(`8de9b6a` — 스킬 promoted 승격+ask-yusung 라우터).
- 귀환 절차 정본 = `methodology/figma-workflow.md` §2③⑤ + `docs/design-system/figma-bridge-contract.md` §3a. 도구: `scripts/figma-push-snapshot.mjs`·`figma-return-diff.mjs`(`--self-test`).
- Figma MCP 이 기기 user scope 등록·SKKU OAuth 완료 — 재인증 필요 시 세션 내 `/mcp`(CLI `auth` 커맨드 없음).
- untracked `tmp-patterns-reference.png` 사용자 소유 방치 유지.
