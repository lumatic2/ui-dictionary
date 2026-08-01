# PLAN — M10: Radix 흡수 — 포커스·키보드 규율 (레퍼런스 다변화 2라운드 2/3)

> 생성: 2026-08-01 · 갈래: reference 흡수(RL 배치) · scope: Tier 2 Radix Primitives 를 RL 루프에 태운다. 표면 = 접근성 — 오버레이·복합 위젯의 포커스·키보드 규율. goal `reference-diversification-2` 2번 milestone (연쇄: M9 → M10 → M11).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M9→M10→M11 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — "AI 티가 덜 나는 제품 UI" 의 큰 축이 접근성 규율이다.
- **goal**: `reference-diversification-2` · **리서치 입력**: 조사 불요 — 배관 직전 실증 + 소스 목록 `research/product-system-exemplars.md` §Radix(공식 URL 3종). WAI-ARIA APG 는 Radix 가 준거로 삼는 상위 규범이라 필요 시 함께 캡처.

## Scope Boundary
- **포함**: ① Radix Primitives 공식 문서(overview·대표 프리미티브 2~3종: Dialog·DropdownMenu·Tabs 급) 실브라우저 캡처 → inbox ~10건 → dedup ② 승격 — `knowledge/focus-keyboard.md`(포커스 트랩·반환·roving tabindex·dismiss 계층·키보드 계약 판정 규칙) + llms 등재 + terms 보강 + ledger 1행 + 검증 체인.
- **제외**: Radix 컴포넌트 코드 벤더링(원리만 — Do-not-copy: Radix 기본 비주얼) · 전 프리미티브 전수 조사(대표 2~3종으로 규율 추출).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 커밋 단위 revert.

## 스캐폴딩 결정
- source-of-truth: M7~M9 와 동일.
- 검증: M8 과 동일 체인 + 실브라우저 스모크.
- 배포/운영: goal 마감(M11) 일괄 push — 사용자 승인 후.
- 자기선언 도메인 — 없음.
- 검토 후 제외: 접근성 실측 감사(우리 사이트에 Radix 규율 적용 검사) — 흡수 범위 밖, 별도 design-qa 몫.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: finding 큐 3건 전부 진행.
- **기술 결정**: ① 착지 = `knowledge/focus-keyboard.md` — Radix 의 가치는 look 이 아니라 포커스·키보드·ARIA 규율의 코드화된 준거 ② kg 노드 `focus-visible-audit-real-tab-key`(이 세션 인입)와 상보 — knowledge 문서에서 감사 함정을 한 줄 참조 ③ 기존 terms(focus-trap·keyboard-* 계열) 보강 주 경로 예상.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — Radix 배치 수집 + dedup**
  - Artifact: Radix Primitives overview + Dialog·DropdownMenu·Tabs 문서 실브라우저 캡처 → `research/2026-08-01-m10-radix-focus-keyboard-capture.md` 동결 → inbox ~10건(source t2) → dedup audit.
  - Files: write docs/research/loop/inbox.yml, research/2026-08-01-m10-radix-focus-keyboard-capture.md. read research/product-system-exemplars.md, docs/ui-vocabulary/terms.yml.
  - Risk: 기계적 (데이터 스테이징)
  - Dependencies: 없음 (M9 완료가 전제 — 연쇄 순서)
  - Verify: dedup audit exit 0 — 전건 판정.
  - Failure probe: focus-trap·keyboard-navigation 류 기존 terms 존재 확률 높음 — 보강 전환 판정 기록.
  - Commit: changeset `m10-radix-focus-keyboard-absorption` (README 절: step-1).

- [x] **step-2 — 승격 + 검증 체인 + ledger (M10 마감)**
  - Artifact: `knowledge/focus-keyboard.md` 신설(포커스 이동·트랩·반환·roving tabindex·Esc/외부클릭 dismiss 계층·타이핑 어헤드 등 판정 결정표) + **llms 배선(필수)**: FIXED_ASSETS 등재 + 재생성 커밋 + terms 보강분 + inbox 비움 + ledger 1행(source=radix (t2)) + `evidence/reference-diversification-2/m10-radix-focus-keyboard-absorption.md`.
  - Files: write knowledge/focus-keyboard.md, scripts/generate-llms-txt.mjs(FIXED_ASSETS), examples/ui-vocabulary-site/public/llms.txt·public/llms/(재생성), docs/ui-vocabulary/terms.yml, docs/research/loop/ledger.md, docs/research/loop/inbox.yml(비움), evidence/reference-diversification-2/m10-radix-focus-keyboard-absorption.md.
  - Risk: 위험 (terms.yml 정본 데이터 — 검증 체인으로 차단)
  - Dependencies: step-1
  - Verify: M8 동일 체인 전체 PASS + llms 노출 문자열 확인 + 실브라우저 스모크.
  - Failure probe: mobile-navigation.md 의 모달 깊이·dismiss 규칙과 중복 위험 — 경계 wikilink(컨테이너 선택 vs 포커스 규율), 중복 규칙 0.
  - Commit: changeset `m10-radix-focus-keyboard-absorption` (README 절: step-2).

## 검증/DoD
- **DoD**: Radix 가 source 축 ledger 행으로 RL 완주 — knowledge 규칙 ≥1(`focus-keyboard.md`) + llms 노출 + 전 검증 체인 PASS. 실패 모드: 재생성 누락 = check-llms-sync.
- **Evidence**: `evidence/reference-diversification-2/m10-radix-focus-keyboard-absorption.md`
- **회귀 게이트**: build·lint + audit:visuals + ledger 무손실.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
