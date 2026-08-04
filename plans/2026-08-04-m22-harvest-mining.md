# PLAN — M22: 소스 레벨 재료 채굴 — 확정 풀 5 표면 코드 채굴 장부 + 착지 판정

> 생성: 2026-08-04 · 산출물: changeset (mining ledger + 착지 판정표) · scope 결정: 사용자 지목 재료 전건 채굴 → 착지·순서 사용자 확정까지
> milestone-레벨 durable plan doc. Claude/Codex 가 이 문서만 읽고 이어받는 단일 장부.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M22+M23 연쇄, fresh 검증자 3건 반영본)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — 입력 루프(harvest) 심화 (← `CLAUDE.md` 「북극성」 절). M20 teardown 은 라이브 화면 관측이라 겉면 판정에 그쳤다 — 사용자 지적(2026-08-04): "훨씬 가져올 수 있는 게 많을 거라 생각했어". 컬러감·연결 방식·three.js 코드·포인터 효과·마키·문구 로테이션·사전형 구조는 **소스 코드 채굴**에서 나온다.
- **milestone**: M22 = 확정 풀 5 표면(brain·본체·bootcamp·dev·sixsense)의 소스를 직접 뒤져 사용자 지목 재료 전건의 채굴 카드(코드 위치·의존성·재료 유형·착지 제안)를 만들고, 착지·승격 순서를 사용자 확정까지 끌고 간다. 리프 판정 근거: 독립 step ≥2(채굴/판정/확정) + 통합 검증(지목 재료 전건 커버) + 단독 capability(M23 집행의 입력) + 사용자 결정.
- **사용자 지목 재료 (2026-08-04 원문 기준 — 채굴 최소 집합)**: brain ①컬러감 ②지식 그래프 연결 방식 ③three.js 활용 코드 ④UI(필터/범례 등) · 본체 ⑤랜딩 페이지 ⑥마우스 포인터 효과 ⑦배경 장식 · bootcamp ⑧마키 ⑨히어로 문구 변화 인터랙티브 · dev ⑩사전형 사이트 구조 · sixsense ⑪마키 ⑫히어로 ⑬랜딩 페이지·전체 페이지 구조 ⑭설명 텍스트 UI. 채굴 중 추가 발견은 카드로 증보(축소 금지).
- **소스 위치 실측 (2026-08-04)**: brain=`~/projects/second-brain/poc-graph` · 본체=이 레포 `examples/ui-vocabulary-site` · bootcamp=`~/projects/ai-bootcamp-2026` · dev=`~/projects/development-dictionary` · sixsense=`~/projects/archive/upstage-sixsense` — 전부 로컬.
- **조사 인용**: `docs/design-system/harvest-contract.md`(판정 축·6단 절차·부록 8단) · `research/2026-08-04-m20-harvest-teardown-ledger.md`(표면 카드 — 겉면 판정 선행 기록).

## run 전 scope 결정 (확정)

- **결정**: M22 전체(step-1~3) → 확정 후 M23 연쇄. 채굴만 한다 — 코드 승격·registry 변경은 M23. 대상 = 지목 재료 14건 + 채굴 중 발견 증보.
- **execution mode**: `continuous`
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-3(착지·순서 확정).
- **진행 보고**: commentary only.
- **rollback/cleanup**: 산출물 research 문서뿐 — 커밋 revert. 타 레포는 읽기 전용(수정 금지).

## 스캐폴딩 결정

- source-of-truth: 채굴 쓰기 정본 = `research/2026-08-04-m22-harvest-mining-ledger.md`(재료당 카드 1개: 소스 파일:라인·의존성·재료 유형·기존 자산 중복·착지 제안·추출 난도).
- 검증: 지목 재료 14건 ↔ 카드 1:1 전건 + 카드마다 실코드 인용(파일:라인) — 화면 추측 금지.
- 배포/운영: 해당 없음 — 조사 milestone. push 세션 일괄.
- 위임: **use** — 레포당 sonnet worker 1(총 5, 읽기 전용 채굴). 판정·착지 제안 종합은 오케스트레이터.
- 검토 후 제외: 타 레포 소스의 이 레포 복사 — 채굴 카드는 위치·인용만, 코드 이동은 M23 승격 절차 소유.

## 결정 로그 (run 전 사전 소진)

