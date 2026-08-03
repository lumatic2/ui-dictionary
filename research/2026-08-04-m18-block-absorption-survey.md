# M18 step-1 — 외부 공개 블록 실사 + saas-app-shell 베이스 판정

> 조사일: 2026-08-04 · 소비처: `plans/2026-08-04-m18-composition-block-tier.md` step-4(블록 구현 베이스). 사용자 방향(2026-08-04): 손 조합 전에 깃허브 기존 공개 자산 흡수 우선.

## 1. 판정 요약

**베이스 채택 = shadcn 공식 `dashboard-01` 블록 (MIT)** — 계획 결정 로그의 채택 규칙 3항(라이선스·구성 일치·품질 우위) 전부 충족. 우리 asset(설정 페이지·빈 상태·토스트)으로 보강하고 시멘틱 토큰 restyle 의무 적용. 나머지 후보는 기각(근거 아래 표).

## 2. 실측 표

| 후보 | 라이선스 (재배포) | 구성 일치 (결정 2 세트 대조) | import 표면·이식 비용 | 품질 | 판정 |
|---|---|---|---|---|---|
| **shadcn 공식 blocks `dashboard-01`** | **MIT** (© 2023 shadcn — 표기 의무 이행 가능) | 사이드바 셸 + 대시보드(stat 카드 `section-cards` + 인터랙티브 차트 + 데이터 테이블) — 결정 2 코어 일치. 설정·빈 상태·토스트 미포함 → 우리 asset 보강 | **이미 `registry:block` JSON으로 배포**(11 files: page 1·component 9·data 1). registryDependencies = shadcn primitives 19종(우리 모델과 동형). npm deps: @dnd-kit×4·@tabler/icons-react·@tanstack/react-table·zod — dependencies 선언으로 purity gate 통과 가능. 라우팅 미결합(page.tsx 단일) | shadcn 공식 — 실전 검증 최다 조합. generic face 는 restyle 의무로 해소 | **채택 (베이스)** |
| satnaing/shadcn-admin | MIT (12.8k★) | 10+ 페이지(설정 포함) — 구성은 초과 충족 | **TanStack Router 전면 결합** — 계획의 "라우팅 미결합" 계약과 충돌, 추출 = 사실상 재작성. Vite 앱 형태라 registry 단위 아님 | 높음 | 기각 (설정 페이지 *구조 참고*로만 — 코드 이식 안 함) |
| Tremor (tremorlabs/tremor) | Apache-2.0 (3.5k★) | 대시보드 컴포넌트 35+ | **자체 컴포넌트 시스템**(Tailwind+Radix, shadcn primitives 아님) — registryDependencies 모델 불일치, 이식 시 이중 체계 | 높음 | 기각 (B 링크 참조 성격) |
| Kiranism next-shadcn-dashboard-starter 계열 | MIT (~6k★) | 대시보드+kanban 등 | **Next.js 앱 결합**(app router·Clerk) — Vite/registry 단위 아님 | 중상 | 기각 |
| shadcnblocks.com | 유료 상품 (블록별 약관) | — | — | — | 기각 (계획 failure probe 규칙: 라이선스 불명확/유료 = 추정 채택 금지) |

## 3. 채택 규칙 3항 대조 (dashboard-01)

1. **라이선스**: MIT — `/r/` 재배포 시 파일 헤더 + block-contract.md 표기 규칙으로 attribution 이행. ✓
2. **구성 일치**: 셸+대시보드 코어 일치. 미포함 3종(설정·빈 상태·토스트)은 우리 `recoverable-empty-state`·`actionable-toast` + 설정 페이지 신작으로 보강 — "베이스 + 보강" 형태는 계획 step-4 Artifact 정의 그대로. ✓
3. **품질 우위**: 자체 27 asset 조합은 조각별 검증만 있고 조합 완성도는 미검증 — dashboard-01 은 조합 자체가 공식 검증됨. 시그니처 하드페일(generic shadcn face)은 restyle 단계가 계약된 해소 경로(component-restyle.md). ✓

## 4. step-4 이식 시 주의 (실측 파생)

- npm deps 중 `@tabler/icons-react` 는 우리 표준(lucide-react)과 아이콘 이중화 — restyle 시 lucide 교체 검토(치환 실패 시 dependencies 선언 유지).
- `@dnd-kit` 4종은 data-table 행 드래그용 — 해커톤 골격에 과한지 step-4 에서 판단(드래그 제거 시 deps 4종 절감).
- `data.json` 목데이터 포함 — 우리 블록도 목데이터 파일 관례 승계.

## 5. 출처 (전건 접근일 2026-08-04)

- shadcn blocks 카탈로그: https://ui.shadcn.com/blocks
- dashboard-01 registry JSON 실측: https://ui.shadcn.com/r/styles/new-york-v4/dashboard-01.json
- shadcn/ui LICENSE(MIT): https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
- satnaing/shadcn-admin: https://github.com/satnaing/shadcn-admin
- tremorlabs/tremor: https://github.com/tremorlabs/tremor
- 후보군 서베이: https://dev.to/tailwindadmin/best-open-source-shadcn-dashboard-templates-29fb · https://adminlte.io/blog/shadcn-admin-dashboard-templates/

## 종료

포화 판정: 채택 규칙 3항을 전부 충족하는 후보가 확정됐고, 추가 후보(Next/router 결합 계열)는 동일 사유로 기각 수렴 — 종료.
