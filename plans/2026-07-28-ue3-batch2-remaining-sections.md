# PLAN — UE3 배치 2(확대): 남은 Page Sections 14종 레퍼런스 → 데모 정비

> 생성: 2026-07-28 · 갈래: product 기능/화면 + 리서치 · scope 결정: **사용자 지시(2026-07-28 원문: "이제 배치단위로 끊지 말고, 더 큰 범위로 진행해줘")** — 구 배치 2·3·4 분할을 접고 남은 14종을 이 한 계획으로 소진한다. 이 배치가 끝나면 milestone UE3 을 닫는다.
Status: approved (2026-07-28 — UE1 승인 연쇄 `--chain UE2,UE3,UE4` 의 UE3 집행 + 확대 범위는 사용자 명시 지시. 새 사용자 소유 결정 없음)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절)
- **goal**: `ui-encyclopedia` — "헤더, 푸터 종류와 디자인 레퍼런스들도 볼 수 있는"(사용자 원문)의 Page Sections 전체 확장.
- **milestone**: UE3 — Page Sections 전체 레퍼런스 → 직접 구현 데모. 배치 1(헤더/푸터) 완료 — **이 plan = 남은 14종 전부.**
- **리서치 입력**: 실측 — 남은 14 컬렉션: Hero·Feature·Pricing·CTA·Bento·Newsletter·Stats·Testimonials·Blog·Contact·Team·Content·Logo Clouds·FAQs (`marketingSectionPages`). 배치 1 방법(장부 대조 → 갭 도출 → 갭 변형 구현 + 설명 차별화)이 사람 관측으로 검증됨 — 같은 방법을 14종에 적용.

## Scope Boundary
- **포함**: ① 14종 통합 레퍼런스 장부(카테고리당 대조·갭 도출) ② 갭 변형 구현 + 안내문·설명 차별화(O10 방지) — 3그룹으로 나눠 구현 ③ 통합 검증 + 사람 관측 1회(마지막에 몰기 — 사용자 지시 반영) ④ UE3 milestone 마감.
- **제외**: Pro 잠금(UE4) · 신규 페이지 타입 · Elements/Page Examples 컬렉션(Page Sections 16종 밖) · 기존 변형 삭제.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: 변형은 variant 단위 추가·수정 — variant 단위 revert 가능. 기존 변형 삭제 없음.

## 스캐폴딩 결정
- source-of-truth: 데모 변형 정본 `src/components/marketing-section-preview.tsx` + `marketingSectionPages`(App.tsx). 장부 `research/2026-07-28-ue3-batch2-references.md`.
- 검증: `@askewly/design verify`(신규·수정 코드) + Playwright(컬렉션별 렌더·예제 수·콘솔 에러) + build·lint·tsc. 최종 사람 관측 1회.
- 배포/운영: 로컬 검증까지 (push 는 세션 일괄 규약).
- 자기선언 도메인 — **저작권 경계**: 레퍼런스는 참고·재해석만 — 스크린샷 게재·픽셀 복제 금지. 장부에 출처 URL+접근일.
- 자기선언 도메인 — **변형 차별성(O10)**: 카테고리마다 변형 이름·한 줄 정의·시각이 서로 구분. 관측 과업에 명시 포함.
- 자기선언 도메인 — **번들 크기**: `marketing-section-preview` lazy 청크(현재 ~941kB)가 커진다 — build 후 청크 크기를 장부에 기록하고, 1.3MB 초과 시 카테고리 분할을 finding 큐로 올린다(이번 범위에서 분할 강행하지 않음).
- 검토 후 제외: 인증·결제(UE4)·DB(해당 없음). 디자인 게이트: askewly-design 진입 완료 세션 연속.

## 결정 로그
- status: resolved
- **범위 확대**: 사용자 명시 지시(2026-07-28) — 배치 분할 폐지, 남은 14종 일괄. 사람 관측도 그룹별이 아니라 최종 1회.
- **그룹 구현 순서**: A 전환 축(Hero·CTA·Pricing) → B 증거 축(Feature·Bento·Stats·Testimonials) → C 콘텐츠 축(Newsletter·Blog·Contact·Team·Content·Logo Clouds·FAQs). 순서는 노출 빈도 기준 — 기술 결정.
- **장부 밀도**: 카테고리당 레퍼런스 ≥3(공통 트렌드 소스는 공유 가능) + 패리티 원본 대조 + 갭 판정(갭 없음이면 근거 명시). 배치 1의 ≥6 은 2 카테고리 기준 — 14종에 같은 밀도는 장부가 목적을 초과한다(기술 결정).
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 통합 레퍼런스 장부 (14종)**
  - Artifact: `research/2026-07-28-ue3-batch2-references.md` — 14 카테고리 각각: 기존 변형 전수 나열 + 레퍼런스(카테고리당 ≥3, URL+접근일) + 갭 판정(신규 변형 후보 또는 "갭 없음" 근거) + O10 중복감 점검 메모.
  - Files: write `research/2026-07-28-ue3-batch2-references.md`. read `src/App.tsx`(marketingSectionPages)·`src/components/marketing-section-preview.tsx`(변형 목록).
  - Risk: 없음 (문서만)
  - Dependencies: 없음
  - Verify: 14 카테고리 전부 절 존재, 전 레퍼런스 URL+접근일, 카테고리별 갭 판정 명시.
  - Failure probe: URL 없는 인용 = 전역 인용 규칙 위반 — 장부 무효. 대조 없이 "충분"으로 닫은 카테고리 무효.
  - Commit: changeset `ue3-batch2-remaining-sections` (README 절: step-1).

