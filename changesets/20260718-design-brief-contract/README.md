# changeset: design brief contract

- Date: 2026-07-18
- Milestone: DB1 (`plans/2026-07-18-db1-brief-contract.md`)

## 변경

- `docs/design-system/design-brief.md` 신설 — 4절: ① 규모 게이트(DESIGN.md 존재=재인터뷰 없음 / 신규 화면=풀 브리프 / 소형=생략) ② 7도메인 질문 카탈로그(선택지+추천 의무, 주관식 전면 금지) ③ DESIGN.md 저장 계약(결정 vs 추정 구분 기록) ④ headless 폴백(기본값 진행 + 추정 명시).
- step-2: entry-protocol 배선 + generate-llms-txt 등재 + 배포.

## 검증 checklist

- [x] 4절 전부 존재 (규모 게이트·질문 카탈로그·저장 계약·폴백)
- [x] Failure probe: 질문이 주관식 단독이 아님 — 도메인당 선택지+추천 명문화
- [x] curl design-brief.md "# Design Brief" 확인 + llms.txt 항목 grep 1 (엣지 1개 지연 후 OK)
- [x] entry-protocol "Brief interview" 배포 grep 1
