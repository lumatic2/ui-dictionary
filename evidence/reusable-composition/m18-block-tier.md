# M18 evidence — 조합 블록 계층

> Plan: `plans/2026-08-04-m18-composition-block-tier.md` · 갱신: step 진행마다 append.

## step-1 — 외부 실사·베이스 판정 (2026-08-04)

- 판정: **shadcn 공식 `dashboard-01`(MIT) 베이스 채택** — 근거 전건 `research/2026-08-04-m18-block-absorption-survey.md` (후보 5 실측 표 + 채택 규칙 3항 대조). absorption-criteria 표 A/B 행 등재. 커밋 `606c3bd`.

## step-2 — 계약 정본화 + 구성 재료 실측 (2026-08-04)

- `docs/design-system/block-contract.md` 신설(등급 구분 meta.tier·registry 표현·레이아웃 계약·restyle 요구 변수·흡수/표기 규칙·소비 경로) + entry-protocol A-0 블록 우선 단계 접합.
- 보강 재료 import 표면 실측 (2026-08-04, `grep ^import`):

| asset | import 표면 | 판정 |
|---|---|---|
| recoverable-empty-state | react · lucide-react · @/components/ui/button | 순수 — 이식 가능 |
| actionable-toast | react · lucide-react · @/components/ui/button | 순수 — 이식 가능 |
| sidebar-application-shell | react · lucide-react · @/lib/utils | 순수 (베이스가 dashboard-01 셸이므로 직접 사용 안 함 — 참조용) |
| interactive-data-table | react · @/components/ui/{button,checkbox,…} | 순수 (dashboard-01 자체 data-table 우선 — 참조용) |
| stat-summary-grid | (dashboard-01 `section-cards` 로 대체) | 참조용 |

- 설정 페이지는 대응 asset 부재 → step-4 에서 블록 내 신작(shadcn-admin 은 구조 참고만, 코드 이식 없음 — step-1 판정).
