# M10 · Radix 흡수 (포커스·키보드 규율) — 완료 보고

Date: 2026-08-01 · Goal: `reference-diversification-2` (연쇄 2/3) · Plan: `archive/plans/2026-08-01-m10-radix-focus-keyboard-absorption.md`

## 1. 결과

Radix Primitives 가 RL 루프를 완주했다. `knowledge/focus-keyboard.md` 신설 — APG=정본(키보드 행동 발명 금지) 대원칙, 모달 계약(트랩+트리거 반환+첫 논리 항목 포커스+공지), roving tabindex(복합 위젯 = Tab stop 1개), dismiss 계층 계약, 라벨 계약 + 판정 절차. llms 노출(자산 172). terms 보강 3건(focus-trap·tabs·dropdown-menu — 키보드 계약을 정의에 편입). ledger 에 radix t2 행. 이 세션 kg 인입 노드(focus-visible 감사 함정)와 상호 배선됐다.

## 2. 이슈와 해결

- Radix 컴포넌트 문서는 `get_page_text` 본문 추출 실패(데모 헤비 구조) — 접근성 트리(read_page)+find 로 Features/Keyboard 표 직접 추출. JS 셸(HIG·M3)과도 다른 제3의 캡처 경로로 capture 문서에 기록.
- inbox `surface` 어휘(7종)는 pattern_group(10종)과 별개 — `application-ui` 무효를 audit 가 적발, `components-primitives` 로 정정(두 번째 스키마 실측).
- 기존 focus-trap term 이 반환 원칙을 이미 보유 — 중복 생성 대신 Esc 경로·반환 대상 구체화로 보강을 좁힘.

## 3. 증거

- changeset: `changesets/20260801-m10-radix-focus-keyboard-absorption` · Evidence: `evidence/reference-diversification-2/m10-radix-focus-keyboard-absorption.md` · 동결: `research/2026-08-01-m10-radix-focus-keyboard-capture.md`
- 검증: validate 2종·재생성·check-llms-sync PASS·build 755 routes·oxlint 기존 경고만·lint:colors 0·build:data terms=563·audit:visuals 신규 fallback 0. build:catalog 생략(recipe 0 — 규약 근거).
- 실표면: 실브라우저(vite preview :4324)에서 `/terms/focus-trap` 열어 보강 description("반환 없는 트랩은 미완성") 렌더 확인 — 통과. llms.txt 에 focus-keyboard 링크 노출 확인.
- 재현: `node scripts/check-llms-sync.mjs` (PASS) · `cd examples/ui-vocabulary-site && npm run build && npm run audit:visuals`.
- 크기 회고: changeset 1개·독립 step 2 + 통합 검증 — 연쇄 2/3 설계 그대로, 라벨 정합 문제 없음.
