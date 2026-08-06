# M32 evidence — `requiredCssVars` 실측화

Date: 2026-08-06 · Plan: `plans/2026-08-06-m32-required-css-vars-measured.md`

## 1. 게이트 (step-1)

- `scripts/generate-registry.mjs --self-test` → **8/8**. 양성 5(변수 직접·유틸+불투명도·variant 접두사·`rounded-*`→`--radius`·색 없는 `border`→`--border`), 음성 2(테마 밖 토큰·주석 산문), 한계 고정 1(문자열 안 유틸은 센다).
- 생성기 2회 실행 → `public/r/` **diff 0**(멱등).
- **Failure probe 양 경로 발동**:
  - 비블록(`meta.requiredCssVars`): `auth-gate-modal` 에서 `--scrim` 제거 → `exit 1`, "선언 누락: --scrim"
  - 블록(top-level `requiredCssVars`): `marketing-landing` 에서 `--primary` 제거 → `exit 1`, "선언 누락: --primary"
  - 두 경로가 갈린다는 사실이 계획 검증자의 지적(C3)이었고, 한쪽만 걸면 54종이 검사 밖에 남는다.

## 2. 선언 채우기 (step-2)

| 구분 | 수 | 비고 |
|---|---|---|
| 신규 선언 | **49** | 실측값 그대로 |
| 무변경 | **5** | 기존 손 선언이 이미 실측의 상위집합 (블록 3 + asset 2) |
| 생략 | **3** | 요구 변수 0 (`rotating-label`·`palette-generator-core`·`glow-points-scene-impl`) |

- `registry.json` 은 `requiredCssVars` 를 제외하면 HEAD 와 **완전 동일**(스크립트 대조). 이식 파일 content 무변경.
- 실측 변수 종류 **19종** (사이트 전용 `--askewly-violet` 포함).

## 3. 전이 수집이 실제로 도는가

라이브 데이터로는 증명되지 않는다 — `marketing-landing` 의 자식 요구가 블록 선언의 **부분집합**이라 합집합 개수가 변하지 않는다. 그래서 두 갈래로 나눠 증명했다.

- **코드 발화 (vitest 픽스처)**: 자식만 `--child-only` 를 선언한 트리에서 합집합이 `["--child-only","--parent-only"]`, 자식 선언을 비우면 `["--parent-only"]`. 양·음 두 방향 고정.
- **라이브 전후 대조**: 배포 전 자식 asset 8종의 선언 합집합 **0개** → 배포 후 **10개**(`--background --border --card --card-foreground --foreground --muted --muted-foreground --primary --radius --ring`). 전이 경로가 이제 **비어 있지 않은 데이터를 받는다**. 블록 선언 20의 부분집합이라 최종 요구 수는 20 유지.

## 4. 상류 shadcn 경계 (D3 분기 미발동)

- 우리가 끌어오는 upstream primitive **21종**(accordion·avatar·badge·button·card·chart·checkbox·command·dropdown-menu·input·label·pagination·radio-group·select·separator·sheet·sidebar·skeleton·switch·table·tabs)을 같은 추출기로 실측 → **27종** 요구.
- 그중 **25종을 `renderBrandCss` 가 정의**한다(미정의 0). 나머지 2종은 Radix 가 런타임에 쓰는 `--radix-select-trigger-height/width` 로, 토큰 층이 정의하면 라이브러리와 싸운다.
- 결론: **구멍이 아니라 경계**. `block-contract.md` §4.2 에 명문화 + `packages/cli` 테스트로 고정. baseline 추가·`0.4.4` 출고 불필요.

## 5. 라이브 재현 (step-3)

`npx --yes @askewly/design@0.4.3 init <빈 vite react-ts> --block marketing-landing --color violet --yes`

| | 배포 전 | 배포 후 |
|---|---|---|
| 이식 파일 | 23 | 23 |
| `required CSS variables` | 20/20 | 20/20 |
| 자식 asset 선언 합집합 | 0 | 10 |
| 브랜드 CSS 실물 대조 | — | 정의 61종, **요구 20종 미정의 0** |
| `verify` | PASS (10 block file) | PASS |

라이브 반영은 즉시가 아니다 — 폴링 **9회(약 4분)** 후 확인. M31 실측(약 2분)보다 길었다.

## 6. 결함·한계

- **`color-palette-generator` 가 사이트 전용 토큰을 요구한다** — `ring-askewly-violet`. 소비처에 `--askewly-violet` 이 없어 포커스 링이 투명해진다. 이식 파일 **내용** 변경은 M32 범위 밖이라 고치지 않고 finding + 테스트로 gap 고정.
- **정적 추출의 상한** — 런타임 조립 클래스는 못 잡고, 문자열 안의 유틸은 센다(주석은 제거). `--self-test` 에 고정.
- 추출기 오검출 2라운드를 실측이 잡았다: ① `--color-<series>`(shadcn chart 런타임 주입)·`--spacing`(Tailwind 내장)·자기정의 변수 ② `style.setProperty("--cursor-x", …)` 주입. 둘 다 제외 규칙으로 폐구.
- 레포 루트 `vitest` 175건 실패는 **전부 동결 표면**(`apps/agent-design`·`canvas-core/dist`·`template-core/dist`·`glass-landing`)의 기존 실패로 이번 변경과 무관. 판정 기준은 `packages/cli` 스위트 **89/89**.
