# PLAN — DQ2: 표현 기계 업그레이드 (Auto-Animate + 이미지 최적화 빌드 + sourceNote 배치)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `deck-quality` 2/3.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 발견 7건 반영 후 일괄 승인, chain dq1→dq2→dq3)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `deck-quality` 2/3 — 품질 기준(DQ1)을 실물로 밀어 올릴 표현 기계 중 이월 finding 큐 3건: ① Auto-Animate(장 사이 요소 연속 전환 — HU2 이월, 장 전환이 "문서 넘김"이 아니라 "같은 무대의 장면 전환"으로 읽히게) ② 이미지 최적화 빌드(리사이즈·webp — HU3 이월, 원본 3MB급 실사진이 덱을 무겁게 함) ③ split-screen sourceNote 겹침 배치 재검토(HU3 관측 노트).
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §1(reveal.js Auto-Animate·Slidev 전환 — 차용 대상)·§2(GPU 속성 규율). 브라우저 cross-document View Transitions 는 착수 시 Context7/공식 문서로 현행 지원 실측(file:// opaque origin 제약 포함 — HU4 에서 실크롬 file:// 환경차 실증 전례).

## Scope Boundary
- **포함**: ① 장간 요소 연속 전환(Auto-Animate 상당 — 같은 `animId` 요소가 다음 장으로 위치·크기 보간) opt-in ② 빌드 파이프 이미지 최적화(캔버스 초과 리사이즈 + webp 변환 + 원본 보존) ③ split-screen 레이아웃 sourceNote 겹침 수리.
- **제외**: 신규 레이아웃 · 정본 덱 적용(= DQ3) · 동영상 에셋 파이프(수요 미확인 — finding 큐).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 전 기능 opt-in/빌드 내부 — 미사용 덱 산출 무변화.

## 스캐폴딩 결정
- source-of-truth: 전환 계약 = `references/rendering-contract.md`(공통 shell) + `slides.schema.json`(opt-in 필드). 이미지 파이프 계약 = `references/imagery.md` 처리 규율 절 확장.
- 검증: fixture 덱에 연속 전환 장쌍·대형 이미지 장 추가 → validate·build·overflow + Chrome 실조작(전환 육안·file:// 동작) + export 전 트랙 무오염(픽셀 diff) + HU4 재현 테스트 5종 회귀(동기·iframe 가드·다중 창·지연·FOUT).
- 배포/운영: setup.sh 단일 배포. 공유 레포 — add 경로 명시.
- 자기선언 — 연속 전환 계약: 요소에 `animId`(opt-in) → 인접 장에서 같은 animId 를 가진 요소끼리 보간. 구현 1순위 = cross-document View Transitions(`view-transition-name` 매핑) — **착수 시 실크롬 file:// 에서 동작 실측이 선행 게이트**(불가면 폴백: 현행 fade 유지 + 전환을 same-document 로 재현하는 standalone 전용 적용, 판정을 changeset 에 기록). 모션은 transform/opacity 한정·reduced-motion 가드(HU2 규율 준수). export 전 트랙·스피커 미리보기는 전환 미적용.
- 자기선언 — 이미지 파이프 계약: 빌드 시 `assets/` 이미지 중 캔버스 초과분을 리사이즈(최대 = 캔버스 픽셀 ×2, 레티나)·webp 재인코딩(원본은 `assets/src/` 보존), sourceNote·라이선스 장부 불변. 도구는 sharp 등 node 생태계 — **npm 의존성 선례 존재**(pptxgenjs: 없으면 `npm install` 안내 후 종료, `references/verification.md` — fresh 검증자 확인 2026-07-31) → 같은 패턴(opt-in 스크립트 + 미설치 시 안내 종료)을 따른다. 산출 용량 비교를 evidence 에 기록. **HU3 fixture 이미지는 스크래치 소멸**(assets 빈 폴더 — 검증자 실측) → step-2 는 imagery.md 3원천 절차로 검증용 이미지(대형 실사진+누끼 투명 PNG)를 재확보하는 것부터 시작한다.
- 자기선언 — sourceNote 배치: split-screen 에서 미디어 패널과 겹치지 않는 위치 계약(콘텐츠 패널 하단 고정 등 — 착수 시 실렌더로 수렴), nav-overlap 검사 통과 유지.
- 검토 후 제외: 전환 이펙트 종류 확장(slide/zoom 등) — 보간 1종 안정화 후 수요 확인.

## 결정 로그
- status: resolved
- **범위 = ① 덱 자체 품질 업그레이드의 표현 기계 축** — 사용자 확정 2026-07-31. Auto-Animate 는 HU2 계획의 finding 큐 이월(당시 "수요 확인 후" — 이번 goal 이 그 수요).
- animId 필드 문법·리사이즈 상한(×2)·webp 품질값 = 기술/튜닝값 (에이전트 결정, 기록만).

## Step 트리

- [x] **step-1 — 장간 요소 연속 전환 (Auto-Animate 상당)**
  - Artifact: `slides.schema.json` `animId` 필드 + shell 전환 배선(View Transitions 실측 판정 포함) + `references/rendering-contract.md`·`references/layouts.md` 계약 절 + fixture 전환 장쌍.
  - Files: write custom-skills `templates/slides.schema.json`·`templates/src/shell.mjs`·`references/rendering-contract.md`·`references/layouts.md`. read `research/2026-07-31-html-upgrade-goal-refs.md` §1.
  - Risk: 위험 (shell 내비·전환 공통 로직 — HU4 동기 수리 5건과 상호작용, 실크롬 file:// 환경차 전례)
  - Dependencies: 없음
  - Verify: chromium 실구동 file:// 전환 장쌍 육안+콘솔 에러 0 + **실크롬 확인**(Claude in Chrome `/chrome` 네이티브 통합으로 file:// 전환 실측 — HU4 전례: Playwright 는 실크롬 환경차를 못 잡는다, 전역 규약 "Playwright 로 실크롬 대체 금지") + HU4 재현 테스트 5종 회귀 PASS + animId 미사용 덱 산출 무변화(diff 0) + export 픽셀 diff 콘텐츠 무변.
  - Failure probe: file:// cross-document View Transitions 미지원 판명 시 폴백 경로로 전환하고 판정 근거(실측 로그)를 changeset 에 기록 — 미지원인데 지원 가정으로 배포하는 것이 실패 모드. 실크롬 확인 불가 시(통합 미가동) 그 사실을 evidence 에 명시하고 사용자 관측(DQ3)으로 이월.
  - Commit: changeset `20260731-dq2-expressive-mechanics` (README 절: step-1).
- [x] **step-2 — 이미지 최적화 빌드 + sourceNote 배치 수리**
  - Artifact: 검증용 이미지 재확보(imagery.md 3원천 — 대형 실사진+누끼, 라이선스 장부 포함) + 이미지 최적화 스크립트(opt-in `tools/optimize-images.mjs`, sharp — pptxgenjs 선례 패턴) + `references/imagery.md` 처리 규율 절 + split-screen sourceNote 배치 수리(css.mjs).
  - Files: write custom-skills `templates/`(스크립트·css.mjs)·`references/imagery.md` + fixture 덱 assets(재확보 이미지). read `references/imagery.md`(3원천 절차)·`references/verification.md`(의존성 선례).
  - Risk: 위험 (빌드 파이프·공통 css 편집 — 전 덱 표면)
  - Dependencies: step-1
  - Verify: HU3 fixture 재빌드 — 최적화 후 용량 실측 비교(전/후 바이트) + 실렌더 화질 육안 + split-screen sourceNote 미겹침 스크린샷 + overflow/nav-overlap PASS + 이미지 없는 덱 산출 무변화.
  - Failure probe: webp 재인코딩이 스크림·투명 PNG(누끼)를 깨지 않는지 — 누끼 fixture 로 알파 보존 확인. 원본 보존 경로가 export-standalone 인라인 대상에서 제외되는지(중복 인라인 방지).
  - Commit: changeset 동일 (README 절: step-2).

## 검증/DoD
- **DoD**: 연속 전환이 opt-in 으로 라이브에서 동작(또는 file:// 제약 실측 근거와 함께 폴백 확정)하고, 이미지 최적화가 실측 용량 개선을 내며, sourceNote 겹침이 해소된다 — fixture 통합 검증 + HU4 회귀 5종 PASS + 미사용 덱 무변화.
- **Evidence**: `evidence/deck-quality/dq2-expressive-mechanics.md`
- **회귀 게이트**: HU4 재현 테스트 5종(POSTMESSAGE-SYNC·IFRAME-GUARD·TWO-DECKS·SYNC-LAG·PREVIEW-FOUT) + 미사용 fixture diff 0.

## 수치 출처
- HU3 fixture 이미지 현행 용량 실측: `du -sb decks/*/assets` (착수 시 실측).
- standalone 현행 크기 2.92MB = `ls -la decks/askewly-design-intro/export/askewly-design.standalone.html` (2026-07-31 실측).

## 재생성 장벽
- step-2 배포 후 배포본 검증.

## finding 큐
- 동영상 에셋 파이프 — 수요 미확인.

## 진행 로그
- 2026-07-31 작성 — goal 연쇄 2/3.
