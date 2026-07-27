# PLAN — UE4: Pro 잠금 + 오너 언락

> 생성: 2026-07-28 · 갈래: product 기능/화면 · scope: 결제 없는 잠금 층 + 오너(사용자 본인) 전체 열람. UE1 승인 연쇄(`--chain UE2,UE3,UE4`)의 마지막 milestone — 사용자 "나머지도 진행하자"(2026-07-28)로 집행.
Status: approved (연쇄 승인 집행 — 새 사용자 소유 결정 없음, 기존 확정 3건 재사용)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "결제 사용자는 더 완전한 코드 복사·에셋 다운로드" 축의 전 단계.
- **goal**: `ui-encyclopedia` · **milestone**: UE4 — Pro 잠금 + 오너 언락.
- **리서치 입력**: 실측 — ① 인증 인프라 존재: 공유 auth authority(askewly.com) 세션이 `{authenticated, email}` 반환, Google OAuth start·logout·세션 갱신 전부 배선됨 ② 잠금 골격 존재: patterns 카탈로그 `hasPublicCode = exampleIndex === 0`(첫 예제만 Code 탭, 나머지 "Get the code →" 모달) ③ UE2 바리에이션 갤러리 `tier: "pro"` 는 배지 표시 층만.

## Scope Boundary
- **포함**: ① 오너 판별(세션 이메일 SHA-256 대조 — 원문 이메일을 공개 번들에 넣지 않음) ② patterns 카탈로그: 오너면 전 예제 Code 탭·복사 언락 ③ 용어 바리에이션 갤러리: pro 변형을 비오너에게 잠금 표면(블러+안내)으로, 오너에게 전체 데모 ④ 검증 + 사람 관측(배포 사이트에서 본인 로그인 언락 확인).
- **제외**: 결제·플랜 관리·라이선스(사용자 확정 — 나중) · auth authority 측 변경(이 레포는 OAuth 시크릿을 두지 않는다, deployment.md 계약) · 에셋 다운로드 팩.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: 게이트는 프론트 표시 층 — revert 로 즉시 원복 가능. 기존 "첫 예제 무료" 동작은 비로그인 기본값으로 보존.

## 스캐폴딩 결정
- source-of-truth: 오너 판별·잠금 상태는 App 루트 1곳(`authSession` → `proUnlocked`)에서 파생해 prop 으로 내려보낸다. 오너 이메일은 SHA-256 hex 상수로만 존재.
- 검증: Playwright(비로그인: 잠금 유지·모달, 세션 mock: 언락) + tsc·build·lint. 최종 사람 관측 = 배포 사이트에서 실제 Google 로그인.
- 배포/운영: push → Cloudflare Pages 자동 배포(관측이 실로그인을 요구하므로 배포 포함).
- 자기선언 도메인 — **보안 한계 명시**: 정적 SPA 의 클라이언트 게이트는 우회 가능(번들에 코드 스니펫 존재). 결제 도입 전 표시/UX 층으로 한정하며 이 한계를 evidence 에 기록한다. 시크릿·OAuth 설정은 다루지 않는다(공유 authority 소관).
- 자기선언 도메인 — **기존 동작 보존**: 비로그인 방문자는 현행과 동일(첫 예제 무료 + Get the code 모달). 회귀 = 비로그인 경로 스모크.
- 검토 후 제외: 결제(제외 확정)·서버 게이팅(정적 호스팅 — 결제 단계에서 재설계)·DB(불요).

