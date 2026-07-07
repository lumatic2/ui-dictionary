# Figma Bridge Contract

Date: 2026-07-07
Milestone: FB2 (horizon: `docs/horizons/2026-07-figma-bridge.md`)
근거: `docs/research/figma-capability-map-2026-07.md` (FB1 실측), ADR 0003
관련 스킬: `~/projects/custom-skills/figma-codex-workflow/` (소비 좌표)

## 0. 원칙

- **Askewly SSOT가 이긴다.** `tokens/askewly.tokens.json`이 토큰의 유일 SoT다. Figma variables는 **파생 아티팩트** — Figma에서 변수 값을 고쳐도 다음 push가 덮어쓴다. Figma를 SoT로 만들지 않는다 (horizon Non-Goal).
- **브리지는 양방향이지만 대칭이 아니다.** Askewly→Figma는 *동기화*(기계적, idempotent), Figma→Askewly는 *흡수*(선별적, 근거 기반 레퍼런스 루프).

## 1. 실행 채널 (FB1 실측 확정)

| 순위 | 채널 | 용도 |
|---|---|---|
| **주력** | claude.ai 원격 Figma MCP `use_figma` (Plugin API JS) | variables 생성·바인딩·읽기 전부 실측 검증됨. 호출 전 `skill://figma/figma-use/SKILL.md` 로드 필수 |
| fallback | chrome-ext (로그인 Chrome 실 UI) | MCP가 못 닿는 UI 조작(라이브러리 publish, 파일 공유 설정 등) |
| 제외 | REST variables API (Enterprise 전용), 커뮤니티/자체 플러그인 | capability map §3차 판정 |

**계정 경계 (리스크)**: 원격 MCP OAuth = `yusung345@g.skku.edu` (student tier, Full seat). REST PAT·chrome-ext = `yusung8307@gmail.com`. **동기화 대상 Figma 파일은 SKKU 계정이 접근 가능한 팀에 있어야 한다** — 권장: "어스큐리" 팀 (SKKU 계정 Full seat 보유). FB3 실행 전 대상 파일 확정은 사용자 결정.

## 2. Askewly → Figma (토큰 → variables 동기화 규약)

### 2.1 컬렉션 구조

DTCG 3-tier를 Figma variable collection 2개 + alias로 보존한다:

| Figma collection | modes | 내용 |
|---|---|---|
| `askewly/primitive` | `default` 1개 | `color/primitive/*`, `dimension/*`, `typography/*` — 원시값 |
| `askewly/semantic` | `light` / `dark` | `color/semantic/*` — 값은 **primitive 변수로의 alias**. dark 값은 SSOT의 `$extensions['com.askewly.modes'].dark` 참조를 alias로 변환 |

component tier(`color/component/*`)는 semantic으로의 alias로 `askewly/semantic`에 포함한다 (별도 컬렉션을 만들 만큼 수가 없음 — 현재 2개).

### 2.2 이름 규칙 (토큰 이름 보존)

- **변수 이름 = DTCG 경로 그대로, 점(.)만 슬래시(/)로**: `color.semantic.surface.base` → `color/semantic/surface/base`. 접두 생략·축약 금지 — 에이전트가 코드 토큰명과 Figma 변수명을 문자열 일치로 대조할 수 있어야 한다 (figma-codex-workflow "exact code token names" 규칙).
- 변수 `description`에 SSOT의 `$description` 요지를 복사한다 (MCP search 신호).

### 2.3 타입·값 변환

| DTCG | Figma resolvedType | 변환 |
|---|---|---|
| color (oklch/srgb) | COLOR | oklch → sRGB 변환 후 0–1 rgb (Figma는 oklch 미지원). 참조값(`{color.primitive.x}`)은 값 복사가 아니라 **variable alias** |
| dimension (px) | FLOAT | 숫자만. scopes: space→`GAP`,`WIDTH_HEIGHT`; radius→`CORNER_RADIUS` |
| typography.scale/weight | FLOAT | scopes: `FONT_SIZE` / `FONT_WEIGHT` |
| typography.font (배열) | STRING | 첫 항목만 (`Geist`). scopes: `FONT_FAMILY` |

`variable.scopes`는 항상 명시한다 (`ALL_SCOPES` 금지 — figma-use 규칙 16).

### 2.4 Idempotency (재실행 규약)

- **upsert by name**: (collection 이름, 변수 이름) 키로 기존 변수를 찾아 값만 갱신, 없으면 생성. 실행마다 새로 만들지 않는다.
- **삭제는 관리 대상만**: SSOT에서 사라진 토큰의 변수는 `askewly/*` 컬렉션 안에서만 제거. 다른 컬렉션·사용자가 만든 변수는 절대 건드리지 않는다.
- 동기화 스크립트는 실행 결과(created/updated/removed 수)를 반환하고, 두 번째 실행이 no-op(0/0/0 또는 updated-only)임을 검증한다 — FB3 DoD.

## 3. Figma → Askewly (흡수 규약)

- Figma 자산(프레임·컴포넌트·외부 UI kit)은 **레퍼런스 입력**이다: 스크린샷 + 구조 노트로 `docs/research/`에 캡처하고, 채택할 패턴만 근거와 함께 `knowledge/`·`tokens/`로 승격한다 (기존 레퍼런스 흡수 루프와 동일 절차).
- Figma에서 직접 토큰·이름·값을 역수입하지 않는다. 디자이너가 Figma에서 제안한 변경은 SSOT 수정 PR로 들어와야 반영된다.
- 외부에 남기는 것: Figma 전용 시각 탐색(무드보드, 시안 배리에이션), 커뮤니티 템플릿 원본. 흡수하는 것: 검증된 패턴·수치·구조.

## 4. 경계 정의 — Figma가 이기는 곳 / Askewly가 다른 곳

- **Figma가 이기는 곳**: 자유 캔버스 탐색, 디자이너 협업·코멘트, 시안 배리에이션 속도. 여기서 경쟁하지 않는다.
- **Askewly가 의도적으로 다른 곳**: 토큰·패턴·레시피의 기계 소비(에이전트가 문자열로 읽는 SSOT), 검증 루프(WCAG·lint·스크린샷), anti-AI-tell 가이드. Figma variables는 이 SSOT의 *디자이너 표면 뷰*일 뿐이다.

## 5. figma-codex-workflow 스킬 정합 (갱신 지점 식별)

스킬 규칙 중 이 계약이 흡수한 것: exact token name(§2.2), idempotent 쓰기·자기 소유물만 삭제(§2.4), page-family 경계(현재 SSOT 단일 family — 분화 시 collection mode가 아니라 **컬렉션 분리**로 대응), 라이브러리 우선 재사용, 공식 MCP 우선.

스킬 쪽 갱신 필요 지점 (FB3 이후 반영):
1. Tool Rules에 "Claude Code에서는 원격 claude.ai Figma MCP가 주력 채널, figma-use는 MCP 리소스로 로드" 명시 (현재는 Codex 표면 서술 중심).
2. 계정 이원화 주의(어느 OAuth 계정이 파일에 닿는지 `whoami`로 먼저 확인) 추가.
3. Askewly 레포 한정: 이 계약 문서를 소비 좌표 정본으로 링크.

## Changelog

- 2026-07-07: 초판 (FB2). FB1 capability map 실측 기반.
