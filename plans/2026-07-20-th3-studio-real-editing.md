# PLAN — TH3 스튜디오 토큰 구동 + 실편집

> 생성: 2026-07-20 · 갈래: product · scope 결정: 토큰 실배선·값 편집·이미지 교체·청사진 6종 선택·왕복 실측까지
Status: 승인 대기

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH3 — TPS3가 선언하고 구현하지 않은 "semantic token 변경"을 실제로 배선하고, 스튜디오를 편집 가능한 표면으로 만든다.

## Scope Boundary
- **결정**: 스튜디오는 계속 좁은 제품 표면이다. 범용 `apps/agent-design` 캔버스와 통합하지 않는다.
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

- [ ] **step-2 — edit-surfaces**
  - Artifact: semantic token 값 편집, 이미지 교체(로컬 파일), 청사진 6종 직접 선택·비교가 스튜디오에서 가능하다.
  - Files: read/write `apps/template-studio/src/**`(토큰 패널·이미지 컨트롤·청사진 선택기), 테스트.
  - Dependencies: step-1
  - Verify: Playwright로 ① 토큰 값 편집 → 렌더 반영 ② 이미지 교체 → 슬롯 이미지 변경 ③ 청사진 6종 전환 → 각각 nonblank 렌더 관측.
  - Failure probe: 지원하지 않는 파일 형식·과대 용량 이미지·잘못된 토큰 값(색이 아닌 문자열)이 명시 차단된다.
  - Commit: changeset `studio-edit-surfaces`.

- [ ] **step-3 — export-import-roundtrip**
  - Artifact: JSON/HTML/SVG 내보내기 → JSON 재가져오기 왕복이 Playwright로 실측되고, 편집 상태가 손실 없이 복원된다.
  - Files: read/write `apps/template-studio/src/exporters.ts`, Playwright 스펙.
  - Dependencies: step-2
  - Verify: 편집(텍스트+토큰+이미지) → JSON 다운로드 → 재가져오기 후 `templateSignature`와 화면 표시값이 편집 직후와 일치.
  - Failure probe: 깨진 JSON·스키마 불일치·필수 슬롯 삭제본을 가져오면 차단되고 기존 상태가 보존된다(부분 적용 금지).
  - Commit: changeset `studio-roundtrip-e2e`.

## 검증/DoD
- **DoD**: 스튜디오에서 토큰 값을 바꾸면 렌더가 실제로 바뀌고(computed style 관측), 이미지 교체·청사진 6종 선택이 되며, 편집 상태가 내보내기→재가져오기 왕복에서 손실 없이 복원된다.
- **Evidence**: `evidence/template-production-hardening/th3-studio.md` + Playwright 스크린샷

## finding 큐
- 실행취소/다시실행, 다중 선택, 슬롯 직접 드래그는 별도 후보.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
