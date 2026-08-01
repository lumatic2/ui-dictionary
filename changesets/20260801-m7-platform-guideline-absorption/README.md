# changeset — M7 플랫폼 가이드라인 흡수 (HIG·Material → 모바일 내비게이션·시트)

- Plan: `plans/2026-08-01-m7-platform-guideline-absorption.md`
- Goal: `reference-diversification` (연쇄 M7 → M8)

## step-1 — RL 배관 보수: ledger 소스 열 + 원칙류 착지 규칙 (2026-08-01)

- `docs/research/loop/ledger.md`: `source` 열 신설(표 헤더+구분선), 기존 9개 배치 행 "tailwind 주도(소급)" 기입 — 행 수 무손실(9행 유지). Changelog 기재.
- `docs/design-system/absorption-criteria.md`: A 판정 산출물을 "recipe 또는 knowledge 규칙"으로 확장 + §원칙류 소스(플랫폼 가이드라인) 착지 규칙 신설 — knowledge 결정표 착지·B 링크 참조·term 보강 경로·FIXED_ASSETS 수동 등재 필수를 명문화.
- `research/reference-loop.md`: 검증 체인에 generate-tokens + `check-llms-sync.mjs`(M5 게이트) 추가, `build:data`/`build:catalog` 는 recipe 승격 배치만 필수로 명문화, ledger 규약에 source 행 추가, llms 등록 절에 knowledge 착지 배선.
- llms 재생성 산출물 3건 커밋: absorption-criteria(이번 변경) + `knowledge/slide-principles.md`·`methodology/slide-production.md`(**기존 드리프트 발견** — 이전 세션 슬라이드 워크트리 병합 때 소스만 커밋되고 재생성 누락된 것으로 추정. 게이트 FAIL 실측으로 적발, 이번 재생성에 접어 해소).

검증: check-llms-sync FAIL(재생성 전) → 재생성 → 커밋 후 PASS(exit 0, 아래 step 기록 시 확인) · ledger `grep -c '^| 20260712'` = 9(무손실).
