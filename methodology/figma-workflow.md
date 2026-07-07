# Figma Workflow — Claude Code × Figma 활용 방법론

Date: 2026-07-07
Milestone: FW1 (horizon: `docs/horizons/2026-07-figma-workflow.md`)
근거: `docs/market/2026-07-07-figma-claude-workflows.md` (다각 리서치) + `docs/market/2026-07-07-figma-claude-community-pulse.md` (커뮤니티 펄스)
전제 계약: `docs/design-system/figma-bridge-contract.md` (SSOT 우위·채널·idempotency — 이 문서는 그 계약 위의 *활용 절차*다)

## 0. 채택 워크플로우 — 하이브리드 왕복 (2026-07-07 사용자 확정)

**코드로 디자인 → Figma 투입(Code to Canvas) → 사람이 디테일링 → 코드로 회수.**

채택 근거 (리서치 §3 비교):
- 사용자의 작업 방식(DESIGN.md·토큰이 출발점)과 방향이 일치 — "사람이 Figma에서 먼저 디자인"하는 design-to-code 단독 흐름은 우리 관례와 반대.
- 2026 상반기 가장 뜨는 흐름(2월 Figma×Anthropic 파트너십 → 6월 code layers 정식 출시, round-trip 실사용 후기 다수)이면서, 실무 노하우는 아직 얇은 초기 단계 — 우리 파일럿 기록 자체가 방법론 자산이 된다.
- "코드가 SSOT, Figma는 파생물" 브리지 계약(§0)과 정합 — Figma는 사람의 다듬기 표면으로만 쓰고 결과를 코드로 회수한다.

## 1. 역할 분담

| 주체 | 하는 것 | 하지 않는 것 |
|---|---|---|
| **코드 (SSOT)** | 토큰·컴포넌트·레이아웃의 정본. 디자인의 출발점과 종착점 | — |
| **Claude Code** | taste direction 소비 → 코드로 디자인 구현 → Figma 승격 → 회수분 반영 | 사람 몫의 심미 판단을 대체하지 않는다 |
| **Figma** | 사람의 디테일링 표면(간격·시각 디테일·배리에이션 탐색), 디자이너 협업·코멘트 | SoT 아님 — Figma에서 고친 값은 다음 push가 덮어쓴다 |
| **사람 (유성)** | taste direction 확정, Figma에서 디테일 다듬기, 회수분 승인 | 픽셀 노동의 1차 생산(코드가 먼저 만든다) |

## 2. 왕복 절차 (5단계)

### ① Taste direction 고정
- 대상 화면·컴포넌트의 디자인 의도를 코드 작업 *전에* 확정: 참조할 DESIGN.md/토큰, 레퍼런스, 피해야 할 안티패턴.
- **taste direction / visual exploration / implementation spec을 한 프롬프트에 뭉치지 않는다** — 뭉치면 모델이 안전한 평균(Inter, indigo 그라디언트, 3-card hero)으로 수렴한다(리서치 §2.4 "distributional convergence"). 단계를 분리해 각각 지시한다.

### ② 코드로 디자인
- `tokens/askewly.tokens.json` semantic 토큰만 참조해 구현(하드코딩 금지 — 기존 관례).
- 브라우저 실구동으로 1차 검증(`/browse` — verify-loop.md 절차).

### ③ Figma 승격 (Code to Canvas)
- 채널: claude.ai 원격 Figma MCP — `generate_figma_design`(신규 캔버스 생성) 또는 `use_figma`(기존 파일 내 정밀 조작). **호출 전 `skill://figma/figma-use/SKILL.md` 로드 필수.**
- **`whoami`로 계정 먼저 확인** — 원격 MCP OAuth = SKKU 계정. 대상 파일은 SKKU 계정이 닿는 팀(권장: 어스큐리)에 있어야 한다(브리지 계약 §1 계정 경계).
- 승격 단위는 화면/컴포넌트 1개씩 — 파일 전체 덤프 금지. 레이어·프레임 이름은 코드 컴포넌트명과 대응되게.

### ④ 사람 디테일링 (Figma)
- 다듬는 것: 간격·정렬 미세 조정, 시각 디테일, 카피 톤, 배리에이션 탐색(Figma가 이기는 자유 캔버스 영역 — 브리지 계약 §4).
- **다듬지 않는 것: `askewly/*` variables 값** — 토큰 변경 욕구가 생기면 Figma에서 고치지 말고 SSOT 수정으로 제안(다음 push가 덮어쓰므로 Figma 쪽 수정은 유실된다).

### ⑤ 코드로 회수
- `get_design_context`(구조화 데이터) → `get_screenshot`(시각 참조) 순서로 다듬은 프레임을 읽는다(리서치 §2.3 권장 순서).
- diff 관점으로 반영: 사람이 바꾼 것만 코드에 적용, 토큰 이름 문자열 대조로 값 변경/토큰 변경을 구분.
- 토큰 자체를 바꾸는 결정이면 SSOT 수정 → `scripts/generate-figma-variables-sync.mjs` 재동기화로 Figma에 반영(역수입 금지 — 브리지 계약 §3).
- 회수 후 브라우저 재검증으로 왕복을 닫는다.

## 3. 도구 좌표

| 단계 | 도구 | 비고 |
|---|---|---|
| ③ 승격 | `generate_figma_design` / `use_figma` | figma-use 스킬 로드 필수, `whoami` 선행 |
| ④ 디테일링 | 사람 + Figma UI | 필요시 chrome-ext(로그인 Chrome) 보조 |
| ⑤ 회수 | `get_design_context` → `get_screenshot` | `get_variable_defs`로 토큰 대조 |
| 토큰 동기화 | `scripts/generate-figma-variables-sync.mjs` → `use_figma` | idempotent(브리지 계약 §2.4) |

## 4. 안티패턴

- 한 프롬프트에 taste + exploration + spec 뭉치기 (→ 평균 수렴).
- Figma에서 `askewly/*` variable 값 직접 수정 (→ 다음 push에 유실).
- Figma 다듬기 결과를 눈대중으로 코드에 옮기기 (→ `get_design_context`로 구조화 회수).
- 모호한 승격/회수 지시 ("이거 Figma에 넣어줘") — 대상 프레임·페이지·파일을 명시.
- 왕복 없이 승격만 하고 방치 (→ Figma 파일이 죽은 파생물로 쌓임. 왕복을 닫거나 파일을 정리).

## 5. 알려진 리스크 (리서치 근거)

- Figma 캔버스 쓰기는 베타 무료 → 사용량 기반 유료 전환 예정(비용 변수 추적).
- 쓰기 API는 Plugin API parity 미완성(이미지·커스텀 폰트 등 제한) — 승격 시 안 옮겨지는 속성은 기록하고 사람 단계에서 보정.
- code-to-design 실무 노하우가 업계 전체적으로 얇음 — 파일럿에서 발견한 함정은 이 문서 Changelog에 축적한다.

## Changelog

- 2026-07-07: 파일럿 1회(랜딩 hero) 반영 — ⑤ 회수는 구조 변경 없으면 속성 스냅숏 대조가 `get_design_context`보다 정밀(승격 시 노드 ID+값 보존 필수); ④ 핸드오프에 조작 안내(배리에이션=프레임 복제) 포함할 것; variables 있는 파일에 페이지 추가 승격이 별도 파일보다 간단. 상세: `docs/research/figma-roundtrip-pilot-2026-07.md`.
- 2026-07-07: 초판 (FW1). 리서치 2건 + 브리지 계약 기반, 하이브리드 왕복 채택.
