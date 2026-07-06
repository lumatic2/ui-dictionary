# Figma Capability Map — 실측 기록

Date: 2026-07-07 (FB1 진행 중)
Milestone: FB1 (horizon: `docs/horizons/2026-07-figma-bridge.md`)
계정: ManGam (yusung8307@gmail.com)

## 경로별 실측 현황

| # | 경로 | 상태 (2026-07-07 실측) | 읽기 | 쓰기 | 비고 |
|---|---|---|---|---|---|
| 1 | **claude.ai 원격 Figma MCP** (`mcp.figma.com/mcp`) | 연결됨(`claude mcp list` ✔) — **이 세션에 도구 미노출, 세션 재시작 후 재확인 필요** | 예상: 노드 컨텍스트·코드·스크린샷 | 예상: 제한적 | 도구 스키마 실측은 재시작 후 |
| 2 | **로컬 Dev Mode MCP** (`127.0.0.1:3845/mcp`) | 데스크톱 앱 설치·실행 확인, **포트 미청취 — 앱 내 토글 OFF** | (토글 후 실측) | 공식 문서상 read 중심 | 사용자 손 필요: Figma 메뉴 → Preferences → Enable local MCP Server |
| 3 | **figma-developer-mcp** (Framelink, 서드파티) | 설치돼 있으나 `mcp-disabled.json`에 비활성 보관 | REST 래퍼 (파일→구조화 컨텍스트) | 없음 (read-only) | 활성화 시 `/mcp-toggle figma on` + 세션 재시작. 서드파티 신뢰 주의(figma-codex-workflow Failure Modes) |
| 4 | **Figma REST API** (PAT) | **PAT 유효**(`/v1/me` 200) · **스코프 제한**: `/v1/teams/:id/projects` 403 — 파일 단위 read 스코프로 추정, 파일 키 확보 후 재검 | 파일/스타일 (스코프 내) | variables 쓰기는 **Enterprise 전용**(문서 기준 — FB3 경로로 부적합 가능성 높음) | PAT가 로컬 세션 로그에 1회 노출됨 — 필요시 재발급 권장 |
| 5 | **chrome-ext (로그인 Chrome 실 UI)** | **검증 완료** — figma.com 로그인 상태, 팀 페이지 접근·구동 가능 | UI로 전부 | UI로 전부 (플러그인 실행 포함) | figma-codex-workflow의 `$chrome:control-chrome` fallback과 동일 경로 |
| 6 | **Codex figma 플러그인** | `~/.codex/config.toml`에 존재하나 `enabled=false` | — | — | Codex 위임 lane은 활성화 필요 |

## FB3(토큰→variables) 경로 판정 재료

- REST variables 쓰기 = Enterprise 게이트 → **주력 경로 후보에서 제외 가능성 높음**.
- 유력 대안: **Figma 플러그인**(Plugin API는 플랜 무관하게 variables 생성 가능) — 사용자가 받아둔 "플러그인"의 정체 확인 필요(변수 import 플러그인? talk-to-figma류 MCP 브리지 플러그인?). chrome-ext로 웹앱에서 플러그인 실행 구동 가능.
- 로컬 Dev Mode MCP는 read 중심이라 variables *쓰기*에는 부적합할 것으로 예상 — 토글 후 도구 목록으로 확정.

## 미확정 (다음 실측)

1. 세션 재시작 후 원격 Figma MCP 도구 스키마 실측 (읽기/쓰기 범위)
2. 데스크톱 앱 MCP 토글 ON 후 로컬 서버 도구 실측 (사용자 손)
3. 사용자가 받아둔 Figma 플러그인 정체 + variables 쓰기 가능 여부
4. PAT 파일 read 실측 (파일 키 확보 후) + variables 엔드포인트 실응답
