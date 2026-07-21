# Horizon — Quality & Dogfooding

Date: 2026-07-12 (사용자 승인 활성화 — H2 Living Design System close 직후)
Status: closed (2026-07-12 — QA2/QA1/QA3 3/3 완료)

## Close Audit (2026-07-12)

- **QA2 — Install & Dogfooding** (6 steps, changesets #84–88): AskewlyDesign 재패키징·실설치·언인스톨 lifecycle PASS, dogfooding에서 major 결함 4건 발견(#1 삽입 계약은 Step 6에서 해소, #2~#4는 유지보수 후보 등재), 적체 유지보수 4건 소진.
- **QA1 — Recipe Gallery & Visual QA** (3 steps, changesets #89–90): 갤러리 섹션에서 recipe 35종 전부 live render, 라이트/다크 70장 sweep + contrast 판독(오탐 7건 전수 판독), 오버레이 격리 결함 G1/G2 수정, live-render 유보 계약 갱신.
- **QA3 — Canvas Recipe Materialization** (3 steps, changesets #91–93): recipe 실체화가 실 standalone 소스 방출, 캔버스 Materialize 액션 신설, packaged E2E 왕복 관측(identity 계약·재시작 단일 생존). E2E가 Windows 스테이징 경로 결함을 적발·봉합.
- Close criteria 3항목 전부 충족: ① 전 recipe 사이트 열람 + design-qa 패스, ② 설치·실사용 시나리오 통과 + 유지보수 소진, ③ 실체화 왕복 E2E 관측.
- 크기 회고: milestone 당 changeset 5/2/3 — 인플레 없음.
- 잔여(후속 유지보수 후보): 데스크톱 human Undo/Redo, 신뢰 프로젝트 소실 에러 표면, 프로덕션 셸 정리(1,000-node fixture·dev 계기판), shortcuts 배경 inert.

## Objective 임팩트 (close 시점)

성공상태 ①(시각 라이브러리 탐색)이 recipe 갤러리로 실품질 도달, ④(캔버스 제작 환경)가 설치·실사용·실체화 왕복까지 검증됨. H3(Public Product & Monetization)의 품질 전제 확보.

## Goal

기계 검증(validator·테스트·빌드)까지 통과한 시스템을 **사람이 쓰고 볼 수 있는 품질**로 끌어올린다: recipe가 사이트에서 실제로 보이고, AskewlyDesign 데스크톱 앱이 설치되어 실사용되며, 접근성·시각 품질이 반복 검증 루프에 들어간다.

## Why (승인 시점 근거)

H2가 recipe 35종·4-소비처 배선을 완성했지만 전부 기계 게이트까지다: recipe 19종은 사람이 화면에서 본 적 없고(사이트 live 렌더 부재 — recipe-format이 유보 중), design-qa 패스 0회, 데스크톱 설치·실사용 0회, 유지보수 후보 4건 적체. 다음 후보인 Public Product & Monetization은 공개 품질 담보가 선행돼야 한다 (사용자 판정 2026-07-12: "아직 다듬을 부분이 더 많아. QA, QC도 아직 안 됐고").

## Milestones (2026-07-12 사용자 확정: 3개 전부, QA2부터)

- **QA2 — AskewlyDesign Install & Dogfooding** (first): 리네임 반영 재패키징 → 실설치 → 실사용 시나리오 검수 → 유지보수 후보 4건 처리.
- **QA1 — Recipe Gallery & Visual QA**: 전용 갤러리 섹션으로 recipe 실노출(사용자 확정: 갤러리 방식) → design-qa 일괄 패스(WCAG·스크린샷·다크모드) → 결함 수정. recipe-format의 live render 유보 계약 갱신 포함.
- **QA3 — Canvas Recipe Materialization**: 팔레트 recipe 삽입을 placeholder가 아닌 실 소스 실체화로.

## Close Criteria

전 recipe가 사이트에서 열람 가능 + design-qa PASS, AskewlyDesign이 설치되어 실사용 시나리오 통과 + 유지보수 후보 소진, 캔버스 recipe 실체화 왕복 E2E 관측.

## Objective Impact Target

성공상태 ①(시각 라이브러리 탐색)의 실품질 완성, ④(캔버스 제작 환경)의 실사용 검증. H3(수익화)의 전제 확보.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Predecessor: `docs/horizons/2026-07-living-design-system.md` (closed 2026-07-12)
- Next queued: `docs/horizons/2026-07-public-product-monetization.md`
