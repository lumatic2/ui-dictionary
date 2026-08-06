# Around/Createx 재판정 — 이식 축이 열린 뒤

> 2026-08-06 · Milestone M34 (plan: `plans/2026-08-06-m34-around-reverdict.md`)
> 입력: 원 판정서 `research/2026-08-01-m11-around-verdict.md` (판정 **C**) · 원 캡처 `research/around-template-system-capture.md` (2026-07-04, RME2 — **유일 정본, 동결**)
> 판정 어휘: `docs/design-system/absorption-criteria.md` 의 A/B/C

## 1. 재판정 조건은 충족됐는가 — 코드로 확인

M11 이 적은 조건은 하나였다(`research/2026-08-01-m11-around-verdict.md:15-18`):
"이식 가능한 제품/패키징 방향이 **milestone 로 승격되면** A 재검."
C 였던 이유는 품질이 아니라 **소비처 부재**였다 — 2026-08-01 에 사용자가 "이식 검증은 품질·문서화가 아직이라 이르다"고 판정했다.

그 뒤 이식 축은 실제로 열렸다. 로드맵 문구가 아니라 **커밋·보고서·코드**로 지목한다:

| 근거 | 무엇 |
|---|---|
| `docs/reports/2026-08-04-m26-cli-release-040.md` | 킥스타트 CLI `0.4.0` 출고 |
| `docs/reports/2026-08-06-m29-docs-block-and-alias.md` | 블록 3종(`marketing-landing`·`saas-app-shell`·`docs-site`) + `0.4.2` |
| `docs/reports/2026-08-06-m31-dark-inversion-cleanup.md` | 토큰이 CLI·registry 를 타고 이식 경로까지 `0.4.3` |
| `docs/reports/2026-08-06-m32-required-css-vars-measured.md` | 이식 계약(`requiredCssVars`)을 실측으로 강제, 라이브 재현 |

**킥스타트가 실제로 무엇을 묻고 무엇을 만드는지**(Failure probe — 요약을 믿지 않는다, `packages/cli/src/kickstart.ts` 실측):

- 질문 **3개**: `Tone — how should the product feel?`(`:26`) · Accent · `Type direction — one family, hierarchy by weight/size`(`:38`)
- 선택지: `CANVASES` **3종**(minimal-clean·warm-editorial·dark-technical, 각각 light/dark 쌍 + `radius`) ·
  `ACCENTS` **5종**(blue·teal·violet·amber·cosmos) · `FONT_STACKS` **3종**
- 각 톤 프리셋이 **radius 를 포함**한다(`0.5rem`·`0.625rem`·`0.375rem` 실측)
- 산출: `src/askewly-brand.css` — 변수 **61종** 정의(M32 step-3 실측), 라이트·다크 양면 + `@theme inline` 매핑

**결론: 조건 충족.** 소비처가 생겼을 뿐 아니라, Around customizer 원리가 지목한 세 요소
("토큰을 만질 수 있는 컨트롤로 / 생성 스타일 복사 가능하게 / 타이포·radius 포함")가 **이미 구현돼 있다.**

## 2. 사이트 현행 재확인

https://around.createx.studio/ (실브라우저 접근 **2026-08-06**) — 생존. 2026-08-01 캡처 대비 **무변동**:
카탈로그 IA(Landing pages 프리빌트 레이아웃 그리드), `Around customizer` 절, 라이트/다크 모드 이미지 쌍,
타이포 스케일 셀렉트(`.75`·`.875`·`1`·`1.05`·`1.1`·`1.15`·`1.25`·`1.375`), `Buy now` 패키지 링크 모두 그대로다.

## 3. 판정: **A (흡수)** — 단 대상은 판정서가 지정한 2건으로 한정

C 를 유지할 이유가 사라졌다. 다만 **흡수의 성격이 M11 시점과 달라졌다**: 그때는 "언젠가 만들 것의 참고"였고,
지금은 **이미 만든 것에 이름과 규칙을 붙이는 일**이다. 그래서 흡수는 새 기능 도입이 아니라 **규칙 명문화**다.

- **① customizer 원리 → knowledge 규칙 — A.** 우리 킥스타트가 왜 질문 3개인지, 왜 톤 프리셋이 radius 까지
  묶는지가 **코드에만 있다.** 다음에 이식 표면을 넓힐 때(시각 프리뷰·스케일 조절 등) 기준이 없다.
  Around 가 실물로 보여주는 것은 그 기준의 상한이다 — 특히 **우리에게 없는 두 가지**:
  실시간 시각 프리뷰, 타이포 **스케일 배수** 조절(우리는 스택만 고르고 배수는 고정).
- **② 패키지 클레임 모델 → 제품 문서 계약 — A.** `docs/PRD.md` 를 실측하니 Problem·Product Goal·Scope·
  Core Experiences·MVP·Non-Goals·Success Criteria·포지셔닝 절은 있으나, **"이 시스템을 받으면 무엇이 따라오는가"**
  (스택·자산·검증·Figma 왕복)를 한 자리에 적은 절이 없다. 킥스타트는 next steps 를 인쇄하지만 그건 절차이지 약속이 아니다.
- **원 캡처는 재서술하지 않는다.** 흡수 문서는 *우리 규칙*을 쓰고 근거로 캡처를 링크한다(M11 의 "재서술 = 열화 복제").

**범위 밖(확장 금지)**: customizer 를 실제 UI 로 구현하는 일 · Around 의 시각 디자인·컴포넌트 복제 ·
가격/결제/라이선스 강제(「하지 않는 것」) · 실시간 프리뷰·스케일 조절 기능 자체(그건 별도 milestone 후보).

## 4. 집행 (step-2)

- `knowledge/customizer-and-packaging.md` 신설 — customizer 원리를 우리 규칙으로(무엇을 컨트롤로 노출하고
  무엇을 고정하는가, 생성물이 복사 가능하다는 것의 의미, 타이포·radius 를 프리셋에 묶는 이유). 근거 링크 = 원 캡처.
- `docs/PRD.md` 에 제품 약속 절 신설 — 스택·자산·검증·Figma 왕복.
- `docs/design-system/absorption-criteria.md` 의 Around 행을 재판정 결과로 갱신 + `docs/research/loop/ledger.md` 1행.
- llms 배선이 필요하면 `scripts/generate-llms-txt.mjs` 등재 후 재생성.
