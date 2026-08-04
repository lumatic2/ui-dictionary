# PLAN — M24: harvest 배치 3 — 본체 미등재 재고 회수 + motion 의존 게이트 확장

> 생성: 2026-08-04 · 산출물: changeset (registry 게이트 확장·승격 자산·knowledge) · scope 결정: 본체 미등재 마이크로 인터랙션 6종 + 미등재 데모 3종 추출·등재 + B4 그래프 스키마 knowledge = 10건. C1(three.js)·C2(Palette Generator)·C5 는 이월.
> milestone-레벨 durable plan doc. Claude/Codex 가 이 문서만 읽고 이어받는 단일 장부.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — 집행 10건+부속 1, C1·C2·C5 이월 확정)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — 회수 루프의 배치 반복 가동, 3회차 (← `CLAUDE.md` 「북극성」 절). 배치 1(M21 2건)·배치 2(M23 12건)에 이어 이번은 **본체 사이트 안에 이미 실존하는 미등재 재고**를 계약 그대로 회수한다.
- **milestone**: 2차 채굴이 적발한 본체 미등재 마이크로 인터랙션 6종(소스 실존·registry 부재)과 미등재 데모 3종(home-page.tsx 내장)을 registry 자산으로 승격하고, B4 그래프 스키마를 knowledge 로 착지한다. 이 중 3종이 `motion/react` 의존이라 plain-asset purity gate 에 블록 계약 §2 준용 선언 allowlist 를 먼저 놓는다. 리프 판정 근거: 독립 step ≥2(게이트 확장/6종 등재/데모 추출/knowledge/통합 검증) + 통합 검증 + 단독 capability(모션 계열 자산군이 저장고에 진입).
- **조사 인용**: `research/2026-08-04-m22-harvest-mining-ledger.md` 「2차 증보 채굴」 절(6종 카드 A-1~A-8·file:line 실측) + C 이월표(C3 데모 3종) + B4 행. `docs/design-system/harvest-contract.md` 부록 8단.

## run 전 scope 결정 (확정)

- **결정**: 집행 10건 = 미등재 마이크로 인터랙션 6종(magnetic-hover-button·spring-drag-snap-card·swipe-action-row-pattern·pull-to-refresh-list-pattern·staggered-entrance-group·bottom-sheet-detents) + 미등재 데모 3종 추출·등재(Coverflow·Hero Composition·Image Treatment) + B4 knowledge 1건. **제외(이월)**: C1 brain three.js 씬(threeState 강결합 — 독립화 별도 milestone 감), C2 Color Palette Generator(난도 상·수백 줄 도구), C5(Cursor-Reactive Field·brain 인증 모달/HUD), CLI npm publish, 사이트 공개 페이지 노출 변경.
- **execution mode**: `continuous`
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-5(승격 실물 관측).
- **진행 보고**: commentary only.
- **rollback/cleanup**: 커밋 단위 revert. registry 재생성은 기존 38건 diff 0 게이트(순수 추가 확인). 데모 추출은 home-page.tsx 시각 회귀 스크린샷으로 방어. E2E 신선 프로젝트는 scratchpad.

## 스캐폴딩 결정

- source-of-truth: 승격물 코드 = `examples/ui-vocabulary-site/src/components/…`(RC1 — 6종은 기존 파일 그대로, 데모 3종은 home-page.tsx 에서 추출한 신규 파일) · knowledge 착지 = `knowledge/` · 게이트 정본 = `scripts/generate-registry.mjs`.
- 검증: harvest-contract 부록 8단 전 구간(diff 0·purity·build/lint·llms-sync·신선 E2E·시간차 실브라우저 — 모션 자산 다수라 의무) + 게이트 확장분은 자기시험(미선언 npm import → FAIL 확인).
- 배포/운영: registry·llms 재생성 커밋. push 세션 일괄(승인 커밋은 M12 규약대로 즉시).
- 위임: skip — 게이트 확장·데모 추출은 판단 밀도가 높아 오케스트레이터 직접. E2E 스크린샷만 필요 시 playwright CLI 병렬.
- 검토 후 제외: CLI verify chart.tsx 속성 셀렉터 오탐 수리 — 이월 finding 유지(이번 배치와 독립, 섞으면 diff 대조가 흐려짐).

## 결정 로그 (run 전 사전 소진)

