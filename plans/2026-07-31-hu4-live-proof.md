# PLAN — HU4: 통합 실증 (실증 덱 업그레이드 + 발표 게이트 명문화)

> 생성: 2026-07-31 · 갈래: changeset + 실증(이 레포 decks/) · scope: goal `html-upgrade` 4/4.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 2회 발견 7건 반영 후 일괄 승인, chain hu1→hu2→hu3→hu4)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `html-upgrade` 4/4 — HU1(운영력)·HU2(모션 문법·표현 규율)·HU3(이미지 트랙)를 실제 덱에서 통합 실증하고, C 묶음 잔여(프로젝터 실측 게이트)를 발표 게이트로 명문화해 goal 을 닫는다. 실증 없이 스킬만 바꾸면 PB2 의 교훈(실사용 품질은 실덱 관측에서만 드러난다)을 위반한다.
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §2-7(프로젝터 실측·대비 AAA)·§4(D1 few-shot 형식화는 finding 큐).

## Scope Boundary
- **포함**: ① 실증 덱(askewly-design-intro — 결정 로그)에 fragment·bento·이미지(HU3 3원천 중 적합한 것, 적합 장에 한해)·스피커 뷰·standalone·PDF 노트 적용, 라이브 발표 리허설 시나리오 실조작 + anti-slop 린트 통과 ② 발표 게이트 명문화 — verification.md/G7 에 발표 전 체크(대비 AAA 7:1 지향·프로젝터/외부 모니터 실측 항목·오프라인 리허설) + methodology/slide-production.md 갱신 ③ 사용자 관측 1회(라이브 발표 흐름) ④ goal 마감 되먹임(스킬 잔여 흡수·finding 큐 정리).
- **제외**: 새 콘텐츠 덱 제작(기존 실증 덱 업그레이드가 대상) · 실제 프로젝터 하드웨어 실측(사용자 환경 소유 — 게이트 문서화까지가 범위, 실측은 사용자 발표 시) · D 묶음(few-shot 형식화·Presenton 벤치마크 — finding 큐).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **사용자 관측 대기(G 라이브 관측)**
- rollback/cleanup: 덱 변경은 이 레포 커밋 revert. slides.json 원본 백업은 git 이력으로 충분.

## 스캐폴딩 결정
- source-of-truth: 덱 원본 = `decks/askewly-design-intro/content/slides.json`(HTML 정본 — PPT 구성 레이어 `pptx-composition.json` 무접촉). 발표 게이트 정본 = custom-skills `references/verification.md`, 방법론 = 이 레포 `methodology/slide-production.md`.
- 검증: validate·build·overflow 3종(+anti-slop 린트) + Chrome 라이브 리허설 실조작(fragment 진행·스피커 뷰 동기·오프라인 standalone·이미지 대비) + PDF 노트 실산출 + **사용자 관측 1회**(라이브 발표 흐름 — 결과를 evidence 새 줄로).
- 배포/운영: 스킬 측 잔여 수정 발생 시 custom-skills changeset + setup.sh 배포(경로 명시 add).
- 자기선언 — 실증 계약: fragment 는 서사에 맞는 장에만(전 장 강제 금지 — 과모션 함정, research §2-5) · bento·이미지는 적합 장에만(무리한 끼워넣기 금지, 적합 장 없으면 "해당 없음" 기록 — 이미지는 출처 장부 필수) · 관측 결과를 미리 PASS 로 쓰지 않는다(PB2 교훈 — 관측 줄은 사후 추가) · 라운드 장부(캘리브레이션 왕복 기록, 상한 5).
- 검토 후 제외: 실제 발표장 예행(장소 필요) — 게이트 문서화 + 로컬 리허설로 대체하고 실측 항목은 체크리스트로 남긴다.

## 결정 로그
- status: resolved
- **범위 = 추천안(C 는 실증 덱에 얹어 검증, D 는 finding 큐)** — 사용자 확정 2026-07-31 ("추천대로 계획 ㄱ").
- **실증 덱 = askewly-design-intro** — 제안 근거: 레포 정본 소개 덱이라 업그레이드의 실사용 가치 최대 + HTML 원본·기준 스크린샷·PPTX 실증이 이미 있어 회귀 대조 가능. (승인 질문에 포함해 확정 — 다른 덱/신규 덱 원하면 "수정".)

