# PLAN — M20: 산출물 전수 teardown — 배포 표면 29종 실사 + harvest 후보 장부

> 생성: 2026-08-04 · 산출물: changeset (research ledger + 판정 문서) · scope 결정: census 29 표면 전건 teardown → harvest 후보 순위 사용자 확정까지
> milestone-레벨 durable plan doc. Claude/Codex 가 이 문서만 읽고 이어받는 단일 장부.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M20+M21 연쇄, fresh 검증자 3건 반영본)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — "일회성 작업에서 → 반복 가능한 루프로" (← `CLAUDE.md` 「북극성」 절). reusable-composition(M18+M19)이 저장고→착수의 출력 루프를 닫았고, 이번 goal `harvest`는 산출물→저장고의 **입력 루프**를 연다(원 설계안 ③, 저장고 복리 성장).
- **milestone**: M20 = 회수 계약을 설계하기 전에 회수할 것이 실제로 무엇인지 전수로 본다 — 배포 표면 29종(census 실측) 하나씩 teardown 하여 harvest 후보 장부·순위를 만든다. 리프 판정상 milestone 근거: 독립 step ≥2(소스 매칭 / teardown 실사 / 순위 판정) + 통합 검증(전건 커버리지 대조) + 단독 capability(후보 장부 = M21 계약·승격의 입력) + 사용자 결정(순위 확정)을 부른다.
- **입력 실측 (2026-08-04)**: `research/2026-08-04-harvest-asset-census.md` — 표면 29종 = Pages 8 + Workers 커스텀도메인 4 + Workers 무도메인(UI 추정) 2 + Vercel 13 + GitHub Pages 1 + prawn 1. 도메인 27건 스윕 중 25건 200(404 1·무응답 1), 무도메인 워커 2건은 teardown 에서 실측. 터널 7·cdn·메일·prawn-uptime 워커는 인프라 비대상.
- **조사 인용 (M12 규약 — 재리서치 대신)**: `docs/design-system/absorption-criteria.md`(승격 시점 A/B/C 판정에 인용 — teardown 판정 축 자체는 결정 2 자체 정의) · `docs/design-system/block-contract.md` §7/§8(승격 후 소비 계약) · `research/2026-08-04-m18-block-absorption-survey.md`(흡수 실사 표 형식 선례).

## run 전 scope 결정 (확정)

- **결정**: 이번 run 이 닫을 범위 = M20 전체(step-1~3) → 사용자 순위 확정 후 M21 연쇄. 조사 대상 = 사용자 대면 29 표면 전건(죽은 표면·미확인 workers.dev 도 실측 카드로 계수 — 사용자 지시 "전수 조사" 2026-08-04). 인프라(터널 7·cdn·메일·prawn-uptime 워커)는 제외. 분모 정본 = census 문서의 표면 목록 29행.
- **execution mode**: `continuous`
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-3(후보 순위 사용자 확정).
- **진행 보고**: commentary only. 미완 leaf 는 턴 종료점이 아니다.
- **rollback/cleanup**: 산출물이 research/평가 문서뿐 — 커밋 단위 revert. 스크린샷 등 대용량 원본은 scratchpad, 장부에는 판정 텍스트+필요 시 축소본만(레포 무오염).

## 스캐폴딩 결정

- source-of-truth: census = `research/2026-08-04-harvest-asset-census.md`(동결 record) · teardown 쓰기 정본 = `research/2026-08-04-m20-harvest-teardown-ledger.md`(표면당 카드 1개) · 후보 순위 = 같은 문서 말미 판정 절.
- 검증: step별 Verify + 통합 = census 29행 ↔ ledger 카드 전건 1:1 대조(누락 0). 라이브 관측은 실브라우저(Playwright) 스크린샷.
- 배포/운영: 해당 없음 — 조사 milestone(사이트·registry 코드 무변경, llms 재생성 없음). push 는 세션 일괄(deploy-batching 규약).
- 위임: **use** — step-2 표면별 teardown 카드 작성은 사양 고정 후 하위 모델(sonnet) 병렬 fan-out(표면 묶음당 worker 1). 되돌림 싸고(카드 재작성) 판정은 오케스트레이터가 전건 검수 후 순위 소유. fan-out 규모(worker ≤6·표면 29)는 승인 게이트에 명시(고비용 fan-out 사전 승인 규약).
- 검토 후 제외: 소스 레포 신규 clone — 로컬 `~/projects` 실측만으로 매칭, 원격만 있는 소스는 "소스 원격" 표기(조사 목적에 clone 불요).

## 결정 로그 (run 전 사전 소진)

- 결정 1 — 조사 범위: 29 표면 전건 + 인프라 제외 → **확정** (사용자 지시 "전수 조사해서 하나씩 뜯어보자" 2026-08-04).
- 결정 2 — teardown 판정 축 = **이 milestone 자체 정의** 3축: ①재료 등급(블록/패턴/토큰/모션/없음) ②품질(시그니처·anti-patterns 대조) ③기존 자산 27종+블록 1종과의 중복 여부 → **확정** (기술 결정 — absorption-criteria 는 이 축의 출처가 아니라 승격 시점 A/B/C 판정에만 인용, fresh 검증자 적발 반영).
- 결정 3 — 후보 순위 = **사용자 소유** → step-3 게이트에서 확정(계획 단계에서 소진 불가 — 조사 결과가 선행 입력).
- status: resolved

