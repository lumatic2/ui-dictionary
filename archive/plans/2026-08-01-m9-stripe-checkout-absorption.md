# PLAN — M9: Stripe 흡수 — 결제·체크아웃 플로우 (레퍼런스 다변화 2라운드 1/3)

> 생성: 2026-08-01 · 갈래: reference 흡수(RL 배치) · scope: Tier 2 Stripe 를 RL 루프에 태운다. 표면 = commerce 결제·체크아웃 플로우. goal `reference-diversification-2` 1번 milestone (연쇄: M9 → M10 → M11).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M9→M10→M11 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 커머스 플로우는 명시된 범위 표면.
- **goal**: `reference-diversification-2` (M8 finding 큐 승격 — 사용자 지시 2026-08-01 "파인딩 큐 남은 3가지 이어서").
- **리서치 입력**: 조사 불요 — M7·M8 이 같은 배관을 직전 실증(`docs/research/loop/ledger.md` 최근 2행), 소스 목록은 `research/product-system-exemplars.md` §Stripe(공식 URL 3종), 절차는 `research/reference-loop.md` 정본.

## Scope Boundary
- **포함**: ① Stripe Elements·Checkout 공식 문서/제품 페이지 실브라우저 캡처(출처 URL+접근일) → inbox 후보 ~10건(source=t2) → dedup ② 승격 — `knowledge/checkout-flow.md`(결제 플로우 신뢰·전환·검증 판정 규칙) + llms FIXED_ASSETS 등재 + terms 보강 + ledger 1행 + 전 검증 체인.
- **제외**: 실결제 연동·Stripe API 구현(문서·지식 범위) · Do-not-copy 표 준수(Stripe 그라데이션·규제 문구 비이식).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서·데이터 추가 위주 — 커밋 단위 revert.

## 스캐폴딩 결정
- source-of-truth: M7·M8 과 동일(reference-loop·absorption-criteria §원칙류·terms.yml·knowledge/·FIXED_ASSETS 수동 등재).
- 검증: M8 과 동일 체인(dedup audit → validate 2종 → 재생성+check-llms-sync → site build·lint → 실브라우저 스모크 + audit:visuals, recipe 승격 시 build:data/build:catalog).
- 배포/운영: push 는 goal 마감(M11) 시 일괄 — 요약 보고 후 사용자 승인(배포 배칭).
- 자기선언 도메인 — 없음.
- 검토 후 제외: Stripe 대시보드(로그인 내부) 캡처 — 공개 문서·제품 페이지로 충분, 크리덴셜 표면 회피.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: finding 큐 3건 전부 진행(그릇 = M9→M10→M11 연쇄).
- **기술 결정**: ① 착지 = `knowledge/checkout-flow.md` — 결제 UI 는 컴포넌트가 아니라 플로우 규율(인라인 검증·에러 복구·신뢰 프레이밍·로컬라이제이션)이 이식물 ② 기존 commerce terms 두꺼움(2배치 완주) — 보강 전환이 주 경로 예상, DoD 는 knowledge 규칙 ≥1 ③ 로그인 벽 시 공개 문서·데모 폴백(M8 선례).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — Stripe 배치 수집 + dedup**
  - Artifact: Stripe Elements(제품+docs)·Checkout 실브라우저 캡처 → `research/2026-08-01-m9-stripe-checkout-capture.md` 동결 → inbox 후보 ~10건(8필드+source t2) → dedup audit.
  - Files: write docs/research/loop/inbox.yml, research/2026-08-01-m9-stripe-checkout-capture.md. read research/product-system-exemplars.md, docs/ui-vocabulary/terms.yml.
  - Risk: 기계적 (데이터 스테이징 — 접근 벽 시 공개 표면 폴백·한계 기록)
  - Dependencies: 없음
  - Verify: `node scripts/audit-recipe-candidates.mjs` exit 0 — 후보 전건 판정 완료.
  - Failure probe: checkout 계열 기존 terms(checkout-*, payment-*) 다수 예상 — 전부 중복이면 보강 전환 판정 기록.
  - Commit: changeset `m9-stripe-checkout-absorption` (README 절: step-1).

- [x] **step-2 — 승격 + 검증 체인 + ledger (M9 마감)**
  - Artifact: `knowledge/checkout-flow.md` 신설(결제 플로우 판정 규칙 — 인라인 검증·에러 복구·신뢰 프레이밍·단계 축소·로컬라이제이션, knowledge 양식) + **llms 배선(필수)**: FIXED_ASSETS 등재 + 재생성 산출물 커밋 + terms 보강분 + inbox 비움 + ledger 1행(source=stripe (t2)) + `evidence/reference-diversification-2/m9-stripe-checkout-absorption.md`.
  - Files: write knowledge/checkout-flow.md, scripts/generate-llms-txt.mjs(FIXED_ASSETS), examples/ui-vocabulary-site/public/llms.txt·public/llms/(재생성), docs/ui-vocabulary/terms.yml, docs/research/loop/ledger.md, docs/research/loop/inbox.yml(비움), evidence/reference-diversification-2/m9-stripe-checkout-absorption.md.
  - Risk: 위험 (terms.yml 정본 데이터 — 검증 체인으로 차단)
  - Dependencies: step-1
  - Verify: M8 step-2 와 동일 체인 전체 PASS + llms.txt 에 knowledge/checkout-flow 노출 문자열 확인 + 실브라우저 스모크(보강 term 1건 렌더).
  - Failure probe: knowledge 문서 간 규칙 중복 — 실충돌 후보는 `mobile-navigation.md` §3(dialog 액션 ≤2·확인 규칙, fresh 검증자 실측)이지 dashboard-density 가 아니다. 체크아웃 확인 모달 규칙은 mobile-navigation 을 참조로 위임하고 checkout-flow 는 플로우 고유 규칙만 — 상호 wikilink, 중복 규칙 0.
  - Commit: changeset `m9-stripe-checkout-absorption` (README 절: step-2).

## 검증/DoD
- **DoD**: Stripe 가 source 축 ledger 행으로 RL 완주 — knowledge 규칙 ≥1(`checkout-flow.md`) + llms 노출 + 전 검증 체인 PASS. 실패 모드: 재생성 누락 = check-llms-sync 게이트.
- **Evidence**: `evidence/reference-diversification-2/m9-stripe-checkout-absorption.md`
- **회귀 게이트**: 사이트 build·lint + audit:visuals + ledger 기존 행 무손실.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — step-2 failure probe 충돌 상대 정정(dashboard-density→mobile-navigation §3). checkout 계열 기존 terms 8개 실측(보강 전환 전제 타당).
