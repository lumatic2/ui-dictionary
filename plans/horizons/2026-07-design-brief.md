# Horizon — Design Brief (착수 인터뷰 + 프로젝트 룩 소유권 생성)

Date: 2026-07-18
Status: closed (2026-07-19 — DB1·DB2 완료. Close Criteria 3/3: 계약 배포 + 프로토콜·skill 배선 + E2E 3경로(생략·발동·파생) 관측. 사용자 피드백 5건은 차기 horizon 입력: 시각적 선택(폰트·컬러·인터랙션 실물 보기), Stitch 양식 정합, 결과물 크롬 상시 표시, 컴포넌트/IA 세분화 여부)
Objective link: `OBJECTIVE.md` (성공 상태 ③ — "의도적으로 디자인된 느낌"의 상한을 사용자 의도 반영으로 올림)
Preceding horizon: `plans/horizons/2026-07-skill-entry.md` (closed 2026-07-18)

## Goal

디자인 작업 진입 시 **시니어 디자이너의 브리프 인터뷰** 단계를 추가한다: 규모 비례로 발동(새 페이지·사이트=풀 브리프 / 소형 수정=생략)하고, 답변을 작업 프로젝트의 `DESIGN.md`로 저장해 **프로젝트가 룩 소유권을 갖게 만든다** — 이후 작업은 재질문 없이 파생.

## Why Now

- 사용자 발의 2026-07-18 (진주 만두 데모 직후): "사용자의 의도를 구체적으로 반영할 수 있으면 좋겠네. 헤더, 푸터, 히어로, 인터랙션 등등 인터뷰하는 단계 — 폰트, 컬러 등 시니어 디자이너가 작업 의뢰를 받았을 때 필요로 할 만한 것들."
- 현 프로토콜은 "프로젝트 토큰이 룩을 소유"라고 하지만 무토큰 프로젝트에서 소유권을 *만드는* 절차가 없음 — 에이전트 추정(진주 만두: 팥빛·카피 톤 전부 추정)으로 메움.
- 사용자 확정 2026-07-18 (AskUserQuestion): ① 발동=규모 비례 ② 답변=DESIGN.md 저장·재사용.

## 설계 원칙

- 브리프 계약 정본 = `docs/design-system/design-brief.md` (llms 배포) — skill은 여전히 얇은 라우터.
- DESIGN.md 생성은 기존 `templates/DESIGN.md.tmpl`·`methodology/design-md-guide.md`와 정합.
- 대화 불가 환경(headless)은 합리적 기본값 진행 + "브리프 추정" 명시 의무.

## Sizing (boundary horizon 사유)

milestone 2개 — 사용자 발의 범위가 명확한 단일 capability(브리프 단계). 인접 확장(예: 브리프 기반 시안 2안 제시)은 수요 확인 전 편입하지 않는다.

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| DB1 | 브리프 계약 정본 + 프로토콜 배선 | `plans/2026-07-18-db1-brief-contract.md` | approved 2026-07-18 | 불요 — 사용자 인터뷰로 결정 완료 |
| DB2 | skill 개정 + E2E | `plans/2026-07-18-db2-skill-e2e.md` | approved 2026-07-18 | 불요 |

## Close Criteria

① design-brief.md가 llms.txt에 배포되고 ② entry-protocol·skill이 브리프 단계를 지시하고 ③ E2E로 (a) 소형 작업 생략 판정 (b) 신규 화면 의뢰 시 인터뷰 발동 (c) DESIGN.md 생성·재사용이 관측되면 닫는다.

## 범위 제외

- 브리프 기반 시안 다중 제시(2안 비교) — 수요 발생 시 별도
- 기존 design-* 글로벌 스킬 개편
- DESIGN.md 포맷 자체 개정(기존 템플릿 준수)

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-skill-entry.md`
- 관련 자산: `templates/DESIGN.md.tmpl`, `methodology/design-md-guide.md`, `docs/design-system/entry-protocol.md`
