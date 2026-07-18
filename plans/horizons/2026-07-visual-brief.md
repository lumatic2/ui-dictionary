# Horizon — Visual Brief (눈으로 고르는 브리프 + 크롬 게이트)

Date: 2026-07-19
Status: active
Objective link: `OBJECTIVE.md` (성공 상태 ④ AskewlyDesign 앱 — 브리프 화면의 웹 프로토타입 + 성공 상태 ③ 판단 주입의 입력 품질)
Preceding horizon: `plans/horizons/2026-07-design-brief.md` (closed 2026-07-19)

## Goal

브리프 인터뷰의 선택을 **텍스트 라벨에서 실물 보기로** 올린다: 폰트(Google Fonts 스펙시멘)·컬러(미니 UI 프리뷰에 입힌 팔레트 후보)·인터랙션(살아있는 데모)을 브라우저에서 보고 클릭으로 선택하는 **브리프 스튜디오**, 결과물을 크롬으로 열어 확인까지 유지하는 **상시 표시 게이트**, DESIGN.md의 **Stitch 공식 양식 정합**, 그리고 컴포넌트·IA 수준 **딥 브리프 선택 모드**.

## Why Now

- 사용자 피드백 2026-07-19 (꽃집 실연 직후): ① 결과물은 크롬으로 띄워 유지 ② DESIGN.md 양식은 구글 규칙 리서치 ③ 폰트는 Google Fonts를 보고 선택 ④ 컬러는 askewly 컬러 시스템/coolors를 보고 ⑤ 인터랙션도 눈으로 보고 선택 ⑥ 추후 AskewlyDesign 앱 표면 ⑦ 컴포넌트·헤더/푸터 IA 세분화 검토.
- design-brief 잔여 리스크에 명시됨: "브리프 선택지가 텍스트 라벨뿐".
- 사용자 확정 2026-07-19 (AskUserQuestion): horizon 진행 + 세분화는 딥 브리프 선택 모드(기본 7도메인 유지).

## 설계 원칙

- 브리프 스튜디오 = **AskewlyDesign 앱 브리프 화면의 웹 프로토타입** — 앱 개발 전 흐름 검증. 로컬 생성 페이지 + 선택 수집, 정본 계약·템플릿은 llms 배포.
- 딥 브리프는 기본 발동 아님: 사용자 요청 또는 대규모 프로젝트에서만 (질문 피로 방지 — E2E (a) 교훈 유지).
- 사람 게이트 강화: 스크린샷은 증거, 판정은 실물 브라우저.

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| VB1 | Stitch 양식 리서치·정합 | `plans/2026-07-19-vb1-stitch-alignment.md` | approved 2026-07-19 | `research/2026-07-19-vb1-stitch-design-md.md` (step-1 산출) |
| VB2 | 브리프 스튜디오 | `plans/2026-07-19-vb2-brief-studio.md` | approved 2026-07-19 | 불요 — VB1 산출 소비 |
| VB3 | 크롬 상시 표시 게이트 | `plans/2026-07-19-vb3-chrome-gate.md` | approved 2026-07-19 | 불요 |
| VB4 | 딥 브리프 선택 모드 | `plans/2026-07-19-vb4-deep-brief.md` | approved 2026-07-19 | 불요 |

## Close Criteria

① DESIGN.md 템플릿·저장 계약이 Stitch 공식 양식과 대조·정합(차이는 사유 기록)되고 ② 브리프 스튜디오로 폰트·컬러·인터랙션을 실물 선택하는 흐름이 실연 1회 관측되고 ③ 결과물 크롬 상시 표시가 프로토콜에 배포되고 ④ 딥 브리프 모드가 계약에 추가되면 닫는다.

## 범위 제외

- AskewlyDesign 데스크톱 앱 자체 개발 (스튜디오는 웹 프로토타입까지)
- askewly 컬러 시스템 사이트 페이지 신설(있는 자산 활용, 없으면 coolors 임시 — 사용자 승인 문구 반영)
- 폰트 라이선스 관리·셀프호스팅

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-design-brief.md`
- 소비 리서치: `research/2026-07-19-vb1-stitch-design-md.md` (VB1이 생성)
