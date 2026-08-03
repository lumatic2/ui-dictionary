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

## step-3 — generate-registry 블록 지원 (2026-08-04, 커밋 `8bb9734`)

- `tier:"block"` 분기: 다중 파일 수집·purity gate 확장·meta.tier·asset URL registryDependencies. 기존 27 자산 회귀 diff 0(잔여 1건 = M6 소스 드리프트 회수). **게이트 자기시험 2건 실제 FAIL 확인**(사이트 결합 import·미선언 npm 패키지).

## step-4 — saas-app-shell 블록 구현 (2026-08-04, 커밋 `10c3bf1` + 데모 격리 보정)

- 12 files (`/r/saas-app-shell.json`): dashboard-01 흡수 7본(파일 헤더 MIT attribution — @tabler→lucide 치환·ToggleGroup 절단·navDocuments 제외·데이터 prop 화) + 블록 어댑터 2본(members-table = interactive-data-table+recoverable-empty-state+actionable-toast 배선, use-is-mobile) + 신작 1본(settings-page) + page.tsx + data.json.
- registryDependencies: shadcn primitives 12종 + 우리 asset URL 3종. dependencies: lucide-react·recharts (dnd-kit×4·tanstack-table·tabler·zod 절단 — 실사 §4 예고 대응).
- 사이트 primitives 4종 설치(sidebar·chart·breadcrumb·label + use-mobile hook) + `--sidebar-*` 변수를 semantic 토큰 별칭으로 공급(index.css).
- 검증: generate-registry PASS(28 assets) · 사이트 빌드 PASS(759 routes) · `npx @askewly/design verify` 블록 디렉터리 0건 · lint:colors 0(chart primitive 의 recharts 기본색 덮어쓰기 선택자 hex 는 opt-out 주석) · **브라우저 스모크: 라이트/다크 렌더 + 콘솔 에러 0** (`screenshots/m18-step4-site-demo-{light,dark}.png`).
- Failure probe 실현 1건: shadcn Sidebar 의 `position: fixed` 가 갤러리 카드를 탈출해 호스트 페이지를 덮음 → 데모 래퍼에 `[transform:translateZ(0)]` containing block 으로 격리(블록 본체 무변경 — 데모 표면만 보정).
