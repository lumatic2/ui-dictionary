# PLAN — DQ3: 정본 덱 리디자인 + 사용자 관측 게이트 (goal 마감)

> 생성: 2026-07-31 · 갈래: 덱 로컬(이 레포) + evidence · scope: goal `deck-quality` 3/3.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 발견 7건 반영 후 일괄 승인, chain dq1→dq2→dq3)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `deck-quality` 3/3 — DQ1 루브릭·견본과 DQ2 표현 기계를 정본 덱 `decks/askewly-design-intro` 에 실적용해 리디자인하고, 사용자 관측으로 품질 상승을 실증한다. HU4 전례: 실크롬 사용자 관측이 자동 검증이 못 잡는 결함을 잡는다 — 품질 판정도 최종 게이트는 사용자다.
- **리서치 입력**: DQ1 산출 `research/2026-07-31-dq1-deck-quality-refs.md` + `references/quality-rubric.md`(DQ1 산출).
- **선행 게이트**: DQ1·DQ2 changeset 배포 완료(setup.sh) — animId·이미지 파이프·루브릭이 스킬에 실재해야 "적용 판단"이 성립한다 (fresh 검증자 지적 2026-07-31).

## Scope Boundary
- **포함**: ① 정본 덱 7장 루브릭 감사 → 리디자인 시안(대표 장 + 커버 이미지 유/무 2안) 제시·사용자 선택 ② 선택안으로 전체 재제작(연속 전환·이미지 최적화 적용 판단 포함) + 전 검증 + 산출물 재생성 ③ 사용자 관측 게이트 → goal 마감.
- **제외**: 스킬 계약 변경(발견 시 finding 큐 → 필요하면 DQ1/DQ2 changeset 후속 절로) · 신규 덱 제작.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **시안 선택 게이트(step-1 말미 — 사용자 선택 대기)** / **관측 게이트(step-2 말미 — 사용자 판정 대기)**
- rollback/cleanup: 덱 커밋 revert(리디자인 전 상태 = git 이력). export/baseline-png 은 리디자인 확정 후 재기준선(의도 변경 — 픽셀 diff 게이트는 재기준선 이후 재개).

## 스캐폴딩 결정
- source-of-truth: 덱 콘텐츠 정본 = `decks/askewly-design-intro/content/slides.json`. 품질 잣대 = DQ1 루브릭(감사·시안·판정 전부 루브릭 항 인용으로 근거화).
- 검증: 루브릭 전 항 감사표(장×항) + validate·build·overflow·lint + Chrome 실조작 리허설 + HU4 재현 5종 + 발표 전 체크(verification.md G7 하위) + 사용자 관측.
- 배포/운영: 덱 로컬 — 스킬 배포 없음. 레포 push 는 세션 일괄 규약.
- 자기선언 — 시안 게이트: 대표 장 2~3장(커버 포함)을 [현행 | 리디자인 A(이미지 무) | 리디자인 B(커버 히어로 이미지 — imagery.md 3원천 규율 준수)]로 실렌더 스크린샷 비교 제시. 사용자가 방향 선택 후 전체 재제작 — 이미지 실투입 여부는 이 게이트에서 사용자가 결정한다(HU4 "무리한 끼워넣기 금지" 판정과 정합 — 서사 적합 장만 후보로 제시).
- 자기선언 — 재기준선: 리디자인 확정 커밋에서 export/baseline-png 재산출·교체(의도 변경 명시), 이후 회귀는 새 기준선 대비.
- 검토 후 제외: 다국어판·발표 시간별 축약판 — 수요 미확인.

## 결정 로그
- status: resolved
- **범위 = ① 덱 자체 품질 업그레이드, 정본 덱 1본 실증** — 사용자 확정 2026-07-31.
- **커버 이미지 실투입 여부 = step-1 시안 게이트에서 사용자 선택** (계획 단계 확정 불요 — 시각 비교 없이 물으면 허공 결정이라 게이트에 배치).
- 시안 장수(2~3)·감사표 형식 = 기술값 (에이전트 결정).

## Step 트리

- [x] **step-1 — 루브릭 감사 + 리디자인 시안 (사용자 선택 게이트)**
  - Artifact: 루브릭 감사표(7장×루브릭 항 — 위반·개선 후보) + 대표 장 시안 실렌더 스크린샷(현행 vs A vs B) + 선택 질문 제시.
  - Files: write 이 레포 `evidence/deck-quality/dq3-canonical-redesign.md`(감사표·시안 기록)·`decks/askewly-design-intro/content/`(시안용 임시 변형 — 확정 전 커밋 금지, scratchpad 빌드). read DQ1 루브릭·견본, DQ2 계약.
  - Risk: 없음 (제시까지 — 정본 미변경)
  - Dependencies: 없음
  - Verify: 감사표가 루브릭 전 항을 커버 + 시안 스크린샷이 실빌드·실렌더 산출(목업 금지) + 선택지가 자기완결(각 안의 차이·근거 명시).
  - Failure probe: 시안이 루브릭 항 인용 없이 "느낌" 근거로만 서술되는 것 — 각 변경에 루브릭 항 번호를 달아 차단.
  - Commit: 없음 (게이트 통과 후 step-2 에서).
- [x] **step-2 — 전체 재제작 + 검증 + 사용자 관측 (goal 마감)**
  - Artifact: 선택안 기준 7장 재제작(slides.json·assets — DQ2 기계 적용 판단 포함) + 전 검증 + speaker/standalone/notes PDF 재산출 + 재기준선 + 사용자 관측 → PASS 시 goal 마감 절차(/harness-done).
  - Files: write 이 레포 `decks/askewly-design-intro/**`·`evidence/deck-quality/dq3-canonical-redesign.md`·`docs/reports/`(마감 시). read step-1 선택 결과.
  - Risk: 위험 (정본 덱 전면 수정 — 단 git 이력으로 완전 롤백 가능)
  - Dependencies: step-1
  - Verify: validate·build·overflow·lint 0 실패 + Chrome 리허설(전장 실조작·콘솔 에러 0) + HU4 재현 5종 PASS + 발표 전 체크 수행 + 루브릭 재감사(개선 항 전/후 대비) + **사용자 관측 PASS**(관측 결과를 미리 PASS 로 쓰지 않음 — PB2 교훈).
  - Failure probe: 관측 부분 FAIL 시 HU4 방식 반복(결함 수리→재현 테스트 박제→재관측) — 라운드 기록을 evidence 에 append.
  - Commit: 이 레포 `feat(dq3)` 연쇄(시안 확정·재제작·재기준선 각 경계) + 마감 `docs(dq3)`.

## 검증/DoD
- **DoD**: 정본 덱이 DQ1 루브릭 기준으로 재제작되어 전/후 감사표가 개선을 보이고, 전 자동 검증+HU4 회귀 5종+발표 전 체크 PASS, **사용자 관측 PASS** — goal `deck-quality` 마감.
- **Evidence**: `evidence/deck-quality/dq3-canonical-redesign.md`
- **회귀 게이트**: HU4 재현 5종 + 재기준선 후 픽셀 diff 재개.

## 수치 출처
- 정본 덱 장수 7 = `python -c "import json,io;print(len(json.load(io.open('decks/askewly-design-intro/content/slides.json',encoding='utf-8'))['slides']))"` (착수 시 실측).

## 재생성 장벽
- 재제작 확정 후 export 전 트랙(standalone·notes PDF·baseline-png) 일괄 재산출.

## finding 큐
- (비움 — 진행 중 발견 시 append)

## 진행 로그
- 2026-07-31 작성 — goal 연쇄 3/3.
