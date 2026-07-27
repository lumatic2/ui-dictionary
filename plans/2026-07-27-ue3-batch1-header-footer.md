# PLAN — UE3 배치 1: Header Sections · Footers 레퍼런스 → 데모 정비

> 생성: 2026-07-27 · 갈래: product 기능/화면 + 리서치 · scope 결정: 배치 1(헤더/푸터)만 — Page Sections 나머지 14종은 배치 2+ 로 별도 plan doc 승인. milestone UE3 은 전 배치 소진 시에 닫는다.
Status: approved (2026-07-27 — UE1 승인 연쇄 `--chain UE2,UE3,UE4` 집행 + 배치 1 우선은 goal 결정 ③ 확정분. 새 사용자 소유 결정 없음)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절)
- **goal**: `ui-encyclopedia` — "헤더, 푸터 종류와 디자인 레퍼런스들도 볼 수 있는"(사용자 원문).
- **milestone**: UE3 — Page Sections 전체 레퍼런스 → 직접 구현 데모 (배치식). **이 plan = 배치 1.**
- **리서치 입력**: 실측 — Header Sections 기존 8예제·Footers 기존 7변형 존재. **O10**(관측 3회차): "이게 헤더가 맞아? hero 아님? 몇 개는 그냥 똑같이 생겼는데" — 분류 설명 부재 + 변형 차별성 미달이 확인된 결함.

## Scope Boundary
- **포함**: ① 헤더/푸터 레퍼런스 헌팅 장부(Dribbble·Pinterest·실제 제품, 출처 URL+접근일) ② Header Sections 정비 — hero 와의 구분 설명 명시 + 중복 변형 차별화 + 레퍼런스 대조 갭 변형 추가 ③ Footers 레퍼런스 대조 점검·갭 보강 ④ 통합 검증 + 사람 관측.
- **제외**: Page Sections 나머지 14종(배치 2+, 별도 plan) · Pro 잠금(UE4) · 신규 페이지 타입.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: 데모 변형은 variant 단위로 추가·수정 — variant 단위 revert 가능. 기존 변형 삭제는 하지 않는다(차별화 수정만).

## 스캐폴딩 결정
- source-of-truth: 데모 변형의 정본은 `src/components/marketing-section-preview.tsx`(UE5 분리 모듈) + `marketingSectionPages` 데이터(App.tsx). 레퍼런스 장부는 `research/2026-07-27-ue3-batch1-references.md`.
- 검증: `@askewly/design verify`(신규·수정 변형 코드) + Playwright(컬렉션 페이지 렌더·변형 수) + build·lint·tsc. 최종 사람 관측.
- 배포/운영: 로컬 검증까지.
- 자기선언 도메인 — **저작권 경계**: 레퍼런스는 참고·재해석만 — 스크린샷 게재·픽셀 복제 금지(사용자 확정 ⑤). 장부에 출처 URL+접근일, 데모에는 "무엇을 참고해 어떻게 달리했나" 한 줄.
- 자기선언 도메인 — **변형 차별성(O10)**: 각 변형은 이름·한 줄 정의·시각이 서로 구분돼야 한다. 관측 과업에 "이제 서로 달라 보이나"를 명시 포함.
- 자기선언 도메인 — **분류 명료성(O10)**: Header Section(페이지 머리말)과 내비바 Header(Elements)의 구분을 컬렉션 페이지 안내문에 명시한다.
- 검토 후 제외: 인증·결제(UE4)·DB(해당 없음). 디자인 게이트: askewly-design 진입 완료 세션(N-0 화면·DESIGN.md SoT — UE2 와 동일 컨텍스트 연속).

## 결정 로그
- status: resolved
- **배치 순서(전체)**: 배치 1 헤더/푸터(확정) → 배치 2 Hero·CTA·Pricing → 배치 3 Feature·Bento·Stats·Testimonials → 배치 4 Newsletter·Blog·Contact·Team·Content·Logo Clouds·FAQ. 배치 2+ 는 각 착수 시 plan 승인으로 확정 — 순서 변경은 그때 사용자 확인.
- **기존 변형 처리**: 삭제하지 않고 차별화·설명 보강 — 이미 커밋된 자산 보존(레포 관례).
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [ ] **step-1 — 레퍼런스 헌팅 장부 (헤더/푸터)**
  - Artifact: `research/2026-07-27-ue3-batch1-references.md` — 헤더 계열·푸터 계열 레퍼런스 각 6건 이상(Dribbble·Pinterest 탐색 + 실제 제품 사이트), 항목당 출처 URL·접근일·관찰 노트(구조·차별 요소)·우리 기존 변형과의 대조(있음/갭). 갭 목록이 step-2·3 의 입력.
  - Files: write `research/2026-07-27-ue3-batch1-references.md`. read `src/components/marketing-section-preview.tsx`(기존 변형 목록).
  - Risk: 없음 (문서만)
  - Dependencies: 없음
  - Verify: 장부에 헤더 ≥6·푸터 ≥6 항목, 전 항목 URL+접근일 존재, 기존 변형 대조표(기존 8+7 변형 전수 vs 레퍼런스) 포함, 갭 ≥2 도출(없으면 "갭 없음" 근거 명시).
  - Failure probe: URL 없는 항목이 있으면 전역 인용 규칙 위반 — 장부 무효.
  - Commit: changeset `ue3-batch1-header-footer` (README 절: step-1).

