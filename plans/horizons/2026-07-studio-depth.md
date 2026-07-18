# Horizon — Studio Depth (결정 공간 전면 확장)

Date: 2026-07-19
Status: active
Objective link: `OBJECTIVE.md` (성공 상태 ④ AskewlyDesign 앱 브리프 화면 프로토타입 고도화 + ③ 판단 입력 품질)
Preceding horizon: `plans/horizons/2026-07-visual-brief.md` (closed 2026-07-19)

## Goal

브리프 스튜디오를 "최소 실증판(3그룹×3~4후보)"에서 **시니어 디자이너의 결정 공간 전체**로 확장한다: 스타일 타일 2단 구조(방향 타일 3~4 → 축별 세부), 축 14종(배경/액센트 분리·타이포 페어·구성·헤더·푸터·카드·그리드·radius·밀도·이미지 스타일·아이콘·다크·모션·접근성), 그룹당 후보 6~8 추천순, 실사 이미지 파이프라인(Pexels ko-KR 스톡 우선 + comfy/image_gen 생성 옵션).

## Why Now

- 사용자 피드백 2026-07-19 (카페 실연 직후): "선택지가 되게 적고, 선택하는 사항 자체도 적다 — 배경 색·페이지 구성·구조·헤더/푸터·카드·그리드·실사 이미지까지 방향성은 더 넓다" + "웹 리서치로 시니어 디자이너의 요구를 더 크게 잡고 디테일 설계".
- 리서치 완료(2026-07-19, 2건): 업계 표준 = Style Tiles 2단 관행 + 도구들 3~14 후보 카드. 업계 공백(모션·접근성·형태 언어 미질문)을 우리가 실물로 묻는 차별화 근거 확보.
- 사용자 확정: 큰 그림 승인 + 이미지=스톡 우선·생성 옵션.

## 설계 원칙

- **2단 구조**: 1단 스타일 타일(색+타이포+형태 조합 방향)로 큰 방향 → 2단 축별 세부. 축을 평면 나열하지 않는다(선택 피로는 개수보다 구조 문제 — Style Tiles 관행).
- 규모 게이트 유지: 소형 작업은 여전히 스튜디오 자체를 생략.
- 딥 브리프 부록(VB4)은 스튜디오 v2 기본 그룹으로 흡수(질문 피로는 텍스트 문항의 문제였고 클릭 선택은 구조가 다름 — 사용자 방향 확인됨).
- 근거 정본: `research/2026-07-19-studio-depth-brief-practice.md` · `-tool-practice.md`.

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| SP1 | 브리프 v2 계약 (결정 공간 지도) | `plans/2026-07-19-sp1-brief-v2.md` | approved 2026-07-19 | 위 2건 소비 |
| SP2 | 스튜디오 v2 (2단 구조 + 축 14종) | `plans/2026-07-19-sp2-studio-v2.md` | approved 2026-07-19 | 위 2건 소비 |
| SP3 | 이미지 파이프라인 (Pexels + 생성 옵션) | `plans/2026-07-19-sp3-image-pipeline.md` | approved 2026-07-19 | tool-practice §4 |
| SP4 | 통합 E2E 실연 | `plans/2026-07-19-sp4-integrated-e2e.md` | approved 2026-07-19 | 불요 |

## Close Criteria

① 브리프 v2(전략층 확장 + 축 14종 + 2단 구조)가 llms 배포되고 ② 스튜디오 v2가 실구동(타일→세부→수집)되고 ③ 이미지 후보가 실사(스톡 또는 생성)로 스튜디오에 뜨고 ④ 통합 실연 1회(사용자)가 관측되면 닫는다.

## 범위 제외

- AskewlyDesign 앱 네이티브 구현
- Unsplash 경로(Pexels 확정 — 비영어 베타·신청 병목)
- 스튜디오 다국어화

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-visual-brief.md`
- 소비 리서치: `research/2026-07-19-studio-depth-brief-practice.md`, `research/2026-07-19-studio-depth-tool-practice.md`
