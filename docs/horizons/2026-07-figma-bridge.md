# Horizon - Figma Bridge (피그마 브리지)

Date: 2026-07-07
Status: active
Objective link: `docs/OBJECTIVE.md` (성공 상태 — 레퍼런스 흡수 루프 + 에이전트용 시스템의 디자이너 표면 확장)
Preceding horizon: `docs/horizons/2026-07-agent-integration.md` (closed 2026-07-07)
Candidate record: `docs/horizons/2026-07-figma-bridge-candidate.md` (2026-07-05 — 이 horizon으로 승격, 동결)

## Goal

Figma를 Askewly Design의 경쟁자이자 보완재로 규정하고, **Figma 시각 자산 ↔ Askewly SSOT(토큰·분류·레시피) ↔ 코딩 에이전트 구현·검증**을 잇는 브리지를 실측 기반으로 정의한다 — Figma 클론이 되지 않으면서. 구조: 연결 실측(FB1) → 브리지 계약(FB2) → 왕복 실증 1건(FB3).

## Why Now

Agent Integration이 닫히며 에이전트 쪽 진입점은 검증됐다. 남은 큰 표면은 디자이너 쪽이다 — 디자이너의 기본 SoT인 Figma와의 관계를 정의하지 않으면 Askewly Design은 코딩 에이전트 전용으로 고립된다. SMC 토큰 모델(candidate doc 당시 blocker)이 이제 존재해 브리지의 우리 쪽 끝이 고정돼 있다.

**의도적 override**: candidate doc의 Non-Goal "PSS2 안정 전 우선하지 않기"를 사용자 결정(2026-07-07)으로 넘어선다 — PSS2는 Next Candidates에 유지.

## 확정 결정 (2026-07-07 사용자)

- **연결 수단**: Figma 공식 Dev Mode MCP 서버를 Claude Code에 등록(우선) + 로그인된 Chrome 실 UI(chrome-ext MCP) fallback. 플랜/시트 제약에 걸리면 그 자리서 보고.
- **첫 실증 방향**: Askewly 토큰 → Figma variables (Askewly가 SoT — Figma를 유일 SoT로 만들지 않는다는 정체성 유지).
- **소비 좌표 선례**: `/figma-codex-workflow` 스킬의 규칙(정확한 노드 타겟팅, 토큰 이름을 variable 이름에 그대로, page-family 경계, 라이브러리 우선 재사용)을 FB2 계약에 흡수한다.
- market beat 생략 — FB1 capability 실측이 조사를 겸한다.

## Milestones

### FB1 - 연결 계층 + capability 지도

DoD:

- Figma 공식 Dev Mode MCP 서버가 Claude Code에 등록되고 실제 호출로 검증된다(노드 읽기·variables 접근 등 무엇이 되는지). 플랜 제약 등 blocker면 사실 그대로 기록하고 chrome-ext 경로를 검증한다.
- chrome-ext(로그인 Chrome) 경로로 Figma 웹앱 실 UI 구동이 최소 1회 검증된다.
- 경로별 capability 지도(읽기/쓰기/변수/컴포넌트/제약)가 문서화된다 — candidate doc의 질문들을 사실로 전환.

Evidence:

- `docs/research/figma-capability-map-2026-07.md` + 실호출 기록

### FB2 - 브리지 모델 계약

DoD:

- 방향별 계약 문서: Figma→Askewly(어떤 자산을 레퍼런스로 흡수·무엇은 외부에 남기나, Figma variables↔`tokens/askewly.tokens.json` 매핑 규약), Askewly→Figma(토큰·레시피·예시를 리뷰 가능한 아티팩트로 내보내는 규약), Figma가 이기는 지점/Askewly가 의도적으로 다른 지점.
- figma-codex-workflow 스킬 규칙과의 정합(스킬이 이 계약의 소비 좌표가 되도록 갱신 지점 식별).

Evidence:

- `docs/design-system/figma-bridge-contract.md` + ADR(핵심 결정)

### FB3 - 왕복 실증: Askewly 토큰 → Figma variables

DoD:

- `tokens/askewly.tokens.json`의 semantic 토큰(light+dark)이 Figma variables로 밀어넣어져 디자이너 표면에서 사용 가능함을 실증한다 — 토큰 이름 보존, 재실행 가능(idempotent)한 경로.
- 실행 경로는 FB1 capability 지도가 정하는 최선(MCP 쓰기 / Chrome UI / REST / Codex 위임)을 따르고, 소비 경로를 기록한다.

Evidence:

- Figma 파일의 variables 스크린샷/검증 기록 + 밀어넣기 스크립트·절차 + `docs/research/` 사례 노트

## Close Criteria

capability 지도와 브리지 계약이 존재하고, 토큰→Figma variables 실증 1건이 기록되면 닫는다. 반대 방향(Figma 프레임→코드) 실증은 이 horizon 범위 밖(후속 후보).

## 범위 제외

- Figma 파일 갤러리화, Figma를 유일 SoT로 만들기 (candidate doc Non-Goal 유지)
- Figma→코드 방향 실증 (후속)
- PSS2 랜딩 품질 (Next Candidates 유지)

## Objective Impact

(horizon close 시 기입)
