# Evidence — M7 플랫폼 가이드라인 흡수 (HIG·Material → 모바일 내비게이션·시트)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m7-platform-guideline-absorption.md` · Goal: `reference-diversification`
- Changeset: `changesets/20260801-m7-platform-guideline-absorption/README.md`

## DoD 대조

| DoD 항목 | 증거 |
|---|---|
| 비-Tailwind 소스의 RL 전 단계 첫 완주 | 수집(capture 문서·7개 공식 문서 실브라우저) → dedup(audit exit 0·14후보) → 승격(knowledge 1 + terms 보강 7) → 검증(체인 전체 PASS) → ledger 1행 |
| knowledge 판정 규칙 ≥1 | `knowledge/mobile-navigation.md` — 컨테이너 선택 결정표·행동 계약 7조·모달 표면 선택표·깊이 규칙 |
| llms FIXED_ASSETS 노출 | `scripts/generate-llms-txt.mjs` Knowledge 섹션 등재 · llms.txt 에 `knowledge/mobile-navigation` 링크 확인 · 자산 168→169 |
| source 축 ledger 1행 | `docs/research/loop/ledger.md` batch `20260801-mobile-nav-sheets`, source=`apple-hig+material (t1)` |
| 전 검증 체인 PASS | ledger verification 열 — validate 2종·재생성·check-llms-sync(커밋 후)·build(755 routes)·lint·build:data·audit:visuals 전 exit 0, build:catalog 는 recipe 0 으로 규약상 생략 명시 |

## 실패 모드 실증

- llms 게이트: step-1 에서 absorption-criteria 수정 직후 재생성 없이 `check-llms-sync` 실행 → FAIL 재현 → 재생성·커밋 후 PASS (게이트 FAIL/PASS 양 경로 확인).
- 게이트 부수 적발: `methodology/slide-production.md`·`knowledge/slide-principles.md` 의 기존 llms 드리프트(이전 세션 병합 잔재) — step-1 재생성에 접어 해소.

## 주요 발견

1. **M3 Expressive 가 navigation drawer 를 비권장으로 전환** — expanded navigation rail 대체 권고. baseline 리서치(2026-07-04) 이후의 규범 변화로, 플랫폼 가이드라인 캡처는 시점 갱신 확인이 필수임을 실증. terms(`navigation-drawer` related) + knowledge §1 에 반영.
2. 예상대로 신규 term 0 — 기존 모바일 내비·시트 계열이 이미 두꺼워(~30개) 전 후보가 기존 항목 보강으로 착지. 원칙류 소스의 가치는 term 수가 아니라 **판정 규칙**임이 확인됨(DoD 설계 적중).
3. WebFetch 는 HIG·M3 모두 JS 셸 — 실브라우저 캡처가 유일 경로.

## 산출물 목록

- `knowledge/mobile-navigation.md` (신설, llms 노출)
- terms.yml 보강 7: tab-bar · bottom-navigation · navigation-drawer(+related) · modal-bottom-sheet · full-screen-dialog · sheet-drag-handle · dialog
- `research/2026-08-01-m7-mobile-nav-sheets-capture.md` (근거 동결)
- 배관: ledger source 열 · absorption-criteria §원칙류 소스 · reference-loop 검증 체인 개정
