# 20260805-m28-cli-polish-041 — M28 CLI 0.4.1 폴리싱

> plan: `plans/2026-08-05-m28-cli-polish-041.md` · milestone: M28

## step-1 — verify 속성 셀렉터 오탐 제거

- 증상: `[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50` 이 hex-literal 위반으로 잡혔다. 그 hex 는 recharts 내장 기본색을 **겨냥하는 매치 대상**이고 같은 줄이 그것을 토큰으로 덮는다 — 오탐이 아니라 **토큰 준수를 위반으로 부르는** 역전.
- 처리: `maskIgnoredRegions` 에 pass 추가(`ATTR_SELECTOR_HEX`) — 속성명 + `=`(CSS 매치 연산자 허용) + **따옴표 hex** 형태만 공백화. 파일 SKIP 목록은 채택하지 않았다(계획 기술결정 ①): 한 파일을 통째로 면제하면 그 파일의 진짜 위반까지 숨는다. 같은-따옴표 JS 문자열 안의 `\"` 이스케이프 형태도 포함(fixture 12행에서 실적발 — 1차 구현은 이걸 놓쳐 테스트가 잡았다).
- 경계: `bg-[#ccc]`(Tailwind arbitrary **값** — `=`·따옴표 없음)와 `color: "#112233"` 은 그대로 위반. fixture `attr-selector-outside.tsx` 5행이 면제 셀렉터와 `bg-[#ccc]` 를 한 줄에 두어 면제가 이웃을 삼키지 않는지 고정.
- 게이트: vitest 63/63(신규 3 케이스 + fixture 2) · `tsc --noEmit` exit 0 · 사이트 전체 스캔 전/후 diff = **chart.tsx:70 한 줄만 소멸**(154→153, 나머지 153건 판정 바이트 동일).

## step-2 — 킥스타트 handoff 정확도 (export 이름 파생 + import 실측 dep 집계)

- **dep 집계**: 이식 직후 그 파일 내용에서 bare specifier 를 추출해 `npmDeps` 에 합류(`importedPackages`). registry 선언은 하한으로만 쓴다 — shadcn `button.json` 이 `["radix-ui"]` 만 선언하고 `button.tsx` 는 cva 를 import 하는 상류 결함이라, 재선언이 아니라 실측으로 메워야 한다(계획 기술결정 ②). 상대경로·`@/` alias·node 내장 제외, 하위경로는 설치명으로 접기(`radix-ui/react-slot`→`radix-ui`). type-only·side-effect·re-export·동적 import·require 5형태 커버.
- **export 이름**: 이식된 `blocks/<block>/page.tsx` 에서 `Demo` 로 끝나지 않는 첫 `export function` 을 쓴다(`blockExportName`). 못 찾으면 심볼을 지어내지 않고 "파일을 열어 확인" 문구로 폴백. registry `meta.exportName` 안은 기각 — 자산 56종 재생성·재배포가 딸려오는데 CLI 만으로 닫히는 결함이다.
- 실측 전/후 (0.4.0 → 지금):
  - `marketing-landing`: `clsx lucide-react radix-ui tailwind-merge` → **`class-variance-authority` `motion` `react` 추가** · export `SaasAppShell`(존재하지 않음) → `MarketingLandingPage`.
  - `saas-app-shell`: **`class-variance-authority` `react` 추가** · export `SaasAppShell` 유지(회귀 없음).
  - `react` 는 걸러내지 않는다 — 킥스타트는 빈 디렉터리를 받으므로 실제로 필요하고, 제외 목록을 만드는 순간 cva 때 기각한 하드코딩 패턴으로 돌아간다.
- 게이트: vitest 71/71(신규 8) · `tsc --noEmit` exit 0 · 블록 2종 킥스타트 exit 0 · verify PASS · 인쇄된 export 심볼을 이식 파일 grep 으로 실존 확인.

## step-3 — 킥스타트 기본값 폴리싱 (오너 관측 지목분)

- 지목 3건 전부 **블록·asset 표현** — 팔레트·캔버스(CLI 소유 `ACCENTS`/`CANVASES`)는 지목 없어 무변경.
- ① 그라디언트 제거: `MeshGradientSurface` 사용 2곳(story 첫 스텝 카드·CTA 밴드 지면) 걷어냄. asset 은 registry 에 그대로 남고 다른 데모(glass-panel·grain-texture-overlay)도 무변경 — 이 블록에서만 안 쓴다.
- ② 미디어 슬롯 테두리 제거: story 스텝은 asset 자체 플레이스홀더(`bg-muted`, 보더 없음)로 통일, CTA 밴드도 보더 없이 `bg-muted`. 근거는 오너 지적 그대로 — 슬롯에 컴포넌트를 넣으면 테두리가 이중이 된다.
- ③ 마키: 컨테이너 `mx-auto` 추가, 일시정지를 `group`/`group-hover` 로 교체. **원인** = `hover:[&>div]:[...]` 의 쌓인 variant 가 오른쪽→왼쪽으로 적용돼 `.strip > div:hover` 로 해석된 것.
- 측정 전/후: 마키 중심 713==부모 713 · `animation-play-state` hover 시 running→**paused** · DOM `radial-gradient` **0** · 섹션 9개 유지(구조 무변경).
- 게이트: registry 재생성 diff = 건드린 3자산+인덱스만(다른 52종 무변경) · llms-sync PASS · 사이트 build+prerender 759 PASS · 블록 verify 0건 · 라이트/다크 관측.
- 주의(승계): 블록 JSON 의 asset regDeps 는 라이브 절대 URL 이라 `--registry` 로컬로는 asset 변경분이 안 온다 — 이번 관측은 asset 2파일 직접 복사로 확인했고 라이브 재확인은 step-4.

## step-4 — `0.4.1` 출고

- 버전 `0.4.0` → `0.4.1` (patch — 오탐 수정·누락 수정, CLI 인터페이스 무변경). `cli-release-procedure.md` 배포 이력 행 추가.
- 배포 전 게이트: build(data 번들 terms=563 recipes=48) · vitest **71/71** · `tsc --noEmit` exit 0 · `npm pack --dry-run` **15 files · 259.6 kB**(0.4.0 대비 +1 파일 = kickstart 테스트 아님, dist 모듈 증가 없음 — `src/`·`test/`·`scripts/` 포함 **0건** 확인).
- 경로: Trusted Publishing 워크플로(`gh workflow run publish-cli.yml --ref main`). 워크플로가 지정 ref 를 checkout 하므로 **push 선행 필수**.
- 출고 완료: [run 30988075333](https://github.com/lumatic2/ui-dictionary/actions/runs/30988075333) 전 단계 ✓ · `npm view` → `0.4.1`.
- 라이브 재현(M27 실패 경로 그대로): 빈 vite 프로젝트 → `npx @askewly/design@0.4.1 init . --block marketing-landing --color teal --yes` → **인쇄된 설치 목록 그대로** → **인쇄된 export 로 진입점** → `npm run build` PASS(**cva 누락 무재현**) → `verify` 25파일 0건 → `vite preview` 섹션 9 렌더·콘솔 에러 0.
- step-3 변경분 라이브 반영 확인: `mx-auto` 있음(중심 정렬 측정 PASS) · 플레이스홀더 `border` 없음 · 블록 내 mesh 사용 0건·DOM `radial-gradient` 없음.
