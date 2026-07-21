# PLAN — TH3 AskewlyDesign 템플릿 편집 배선

> 생성: 2026-07-20 · 개정: 2026-07-20(편집 표면을 AskewlyDesign으로 단일화, 사용자 지시) · 갈래: product
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH3 — TPS3가 선언하고 구현하지 않은 "semantic token 변경"을 실제로 배선하고, 스튜디오를 편집 가능한 표면으로 만든다.

## Scope Boundary
- **결정 (2026-07-20 개정, 사용자 지시)**: 편집 표면은 **AskewlyDesign(`apps/agent-design` + `apps/agent-design-desktop`) 하나**다. `apps/template-studio`는 은퇴한다.
  - 근거: 컴파일된 템플릿의 `scene`은 이미 AskewlyDesign이 쓰는 `CanvasDocument`다 — 6종 전부 `validateDocument` VALID(실측). 포팅이 아니라 배선이다.
  - 근거: step-2로 만들려던 속성 편집·이미지 교체·레이어 조작은 AskewlyDesign에 이미 있다(`PropertyInspector`·`InsertPalette`·`LayersPanel`·실행취소). 스튜디오에 두 번째로 만드는 셈이었다.
  - 폐기된 구 결정: "스튜디오는 계속 좁은 제품 표면이다. 범용 캔버스와 통합하지 않는다." — 편집 표면 이원화는 이 horizon이 고치는 "선언과 구현이 갈라지는" 병리를 표면 수준에서 재생산한다.
- **유지되는 것**: step-1의 토큰 세트 정본(`packages/template-core/src/tokens.ts`)은 표면과 무관하게 그대로 쓴다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. Playwright 서버·다운로드 산출물은 각 실행 후 정리한다.

## 스캐폴딩 결정
- source-of-truth: 색·타이포의 정본은 **토큰 세트**다. 렌더러는 토큰을 조회해 값을 얻고, 어떤 색 리터럴도 컴포넌트에 두지 않는다.
- 검증: Vitest DOM + Playwright(desktop/mobile) — 토큰 값 변경 시 computed style 변화 관측, 내보내기→재가져오기 왕복.
- 배포/운영: 해당 없음 — 로컬 브라우저 앱. 공개 hosting 편입은 제외.
- 화면: 기존 3분할(레이어/캔버스/속성) 유지 + 청사진 선택기 + 토큰 패널 + 이미지 교체 컨트롤.
- 이미지 교체: 로컬 파일 선택 → data URI로 asset 교체. 원격 URL·업로드 서버는 제외.
- 디자인: 이 표면은 사람이 조작하는 화면이므로 UI 변경 전 `askewly-design` 스킬을 호출한다(전역 규약 — 화면 UI 대상).
- 검토 후 제외: 인증·다중 사용자·저장 서버·실행취소 스택 — 좁은 편집 루프 검증에 불필요. 관측·결제·DB — 걸리지 않음.

## 결정 로그
- status: resolved
- 하드코딩 팔레트(`App.tsx:8`)는 **삭제**한다. 토큰 조회 실패 시 조용한 폴백 색을 쓰지 않고 진단을 표시한다 — 조용한 폴백이 TPS3에서 결함을 숨겼다.
- 이미지 교체는 로컬 파일만. 생성 소재 연결은 TH5 소관.
- 사용자 결정 필요 항목 없음.

## Step 트리

- [ ] **step-1 — token-driven-render**
  - Artifact: 렌더러가 `tokenSetId`로 토큰 세트를 조회해 색·타이포를 결정하고, 하드코딩 팔레트가 제거된다.
  - Files: read/write `apps/template-studio/src/App.tsx` 및 분리될 렌더 모듈, 토큰 세트 소스; read `packages/template-core/src/types.ts`.
  - Dependencies: TH2 complete
  - Verify: Playwright로 토큰 값 변경 전후 캔버스 요소의 computed style이 **실제로 달라짐**을 관측. 소스에 색 리터럴 grep 0.
  - Failure probe: 존재하지 않는 `tokenSetId`를 주면 조용한 기본색이 아니라 진단 패널이 뜬다.
  - Commit: changeset `studio-token-driven-render`.

- [ ] **step-2 — template-gallery-in-app**
  - Artifact: AskewlyDesign에서 청사진 6종을 카드로 보고 고르면 그 템플릿이 캔버스 문서로 열린다. 토큰 세트도 앱에서 고른다.
  - Files: write `apps/agent-design/src/TemplatePicker.tsx`·`App.tsx`·`package.json`(template-core 의존 추가)·테스트; read `packages/template-core/src/**`.
  - Dependencies: step-1
  - Verify: Playwright로 6종을 각각 열어 캔버스 노드 수·서명이 청사진별로 **서로 다름**을 관측하고, 연 뒤 직접 조작(노드 이동)이 동작함을 확인.
  - Failure probe: 필수 content가 빠진 요청·없는 청사진 id를 주면 진단이 뜨고 **기존 캔버스가 보존된다**(빈 문서로 덮어쓰지 않는다).
  - Commit: changeset `askewly-design-template-gallery`.

- [ ] **step-3 — export-roundtrip + 스튜디오 은퇴**
  - Artifact: 내보내기(JSON/HTML/SVG)와 JSON 재가져오기가 AskewlyDesign에서 왕복 실측되고, `apps/template-studio`가 `archive/`로 은퇴한다.
  - Files: write `packages/template-core/src/exporters.ts`(스튜디오에서 이관)·`apps/agent-design/src/**`·Playwright 스펙; delete `apps/template-studio/`.
  - Dependencies: step-2
  - Verify: 템플릿 열기 → 캔버스에서 편집 → JSON 내보내기 → 재가져오기 후 서명·표시값이 편집 직후와 일치. 이관된 exporter는 기존 테스트가 그대로 통과.
  - Failure probe: 깨진 JSON·스키마 불일치본을 가져오면 차단되고 기존 문서가 보존된다(부분 적용 금지).
  - Commit: changeset `askewly-design-roundtrip-and-studio-retire`.

## 검증/DoD
- **DoD**: 토큰 세트를 바꾸면 렌더가 실제로 바뀌고(computed style 관측), AskewlyDesign에서 청사진 6종을 골라 캔버스로 열어 편집할 수 있으며, 편집 상태가 내보내기→재가져오기 왕복에서 손실 없이 복원된다. 편집 표면은 하나만 남는다.
- **Evidence**: `evidence/template-production-hardening/th3-studio.md` + Playwright 스크린샷

## finding 큐
- 실행취소/다시실행·다중 선택·슬롯 드래그는 AskewlyDesign이 이미 갖고 있다 — 별도 후보가 아니라 흡수 대상이었다(개정 근거).
- `apps/agent-design`의 시작 문서가 `createDocumentFixture(1000)`(성능용 더미)인 점은 step-2가 대체한다.

## 진행 로그
- 2026-07-20 계획 작성, 승인.
- 2026-07-20 step-1 완료 (changeset `20260720-studio-token-driven-render`, commit 02cb489).
- 2026-07-20 사용자 지시로 step-2·3 개정 — 편집 표면을 AskewlyDesign 단일로. 사용자 결정 2건: 스튜디오 은퇴 / 진입은 청사진 6종 갤러리.
