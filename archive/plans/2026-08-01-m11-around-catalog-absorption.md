# PLAN — M11: Around 흡수 판정 — 템플릿 카탈로그 구조 (레퍼런스 다변화 2라운드 3/3)

> 생성: 2026-08-01 · 갈래: reference 흡수(RL 배치 — 판정 중심) · scope: Tier 2 Around/Createx 템플릿 시스템의 카탈로그·패키징 구조를 기존 캡처(`research/around-template-system-capture.md`, 2026-07-04) 재사용 + 최소 재확인으로 A/B/C 판정까지. M8 finding 큐에서 "우선순위 최하"로 등재된 건 — 보류(C) 마감도 정당한 결과다. goal `reference-diversification-2` 3번 milestone (연쇄 마지막 — goal 마감 + 일괄 push).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M9→M10→M11 일괄 승인, 보류(C) 마감 인정 포함)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — "이식 가능한 제품" 축: 상용 템플릿 시스템이 카탈로그·테마·에셋을 어떻게 패키징하는가는 그 축의 참고 재료다.
- **goal**: `reference-diversification-2` · **리서치 입력**: 조사 불요 — 기존 캡처 `research/around-template-system-capture.md` + DOM 요약 자산(`docs/research/assets/around-template-system-2026-07-04/`) 재사용.

## Scope Boundary
- **포함**: ① 기존 캡처 정독 + 사이트 최소 재확인(구조 변동 여부) ② absorption-criteria A/B/C 판정 — A 면 `knowledge/` 또는 기존 문서 보강으로 소폭 승격, B 면 링크 참조 등재, C 면 보류 근거 기록 ③ ledger 1행(source=around (t2)) + goal 마감 절차(일괄 push 승인 요청).
- **제외**: Around 소스 코드·Bootstrap 구현 흡수(Do-not-copy) · 대규모 신규 캡처(기존 자산 재사용이 원칙 — 이 건의 수요는 미실증).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 커밋 단위 revert.

## 스캐폴딩 결정
- source-of-truth: M7~M10 과 동일 + 기존 캡처 문서(동결 record — 수정하지 않고 신규 문서로 보충).
- 검증: 판정 산출물에 따라 — knowledge/terms 변경 시 M8 동일 체인, 문서-only(B/C 판정)면 check-llms-sync + 관련 lint 만(생략 사유 ledger 명시).
- 배포/운영: **M11 마감 = goal 마감** — 로컬 검증 후 요약 보고 → 사용자 승인 시 일괄 push.
- 자기선언 도메인 — 없음.
- 검토 후 제외: Around 유료 소스 구매·다운로드 — 공개 표면 관찰로 충분.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: finding 큐 3건 전부 진행 — 단 M11 은 등재 당시 "우선순위 최하·수요 미확인"이므로 **보류(C) 판정 마감을 정당한 완료로 인정**(억지 승격 금지).
- **기술 결정**: ① 신규 대규모 캡처 없이 기존 자산 재사용 ② 판정 기준 = absorption-criteria 3분기 그대로 ③ A 판정이어도 산출물은 소폭(기존 문서 보강 우선, 신규 knowledge 는 근거가 충분할 때만).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — 기존 캡처 정독 + 재확인 + A/B/C 판정**
  - Artifact: `research/around-template-system-capture.md` 정독 + Around 사이트 실브라우저 최소 재확인(카탈로그 구조 변동 여부, 접근일 갱신) → 판정 메모 `research/2026-08-01-m11-around-verdict.md`(A/B/C + 근거 + 산출물 계획).
  - Files: write research/2026-08-01-m11-around-verdict.md. read research/around-template-system-capture.md, docs/design-system/absorption-criteria.md.
  - Risk: 기계적 (읽기+판정 문서)
  - Dependencies: 없음 (M10 완료가 전제 — 연쇄 순서)
  - Verify: 판정 문서에 3분기 중 1개 명시 + 근거 ≥3줄 + 산출물 계획(또는 보류 사유).
  - Failure probe: 사이트가 개편·소멸됐을 수 있음 — 접근 불가면 기존 캡처만으로 판정하고 그 한계를 명시.
  - Commit: changeset `m11-around-catalog-absorption` (README 절: step-1).

- [x] **step-2 — 판정 집행 + ledger (M11·goal 마감)**
  - Artifact: step-1 판정대로 집행 — A: 소폭 승격(기존 문서 보강 또는 knowledge 신설+llms 등재) / B: absorption-criteria 실측 표에 행 추가(링크 참조) / C: 보류 근거를 absorption-criteria 표 + ledger 에 기록. 공통: inbox 사용 시 비움 + ledger 1행 + `evidence/reference-diversification-2/m11-around-catalog-absorption.md` + goal 마감 요약(일괄 push 승인 요청으로 정지).
  - Files: write docs/design-system/absorption-criteria.md(실측 표 행), docs/research/loop/ledger.md, evidence/reference-diversification-2/m11-around-catalog-absorption.md. (A 판정 시) knowledge/ 또는 해당 문서 + scripts/generate-llms-txt.mjs + 재생성 산출물.
  - Risk: 기계적 (판정 집행 — terms 대량 변경 없음 예상. A 판정으로 정본 데이터를 만지면 검증 체인 전체로 승격)
  - Dependencies: step-1
  - Verify: 판정 산출물별 — 정본 변경 시 M8 동일 체인 전체 / 문서-only 시 check-llms-sync PASS + 생략 사유 ledger 명시. 공통: absorption-criteria 표에 Around 행 존재.
  - Failure probe: absorption-criteria 는 llms 등재 문서 — 수정 후 재생성 누락 시 check-llms-sync FAIL 확인(게이트 재실증).
  - Commit: changeset `m11-around-catalog-absorption` (README 절: step-2).

## 검증/DoD
- **DoD**: Around 가 **근거 있는 판정**으로 마감 — A/B/C 어느 쪽이든 absorption-criteria 실측 표 + source 축 ledger 행 + evidence 가 남고, 정본 변경이 있었으면 전 검증 체인 PASS. 실패 모드: 판정 없이 흐지부지(표·ledger 행 부재)가 실패다.
- **Evidence**: `evidence/reference-diversification-2/m11-around-catalog-absorption.md`
- **회귀 게이트**: check-llms-sync + (정본 변경 시) 전 체인.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