## Step 트리

- [x] **step-1 — 소스 레포 매칭 장부**
  - Artifact: teardown ledger 골격 — census 29 표면 전건에 로컬 소스 레포(`~/projects/*`) 매칭 행(레포 경로·배포 경로·최종 커밋일). 미발견은 "소스 미상/원격" 명시.
  - Risk: 없음 (조사 기록만)
  - Files: read research/2026-08-04-harvest-asset-census.md, ~/projects/INDEX.md, 각 후보 레포의 배포 설정(wrangler.toml·vercel.json·package.json). write research/2026-08-04-m20-harvest-teardown-ledger.md.
  - Dependencies: none
  - Verify: ledger 행 29개 전건 존재 + 각 행 소스 칸 비어있지 않음(경로 또는 "미상" 명시).
  - Failure probe: census 에 없는 표면이 ledger 에 있거나 그 역 — 29:29 대조 스크립트/수기 카운트로 즉시 FAIL 확인.
  - Commit: changeset `20260804-m20-harvest-teardown` (README 절: step-1).
- [x] **step-2 — 표면별 teardown 실사 (병렬 위임)**
  - Artifact: 표면당 카드 — 실브라우저 스크린샷 관측(라이브 상태·화면 구성), 디자인 재료 판정(결정 2 축: 재료 등급·품질·중복), harvest 후보 여부 + 근거 1줄. 죽은 2 표면·무도메인 워커 2건(workers.dev 실측)도 각각 실측 카드.
  - Risk: 기계적 (조사 — 레포 코드 무변경. 위임 산출은 오케스트레이터 전건 검수)
  - Files: edit research/2026-08-04-m20-harvest-teardown-ledger.md. 스크린샷 원본 scratchpad.
  - Dependencies: step-1 (소스 매칭이 카드의 입력)
  - Verify: 카드 29건 전건 + 각 카드에 관측(스크린샷 실측 여부)·판정 축 3항·후보 여부 명시. 오케스트레이터 표본 재검(무작위 3건 실브라우저 재관측 일치).
  - Failure probe: 죽은 표면(physical-ai-arm 404·prawn 무응답)이 "정상 관측"으로 기록되면 FAIL — 사망 카드에 실측 코드(404/timeout) 필수.
  - Commit: changeset (README 절: step-2).
- [ ] **step-3 — harvest 후보 순위 + 사용자 확정 게이트**
  - Artifact: ledger 말미 판정 절 — 후보 순위표(재료 등급·중복 대조·승격 예상 형태) + M21 첫 승격 추천 1~2건. 사용자 관측·확정 기록.
  - Risk: 없음 (판정 문서 + human gate)
  - Files: edit research/2026-08-04-m20-harvest-teardown-ledger.md.
  - Dependencies: step-2
  - Verify: 순위표 존재 + 사용자 확정 문구 기록(확정 전 M21 진입 금지).
  - Failure probe: 후보 0건 판정이면 — M21 승격 실증이 공회전하므로 "후보 없음 → M21 재설계 필요" 로 blocked 보고(조용한 진행 금지).
  - Commit: changeset (README 절: step-3).

## 검증/DoD

- **DoD**: census 29 표면 ↔ teardown 카드 1:1 전건(누락 0) + 판정 축 3항 전건 기록 + 후보 순위표 + **사용자 확정 1회**. 실패 모드 검증 = 죽은 표면 2건이 사망 카드로 실측 코드와 함께 기록.

## 수치 출처

- 29 표면·도메인 스윕 25/27 (200): `npx wrangler pages project list`(8) + CF API `accounts/<id>/workers/scripts`(7, UI 표면 6+모니터 1 제외 규칙은 census 문서) + `zones/<id>/dns_records`(Vercel CNAME 13·GitHub Pages 1) + 전 표면 curl 상태코드 스윕(-L, 타임아웃 10s) — 무도메인 워커 2건 미확인 포함 계수 29 — 실행 기록 2026-08-04, 상세 `research/2026-08-04-harvest-asset-census.md`.

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (착수 전) 직전 핸드오프의 "ui.askewly.com Vercel 재배포" 표현은 부정확 — 실호스팅 CF Pages(census 실측). 다음 핸드오프에서 정정.

## 진행 로그 (append-only)

- 2026-08-04 · census 선행 완료 — `research/2026-08-04-harvest-asset-census.md` (29 표면·도메인 스윕 25/27 200).
- 2026-08-04 · step-1 완료 — 소스 매칭 29/29 (확정24·원격2·추정2·미상1).
- 2026-08-04 · step-2 완료 — sonnet 워커 6기 병렬, 카드 29/29 + 스크린샷 58장(scratchpad), 오케스트레이터 표본 재검 3건 일치. 판별 정정 4: overrism=over-series-site 확정 · precon=gcp-solana-agentic · skku=skku-startup-hub · prawn 생존(콜드스타트). 사망 카드 1(physical-ai-arm 404).
- 2026-08-04 · step-3 순위표 작성 — 1군 추천 kifrs-viz 데이터비주얼 3종 + skku 에디토리얼. 사용자 확정 대기(human gate).
