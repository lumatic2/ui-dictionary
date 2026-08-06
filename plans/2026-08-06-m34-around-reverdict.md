# PLAN — M34: Around 재판정 (+ A 면 흡수)

> 생성: 2026-08-06 · 갈래: goal `queue-drain` (3/4) · scope: M11 이 **C(보류)** 로 닫은 Around/Createx 를,
> 그때 명시한 재판정 조건이 충족됐는지 실사해 다시 판정하고, A 면 지정된 2건을 실제로 흡수한다.
Status: approved (사용자 승인 2026-08-06 "ㄱㄱ" — goal `queue-drain` 연쇄 M32→M33→M34→M35 일괄 승인. 계획 검증자 1회 반영 완료)

## 재판정 조건이 충족됐는가 (착수 전 실사)

M11 판정서(`research/2026-08-01-m11-around-verdict.md:15-18`)가 적은 조건은 하나다:

> "**이식 가능한 제품/패키징 방향이 milestone 로 승격되면 A 재검**: customizer 원리(토큰을 만질 수 있는
> 컨트롤로·생성 스타일 복사 가능하게·타이포/radius 포함) → knowledge 규칙 또는 site-blueprint 반영,
> 패키지 클레임 모델(스택·자산·검증·Figma 명시) → 제품 문서 계약."

C 판정의 근거는 "**소비처가 없다**"였다 — 2026-08-01 시점에 사용자가 "이식 검증은 품질·문서화가 아직이라
이르다"고 판정했기 때문이다. 그 뒤 실제로 열린 것:

- **M26~M31** 이 킥스타트 CLI·블록 3종·registry 57종·`@askewly/design@0.4.3` 출고까지 이식 표면을 열었다
  (`docs/reports/2026-08-04-m26-cli-release-040.md` · `2026-08-06-m29-docs-block-and-alias.md` ·
  `2026-08-06-m31-dark-inversion-cleanup.md`).
- 킥스타트는 **색·톤·타이포를 질문으로 받아 브랜드 CSS 를 생성**한다(`kickstart.ts` `renderBrandCss`,
  `ACCENTS`/`CANVASES`/`FONT_STACKS`) — Around 의 customizer 원리와 **같은 자리**의 기능이다.

즉 조건은 **충족된 것으로 보인다.** 다만 "충족됐다"는 판단 자체가 이 milestone 의 step-1 산출물이고,
재판정 결과가 다시 C 로 나올 수도 있다(그 경우 조기 종료 — 아래 DoD).

## 북극성 → milestone → step (위계)

북극성의 **"이식 가능한 제품 — 팔란티어처럼 내 색채를 남의 맥락에 입힌다"** 축이다.
Around 의 이식물은 컴포넌트가 아니라 **"많은 표면을 하나의 판매 가능한 시스템으로 패키징하는 법"** 이고,
그 축은 지금 CLI·블록·registry 로 실재한다.

## run 전 scope 결정

- **포함**: ① 재판정(조건 충족 실사 + 사이트 현행 재확인 + 판정서) ② 판정 반영 —
  **A 면** 판정서가 지정한 2건(customizer 원리 → knowledge 규칙, 패키지 클레임 모델 → 제품 문서 계약) 흡수
  + llms 재생성 / **B·C 면** 표·ledger 갱신 후 종료.
- **제외**: Around 의 시각 디자인·컴포넌트 복제(하지 않는 것 규약 — 브랜드 아이덴티티 복사 금지) ·
  customizer 를 **실제 UI 로 구현**하는 일(원리의 문서 흡수까지가 이번 범위) · 가격·결제·라이선스 강제
  (「하지 않는 것」 — 공개 탐색 경험과 에셋 모델 정합 전에는 붙이지 않는다) · 새 블록·asset.
- **연쇄**: **M35** (goal `queue-drain` 잔여).
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  human gate 없음(문서 산출물 — 배포는 사이트 push 에 동승).
- rollback/cleanup: 커밋 단위 revert. `public/llms/` 는 생성물이므로 소스 되돌린 뒤 재생성.

## 스캐폴딩 결정

