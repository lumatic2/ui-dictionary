# 완료 — M25 harvest 배치 4 — 이월 재고 완주 (three.js 씬·Palette Generator·Cursor Field·brain 모달/HUD)

> work-id: m25-harvest-batch4 · plan: archive/plans/2026-08-04-m25-harvest-batch4.md · changeset: changesets/20260804-m25-harvest-batch4 · 2026-08-04

## 1. 결과

- **registry 48 → 55 (+7)**: glow-points-scene+impl(brain three.js — Points 단일 드로우콜 셰이더·발광 엣지·UnrealBloom, lazy 분리·WebGL 폴백) · palette-generator-core+color-palette-generator(코어 lib 정본 이전+도구 추출) · cursor-reactive-field(추출) · auth-gate-modal·focus-hud-overlay(brain 시맨틱 재작성). meta.harvest 전건.
- M22 이월 C1·C2·C5 전건 소진 — harvest 이월 재고 큐가 비었다.
- 게이트 부수 확장 2건: three 씬이 M24 2경로(선언 npm 의존·등재 자산 참조)의 첫 실전 소비자 + `react-dom` 기본 표면 편입(flushSync — react 동봉 보장).
- 사용자 관측 1회 통과(2026-08-04 "그래 통과" — 보드 artifact 5ae085df M25 섹션).
- 구현됨·미검증: shadcn CLI 실설치 경로(M24 와 동일 — npm publish 전 로컬 한정, M26 이 해소 예정).

## 2. 이슈와 해결

- fresh 검증자 적발 3건 사전 반영: 가짜 의존 간선(2·3·4 상호 무의존) 정정 · 재생성 장벽 의미(최종 확인 1회) 명시 · WebGL 폴백 probe 를 `addInitScript` getContext 스텁으로 결정화(소프트웨어 래스터라이저 우회 차단).
- color-palette-generator 의 `react-dom`(flushSync) import 가 게이트 FAIL → 선언 의존이 아니라 기본 표면 판정(react 와 동봉 보장) — ALLOWED 편입 + dependencies 산출 제외, 기존 53건 diff 0 확인.
- generate-registry 실행 시 EPERM — E2E 용 `python -m http.server` 가 public/r 점유 → 프로세스 종료 후 정상. 교훈: 재생성 전 서빙 프로세스 정리.
- 이월 잔여(씬 계약 밖 명시): brain 2D 폴백(force-graph)·3D 라벨 오버랩 회피·씬 raycast hover — 씬 자산의 1차 계약은 렌더, 인터랙션은 소비자 몫.
- 크기 회고: milestone 판정 적정 — 독립 step 5·통합 검증·단독 capability(three 씬·프로덕션 도구 진입), changeset 1 디렉터리·커밋 5.

## 3. 증거

- 실표면: 로컬 프로덕션 빌드 프리뷰(:4323) Colors 페이지 실렌더 + 라이브 프로드(ui.askewly.com/colors) 풀페이지 대조 동일 — 신규 registry 라이브 반영은 M25 마감 push 후 CF Pages 자동 배포.
- 재현: `node scripts/generate-registry.mjs && cd examples/ui-vocabulary-site && npm run lint && npm run build` (55 assets·0 violations·759 routes) + 신선 E2E 는 harvest-contract 부록 8단(로컬 registry 서빙→7종 fetch→시간차·실발화).
- fetch 의존 체인 전건 해석: wrapper→`/r/glow-points-scene-impl.json` · 도구→`/r/palette-generator-core.json` · 모달→button/input · impl deps `["three"]` (fetch 로그).
- 실발화 측정: 커서 필드 점등 0→54(글리프 o/>/_ 3종)→감쇠 13 / 모달 aria-modal·포커스 Email 착지·닫기 3경로(Esc·백드롭·X)·경로 해석 3종 / HUD pointer-events none·배지 "7 memories activated"·Clear 숨김 / 팔레트 Generate FF99C8→12130F·잠금 생존·셰이드 10단·토스트 "Color copied to clipboard" / 씬 시간차 element 스크린샷 2장 상이(43,698≠45,420 bytes — 궤도/breath)·WebGL 스텁 시 폴백 노드·canvas 0.
- 통합 E2E: 7종 fetch 전건 ok·tsc 무오류·콘솔 에러 0·시간차 풀페이지 2장(t=2.5s/7.5s, scratchpad m25-e2e-t1/t2.png·m25-glow-t1/t2.png).
- 커밋: 563ed27(step-1)·cca700f(step-2)·dd5b321(step-3)·8b9a490(step-4)·dc802b3(step-5) · 상세 evidence: evidence/harvest/m25-batch4.md