## 결정 로그
- status: resolved
- **기존 사용자 확정 재사용(2026-07-27)**: ① 유료 모델 = Tailwind Plus 방식(대표 무료·전체 Pro) ② 지금은 잠금+오너 언락만(결제 없음) ③ 오너 판별 = Google 로그인 이메일 대조.
- **기술 결정**: 이메일 원문 대신 SHA-256 hex 대조(공개 레포·번들에 이메일 비노출) · 잠금 표면 = patterns Code 탭/복사 + 바리에이션 pro 데모(블러 오버레이) · 게이트 파생은 App 루트 단일점.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 오너 판별 + patterns 코드 언락**
  - Artifact: `isProUnlocked`(세션 이메일 SHA-256 대조, crypto.subtle) → `MarketingSectionCatalogPage` 에 prop — 오너면 전 예제 `hasPublicCode`, 잠긴 예제엔 Pro 칩 표시. CodeAccessModal 에 "오너 계정 로그인 시 열람" 안내 한 줄.
  - Files: write `src/App.tsx`(오너 판별 훅·prop 배선·카탈로그 게이트), 필요 시 `src/lib/owner.ts` 신설. read `docs/ui-vocabulary/deployment.md`.
  - Risk: 위험 (게이트 파생 오류 시 비로그인 사용자에게 전체 코드가 열리는 회귀 — 비로그인 스모크를 Verify 에 포함)
  - Dependencies: 없음
  - Verify: Playwright — 비로그인: 첫 예제만 Code 탭·나머지 "Get the code" 유지 / 세션 mock(fetch 라우트 스텁): 전 예제 Code 탭 노출·복사 동작. tsc·build·lint PASS.
  - Failure probe: 해시 대조가 대소문자·공백에 흔들리면 오너가 잠긴다 — normalize(trim+lower) 후 해시.
  - Commit: changeset `ue4-pro-lock-owner-unlock` (README 절: step-1).

- [x] **step-2 — 바리에이션 갤러리 pro 잠금 실제화**
  - Artifact: `VariationGallery` — 비오너에게 pro 변형은 데모 위 블러 오버레이 + 잠금 안내(로그인 유도), 오너·free 변형은 현행. 상태 칩·설명은 잠겨도 보임(Tailwind Plus 프리뷰 관례).
  - Files: write `src/components/variation-gallery.tsx`. read `src/data/term-variations.tsx`.
  - Risk: 위험 (오버레이가 free 변형까지 덮으면 UE2 회귀 — tier 분기 스모크 포함)
  - Dependencies: step-1
  - Verify: Playwright — `/terms/accordion`: 비로그인 pro 변형 오버레이·free 변형 정상 조작, mock 세션: 전 변형 조작. tsc·build·lint PASS.
  - Failure probe: 오버레이 아래 데모가 포커스 가능하면 잠금이 장식 — pointer-events·tabindex 차단 확인.
  - Commit: changeset `ue4-pro-lock-owner-unlock` (README 절: step-2).

- [ ] **step-3 — 통합 검증 + 배포 + 사람 관측 (UE4 마감)**
  - Artifact: 통합 Playwright 로그 + push(자동 배포) + **사람 관측 1회**: 배포 사이트에서 본인 Google 로그인 → 잠긴 예제 Code 열람·pro 변형 언락 확인. 클라이언트 게이트 한계 evidence 명기.
  - Files: write `evidence/ui-encyclopedia/ue4-pro-lock.md`.
  - Risk: 없음 (관측·기록 중심 — push 는 승인된 완료 절차)
  - Dependencies: step-1, step-2
  - Verify: 통합 Playwright PASS(원문) · build·lint PASS · 사람 관측 기록(발화 인용).
  - Failure probe: 로컬 mock 만으로 닫으면 실로그인 경로(쿠키·same-origin 프록시)가 미검증 — 배포 관측 필수.
  - Commit: changeset `ue4-pro-lock-owner-unlock` (README 절: step-3).

## 검증/DoD
- **DoD**: 비로그인 = 현행 유지(첫 예제 무료·pro 표시), 오너 로그인 = patterns 전 예제 코드 + 바리에이션 전체 언락. 배포 사이트 실로그인 관측 1회 통과. 클라이언트 게이트 한계 기록.
- **Evidence**: `evidence/ui-encyclopedia/ue4-pro-lock.md`
- **회귀 게이트**: build·lint·tsc + 비로그인 경로 스모크 + UE5 라우팅 스모크.

## 수치 출처
- 잠금 골격 실측: `src/App.tsx:2095` `hasPublicCode = exampleIndex === 0` · 세션 필드: `src/App.tsx:209` `{authenticated, email}`.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 (연쇄 마지막 milestone 집행).