- source-of-truth: 원 캡처 `research/around-template-system-capture.md`(2026-07-04) 가 **유일 정본이고 동결**이다
  — 재서술하지 않고 **링크로 참조**한다(M11 이 "재서술 = 열화 복제"로 명시). 판정 정본은
  `docs/design-system/absorption-criteria.md` 실측 표의 Around 행(`:51`), 흡수 장부는 `docs/research/loop/ledger.md`.
- 검증: `node scripts/check-llms-sync.mjs`(사이트의 `npm run lint:llms` 와 **같은 명령** — 두 건으로 세지 않는다,
  그리고 루트에는 `lint:llms` 가 없으므로 `examples/ui-vocabulary-site` 에서 실행) + 문서 lint.
  **정본 데이터(토큰·registry) 무변경** —
  diff 가 문서에만 걸리는지 확인. 통합 검증 = llms 배포본에 새 문서가 실제로 실렸는지 대조.
- 배포/운영: 사이트 CF Pages(문서·llms). CLI·registry 무관.
- 자기선언 도메인 — **흡수 대상은 판정서가 지정한 2건으로 고정**: customizer 원리 / 패키지 클레임 모델.
  실사 중 눈에 띄는 다른 것은 **finding 으로만** 남긴다(범위 확장 금지).
- 자기선언 도메인 — **판정별 반영처 확정 (A·B·C 3분기 — 실행 중 재질문 없음)**:
  - **A**: ① customizer 원리 → `knowledge/` 신규 문서 1건(기존 `knowledge/motion-references.md` 와 같은 층)
    ② 패키지 클레임 모델 → **`docs/PRD.md` 의 제품 약속 절**. M11 원문이 지목한 "제품 문서 계약"의 층은
    블록 단위 계약(`block-contract.md`)이 아니라 제품 계약이다(검증자 m7).
  - **B**(관찰 소스로만 가치 있음): 흡수 문서를 만들지 않고 `absorption-criteria.md` 행을 B 로 갱신 +
    원 캡처 링크만 남긴다. 표에 이미 B 행이 다수 있다(`:47-50`) — 예외 처리가 아니라 정규 경로다.
  - **C**(여전히 이르다): 판정 사실·근거만 갱신하고 조기 종료.
  llms 배선이 필요한 문서면 `scripts/generate-llms-txt.mjs` 대상에 등재한다(M11 시절 llms 배선 누락 선례 있음).
- 검토 후 제외: customizer UI 구현 · Around 디자인 복제 · 결제/라이선스 · 원 캡처 재작성.

## 결정 로그

- status: resolved

- **D1 — 흡수까지 담을 것인가 [사용자 소유 · 확정 2026-08-06]**: **재판정 + 흡수까지.**
  단 흡수 대상은 판정서가 지정한 2건으로 한정한다(위 자기선언).
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **사이트 현행 재확인 1회** — M11 도 그렇게 했다(2026-08-01 접근). 브라우저로 열어 카탈로그 IA·
    customizer 생존을 확인하고 접근일을 기록한다. 죽어 있으면 그 사실이 판정 입력이 된다.
  - ② **A 가 아니면(B·C) 흡수하지 않는다** — 표·ledger 에 재판정 사실과 근거만 남기고 종료한다.
    "이번에 흡수까지 승인받았으니 A 여야 한다"는 압력에 굴복하지 않는다.
  - ③ **원 캡처는 재서술하지 않는다** — 흡수 문서는 *우리 규칙*을 쓰고 근거로 캡처를 링크한다.
- **위임 결정**: **skip** — 입력(캡처·판정서)이 이미 레포 안에 있고 판단이 핵심이다.

## 재생성 장벽

- **step-2 이후(A 인 경우)**: `node scripts/generate-llms-txt.mjs` → `public/llms/` 재생성 + sync 검사.

## Step 트리