- 결정 1 — **배치 구성(사용자 소유)**: 추천 = 10건(6종+데모3+B4), C1·C2·C5 이월. 근거: 6종·데모 3종은 소스 실존이라 회수비 최저, C1·C2 는 각각 독립화·재설계가 필요해 배치에 섞으면 확실한 수확이 볼모가 된다 → **승인 게이트에서 확정**.
- 결정 2 — motion 의존 허용 방식(기술): 블록 계약 §2 준용 — plain asset 도 `item.dependencies` 선언 allowlist 로만 npm import 허용, 미선언은 여전히 FAIL. ALLOWED 정규식 무차별 확장은 하지 않는다(선언 없는 의존 유입 차단 유지) → **확정**.
- 결정 3 — 데모 3종 자산명(기술): `product-coverflow`·`hero-composition`·`image-treatment` 잠정 — 기존 자산 명명 결(kebab, 역할 명사구)에 맞춰 run 에서 최종화 → **확정(위임 범위)**.
- status: resolved
- (부기) 사용자 소유는 결정 1 하나 — 승인 질문에 포함해 매듭.

## Step 트리

- [x] **step-1 — plain-asset 게이트 확장 (선언 의존성 + 등재 자산 참조)**
  - Artifact: `generate-registry.mjs` plain-asset 경로가 블록 계약 §2 준용으로 두 가지를 읽는다 — ① `item.dependencies` 선언 npm allowlist(선언+실사용 대조, 선언·미사용도 FAIL) ② `@/components/<등재자산>` 참조 허용 → registryDependencies URL 파생(블록 buildBlock 과 동일 — 미등재 컴포넌트 참조는 여전히 FAIL). 기존 38건 산출 불변. (fresh 검증자 발견 1 반영: 6종 중 3종이 `@/components/device-frame` import — ② 없이는 재생성 전체가 크래시.)
  - Risk: 위험 (배포 게이트 변경 — diff 0 + 자기시험으로 방어)
  - Files: edit scripts/generate-registry.mjs. run scripts/generate-registry.mjs.
  - Dependencies: none
  - Verify: 재생성 후 기존 38건 `public/r/*.json` diff 0 + 자기시험 3건(미선언 motion import → FAIL / 선언·미사용 → FAIL / 미등재 컴포넌트 참조 → FAIL) 확인 후 원복.
  - Failure probe: 자기시험이 곧 실패 경로 검증 — FAIL 이 안 나면 게이트가 죽은 것이므로 중단·수리.
  - Commit: changeset `20260804-m24-harvest-batch3` (README 절: step-1).
- [ ] **step-2 — device-frame 부속 승격 + 미등재 마이크로 인터랙션 6종 등재**
  - Artifact: `device-frame` 을 부속 자산으로 선등재(3종의 참조 대상 — meta.harvest 본체 출처) 후 6종 registry.json 등재(meta.harvest 전건, motion 의존 3종은 dependencies 선언, device-frame 참조 3종은 step-1 ② 경로) — 소스는 기존 파일, 계약 §3 시그니처·reduced-motion·aria 준수 점검만(사이트 동작 무변경).
  - Risk: 위험 (registry 재생성 — diff 0 게이트로 방어)
  - Files: edit examples/ui-vocabulary-site/registry.json. read src/components/{device-frame,magnetic-hover-button,spring-drag-snap-card,swipe-action-row-pattern,pull-to-refresh-list-pattern,staggered-entrance-group,bottom-sheet-detents}.tsx. run scripts/generate-registry.mjs.
  - Dependencies: step-1
  - Verify: 기존 38건 diff 0(순수 추가 7) + purity PASS + 신규 `/r/*.json` 7건 존재(3종의 registryDependencies 에 device-frame URL 포함) + build/lint PASS.
  - Failure probe: 승격물 1건에 hex 리터럴 주입 → verify 적발 확인 후 제거(게이트 자기시험 — M21 선례).
  - Commit: changeset (README 절: step-2).
- [ ] **step-3 — 미등재 데모 3종 독립 추출 + 등재**
  - Artifact: home-page.tsx 내장 Coverflow·Hero Composition·Image Treatment 를 독립 컴포넌트 파일로 추출(purity 정규화 포함), home-page 는 신규 파일 import 로 전환(시각 무변경), registry 등재(meta.harvest). 얽힘 2건 처리(fresh 검증자 발견 3): ① 공유 훅 `usePrefersReducedMotion`(home-page.tsx:2787 지역 정의) → 추출 파일마다 인라인(자산 독립성 우선 — 계약 §3 정규화) ② `filters-wipe-sweep` keyframe(`src/index.css:1098` 전역 CSS — purity JS 검사 사각) → 추출 컴포넌트에 내장(인라인 style 태그 또는 tailwind arbitrary keyframe, run 최종화).
  - Risk: 위험 (홈 화면 코드 이동 — 시각 회귀 스크린샷으로 방어)
  - Files: write examples/ui-vocabulary-site/src/components/{product-coverflow,hero-composition,image-treatment}.tsx(명명 run 최종화). edit src/components/home-page.tsx, registry.json. run scripts/generate-registry.mjs.
  - Dependencies: step-2
  - Verify: build/lint PASS + 홈 데모 3종 추출 전후 스크린샷 시각 동일 + 기존 자산 diff 0(순수 추가 3) + purity PASS + image-treatment 는 신선 렌더에서 wipe 애니메이션 시간차 실측(전역 CSS 부재 환경 — step-5 에서 확정).
  - Failure probe: 추출 후 home-page 에 구 구현 잔존 여부 grep(중복 정의 0) — 잔존 시 제거.
  - Commit: changeset (README 절: step-3).
