# M27 — marketing-landing 블록 evidence

> 2026-08-04 · plan: `plans/2026-08-04-m27-marketing-landing-block.md` · changeset: `changesets/20260804-m27-marketing-landing-block/`

## step-1 — 외부 실사·베이스 판정

- 후보 5계열 실측 → **자체 조합 폴백** (채택 규칙 3항 전부 충족 후보 없음). 근거·출처 전건: `research/2026-08-04-m27-marketing-block-absorption-survey.md`, 판정 3행: `docs/design-system/absorption-criteria.md`.
- 핵심 실측: tailark/blocks MIT·2,272★ 이나 next/link 195파일·next/image 109파일(GitHub code search) — Vite 소비 경로와 충돌. 자체 마케팅 asset 13종+는 라이브 harvest 산이라 품질 우위 성립.

## step-2 — 블록 구현·등재 게이트

| 게이트 | 결과 |
|---|---|
| generate-registry 재생성 | OK — 56 assets. **기존 55종 diff 0** (git 무변경 실측 — index 만 +94줄 신규 항목) |
| `/r/marketing-landing.json` | files 11 · regDeps: primitives 3(accordion·badge·button) + asset URL 9 · deps [lucide-react] · meta.tier block · requiredCssVars 20 |
| site build + prerender | PASS (759 routes) |
| tsc -b | exit 0 |
| oxlint / lint:colors | 신규 위반 0 (기존 warning 만) / 0 violations |
| `npx @askewly/design verify` (블록 dir) | PASS — 10 files, 색 리터럴 0 |
| check-llms-sync | PASS (커밋 후) |
| 사이트 데모 브라우저 렌더 | Recipe Gallery > Marketing 컬렉션 — hero·터미널 스트리밍 실발화·pricing·FAQ 렌더, 콘솔 에러 0. `screenshots/m27-site-demo-{top,pricing}.png` |

- 환경 사고 1건: 이전 세션(f05620b5)의 stale E2E 프로세스(`public/r` cwd 의 http.server 8931 + vite 4종)가 `public/r` 디렉터리 핸들을 잠가 재생성 EPERM — handle64 로 식별·종료 후 정상화(레포 무변경).

## step-3 — 킥스타트 통합 E2E (신선 프로젝트, 레포 밖 scratchpad)

- 서빙: `python -m http.server 8899 --directory examples/ui-vocabulary-site/public` (push 전 로컬 registry).
- 1커맨드: `npx --yes @askewly/design@0.4.0 init m27-fresh --block marketing-landing --color teal --yes --registry http://127.0.0.1:8899` → **exit 0**.
  - DESIGN.md(teal·minimal-clean·system-sans) + askewly-brand.css 생성 · **24파일 이식**(블록 11 + asset 9 + primitives 3 + lib/utils) · requiredCssVars **20/20** · `verify PASS — 10 block file(s), no color literals`.
  - registryDependencies 의 asset 9종은 **라이브 URL**(`ui.askewly.com/r/…`)로 해결 — 로컬(블록)+라이브(asset) 혼합 해석이 정상 동작(기존 55종은 이미 라이브라 정합).
- 앱 조립(vite+react+tailwind v4, `@`→루트 alias): `npm run build`(tsc+vite) PASS.
- 실브라우저 스모크 (dev 5242, Playwright):
  - 라이트: hero(부유 바 teal 톤)·로고 마퀴 구동·zigzag(1행 mesh 미디어)·터미널 **타이핑 스트리밍 실발화**(시간차 2샷에서 진행 상이)·stagger 리스트·contrast duo(inverted)·pricing 3단 — `screenshots/m27-fresh-light-{hero,demo}.png`
  - 다크: `.dark` 토글 — 전 섹션 다크 정상, CTA rotating label 실발화("beta" 사이클 중 포착)·mesh 다크 변주·footer — `screenshots/m27-fresh-dark-{hero,cta-footer}.png`
  - **콘솔 에러 0** (favicon 404 는 스캐폴드 소관 — data URI 로 0화 후 재확인).
  - **askewly 팔레트 잔존 0** — 전면 teal 렌더 + verify 색 리터럴 0.

## finding (CLI 0.4.x 큐 적재 — 이번 scope 밖)

1. **킥스타트 Next steps 안내문이 블록명과 무관하게 `import { SaasAppShell }` 하드코딩** — marketing-landing 이식 후에도 saas 안내 출력.
2. **dep 안내가 primitive 전이 의존 누락** — badge/button 의 `class-variance-authority` 가 안내 목록에 없어 빌드 1회 실패(수기 설치로 해소). regDeps 로 이식된 primitives 의 npm deps 집계 필요.

## 판정

step-1~3 기계 게이트 전건 PASS + **사용자 관측 통과 (2026-08-04 — Artifact 실화면 관측 "확인했고 마감처리해")**. DoD 전항 충족.