- [ ] **step-1 — 재판정**
  - Artifact: A/B/C 판정과 근거가 문서로 확정된다
  - Files: `research/2026-08-06-m34-around-reverdict.md`
  - Dependencies: 없음
  - Verify: 재판정 조건 충족 여부를 **커밋·보고서 경로로 지목**(추상 서술 금지) · 사이트 실브라우저 재확인
    (URL + 접근일, 생존/변동 여부) · 원 판정서(`research/2026-08-01-m11-around-verdict.md`)와
    원 캡처(`research/around-template-system-capture.md`)에 **양방향 백링크** · 판정 어휘 A/B/C
  - Failure probe: "조건 충족"을 킥스타트가 **실제로 무엇을 질문하고 무엇을 생성하는지** 코드로 확인한다
    (`renderBrandCss` 출력 실물). 로드맵 문구만 보고 충족으로 적으면 그 판정은 근거가 없다
  - Risk: 위험 (이번 승인이 "흡수까지"라 A 로 기울 편향이 있다 — C 조기 종료 경로를 명시해 둔다)
  - Commit: `docs(research): Around 재판정 (M34 step-1)`

- [ ] **step-2 — 판정 반영 (A 면 흡수)**
  - Artifact: 판정이 정본 표·장부에 반영되고, A 면 원리 2건이 우리 규칙으로 존재한다
  - Files: `docs/design-system/absorption-criteria.md`(Around 행 갱신 — 기존 `:51` 을 재판정 결과로) ·
    `docs/research/loop/ledger.md`(1행) · **A 인 경우만** `knowledge/<신규>.md` +
    `docs/PRD.md`(제품 약속 절) + `scripts/generate-llms-txt.mjs` 등재 + `public/llms/` 재생성
  - Dependencies: step-1
  - Verify: `node scripts/check-llms-sync.mjs` PASS(사이트 디렉터리에서) · 토큰·registry **diff 0** ·
    A 인 경우 신규 knowledge 문서가 llms 배포본에 실제로 포함됐는지 대조(M11 계열 배선 누락 선례) ·
    **B·C 인 경우 흡수 파일 생성 0건**
  - Failure probe: 흡수 문서가 원 캡처의 재서술이 아닌지 — 우리 규칙 문장 대 캡처 인용의 비율을 눈으로 확인.
    재서술이면 문서를 줄이고 링크로 대체한다
  - Risk: 기계적 (문서 변경 — 다만 llms 배선 누락이 이 레포의 상습 결함이라 Verify 에 명시)
  - Commit: `docs(design-system): Around 재판정 반영` (+ A 면 `docs(knowledge): customizer·패키징 원리 흡수`)

## 검증/DoD

**DoD**: Around 의 판정이 `docs/design-system/absorption-criteria.md` 에서 **재판정 날짜·근거·판정자**와 함께
갱신되고 ledger 에 1행이 남는다. 판정이 A 면 판정서가 지정한 2건이 우리 규칙으로 존재하고 llms 에 실린다
(원 캡처의 재서술이 아니라 **링크 참조**). 판정이 B·C 면 흡수 산출물은 0건이고 그 사실이 기록된다.
토큰·registry·코드 표면은 무변경.

**실패 모드 3항**:
1. 결론 편향(흡수 승인이라 A 로 기움) → C 조기 종료 경로 명시 + step-1 probe 로 근거를 코드에서 확인
2. 재서술 열화 → step-2 probe(우리 규칙 대 인용 비율)
3. llms 배선 누락 → Verify 에서 배포본 포함 여부 대조

**E2E 표면**: 웹 — Around 사이트 실브라우저 재확인 1회 + 우리 llms 배포본 대조.

## 수치 출처

- 재판정 조건 원문 — `research/2026-08-01-m11-around-verdict.md:15-18`
- 현 판정 행 — `docs/design-system/absorption-criteria.md:51`
- 이식 표면 개통 근거 — `docs/reports/2026-08-04-m26-cli-release-040.md` · `2026-08-06-m29-docs-block-and-alias.md` ·
  `2026-08-06-m31-dark-inversion-cleanup.md` (**step-1 에서 코드 실물로 재확인**)
- 원 캡처 — `research/around-template-system-capture.md` (2026-07-04, RME2)

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `queue-drain` 연쇄 3/4.

- 2026-08-06 계획 검증자 반영.