- [ ] **step-2 — Header Sections 정비 (O10 해소 + 갭 변형)**
  - Artifact: ① 컬렉션 페이지 안내문에 "Header Section = 페이지 머리말 섹션, 내비바는 Elements > Headers" 구분 명시 ② 기존 8예제 중 서로 똑같아 보이는 것들의 시각·카피 차별화 ③ step-1 갭 변형 ≥1 신규 구현(실사 mock 데이터·라이트/다크).
  - Files: write `src/components/marketing-section-preview.tsx`(변형 수정·추가), `src/App.tsx`(`marketingSectionPages` 헤더 항목 데이터·안내문). read `research/2026-07-27-ue3-batch1-references.md`.
  - Risk: 위험 (기존 변형 수정이 다른 컬렉션·홈 쇼케이스에서 재사용 중이면 회귀 — 수정 전 variant 사용처 grep 을 Verify 에 포함)
  - Dependencies: step-1
  - Verify: Playwright — `/patterns/marketing-header-sections` 렌더·예제 수 ≥9(기존 8+신규 ≥1)·안내문 노출, 각 변형 시각 구분(스크린샷 라이트/다크). 수정 variant 의 타 사용처 grep 결과 기록. 디자인 verify 신규·수정 코드 PASS. build·lint·tsc PASS.
  - Failure probe: 신규 변형이 기존 것과 같은 레이아웃 골격이면 O10 재발 — 스크린샷 대조에서 적발한다.
  - Commit: changeset `ue3-batch1-header-footer` (README 절: step-2).

- [ ] **step-3 — Footers 점검·갭 보강**
  - Artifact: 기존 7변형의 레퍼런스 대조 결과(장부 기준 충분/갭)와, 갭이 있으면 변형 ≥1 신규 구현. 컬렉션 안내문 정비.
  - Files: write `src/components/marketing-section-preview.tsx`, `src/App.tsx`(푸터 데이터·안내문). read `research/2026-07-27-ue3-batch1-references.md`.
  - Risk: 위험 (step-2 와 동일 — 수정 variant 재사용 회귀. 동일 절차로 잡는다)
  - Dependencies: step-1
  - Verify: Playwright — `/patterns/marketing-footers` 렌더·예제 수(갭 보강 반영)·안내문. 스크린샷 라이트/다크. 디자인 verify·build·lint·tsc PASS.
  - Failure probe: 장부 대조 없이 "충분하다"로 닫으면 무효 — 대조표가 장부에 실재해야 한다.
  - Commit: changeset `ue3-batch1-header-footer` (README 절: step-3).

- [ ] **step-4 — 통합 검증 + 사람 관측**
  - Artifact: 통합 시나리오(사이드바→Header Sections→Footers 열람) 로그 + **사람 관측 1회**(과업: "헤더 목록 다시 봐주세요 — 이제 hero 와 구분되고 서로 달라 보이나요? 푸터도요") 발화 기록 evidence.
  - Files: write `evidence/ui-encyclopedia/ue3-batch1.md`.
  - Risk: 없음 (관측·기록 중심)
  - Dependencies: step-2, step-3
  - Verify: 통합 Playwright PASS(원문 기록) · build·lint PASS · 사람 관측 기록 존재(발화 인용).
  - Failure probe: 사람 관측 없이 닫으면 무효 (O10 이 정확히 사람만 잡은 결함이었다).
  - Commit: changeset `ue3-batch1-header-footer` (README 절: step-4).

## 검증/DoD
- **DoD (배치 1)**: 레퍼런스 장부(헤더·푸터 각 ≥6, URL+접근일)가 있고, Header Sections 가 분류 안내·변형 차별화·갭 변형 추가로 정비되고, Footers 가 대조·보강되며, 사람 관측 1회로 확인된다. milestone UE3 은 이 배치로 닫지 않는다(전 배치 소진 시).
- **Evidence**: `evidence/ui-encyclopedia/ue3-batch1.md`
- **회귀 게이트**: build·lint·tsc + 디자인 verify(신규·수정분) + UE5 회귀 스위트.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-27 작성 (연쇄 집행 — 배치 1).
