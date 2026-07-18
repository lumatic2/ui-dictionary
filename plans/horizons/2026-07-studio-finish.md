# Horizon — Studio Finish (스튜디오 이월 갭 마감)

Date: 2026-07-19
Status: proposed
Objective link: `OBJECTIVE.md` (성공 상태 ④ — AskewlyDesign 앱 브리프 화면의 완전한 웹 프로토타입 / 성공 상태 ③ — 에이전트가 반복 가능하게 소비하는 시스템)
Preceding horizon: `plans/horizons/2026-07-cascade-studio.md` (closed 2026-07-19 — 이월 갭 3건이 이 horizon 의 입력)

## Goal

cascade-studio 통합 실연이 실측으로 남긴 이월 갭 3건을 닫아 스튜디오를 **반복 가능한 도구**로 완성한다: ① 후보 주입을 수동 python 편집에서 데이터 JSON + 생성 스크립트 1커맨드로 자동화하고 ② 구성 리서치 12유형 중 미편입 4종과 예약/티켓형 특수 패턴을 편입하고 ③ 미리보기에 다크 토글·반응형 뷰포트를 더한다.

## Why Now

- ST4 통합 실연(야구장)이 남긴 갭 3건은 전부 실사용에서 관측된 것 — 특히 주입 자동화 부재는 매 의뢰마다 에이전트가 569줄 HTML 을 직접 편집하게 만들어 오류·비일관의 근원이다 (`changesets/20260719-copy-axes/README.md` 갭 절).
- 구성 4유형(비교표·문제-메커니즘-증거·커뮤니티 UGC·FAQ 신뢰)과 예약형 패턴은 리서치가 이미 완료돼 편입만 남았다 (`research/2026-07-19-st4-composition-patterns.md`) — 재료가 신선할 때 닫는다.
- 다크/접근성 축은 18축에 존재하지만 미리보기가 라이트 고정·데스크톱 고정이라 선택 결과를 눈으로 확인 못 한다 — "실물로 보고 고른다"는 스튜디오 원칙의 잔여 구멍.

## 리서치

조사 불요 — 갭 3건 전부 직전 horizon 실연에서 실측된 내부 툴링 개선이고, 구성·예약형 패턴은 기존 리서치(`research/2026-07-19-st4-composition-patterns.md`, 출처 URL+접근일 완비)가 이미 설계 입력이다.

## 무감독 분량

승인 후 최소 2 무감독 세션 (milestone 3개 · 독립 changeset 6개 이상 · 통합 검증 E2E 포함).

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| SF1 | 데이터 주도 스튜디오 주입 (자동화) | `plans/2026-07-19-sf1-studio-data-injection.md` | proposed | 불요 — 내부 툴링 |
| SF2 | 구성 패턴 완편 (4유형 + 예약형) | `plans/2026-07-19-sf2-composition-patterns.md` | proposed | `research/2026-07-19-st4-composition-patterns.md` |
| SF3 | 미리보기 고도화 (다크·반응형) | `plans/2026-07-19-sf3-preview-upgrade.md` | proposed | 불요 — 내부 툴링 |

## Close Criteria (선언 / 실측 / 판정 대조용)

1. **주입 1커맨드**: `python templates/make-studio.py --data <json> --out <html>` 실행 → 산출 HTML 을 Playwright 로 열어 커스텀 후보가 렌더됨을 관측 (로그 `evidence/studio-finish/`).
2. **구성 완편**: 생성된 스튜디오의 구성 축 후보가 리서치 12유형을 커버(실측 카운트)하고, `curl https://ui.askewly.com/llms/docs/design-system/brief-studio.md` 에 예약형 특수 패턴 절이 존재.
3. **미리보기**: 다크 토글·모바일 뷰포트 토글이 실구동(E2E 로그 + 스크린샷, 구성×다크×모바일 조합 매트릭스 포함).
4. **통합**: 커스텀 데이터 JSON 1건으로 전 루프(주입→선택→수집 JSON)가 1회 관측됨.

## 미리 쓰는 실패 회고 (프리모템)

이 horizon 이 끝났는데 실패했다. 왜?

1. **에이전트가 옛 방식으로 회귀** — 데이터 분리 후에도 계약 문서에 구 지시("python 으로 블록 교체")가 남았거나 llms 미반영이라, 다음 세션 에이전트가 여전히 HTML 을 직접 편집했다. → 예방: SF1 step 2 DoD 에 "계약 문서에서 구 주입 지시 grep 0 + curl 배포 확인" 명시.
2. **구성 과밀로 선택 피로** — 12유형을 전부 평면 노출하자 축이 비대해져 실사용에서 스킵됐다. → 예방: 기본 노출 상한 유지(8종) + 업종 조건 노출(예약형 등 4종은 브리프 맥락 일치 시만) 규칙을 SF2 결정 로그에 내장.
3. **미리보기 조합 렌더 버그 재발** — ST4 피드백 ③(구성 미반영 버그) 전례처럼 구성×다크×모바일 조합에서 렌더가 깨졌는데 happy-path 만 봐서 놓쳤다. → 예방: SF3 E2E 에 조합 매트릭스 실측 필수 항목.

## 범위 제외

- AskewlyDesign 네이티브 앱
- 신규 축 추가(18축 유지 — 구성 축 후보 확장만)
- 카피·이미지 생성 품질 고도화

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-cascade-studio.md`
- 리서치: `research/2026-07-19-st4-composition-patterns.md`
