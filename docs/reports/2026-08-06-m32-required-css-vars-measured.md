# M32 완료 보고 — `requiredCssVars` 를 손 선언에서 실측으로

Date: 2026-08-06 · Plan: `plans/2026-08-06-m32-required-css-vars-measured.md` · Changeset: `changesets/20260806-m32-required-css-vars-measured/`

## 1. 결과

M31 이 세운 이식 방어선(`requiredCssVars` 대조)이 "사람이 빠짐없이 적었는가"에 걸려 있던 것을 실측으로 옮겼다. ① `generate-registry.mjs` 가 이식 파일이 실제 쓰는 CSS 변수를 뽑아 선언과 대조하고, 선언이 좁으면 **빌드를 실패**시킨다 — 블록(top-level)·비블록(`meta`) **양 경로** ② 57종 중 49종에 실측 선언 신규 기입(기존 5종은 이미 상위집합, 3종은 요구 0) ③ 전이 수집이 코드로 도는 것을 픽스처로 증명 ④ 상류 shadcn 21종을 같은 추출기로 재 27종 중 25종을 브랜드 CSS 가 정의함을 확인해 **구멍이 아니라 경계**로 계약 §4.2 에 명문화 ⑤ 라이브 배포 후 재현 통과. CLI 는 무변경(baseline 불필요로 판정 — `0.4.4` 미출고).

## 2. 이슈와 해결

- **계획의 핵심 전제가 반증됐다(계획 검증자 사전 적발 → 실행에서 확정).** 초안은 "asset 8종이 선언을 가지면 `marketing-landing` 합집합이 20보다 커진다"로 ⓑ 를 증명하려 했으나, 그 8종이 쓰는 변수 10종이 블록 선언 20의 **부분집합**이라 개수가 변하지 않는다. 증명 방식을 **픽스처(자식만 가진 변수)** 로 바꾸고, 라이브에서는 "배포 전 자식 선언 0 → 후 10"이라는 전후 대조만 기록했다. 원하는 답을 만들지 않았다.
- **큐 문구 ⓐ 가 실행 불가였다.** "상류 shadcn primitive 에 선언 추가"는 남의 JSON 이라 불가능하다(`SHADCN_BASE` 원격 해석). 실체는 경계 문제였고, 측정 후 안전함을 확인해 문서·테스트로 닫았다.
- **추출기 오검출 2라운드를 실측이 잡았다.** ① shadcn chart 런타임 주입 `--color-<series>` · Tailwind 내장 `--spacing` · 자기정의 변수 ② `style.setProperty("--cursor-x", …)`. 넷 다 제외 규칙으로 폐구.
- **드리프트 감사**: 계획 대비 이탈은 Verify 문구 1건뿐 — "문자열 리터럴 무검출"은 성립 불가(className 자체가 문자열)라 주석만 제거하고 한계를 self-test 에 고정했다. 범위 확장·누락 없음.
- **순조로움 재검증**: step-1 이 한 번에 통과한 것이 의심스러워 게이트를 두 경로에서 각각 무력화해 봤고 둘 다 exit 1 로 잡혔다.
- **결함 1건 이월(범위 밖)**: `color-palette-generator` 가 사이트 전용 `--askewly-violet` 을 요구한다 — 소비처엔 없어 포커스 링이 투명해진다. 이식 파일 내용 변경은 M32 제외 범위라 finding 등록 + 테스트로 gap 고정.
- **크기 회고**: 3 step · changeset 1디렉터리 · 통합 검증(라이브 킥스타트 전후 2회) 보유 — milestone-grade 정합.

## 3. 증거

- `evidence/queue-drain/m32-required-css-vars.md` · 커밋: 50a9873(step-1) · 19e20b0(step-2) · c63b5ba(step-3) · 5af5154(findings)
- 게이트: `node scripts/generate-registry.mjs --self-test` **8/8** · 생성기 2회 실행 `public/r/` diff 0 · `packages/cli` vitest **89/89**(신규 6) · `node scripts/check-llms-sync.mjs` PASS
실표면: 빈 vite react-ts 에 `npx --yes @askewly/design@0.4.3 init . --block marketing-landing --color violet --yes` 를 **배포 전/후 2회** 실행 — 23파일 이식, `required CSS variables 20/20`, `verify PASS`. 생성된 `askewly-brand.css` 를 열어 정의 61종 대 블록 요구 20종을 대조해 **미정의 0** 을 확인(출력은 항상 N/N 이라 미정의를 못 보여준다 — 파일 실측으로 평가). 라이브 자식 asset 선언 합집합 0 → 10 으로 전이 경로가 실데이터를 받게 됐음을 확인.
배선: 신설 장치 = `generate-registry.mjs` 의 실측·대조 층. 호출자는 사이트 빌드의 registry 생성 경로(수동 `node scripts/generate-registry.mjs` 및 그 산출물을 커밋하는 흐름)이고, **실발화 1회 증거**는 이번 실행에서 게이트가 실제로 `saas-app-shell` 을 3건(`--color-desktop`·`--color-mobile`·`--spacing`)으로 **거부한 것**과, probe 2건에서 `auth-gate-modal`·`marketing-landing` 을 각각 거부한 것이다.
재현: `node scripts/generate-registry.mjs --self-test` → 8/8 · `node scripts/generate-registry.mjs --print-measured` → 57종 실측 · `cd packages/cli && npx vitest run` → 89/89 · 라이브: 위 실표면 명령 + `curl -s https://ui.askewly.com/r/contrast-duo-card.json | node -e "…"` 로 `requiredCssVars` 7개 확인
평가 못 함: 라이브 반영 지연의 원인(CF Pages 빌드 큐 대 캐시)은 구분하지 못했다 — 폴링 9회(약 4분)로 반영을 확인했을 뿐이고 M31 실측(약 2분)과의 차이는 설명하지 못한다. 레포 루트 `npx vitest run` 의 175건 실패는 동결 표면(`apps/agent-design` 등)의 기존 실패로 판단했으나 **각 실패의 개별 원인은 확인하지 않았다**(범위 밖).