- [x] **step-2 — 그룹 A 구현: Hero · CTA · Pricing**
  - Artifact: 장부 갭 변형 구현(실사 mock·라이트/다크) + 안내문·기존 설명 차별화. 카테고리당 갭 변형 ≥1 또는 "갭 없음" 근거.
  - Files: write `src/components/marketing-section-preview.tsx`, `src/App.tsx`(데이터·안내문). read 장부.
  - Risk: 위험 (기존 변형 수정이 타 컬렉션·홈 쇼케이스 재사용 중이면 회귀 — 수정 variant 사용처 grep 을 Verify 에 포함)
  - Dependencies: step-1
  - Verify: Playwright — 3 컬렉션 렌더·예제 수·신규 변형 렌더·콘솔 에러 0. 수정 variant 사용처 grep 기록. 디자인 verify 신규·수정 코드 PASS. tsc·build·lint PASS.
  - Failure probe: 신규 변형이 기존과 같은 골격이면 O10 재발 — 스크린샷 대조로 적발.
  - Commit: changeset `ue3-batch2-remaining-sections` (README 절: step-2).

- [x] **step-3 — 그룹 B 구현: Feature · Bento · Stats · Testimonials**
  - Artifact: step-2 와 동일 계약 — 4 카테고리.
  - Files: write `src/components/marketing-section-preview.tsx`, `src/App.tsx`. read 장부.
  - Risk: 위험 (step-2 와 동일 — 수정 variant 재사용 회귀, 동일 절차)
  - Dependencies: step-1
  - Verify: Playwright — 4 컬렉션 렌더·예제 수·신규 변형·콘솔 에러 0. grep 기록. 디자인 verify·tsc·build·lint PASS.
  - Failure probe: step-2 와 동일.
  - Commit: changeset `ue3-batch2-remaining-sections` (README 절: step-3).

- [x] **step-4 — 그룹 C 구현: Newsletter · Blog · Contact · Team · Content · Logo Clouds · FAQs**
  - Artifact: step-2 와 동일 계약 — 7 카테고리.
  - Files: write `src/components/marketing-section-preview.tsx`, `src/App.tsx`. read 장부.
  - Risk: 위험 (동일)
  - Dependencies: step-1
  - Verify: Playwright — 7 컬렉션 렌더·예제 수·신규 변형·콘솔 에러 0. grep 기록. 디자인 verify·tsc·build·lint PASS.
  - Failure probe: step-2 와 동일.
  - Commit: changeset `ue3-batch2-remaining-sections` (README 절: step-4).

- [ ] **step-5 — 통합 검증 + 사람 관측 + UE3 마감**
  - Artifact: 통합 시나리오(사이드바→14 컬렉션 순회) 로그 + build 청크 크기 기록 + **사람 관측 1회**(과업: "컬렉션들 훑어봐 주세요 — 카테고리마다 변형이 서로 달라 보이고 새 변형이 어색하지 않나요?") 발화 기록. 통과 시 UE3 milestone 완료 처리.
  - Files: write `evidence/ui-encyclopedia/ue3-batch2.md`.
  - Risk: 없음 (관측·기록 중심)
  - Dependencies: step-2, step-3, step-4
  - Verify: 통합 Playwright PASS(원문 기록) · build·lint PASS · 사람 관측 기록 존재(발화 인용).
  - Failure probe: 사람 관측 없이 닫으면 무효(O10·RU1 구조 — 기계 PASS 를 사람이 뒤집는다).
  - Commit: changeset `ue3-batch2-remaining-sections` (README 절: step-5).

## 검증/DoD
- **DoD**: 14종 장부(카테고리당 ≥3 레퍼런스·갭 판정)가 있고, 갭 변형이 구현되고, 안내문·설명이 차별화되고, 통합 검증 + 사람 관측 1회를 통과한다. 통과 시 **UE3 milestone 을 닫는다**(배치 1+2 = Page Sections 16종 전부).
- **Evidence**: `evidence/ui-encyclopedia/ue3-batch2.md`
- **회귀 게이트**: build·lint·tsc + 디자인 verify(신규·수정분) + UE5 라우팅 회귀(경로 진입 스모크 포함).

## 수치 출처
- 14종·16종: `grep -o 'navFilter("plus-marketing-[a-z-]+")' src/App.tsx`(marketingSectionPages 정의 구간 2809~3460) — Page Sections 16 컬렉션 중 header-sections·footers 는 배치 1 완료, 잔여 14.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 (사용자 확대 지시 반영 — 구 배치 2·3·4 통합).
