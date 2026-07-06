# Horizon - Agent Integration (에이전트 통합)

Date: 2026-07-07
Status: active
Objective link: `docs/OBJECTIVE.md` (장기 아크 5 — 에이전트 통합)
Preceding horizon: `docs/horizons/2026-07-system-model-core.md` (closed 2026-07-07)

## Goal

System Model Core가 만든 SSOT(토큰 `tokens/askewly.tokens.json` · 분류 `docs/design-system/pattern-taxonomy.md`+`docs/ui-vocabulary/groups.yml` · 레시피 `recipes/` 5종)를 Codex와 Claude Code가 **스스로 발견하고 소비하는 진입점**으로 배선한다. 세 계층으로 닫는다: 발견(llms.txt 인덱스) → 소비(custom-skills 연결) → 실증(외부 프로젝트 UI 구현 1건).

## Why Now

SSOT 세 축은 어제(2026-07-07) 전부 실체가 됐지만, 에이전트가 이를 찾고 쓰는 경로가 없다. SMC3 공용 소비 데모는 사람이 레시피 경로를 손으로 넘겨준 것이지 에이전트가 발견한 게 아니다. Objective의 "Codex/Claude Code가 실제로 사용할 수 있는 에이전트용 디자인 시스템"은 진입점 없이는 성립하지 않으며, 이후 후보(PSS2 사이트 품질, FGB1 Figma 브리지)도 에이전트 소비 경로가 있어야 가치가 배가된다.

시장 재료: 별도 수집 beat 생략 (2026-07-07 사용자 확정) — `docs/market/design-system-format-survey.md`(2026-07-07)가 에이전트 표면 선례(shadcn MCP+llms.txt, Geist `.md` raw, 에이전트 포맷 공통 원칙)와 채택 기준 C-9~11을 이미 커버한다.

## Milestones

### AG1 - llms.txt 발견 계층

DoD:

- `ui.askewly.com/llms.txt`가 배포된다 — 링크만 담고 토큰/레시피 값을 중복하지 않는다(format survey C-10). 규모가 필요하면 서브파일 분할 패턴.
- 인덱스가 가리키는 SSOT 자산(토큰·분류·레시피·포맷 계약)이 에이전트가 fetch 가능한 raw URL로 접근된다.
- 인덱스는 SSOT에서 스크립트로 파생된다(손 편집 금지 — DESIGN.md·tokens.css와 같은 생성물 규약).

Evidence:

- 생성 스크립트 + 배포된 `ui.askewly.com/llms.txt` fetch 결과 + 링크 무결성 검증 PASS

### AG2 - custom-skills 소비 계층

DoD:

- `docs/research/design-skills-impact-audit.md` 실행 계획을 이행한다: design-bootstrap SSOT guard(완료분 확인), design-harness §4 SSOT 분기, design-screen §2/§5 문구·lint 경로 정정 + 스킬이 `recipes/`·토큰 SSOT를 소비 좌표(AG1 인덱스 포함)로 참조하도록 갱신.
- `bash ~/projects/custom-skills/setup.sh` 재배포 후 스킬 경유 소비 smoke 1회.

Evidence:

- custom-skills 레포 커밋 + 재배포 로그 + 스킬 경유 SSOT 소비 smoke 기록

### AG3 - 외부 프로젝트 실전 실증

DoD:

- 외부 프로젝트(대상: `~/projects/development-dictionary` — 2026-07-07 사용자 확정) 1건에서 Codex 또는 Claude Code가 진입점(스킬 또는 llms.txt) 경유로 SSOT를 소비해 UI를 구현한다 — 색·타이포 리터럴 대신 토큰 파생 증거(SMC3 데모 기준 계승: 색 리터럴 0).
- 구현 중 드러나는 부족 레시피는 이 milestone 안에서 수요 주도로 확장한다(선제 배치 확장 없음 — 2026-07-07 사용자 확정).

Evidence:

- 외부 레포 구현 diff·스크린샷 + 소비 경로 기록 (`docs/research/` 사례 노트)

## Close Criteria

발견·소비 두 진입점(llms.txt, custom-skills)이 존재하고, 외부 프로젝트 1건에서 에이전트가 진입점 경유로 SSOT를 소비해 UI를 구현한 실증이 기록되면 닫는다 (실증 1건 — 2026-07-07 사용자 확정).

## 범위 제외 (이번 horizon에서 하지 않는 것)

- MCP 서버 구축 — format survey C-11 결정 유지. AG1의 기계 질의 가능 메타데이터가 준비물이며, 서버는 차기 판단.
- 선제적 레시피 배치 확장 — AG3 수요 주도로만.
- 사이트 탐색 품질(PSS2)·Figma 브리지(FGB1) — Next Candidates로 유지.

## Objective Impact

(horizon close 시 기입)
