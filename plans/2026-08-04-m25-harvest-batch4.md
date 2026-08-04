# PLAN — M25: harvest 배치 4 — 이월 재고 완주 (three.js 씬·Palette Generator·Cursor Field·brain 모달/HUD)

> 생성: 2026-08-04 · 산출물: changeset (승격 자산 7 실물) · scope 결정: M22 이월 C1·C2·C5 전건 — 사용자 지시 2026-08-04 "1,2번 ㄱㄱ" (배치 4 + CLI 출고 연쇄, M26 과 chain).
> milestone-레벨 durable plan doc.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M25+M26 연쇄)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — 회수 루프 4회차, 이월 재고 완주 (← `CLAUDE.md` 「북극성」 절). 배치 1~3이 난도 하·중을 회수했고, 이번은 남은 난도 중상 3묶음이다.
- **milestone**: C5(본체 Cursor-Reactive Field + brain 인증 모달·HUD) → C1(brain 발광 포인트 클라우드 three.js 씬) → C2(본체 Color Palette Generator) 순서로 승격한다. C1 은 M24 가 만든 게이트 2경로(선언 npm 의존 + 등재 자산 참조)의 첫 실전 소비자 — 사이트 선례(lazy-three-object-scene → impl 분리)를 그대로 따라 wrapper+impl 2자산으로 만든다. 리프 판정 근거: 독립 step 5 + 통합 검증 + 단독 capability(three.js 씬·프로덕션 도구가 저장고에 진입).
- **조사 인용**: `research/2026-08-04-m22-harvest-mining-ledger.md` ③(three.js 씬 file:line)·④+추가(인증 모달·HUD)·C 이월표 + 본체 채굴 절(Cursor Field·Palette Generator). 실측(2026-08-04 계획 시): ColorPaletteGeneratorDemo 는 `colors-page.tsx` 도 소비(공유 헬퍼 4종 포함) — 추출 시 양쪽 import 전환 필요. `@/lib/palette-generator`(354줄)는 purity 밖이라 등재 코어로 승격해 참조한다.

## run 전 scope 결정 (확정)

- **결정**: 승격 실물 7 = cursor-reactive-field(추출) · auth-gate-modal·focus-hud-overlay(brain 재작성 2) · glow-points-scene+glow-points-scene-impl(C1, 2) · palette-generator-core+color-palette-generator(C2, 2). **제외**: brain 2D 폴백(force-graph)·라벨 오버랩 회피(three 씬 결합 — 후속 판단)·worker 백엔드 전건.
- **execution mode**: `continuous`
- **중단점**: completed / blocked / decision_required / risk_gate / user_stopped. human gate = step-5(관측).
- **rollback/cleanup**: 커밋 단위 revert. registry diff-0 게이트·홈/Colors 시각 회귀 스크린샷. E2E 는 scratchpad.

## 스캐폴딩 결정

- source-of-truth: 승격물 = `examples/ui-vocabulary-site/src/components/…`. brain 재작성은 viewer.html 마크업/CSS 를 React+시맨틱 토큰으로 정규화(계약 §3 — 다크 고정색은 M23 graph-legend-panel 선례대로 시맨틱 전환, 콘텐츠성 발광색만 로컬 변수).
- 검증: harvest-contract 부록 8단(diff 0·purity·build/lint·llms-sync·신선 E2E·시간차) + three 씬은 WebGL 실렌더 스크린샷 + 상호작용 실발화(팔레트 생성기 조작·모달 열닫).
- 배포/운영: registry·llms 재생성 커밋. push 는 M26 이 소비하므로 M25 마감 시 즉시.
- 위임: skip — 셰이더 이식·상태 분리 재설계는 판단 밀도 높음, 오케스트레이터 직접.
- 검토 후 제외: brain three 씬의 raycast hover 이식 — 씬 자산의 1차 계약은 렌더(발광 포인트+블룸)이고 인터랙션은 소비자 몫(문서에 명시).

## 결정 로그 (run 전 사전 소진)