- 결정 1 — 채굴 범위 = 사용자 지목 14건이 최소 집합, 발견 증보 허용 → **확정** (사용자 지시 2026-08-04).
- 결정 2 — 착지 유형 그릇: 컴포넌트/모션 → registry asset · 페이지/사이트 골격 → 블록 또는 recipe/knowledge 문서 · 컬러감 → 팔레트 프리셋(킥스타트 브리프 옵션) 또는 DESIGN.md 예시 · 코드 기법(three.js 연결 방식) → asset 또는 knowledge — **재료별 최종 착지는 step-3 사용자 확정 게이트에서 매듭**(채굴 결과가 선행 입력이라 계획 단계 소진 불가, M20 결정 3과 같은 구조).
- status: resolved

## Step 트리

- [x] **step-1 — 소스 채굴 (병렬 위임, 레포당 1 worker)**
  - Artifact: mining ledger — 재료당 카드(소스 파일:라인 인용·의존성·유형·구현 요지 3줄·추출 난도 상/중/하). 지목 14건 전건 + 발견 증보.
  - Risk: 없음 (읽기 전용 조사)
  - Files: write research/2026-08-04-m22-harvest-mining-ledger.md. read 타 레포 4 + examples/ui-vocabulary-site (수정 없음).
  - Dependencies: none
  - Verify: 지목 재료 14건 ↔ 카드 1:1 + 카드 전건에 실파일 경로:라인 존재(추측 서술 0).
  - Failure probe: 소스에 실존하지 않는 재료(라이브에만 있고 로컬 소스가 낡은 경우) — "소스-라이브 불일치"로 명시 기록, 조용한 추측 금지.
  - Commit: changeset `20260804-m22-harvest-mining` (README 절: step-1).
- [x] **step-2 — 착지 판정표 + 승격 순위안**
  - Artifact: ledger 말미 — 재료별 착지 제안(결정 2 그릇 적용)·기존 자산 중복 대조·M23 배치 순위 추천안.
  - Risk: 없음 (판정 문서)
  - Files: edit research/2026-08-04-m22-harvest-mining-ledger.md.
  - Dependencies: step-1
  - Verify: 카드 전건에 착지 제안+중복 대조 열 존재.
  - Failure probe: 착지 제안이 기존 그릇 밖(신설 등급 요구)이면 — 계약 위반이므로 "그릇 결정 필요"로 사용자 게이트에 올린다(임의 신설 금지).
  - Commit: changeset (README 절: step-2).
- [ ] **step-3 — 사용자 확정 게이트 (착지·순서)**
  - Artifact: 확정 기록 — M23 집행 목록(착지 형태·순서) 확정.
  - Risk: 없음 (human gate)
  - Files: edit research/2026-08-04-m22-harvest-mining-ledger.md.
  - Dependencies: step-2
  - Verify: 사용자 확정 문구 기록(확정 전 M23 진입 금지).
  - Failure probe: 확정 목록 0건이면 M23 공회전 — blocked 보고.
  - Commit: changeset (README 절: step-3).

## 검증/DoD

- **DoD**: 지목 재료 14건 전건 채굴 카드(실코드 인용) + 착지 판정표 + 사용자 확정 1회. 실패 모드 검증 = 소스-라이브 불일치 발견 시 명시 기록(step-1 probe).

## 수치 출처

- 14건: 사용자 메시지(2026-08-04)의 표면별 지목 재료 나열을 항목화한 수기 계수 — 위 「사용자 지목 재료」 절의 ①~⑭ 가 정본 목록(재검: `grep -c "⑭" && grep -c "⑮"` — ⑭ 존재 1 + ⑮ 부재 0 을 함께 확인).

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (없음)

## 진행 로그 (append-only)

- 2026-08-04 · step-1 완료 — worker 5기 병렬 채굴, 지목 14/14 카드(실코드 인용 전건) + 증보 11(coverflow·hero-composition·image-treatment·palette-generator·인증 모달·HUD·마스크 유틸 등). 소스-라이브 불일치 1: sixsense ⑪ "마키"는 실체가 세로 bobbing.
- 2026-08-04 · step-2 완료 — 착지 판정표: asset 7(A1~A7)·비-asset 4(B1~B4)·이월 5(C1~C5) + M23 배치 추천 11건(상한 재검은 게이트 소유). 사용자 확정 대기.