## Step 트리

- [ ] **step-1 — 실증 덱 업그레이드 적용 + 라이브 리허설**
  - Artifact: askewly-design-intro 에 fragment(적합 장)·bento·이미지(적합 장, 없으면 기록)·스피커 뷰·standalone·PDF 노트 실적용 산출물 + 라운드 장부(`evidence/html-upgrade/hu4-live-proof.md` 초안).
  - Files: write `decks/askewly-design-intro/content/slides.json`·`decks/askewly-design-intro/tools/`(HU1·HU2 반영판 동기화)·`evidence/html-upgrade/hu4-live-proof.md`. read custom-skills 배포본.
  - Risk: 없음 (덱 로컬 — git revert 용이, 기존 export 산출과 대조 가능)
  - Dependencies: 없음 (선행 게이트: HU3 완료 — 연쇄 순서가 보장)
  - Verify: validate·build·overflow PASS + Chrome 리허설 실조작(fragment 전 장 진행·스피커 뷰 동기·타이머) + dev 서버 종료 후 standalone file:// 개봉 + `--notes` PDF 육안 + 기존 raster 기준 스크린샷 대비 정적 상태 회귀 없음.
  - Failure probe: 덱 로컬 tools 가 구판 템플릿 사본이라 HU1·HU2 신기능 부재 — 착수 시 배포본과 diff 후 동기화(덱 로컬 커스텀 유실 금지: diff 로 커스텀 보존 확인).
  - Commit: 이 레포 커밋(step-1 경계).
- [ ] **step-2 — 발표 게이트 명문화 + 사용자 관측 + goal 마감 되먹임**
  - Artifact: custom-skills `references/verification.md` 발표 전 체크 절(대비 AAA 지향·프로젝터/외부 모니터 실측 항목·오프라인 리허설·리모컨=표준 화살표 키 가정 고지) + 이 레포 `methodology/slide-production.md` 발표 운영 절 + 사용자 관측 1회(라이브 흐름) 결과 반영 + finding 큐 정리(D1 few-shot·Presenton 벤치·Auto-Animate).
  - Files: write custom-skills `references/verification.md`·이 레포 `methodology/slide-production.md`·`evidence/html-upgrade/hu4-live-proof.md`.
  - Risk: 없음 (문서 + 관측)
  - Dependencies: step-1
  - Verify: 관측 피드백 반영 왕복 후 사용자 판정(evidence 관측 줄) + 배포 정합.
  - Failure probe: 관측에서 품질 재정의급 피드백이 나오면 decision_required 정지(PB2 전례 — 기준 뒤집힘은 재계획).
  - Commit: custom-skills changeset `20260731-hu4-live-proof` + 이 레포 커밋.

## 검증/DoD
- **DoD**: 실증 덱이 HU1·HU2 전 기능으로 라이브 리허설을 통과(리허설 실조작 + 오프라인 개봉 + PDF 노트)하고, 발표 게이트가 스킬·methodology 에 명문화되며, 사용자 관측 1회에서 라이브 발표 흐름이 확인된다.
- **Evidence**: `evidence/html-upgrade/hu4-live-proof.md`
- **회귀 게이트**: 덱 정적 상태가 기존 기준 스크린샷과 정합(fragment 전체 표시 상태) + pptx-composition/PPTX 트랙 무접촉.

## 수치 출처
- 대비 AAA 7:1·프로젝터 실측 근거 = research 문서 §2-7 (SlideBazaar 외, 접근 2026-07-31).

## 재생성 장벽
- step-2 스킬 잔여 흡수 시 배포(커밋 가드).

## finding 큐
- D1 few-shot 예시 장 패턴 G5 형식화 · D2 Presenton 정밀 벤치마크 · Auto-Animate (HU2 이월).

## 진행 로그
- 2026-07-31 작성 — goal 연쇄 4/4 (2026-07-31 확장으로 HU3→HU4 재구성 — 이미지 트랙 삽입).