- 결정 1 — 배치 구성 = C1·C2·C5 전건(실물 7): 사용자 지시("1,2번 ㄱㄱ")로 확정 → **확정**.
- 결정 2 — C1 착지 형태(기술): 사이트 선례 따라 wrapper(lazy)+impl(three 정적 import, dependencies ["three"]) 2자산. 데이터는 props(positions/colors/sizes), WebGL 미지원 시 정적 폴백 노드 → **확정**.
- 결정 3 — C2 lib 처리(기술): `@/lib/palette-generator` 를 등재 컴포넌트 파일 `palette-generator-core.tsx` 로 이동(정본 이전), 구 lib 경로는 re-export shim 으로 유지(타 소비처 무변경). 중복 사본 금지 → **확정**.
- 결정 4 — brain 재작성 스타일(기술): 시맨틱 토큰 정규화(다크 고정 아님 — 소비 프로젝트 테마 따름). 원본과 시각이 달라지는 것은 재작성 자산의 계약상 정상(출처는 meta.harvest) → **확정**.
- status: resolved

## Step 트리

- [x] **step-1 — C5-a: cursor-reactive-field 추출·등재**
  - Artifact: home-page 내장 Cursor-Reactive Field(포인터 추적 글리프 필드)를 독립 컴포넌트로 추출(M24 step-3 절차 준용 — 훅 인라인·시각 무변경), registry 등재(meta.harvest).
  - Risk: 위험 (홈 코드 이동 — 시각 회귀로 방어)
  - Files: write examples/ui-vocabulary-site/src/components/cursor-reactive-field.tsx. edit src/components/home-page.tsx, registry.json. run scripts/generate-registry.mjs.
  - Dependencies: none
  - Verify: build/lint PASS + 기존 48건 diff 0(순수 추가 1) + 홈 시각 회귀 + 중복 정의 grep 0.
  - Failure probe: 추출 파일 단독 렌더에서 포인터 이동 실발화(글리프 불투명도 변화 측정).
  - Commit: changeset `20260804-m25-harvest-batch4` (README 절: step-1).
- [x] **step-2 — C5-b: brain 인증 모달·HUD React 재작성·등재**
  - Artifact: viewer.html 의 인증 모달(이메일/Google/가입 요청 3버튼 + guest/authed 상태 스위칭)과 HUD(킥커+포커스 타이틀+활성 배지 오버레이)를 React+시맨틱 토큰으로 재작성 — `auth-gate-modal.tsx`·`focus-hud-overlay.tsx` 등재.
  - Risk: 기계적 (신규 파일 — 사이트 기존 화면 무변경)
  - Files: write examples/ui-vocabulary-site/src/components/{auth-gate-modal,focus-hud-overlay}.tsx. edit registry.json. run scripts/generate-registry.mjs.
  - Dependencies: none (step-1 과 기술 의존 없음 — 순차는 실행 편의)
  - Verify: purity PASS + diff 0(순수 추가 2) + build/lint + 단독 렌더 스크린샷(모달 열림/닫힘·guest↔authed 전환).
  - Failure probe: 모달 aria(role dialog·aria-modal·닫기 경로 2개 이상) 자기점검 — 미충족 시 수리.
  - Commit: changeset (README 절: step-2).
- [x] **step-3 — C1: 발광 포인트 클라우드 three.js 씬 2자산**
  - Artifact: brain 의 단일 Points+커스텀 vertex/fragment 셰이더(+LineSegments 엣지)+UnrealBloom 조합을 `glow-points-scene-impl.tsx`(three 정적 import, dependencies ["three"] — 씬 구성·셰이더·리사이즈·dispose) + `glow-points-scene.tsx`(lazy wrapper·WebGL 체크·정적 폴백) 로 독립화. threeState 전역 결합 제거 — 데이터는 props, 자체 rAF 루프.
  - Risk: 위험 (신규 npm 의존 자산 1호 — 게이트 2경로 실전 첫 소비)
  - Files: write examples/ui-vocabulary-site/src/components/{glow-points-scene,glow-points-scene-impl}.tsx. edit registry.json. run scripts/generate-registry.mjs.
  - Dependencies: none (fresh 검증자 반영 — step-2 와 기술 의존 없음, 순차는 실행 편의)
  - Verify: purity(impl 은 선언 의존·wrapper 는 등재 참조로 통과) + diff 0(순수 추가 2) + build/lint + 사이트 내 실렌더 스크린샷(발광 포인트+블룸 확인 — 데모 페이지 또는 단독 마운트) + 시간차 2장(자동 회전/breath 애니메이션 전이).
  - Failure probe: WebGL 강제 비활성 — Playwright `page.addInitScript` 로 `HTMLCanvasElement.prototype.getContext` 를 webgl/webgl2 요청 시 null 반환하도록 스텁한 뒤 렌더 → 폴백 노드 표시 확인(결정적 — 브라우저 소프트웨어 래스터라이저 우회 없음, fresh 검증자 반영).
  - Commit: changeset (README 절: step-3).
