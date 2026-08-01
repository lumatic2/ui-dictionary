# Figma 채널 현행 실측 — 재가동 검사 (2026-08-01)

Milestone: M14 step-1 (소비처: `plans/2026-08-01-m14-figma-return-path-relaunch.md`)
선행 실측: `research/figma-capability-map-2026-07.md` (FB1, 2026-07-07)

## 판정 요약

**주력 채널(원격 Figma MCP `use_figma`) 재가동 성공 — 7월 자산 전부 생존.** 왕복 2회차 진행에 장애 없음.

## 실측 기록

| 항목 | 2026-07-07 (FB1) | 2026-08-01 (이번) |
|---|---|---|
| MCP 연결 | claude.ai 커넥터로 연결돼 있었음 | **이 기기 Claude Code 미등록 상태에서 시작** — `claude mcp add --transport http --scope user figma https://mcp.figma.com/mcp` 재등록 |
| 인증 | (기존 OAuth) | `claude mcp auth` 커맨드 없음 — 세션 내 `/mcp` → Authenticate 로 사용자 OAuth (human gate). **SKKU 계정으로 로그인 완료** |
| 도구 노출 | **세션 재시작 필요**했음 (FB1 1차) | **재시작 불필요** — 인증 직후 같은 세션에 26종 노출 (deferred tool 로 주입, ToolSearch 로 로드) |
| `whoami` | yusung345@g.skku.edu, student tier, Full seat ×2팀 | **동일** — 계정 이원화 상태 유지 (계약 §1) |
| 대상 파일 | "Askewly Design Tokens" `xY42P22E7CtnvuxX8ZzZec` 생성 | **생존** — 페이지 2(Page 1 + Hero Pilot 2026-07-07), 파일명 root 는 "Document" 로 읽힘 |
| variables | primitive 38 + semantic 21(light/dark) | **무손실 동일** — `askewly/primitive` 38 (default) · `askewly/semantic` 21 (light/dark) |
| 유료화 게이트 | 쓰기 베타 무료 (리스크로 기록) | 읽기 호출에서 게이트 미관측. 응답에 `rate-limits-access.md` 리소스 링크 동반 — 쿼터제 존재. 쓰기 게이트는 step-2 실행이 실증 |

## 이번에 발견한 함정 (방법론 Changelog 후보)

- **`get_metadata` (nodeId 생략) 의 페이지 목록이 불완전할 수 있다** — top-level 페이지로 "Page 1" 1개만 반환했으나 `use_figma` 의 `figma.root.children` 은 2페이지 반환. 페이지 전수 확인은 `use_figma` 읽기 스크립트가 정본.
- MCP 재등록 시 인증은 CLI 로 불가(`claude mcp auth` 없음) — 세션 내 `/mcp` 만 가능. 자동화 불가 지점으로 human gate 고정.
- 도구는 인증 직후 세션 재시작 없이 노출된다(FB1 시절과 달라진 점) — 재가동 절차가 한 단계 짧아짐.

## 결론 (step-1 verify)

- `whoami` 200 + SKKU 계정 확인 ✅
- 대상 파일 접근(`get_metadata` + `use_figma` 읽기) ✅
- `askewly/*` variables 컬렉션 2개 생존 ✅
