# changeset — M10 Radix 흡수 (포커스·키보드 규율)

- Plan: `plans/2026-08-01-m10-radix-focus-keyboard-absorption.md`
- Goal: `reference-diversification-2` (연쇄 2/3)

## step-1 — Radix 배치 수집 + dedup (2026-08-01)

- 실브라우저 캡처 5면: Introduction·Accessibility overview + Dialog·DropdownMenu·Tabs 의 Features/Keyboard Interactions 표. 컴포넌트 페이지는 `get_page_text` 본문 추출 실패(데모 헤비 구조) — 접근성 트리(read_page)+find 로 표 직접 추출(방법 메모를 capture 문서에 기록).
- 근거 동결: `research/2026-08-01-m10-radix-focus-keyboard-capture.md` (결정표 재료 7행).
- inbox batch `20260801-focus-keyboard` 후보 8건(source=t2). 스키마 실측: surface 어휘에 `application-ui` 없음(pattern_group 과 별개 어휘 — 7종) → `components-primitives` 로 정정, audit exit 0·warnings 3(이웃 매치).

## step-2 — 승격 + 검증 체인 + ledger (2026-08-01, M10 마감)

- `knowledge/focus-keyboard.md` 신설(§0 APG 정본 · §1 모달 트랩+반환 · §2 roving tabindex · §3 dismiss 계층 · §4 라벨 계약 + 판정 절차) + FIXED_ASSETS 등재(자산 171→172). mobile-navigation 경계 wikilink + kg focus-visible 감사 함정 참조.
- terms 보강 3건: focus-trap(Esc 경로·트리거 반환 구체화) · tabs(roving tabindex 계약) · dropdown-menu(첫 항목 포커스·typeahead·Esc 반환).
- inbox 비움 + ledger 1행(radix t2). 검증: validate 2종·build 755·oxlint 기존 경고만·colors 0·build:data 563·audit:visuals 신규 0·실브라우저 `/terms/focus-trap`·check-llms-sync 커밋 후 PASS.
