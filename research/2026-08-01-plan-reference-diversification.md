# 레퍼런스 다변화 계획 재료 — Tailwind 편중 현황과 흡수 배관 실사

Date: 2026-08-01
소비처: `plans/2026-08-01-m7-reference-diversification.md` (작성 예정 — Tailwind 편중 해소 milestone)

## 발견 요약

### 1. 편중의 실체
- `research/` 150+ 파일 중 캡처·패리티 장부는 사실상 전부 Tailwind/Tailwind Plus 계열.
- `docs/research/loop/ledger.md` 의 실제 배치도 전부 Tailwind 소스에서 출발 (surface 축: commerce/internal-tools/documentation/mobile-*).
- 북극성 「하지 않는 것」: "Tailwind 패리티를 최종 시스템으로 취급하지 않는다" — 현재 근거 기반이 이 원칙과 어긋난 상태.

### 2. 배관은 이미 있다 (재사용 대상 정본)
| 역할 | 정본 |
|---|---|
| 소스 티어링·Capture Protocol 8필드·Adaptation Rules | `research/design-system-reference-strategy.md` (Tier 1 = Apple HIG·Material / Tier 2 = Vercel·Stripe·Linear·Radix·Around) |
| 편입 판정 (A recipe화 / B 링크 참조 / C 보류) | `docs/design-system/absorption-criteria.md` |
| 배치 절차 (수집→dedup→적응→검증→흡수, 1 batch = 1 surface) | `research/reference-loop.md` |
| 스테이징 | `docs/research/loop/inbox.yml` |
| dedup | `scripts/audit-recipe-candidates.mjs` |
| 산출물 계약 | `docs/design-system/recipe-format.md` / `docs/ui-vocabulary/terms.yml` |
| 검증 체인 | validate-recipes → validate-ui-vocabulary → generate-llms-txt → site build/lint → build:data → build:catalog |
| 배치 장부 | `docs/research/loop/ledger.md` |
| knowledge 양식 | `knowledge/*.md` (판정 규칙 정본 + Changelog, 근거는 research 에 동결) |

### 3. 이미 있는 비-Tailwind 리서치 (미흡수 상태)
- `research/mobile-platform-design-baseline.md` (2026-07-04, RME4) — Apple HIG × Material 3 비교표 + Yusung system rule 열 + 모바일 패턴 필수 필드. **RL 루프 미통과 — recipe/term/knowledge 승격 0건.**
- `research/product-system-exemplars.md` (2026-07-04, RME5) — Vercel·Stripe·Linear·Radix·Around 5개 exemplar 의 교훈·Do-not-copy 표. **동일하게 미흡수.**
- 함의: 신규 조사 이전에, 이 두 문서를 inbox→승격 배관에 태우는 것이 중복 조사 없는 출발점.

### 4. 배관 미비점 (이번 milestone 에서 손봐야 할 것)
1. **ledger·inbox 스키마에 소스 축이 없다** — `batch` 필드가 `<YYYYMMDD>-<surface>` 뿐이라 같은 surface 에 Tailwind발/HIG발 후보가 섞이면 장부에서 구분 불가. source 필드 추가 필요.
2. **absorption-criteria 의 A/B/C 3분기는 컴포넌트 라이브러리를 겨냥해 설계** — 플랫폼 가이드라인(HIG·Material 같은 원칙·규범 문서)에 적용한 실증 사례 0건. 원칙류 소스는 recipe 가 아니라 knowledge/ 판정 규칙으로 착지할 가능성이 높음 — 판정표에 소스 유형 축 보강 검토.
3. `design-system-reference-strategy.md` Research Queue 의 R3(모바일 baseline)·R4(제품군 exemplar)는 리서치 산출물만 있고 흡수 단계가 큐에 정의돼 있지 않음.

## 계획에 주는 제약
- 스타일 복사 금지 — 흡수 대상은 원리·계약·판정 기준뿐, look 은 프로젝트 토큰 소유 (absorption-criteria 공통 불변식).
- 1 batch = 1 surface 규칙 유지 (RL 정본).
- 외부 인용은 출처 URL + 접근일 필수 (전역 규칙).
