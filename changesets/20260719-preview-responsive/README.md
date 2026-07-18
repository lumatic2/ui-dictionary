# changeset: responsive preview + integrated E2E (SF3 step 2)

- Date: 2026-07-19
- Milestone: SF3 step-2 (`plans/2026-07-19-sf3-preview-upgrade.md`)
- Target: SF3 — 미리보기 고도화

## Scope

- `templates/brief-studio.html` — 모바일 뷰포트 토글: `#pv-site.pv-m`(320px 센터 + 경계선), 가로 나열 섹션(split·cards·info·story·story2)의 세로 스택 전환(`FX`), ugc 그리드 3→2열.
- `docs/design-system/brief-studio.md` — 미리보기 뷰 토글 절 + Changelog. llms 재생성.
- `evidence/studio-finish/` — sf3-preview-e2e.md + 스크린샷 2장.

## Contract

- source of truth: `templates/brief-studio.html` + `docs/design-system/brief-studio.md`
- deploy: llms (push 후 자동 반영)
- out of scope: 실제 디바이스 에뮬레이션 (폭 전환까지 — 결정 로그)

## Verification checklist

- [x] 조합 매트릭스 12조합(구성 3 × 다크 2 × 뷰포트 2) 렌더·오버플로 실측 — fails 0
- [x] Failure probe: 모바일 폭 오버플로 0건 (scrollWidth ≤ clientWidth 전 조합)
- [x] 통합 루프: 커스텀 데이터 → 생성 → 18/18 선택 → 수집 JSON 파싱 (Close Criteria ④)
- [x] curl 배포 확인 — "미리보기 뷰 토글" grep 1건 (2026-07-19 push 후 실측)
