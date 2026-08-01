# changeset — M7 플랫폼 가이드라인 흡수 (HIG·Material → 모바일 내비게이션·시트)

- Plan: `plans/2026-08-01-m7-platform-guideline-absorption.md`
- Goal: `reference-diversification` (연쇄 M7 → M8)

## step-1 — RL 배관 보수: ledger 소스 열 + 원칙류 착지 규칙 (2026-08-01)

- `docs/research/loop/ledger.md`: `source` 열 신설(표 헤더+구분선), 기존 9개 배치 행 "tailwind 주도(소급)" 기입 — 행 수 무손실(9행 유지). Changelog 기재.
- `docs/design-system/absorption-criteria.md`: A 판정 산출물을 "recipe 또는 knowledge 규칙"으로 확장 + §원칙류 소스(플랫폼 가이드라인) 착지 규칙 신설 — knowledge 결정표 착지·B 링크 참조·term 보강 경로·FIXED_ASSETS 수동 등재 필수를 명문화.
- `research/reference-loop.md`: 검증 체인에 generate-tokens + `check-llms-sync.mjs`(M5 게이트) 추가, `build:data`/`build:catalog` 는 recipe 승격 배치만 필수로 명문화, ledger 규약에 source 행 추가, llms 등록 절에 knowledge 착지 배선.
- llms 재생성 산출물 3건 커밋: absorption-criteria(이번 변경) + `knowledge/slide-principles.md`·`methodology/slide-production.md`(**기존 드리프트 발견** — 이전 세션 슬라이드 워크트리 병합 때 소스만 커밋되고 재생성 누락된 것으로 추정. 게이트 FAIL 실측으로 적발, 이번 재생성에 접어 해소).

검증: check-llms-sync FAIL(재생성 전) → 재생성 → 커밋 후 PASS(exit 0, 아래 step 기록 시 확인) · ledger `grep -c '^| 20260712'` = 9(무손실).

## step-2 — 모바일 내비게이션·시트 배치 수집 + dedup (2026-08-01)

- WebFetch 로 HIG·M3 시도 → 양쪽 다 JS 셸(EMPTY-JS-SHELL) 확인 → 실브라우저(Claude in Chrome)로 전환, 7개 문서 전문 확보(HIG tab-bars·sheets·modality + M3 navigation-bar·bottom-sheets·dialogs·navigation-drawer, 접근일 2026-08-01).
- 근거 동결: `research/2026-08-01-m7-mobile-nav-sheets-capture.md` — 소스 표(URL+접근일+문서측 갱신일) + 관찰 + 플랫폼 대조 요점 + 비이식 목록.
- **신규 규범 사실**: M3 Expressive 가 navigation drawer 를 비권장으로 내리고 expanded navigation rail 대체 권고 — 2026-07-04 baseline 리서치엔 없던 변화. HIG tab-bars 는 2026-06-08 Liquid Glass 반영판.
- `docs/research/loop/inbox.yml` 에 batch `20260801-mobile-nav-sheets` 후보 14건 스테이징(전부 `source: tier 1` 필드 포함). 예상대로 신규 term 후보는 사실상 없음 — proposed_artifact 는 alias 7·related 4·term 2(지식 규칙 입력)·계열로, 주 경로 = 기존 항목 보강 + knowledge 결정표.
- dedup: `node scripts/audit-recipe-candidates.mjs` exit 0, 14 candidates, 19 warnings(전건 dedup_hints 이웃 매치 — 비치명). `audit-ui-vocabulary-candidates.mjs` exit 0.

## step-3 — 승격 + 검증 체인 + ledger (2026-08-01, M7 마감)

- `knowledge/mobile-navigation.md` 신설 — 원칙류 소스의 첫 knowledge 착지(§1 컨테이너 선택 결정표 · §2 행동 계약 7조 · §3 모달 표면 선택표 · §4 모달 깊이 규칙 + 에이전트 판정 절차).
- llms 배선: `generate-llms-txt.mjs` FIXED_ASSETS Knowledge 섹션 등재 → 재생성(자산 168→169) → llms.txt 노출 문자열 확인.
- terms.yml 보강 7건(신규 0 — 예상 적중): tab-bar·bottom-navigation·navigation-drawer(+related→navigation-rail)·modal-bottom-sheet·full-screen-dialog·sheet-drag-handle·dialog. YAML 함정(콤마·따옴표 flow scalar) 회피 준수.
- inbox 비움 + ledger 1행(source=`apple-hig+material (t1)`) — 후보 14건 전건 판정 기록.
- 검증: validate 2종·build(755 routes)·oxlint(기존 경고만)·lint:colors 0·build:data(terms=563)·audit:visuals(신규 fallback 0) 전 PASS. build:catalog 생략(recipe 0 — 개정 규약 근거 명시). 실브라우저 스모크 `/terms/navigation-drawer` 렌더 확인. check-llms-sync 는 커밋 후 PASS.