- [x] **step-4 — C2: Palette Generator 코어 승격 + 도구 추출·등재**
  - Artifact: `@/lib/palette-generator`(354줄) 내용을 `palette-generator-core.tsx` 로 이전(구 경로 re-export shim), home-page 의 ColorPaletteGeneratorDemo+헬퍼(getReadableTextColor·downloadPalettePng·buildPaletteSvg·shade/hex 유틸)를 `color-palette-generator.tsx` 로 추출(코어 참조·keyframe 내장), home-page·colors-page import 전환, 2자산 등재.
  - Risk: 위험 (Colors 페이지 공유 소비 — 양면 시각 회귀로 방어)
  - Files: write src/components/{palette-generator-core,color-palette-generator}.tsx. edit src/lib/palette-generator.ts(shim), src/components/home-page.tsx, src/components/colors-page.tsx, registry.json. run scripts/generate-registry.mjs.
  - Dependencies: none (fresh 검증자 반영 — 기술 의존 없음)
  - Verify: build/lint PASS + diff 0(순수 추가 2) + 홈 Atlas·Colors 페이지 추출 전후 스크린샷 시각 동일 + 중복 정의 grep 0(구 lib 는 shim 만).
  - Failure probe: 상호작용 실발화 — Generate 클릭 팔레트 교체·색 잠금·셰이드 패널 열닫·복사 토스트 측정.
  - Commit: changeset (README 절: step-4).
- [ ] **step-5 — 통합 E2E + 사용자 관측**
  - Artifact: 신선 프로젝트 이식 E2E(신규 7종 fetch — three 설치 포함·시간차·상호작용 실발화) + 관측 보드 갱신 + 사용자 관측 1회 + 이월 잔여(있다면) 명시.
  - Risk: 기계적
  - Files: scratchpad(fresh-harvest 재사용) · 보드 artifact.
  - Dependencies: step-1, step-2, step-3, step-4
  - Verify: fetch 전건 ok·tsc 0·콘솔 0 + three 씬 신선 렌더 실측 + 팔레트 생성기 조작 실발화 + 시간차 ≥2장 + 사용자 관측 기록.
  - Failure probe: three 씬은 정지 1장 판정 금지 — 회전/breath 전이 2장 대조(M21 교훈 준용).
  - Commit: changeset (README 절: step-5).

## 재생성 장벽

- after: step-1, step-2, step-3, step-4 · run: `node scripts/generate-registry.mjs && node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs`
- 의미(fresh 검증자 반영): 각 step 은 자기 등재분 재생성을 자체 수행한다(diff-0 판정 기준 = 그 step 직전 커밋). 이 장벽은 전 step 후 **최종 확인 1회**이지 유일한 재생성이 아니다.

## 검증/DoD

- **DoD**: 실물 7 전건 등재(registry 48→55) + 착지별 게이트 전 구간 + 신선 E2E 1회(three 렌더·상호작용 실발화·시간차) + 사용자 관측 1회. 실패 모드 검증 = WebGL 폴백 probe(step-3) + 모달 aria probe(step-2) + 중복 정의 probe(step-1·4).

## 수치 출처

- 이월 3묶음·실물 7 = M22 ledger C 이월표(C1·C2·C5) + 착지 분해(C1=2·C2=2·C5=3 — 계획 시 확정).
- lib 354줄 = `wc -l src/lib/palette-generator.ts`. colors-page 공유 소비 = `grep -rn 'from "@/components/home-page"' src/`(colors-page.tsx:10 — Demo+헬퍼 3종).
- 기존 48건 = M24 마감 시 `generate-registry: OK — 48 assets`.

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (승계) CLI verify chart.tsx 속성 셀렉터 오탐 · probe 원복 CRLF 오염 주의(M24 finding — 역편집 사용).

## 진행 로그 (append-only)

- 2026-08-04 · 계획 작성 — 실측: lazy-three-object-scene 선례(dynamic import 분리) 확인, colors-page 가 generator Demo+헬퍼 소비 확인, palette-generator lib 354줄, CLI 0.3.0(소스)=출고 대상 아님(M26 소관).
- 2026-08-04 · fresh 검증자 반영 3건 — 의존 간선 정정(2·3·4 상호 무의존), 재생성 장벽=최종 확인 1회 명시, WebGL 폴백 probe 를 getContext 스텁으로 결정화.
