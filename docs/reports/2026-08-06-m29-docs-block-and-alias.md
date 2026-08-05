# 완료 — M29 이식 경로 완결 (`@/` alias + docs-site 블록 + 0.4.2 출고)

> 완료: 2026-08-06 · M29 (goal `docs-block-and-theme-derive`) · 배치: `docs/reports/` (record — 작성 후 동결)

## 1. 결과

**빈 vite 프로젝트에서 킥스타트 한 줄 + 인쇄된 안내만으로 세 번째 블록이 빌드된다 — 수기 보완 0.** M28 E2E 에서 두 번 다 사람이 손으로 메웠던 `@/` alias 구멍이 사라졌고(`tsc -b` 6건 → exit 0), docs 계열 asset 7종이 처음으로 한 벌(`docs-site`: 셸 + 3페이지)로 묶여 `block-contract` §6 에 등재·배포됐다. `0.4.2` 는 npm 에, `docs-site` 는 라이브 registry 에 있다.

관측 게이트에서 사용자 지목 1건(다크 코드 패널 반전)을 반영했고, 그 과정에서 **지목보다 큰 결함 2건**이 드러나 같이 닫혔다 — 생성된 토큰 CSS 가 `dark:` 유틸리티를 클래스에 묶지 않아 다크 스위치가 둘로 갈려 있었고(Tailwind v4 기본은 `prefers-color-scheme`), `color-scheme` 미선언으로 스크롤바·네이티브 컨트롤이 다크에서 흰색으로 남았다. 셋 다 "인쇄된 안내를 그대로 따르면 도달할 수 없던 상태"였다.

흡수 실사는 후보 8건 전수 기각 — 정통 docs 프레임워크 5종은 예외 없이 자체 라우터·빌드 파이프라인을 소유해 파일 복사형 배포와 태생이 다르고, 라이선스가 통과한 둘(shadcn/ui·Mintlify, parent 가 LICENSE 원문 대조)은 셸을 담고 있지 않다. 자체 조합으로 확정.

## 2. 이슈와 해결

- **E2E 가 잡은 자책골 1건**: `@/` alias 1차 스니펫이 `"baseUrl": "."` 를 포함했는데 **TypeScript 6.0.3 이 `TS5101` 로 빌드를 깬다**(deprecated). 미싱 모듈 6건을 deprecation 1건으로 바꾼 셈이었다. `paths` 는 TS 4.4+ 부터 baseUrl 없이 tsconfig 상대로 해석되므로 제거하고 테스트로 고정. **기계 게이트(vitest·tsc)는 전부 통과한 상태였다 — 실표면 구동만이 이걸 잡았다.**
- **지점 B 의 발견 경위가 곧 결함의 증명**: 관측하려고 내가 `@custom-variant` 를 손으로 넣고서야 다크가 보였다. `@/` alias 와 같은 종류의 누락이고, 같은 방식(내가 수기 보완한 것 = 안내가 빠진 것)으로 드러났다.
- **완료 감사 ① 드리프트(확장) 2건 — 정직한 기록**: step-4 계획 Files 는 배선 2파일 + evidence 였는데 ⓐ asset **3종**을 고쳤고(계획서가 "지목이 asset 에 걸릴 수 있다"고 미리 경고한 범위 안이지만 파일은 더 넓다) ⓑ **CLI 를 다시 건드렸다**(step-1 소관). ⓑ 는 관측 중 발견한 이식 경로 결함이고 0.4.2 출고가 같은 milestone 이라 같은 릴리스에 실렸다. 누락 방향 드리프트는 없다(5 step 전건 수행).
- **완료 감사 ② 순조로움 재검증**: step-3 이 한 번에 통과해 두 곳을 되짚었다. ⓐ registry 최종 diff = **수정 3종 + 신규 1종 + 인덱스**뿐, 나머지 53종 무변경(범위 확인). ⓑ 사이트 prerender 수가 759 로 불변인 게 수상해 확인 — `/recipes` 프리렌더 HTML 에는 **기존 `marketing-landing`·`saas-app-shell` 도 없다**(갤러리는 클라이언트 렌더). 회귀가 아니라 원래 그런 표면이었다.
- **범위 밖으로 남긴 것**: `bg-foreground`/`text-background` 반전을 쓰는 나머지 **9개 파일**(marketing hero·colors-page·contrast-duo-card 등). 다크에서 같은 반전이 일어난다 — 일괄 판정이 필요하면 별도 milestone.

## 3. 증거

- changeset: `changesets/20260805-m29-docs-block-and-alias` (step 1~5 절) · evidence: `evidence/docs-block-and-theme-derive/m29-docs-site-block.md`·`m29-release-042.md` · 실사: `research/2026-08-05-m29-docs-site-absorption-survey.md`
- 검증: vitest **80/80**(신규 9) · `tsc --noEmit` exit 0 · `npm pack --dry-run` 15 files·261.6 kB(0.4.1 의 15·259.6 kB 대비 예상 밖 증감 없음) · registry 순수성 게이트 PASS·기존 53종 무변경 · `verify` 블록 0건 · 사이트 build+prerender 759 · oxlint 0건 · llms-sync PASS · 출고 워크플로 [run 31031905737](https://github.com/lumatic2/ui-dictionary/actions/runs/31031905737) 전 단계 ✓
- 평가 못 함: 없음 — 계획 DoD 의 실패 모드 5항이 각각 실제로 평가됐다(alias 감지 오판 양방향은 주석·솔루션파일 fixture, 라이선스 불명확 기각은 실사에서 Tailwind Plus 로 발동, `requiredCssVars` 과소 선언은 전이적 grep 대조, 다크 대비는 관측, publish 후 라이브 실패는 무발생).
- 크기 회고: 5 step · changeset 1개 · human gate 2회(관측·publish) · 독립 커밋 6개 — milestone-grade 맞다. 목표(큐 ①②)가 그 크기였으므로 과소 그릇 아님.
- 실표면: 빈 `create-vite react-ts` → `npx --yes @askewly/design@0.4.2 init . --block docs-site --color violet --yes` → 인쇄된 6단계를 **그대로**(수기 보완 0) → `npx tsc -b` **exit 0** → `npm run build` **exit 0** → `verify` 26파일 0건 → 실브라우저에서 다크 `color-scheme: dark`·`--background #0f1219`·코드 패널 `rgb(30,36,46)`, 클래스 제거 시 라이트로 따라옴, 3페이지 전환·⌘K 정상, **콘솔 에러 0**.
- 배선: 신설 장치 = `detectPathAlias`/`aliasStep`(킥스타트 handoff 조립 경로) — 호출자는 `runKickstart` step 7. **실발화 1회 증거** = 위 실표면 E2E 가 alias 단계를 실제로 인쇄했고(스톡 vite 에서 `tsconfig.app.json` 지목), 이미 설정된 프로젝트 재실행에서는 인쇄되지 않았다. `renderBrandCss` 의 `@custom-variant`·`color-scheme` 은 기존 함수 확장이며 라이브 생성물에서 실측 확인.
- 재현: `npx --yes @askewly/design@0.4.2 init <빈 vite react-ts dir> --block docs-site --color violet --yes` → 인쇄된 6단계 → `npx tsc -b` → `npm run build`