- [ ] **step-4 — B4 그래프 스키마 knowledge 착지**
  - Artifact: brain 그래프 연결 방식(노드 7타입+3계층 hierarchy+13관계) 결정표를 `knowledge/graph-content-schema.md` 로 착지 + llms FIXED_ASSETS 등재.
  - Risk: 기계적 (문서)
  - Files: write knowledge/graph-content-schema.md. edit scripts/generate-llms-txt.mjs. run scripts/generate-llms-txt.mjs, scripts/check-llms-sync.mjs.
  - Dependencies: none
  - Verify: llms.txt 에 신규 문서 노출 + check-llms-sync PASS.
  - Failure probe: FIXED_ASSETS 미등재 상태에서 llms.txt 부재 확인 후 등재(M21 선례).
  - Commit: changeset (README 절: step-4).
- [ ] **step-5 — 통합 E2E + 사용자 관측**
  - Artifact: 신선 프로젝트 이식 E2E(부록 8단 — 신규 10종 fetch·motion 설치 포함·시간차 스크린샷 의무) + 관측 보드 갱신 + 사용자 관측 1회 + 잔여 이월 기록.
  - Risk: 기계적 (검증·문서)
  - Files: scratchpad(신선 프로젝트 — fresh-harvest 재사용 가) · research ledger(이월 기록).
  - Dependencies: step-3, step-4
  - Verify: E2E 체인 전 구간 PASS(모션 자산은 시간차 ≥2장 상태 전이 실측) + 사용자 관측 기록.
  - Failure probe: 시간차 판정 — 정지 화면 1장 판정 금지(M21 terminal-demo-panel 실적발 교훈). 드래그·풀 계열은 스크립트 포인터 시뮬레이션으로 전이 유발.
  - Commit: changeset (README 절: step-5).

## 재생성 장벽

- after: step-1, step-2, step-3, step-4 · run: `node scripts/generate-registry.mjs && node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs`

## 검증/DoD

- **DoD**: 집행 10건 전건 착지(자산 10 등재 — 부속 device-frame 포함 + knowledge 1) + 게이트 확장 자기시험 3건 + 통합 E2E 1회(시간차 실측) + 사용자 관측 1회 + 잔여 이월 명시. 실패 모드 검증 = 게이트 자기시험(step-1·step-2 probe) + 데모 추출 중복 정의 probe(step-3).

## 수치 출처

- 집행 10건 = 미등재 6종(`node -e` registry.items 대조 — 6종 전건 `(none)`, total 38) + 데모 3종(`grep -n` home-page.tsx — 호출부 :923/:927/:943, 정의부 CoverflowDemo :1074·HeroCompositionDemo :1322·ImageTreatmentDemo :2325) + B4 1건(M22 ledger C 이월표).
- 기존 38건 = 위 같은 커맨드의 `total items: 38`.
- 자산 10 등재 = 6종 + device-frame 부속 1(3종의 참조 대상 — `grep -l device-frame src/components/*.tsx` 실측) + 데모 3종.

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (이월 승계) CLI verify chart.tsx 속성 셀렉터 오탐 — M21 finding.

## 진행 로그 (append-only)

- 2026-08-04 · 계획 작성 — 재료 실측: 6종 소스 실존·registry 38건 전건 미포함 확인, motion ^12.42.2 사이트 의존 실존, plain-asset ALLOWED 에 선언 allowlist 부재 확인(블록 분기만 보유), 데모 3종 home-page.tsx 내장(정의 :1074/:1322/:2325) 확인.
- 2026-08-04 · fresh 검증자 반영 3건 — ① 3종의 `@/components/device-frame` import 로 게이트 확장에 등재-자산 참조 경로 필수(step-1 ②·device-frame 부속 승격) ② 수치 출처 file:line 정정 ③ 데모 추출 얽힘 2건(공유 훅 인라인·전역 keyframe 내장) step-3 명시.
