# 완료 — M18 조합 블록 계층 (외부 흡수 실사 + 앱 골격급 자산 정본화 + saas-app-shell 1종)

> 완료: 2026-08-04 · M18 (goal `reusable-composition` 1/2) · 배치: `docs/reports/` (이 레포 확정 위치 — archive/ gitignore)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋에 있다.

## 1. 결과

- code asset 27종 위에 **앱 골격급 자산 등급 "블록"** 이 정본화됐다 — 계약 `docs/design-system/block-contract.md`(tier marker·registry 표현·레이아웃 계약·restyle 요구 변수·흡수/표기 규칙·소비 경로) + entry-protocol **A-0 Block-first** 단계 + llms 등재.
- 첫 실물 `saas-app-shell` 배포(`/r/saas-app-shell.json`, 12 files): 사용자 방향대로 **흡수 우선** — shadcn 공식 `dashboard-01`(MIT, 파일 헤더 attribution) 베이스 + 우리 asset 3종(테이블·빈 상태·토스트) 배선 + 설정 페이지 신작. 무거운 결합(tanstack·dnd-kit·tabler·toggle-group) 절단, deps 는 recharts·lucide 둘로 압축.
- **신선 vite 프로젝트에서 `npx shadcn add` 한 방에 재귀 해결 전건 성공** — 블록 12본+asset 3종(라이브 URL)+primitives 17본+npm deps 자동 설치, teal 테스트 브랜드로 restyle 시 askewly 팔레트 잔존 0. "저장된 소스의 조합으로 시작한다"의 첫 절반이 실측으로 닫혔다.

## 2. 이슈와 해결

- **shadcn CLI 실이식이 생성기 계약 결함 2건을 적발** (사이트 내부 소비만으론 안 보였음): ① registry:page/file 은 `target` 필수 → 블록 전 파일에 단일 디렉터리 target 부여 ② `registry:page` 는 Next 전제라 vite 에서 **조용히 스킵** → 전건 `registry:component` 로 정정. 둘 다 생성기 보수 + 재이식 검증 완료.
- shadcn Sidebar `position: fixed` 가 사이트 갤러리 카드를 탈출 → 데모 래퍼 `[transform:translateZ(0)]` containing block 격리(블록 본체 무변경).
- 신형 shadcn CLI `init` 이 비대화 셸에서 테마 프롬프트로 정지 → components.json 수기 + `add` 만 실기. init 스킵 잔여(lib/utils·기본 토큰 수기)는 **M19 kickstart 가 메울 마찰 목록**으로 evidence 에 등재.
- 드리프트 점검: 결정 2 구성 세트 대비 nav-documents 제외·차트 ToggleGroup 절단 등 적응이 있었으나 전건 failure probe/실사 §4 예고 경로 안(기록 완비). 순조로움 의심 재검증: registry 재생성 멱등성(diff 0) 재확인 PASS.
- 사람 관측 게이트는 계획대로 M19 step-4 에 집중(이번 milestone 은 기계 검증 + 에이전트 브라우저 스모크까지).

## 3. 증거

- changeset: `changesets/20260804-m18-composition-block-tier` (step-1~5 절)
- 검증: generate-registry PASS(28 assets·기존 27 diff 0·멱등 재확인) · purity gate 자기시험 2건 실제 FAIL · 사이트 빌드 759 routes PASS · lint:colors 0 · `npx @askewly/design verify` 블록 0건(사이트·신선 양쪽) · check-llms-sync PASS · 실브라우저 스모크 사이트 2장면 + 신선 4장면(라이트/다크/설정/빈 상태) 콘솔 에러 0 — `evidence/reusable-composition/m18-block-tier.md` + `screenshots/` 6장.
- 크기 회고: changeset 1개(step 절 5개)로 닫힘 — 기록 단위 규약(milestone 당 1 changeset) 그대로, step 5개·통합 검증 실재로 milestone 라벨 정합.
- 실표면: 신선 vite 프로젝트에서 이식된 SaaS 셸을 실브라우저로 조작 — 내비 전환(대시보드↔설정)·검색→빈 상태 전환이 실제 동작, 콘솔 에러 0, teal 브랜드 렌더 관측(스크린샷 4장).
- 재현: `npx shadcn@latest add <repo>/examples/ui-vocabulary-site/public/r/saas-app-shell.json -y` (components.json 있는 vite+tailwind v4 프로젝트) → `npx @askewly/design verify src/components/blocks`
- 배선: entry-protocol A-0 단계가 블록의 호출자(스킬이 매 작업 fetch — 라이브 반영은 세션 push 후) + `/r/registry.json` 인덱스 등재. 실발화 1회 증거 = step-5 이식이 A-2.5 경로 그대로 소비. 신설 스크립트 없음(생성기 확장은 기존 빌드 체인 `generate-registry` 가 호출).
