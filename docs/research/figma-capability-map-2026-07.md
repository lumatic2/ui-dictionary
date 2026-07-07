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

## 추가 실측 (2026-07-07 2차)

- **"플러그인" 정체 해소**: 사용자가 받은 건 별도 Figma 플러그인이 아니라 **claude.ai Figma 커넥터**(경로 #1과 동일) — 커뮤니티 플러그인 미보유. FB3 플러그인 경로를 쓰려면 새로 고르거나 만들어야 함.
- **로컬 MCP 토글**: 사용자가 앱 Preferences에서 토글을 찾지 못함 — **Starter(무료) 플랜에서는 Dev Mode MCP 토글이 노출되지 않음**(유료 Dev/Full seat 필요)이 유력한 원인. 네이티브 앱이라 에이전트 직접 조작 불가. 경로 #2는 플랜 게이트로 사실상 닫힘(플랜 확인/업그레이드 전까지).
- **테스트 파일**(`eDWGkmOxFZTxXPyuIHS8ql`, "제목 없음"): REST(PAT) **404 — 스코프 부족으로 파일 read 불가**. chrome-ext 실 UI로는 **정상 열림**. 원격 claude.ai MCP는 OAuth(사용자 계정) 기반이라 재시작 후 접근 가능 예상.

## 3차 실측 (2026-07-07 3차 — 세션 재시작 후, 미확정 3건 전부 해소)

### 1. 원격 claude.ai Figma MCP 도구 실측 — **읽기·쓰기 전부 검증 완료**

세션 재시작 후 도구 정상 노출(26종: get_design_context, get_metadata, get_screenshot, get_variable_defs, use_figma, create_new_file, search_design_system, code connect 계열 등). 테스트 파일(`eDWGkmOxFZTxXPyuIHS8ql`) 실호출 결과:

| 호출 | 결과 |
|---|---|
| `whoami` | 200 — 계정 정보 반환 (아래 #2) |
| `get_metadata` (page 0:1) | ✅ 페이지 구조 XML 반환 |
| `use_figma` (Plugin API JS 실행) | ✅ **variable collection 생성 + COLOR variable 생성 + setValueForMode + 프레임 fill 바인딩(`setBoundVariableForPaint`) 전부 성공**, 바인딩 round-trip 검증 `true` |
| `get_variable_defs` (생성 프레임 대상) | ✅ `{"surface/probe":"#1a59e5"}` — 쓴 변수를 읽기 도구로 재확인 |
| 정리 스크립트 (노드·변수·컬렉션 remove) | ✅ 파일 원상복구 (collections 0, children 0) |

**판정**: 원격 MCP의 `use_figma`는 Figma Plugin API 전체를 JS로 실행하는 완전한 쓰기 채널이다. variables 생성·모드값 설정·노드 바인딩이 플랜 게이트 없이 동작 — **FB3 (토큰→Figma variables)의 주력 경로 확정**. 커뮤니티 플러그인 선정·자체 플러그인 제작·chrome-ext UI 자동화는 모두 불필요(fallback으로 강등). `use_figma` 호출 전 `skill://figma/figma-use/SKILL.md` 리소스 로드가 필수(idempotent 재실행·변수 scopes 명시 등 규칙 포함 — FB2 계약에 반영할 것).

### 2. 계정 정체 — **원격 MCP는 gmail이 아니라 SKKU 학생 계정**

`whoami` 실측: **yusung345@g.skku.edu (핸들 "유성")**, tier `student`(Education), **Full seat(expert)** × 2팀("글로벌경영학과/전유성의 팀", "어스큐리"). 이 문서 상단의 "계정: ManGam (yusung8307@gmail.com)"은 REST PAT·chrome-ext 경로의 계정이고, claude.ai 커넥터 OAuth는 별도 계정이었다 — **경로별 계정이 이원화**되어 있다.

- 로컬 Dev Mode MCP 토글 미노출(경로 #2)의 재해석: 데스크톱 앱이 gmail(Starter 추정) 계정으로 로그인돼 있었기 때문일 수 있다. SKKU 계정은 student tier Full seat이므로 그 계정으로 로그인하면 토글이 노출될 가능성 있음 — 단, 경로 #1이 완전해 실익 낮음(보류).
- FB2 계약에 반영할 리스크: 토큰을 밀어넣을 대상 파일이 **SKKU 계정에서 접근 가능한 팀/드래프트**에 있어야 원격 MCP가 닿는다. 파일 소유·공유 경계를 계약에 명시할 것.

### 3. FB3 경로 판정 — 확정

| 순위 | 경로 | 판정 |
|---|---|---|
| **주력** | 원격 MCP `use_figma` (Plugin API) | variables 생성·바인딩 실측 완료. idempotent 재실행은 이름 기준 upsert 스크립트로 구현 가능 |
| fallback | chrome-ext 실 UI | 검증돼 있으나 수동적·저신뢰 |
| 제외 | REST variables API | Enterprise 전용 + PAT 스코프 부족(파일 read 404) |
| 제외 | 커뮤니티/자체 플러그인 | 주력 경로가 충분해 불필요 |

## 미확정 (다음 실측)

(없음 — FB1 범위 내 미확정 전부 해소. 잔여 확인은 FB2/FB3에서: 대상 파일의 계정 접근 경계, idempotent upsert 실증)
