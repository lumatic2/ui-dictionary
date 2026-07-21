# changeset: 코드 자산 registry 파이프라인 (RC1)

- Date: 2026-07-19
- Milestone: RC1 (`plans/2026-07-19-rc1-registry-pipeline.md`)
- Target: RC1 — 코드 자산 registry 파이프라인
- 리서치: `research/2026-07-19-recipe-code-reuse-shadcn-registry.md`

## Scope

- `scripts/generate-registry.mjs` — 신규. shadcn registry 호환 빌더: registry.json 선언 + 소스 .tsx → `public/r/<name>.json`(files[].content 내장) + `public/r/registry.json` 인덱스. **순수성 게이트**(허용 import: react·lucide-react·`@/components/ui/*`·`@/lib/utils` — 위반 시 명시 에러), registryDependencies(shadcn primitives)·dependencies(npm) 소스 파싱 자동 도출, 레시피 md `docs` 백링크(+restyle 계약 링크).
- `examples/ui-vocabulary-site/registry.json` — 신규. 1차 배치 27항 선언(54개 실사: 순수 29 − 인프라 2). title·description은 레시피 md Intent에서 파생.
- `examples/ui-vocabulary-site/public/r/` — 산출 28파일 (인덱스 + 27 자산).
- `scripts/generate-llms-txt.mjs` — `Code Assets (verified implementations)`에 registry index·27개 자산과 사람/에이전트 소비 절차를 파생한다.
- `evidence/recipe-code-reuse/rc1-transplant.md` — 새 Vite+React+Tailwind 프로젝트 이식·빌드·브라우저 실구동 증거.

## 실사 결과 (54개)

- 순수 29: 1차 배치 27 + 인프라 제외 2(device-frame·term-visual)
- 결합 25: 사이트 데이터(terms.generated)·home-page·device-frame·motion/three 의존 — 1차 배치 제외 (registry 미등재, 후속 배치 후보)

## Contract

- source of truth: `src/components/*.tsx`(사이트와 자산 동일 소스 — 사본 드리프트 없음) + `registry.json`(선언)
- deploy: 사이트 정적 배포 `public/r/` (push 후 ui.askewly.com/r/)
- out of scope: 라이브 배포 확인(로컬 산출·브라우저까지 검증; push 후 CDN 확인은 milestone close smoke에서 수행)

## Verification checklist

- [x] 27 자산 빌드 + 스키마 필수 필드(name·title·description·files.content·의존 선언)
- [x] 로컬 정적 서빙 전수 curl 27/27 OK (인덱스 items=27 일치)
- [x] Failure probe: 결합 자산(landing-hero) 등재 시도 → `순수성 위반 — @/components/home-page, @/lib/exposure` 명시 에러 + exit 1
- [x] cart-drawer 샘플: registryDependencies=[button,sheet] · dependencies=[lucide-react] · content 6.6k chars · recipe docs 백링크
- [x] `llms.txt` 코드 자산 index+27 링크와 이식·토큰 재결합 지침 생성
- [x] stat-summary-grid 깨끗한 프로젝트 이식: build PASS, Playwright 실렌더·콘솔 오류 0, screenshot 보존
