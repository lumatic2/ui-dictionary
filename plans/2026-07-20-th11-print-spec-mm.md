# PLAN — TH11 인쇄 규격 mm 기반 재정의

> 생성: 2026-07-20 · 갈래: product · scope 결정: 발주 가능한 산출물까지 — 절대 mm 계약·규격 프리셋·도련/재단 표시
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH11 — 사용자 확정(2026-07-20)으로 **실제 인쇄 발주**를 목표에 둔다. 지금 규격 계약은 px 고정값이라 발주 요건을 표현할 수 없다.
- **리서치 입력**: `research/2026-07-20-template-production-hardening-print-spec.md`

## 리서치가 바꾼 것 — 선언한 DoD를 고친다
- **`@page`의 `bleed`·`marks`는 어느 브라우저에도 지원이 없다.** Chrome GUI 인쇄는 `size`조차 무시하고, headless는 `size`만 반영한다. Prince(상용)만 완전 지원, WeasyPrint는 도련 미지원, Paged.js는 폴리필 수준.
  → ROADMAP DoD의 "내보낸 산출물이 재단 표시·도련을 담고"를 CSS 경로로는 만족시킬 수 없다.
  → **사용자 확정(2026-07-20): SVG에 직접 그린다.** 캔버스를 도련 포함 크기로 넓히고 재단 표시를 벡터로 그린다. 외부 의존성 0이고, 어떤 변환 도구를 거쳐도 살아남는다.
- **가장 큰 구조적 갭(리서치 8.4)**: 청사진 px가 **실제로 몇 mm인지 코드 어디에도 없다.** `print-spec.ts`는 mm을 "짧은 변 대비 비율"로만 쓰고, 규격 매칭은 종횡비로 간접 추론한다. 명함 청사진 1050×600px가 90mm인지 85mm인지 코드가 모른다 — 둘 다 종횡비로는 "맞을 수" 있다. **300dpi 인쇄 파일을 만들 방법이 없다.**

## 근거 있는 수치 (전부 리서치 인용)
| 항목 | 값 | 출처 상태 |
|---|---|---|
| 도련(명함·포스터 공통) | 사방 **3mm** | 확정 (한국 2개 출처 일치, 미국 0.125in=3.175mm) |
| 명함 안전영역 | 재단선 안쪽 **3mm** | 확정 (2개 출처 일치) |
| 포스터 게시 여백 | **15mm** | 확정 (단일 출처) — 단 재단 오차 대비 값이 **아니다** |
| 포스터 전용 안전영역 | — | **출처 확인 실패** — 명함 3mm 원칙을 유추 적용하고 그 사실을 코드에 명시한다 |
| mm→px | `mm / 25.4 × dpi` (300dpi에서 1mm ≈ 11.811px) | 확정 (2개 출처 일치) |
| A계열 포스터 | A3 297×420 · A2 420×594 · A1 594×841 (mm) | 확정 (국제 1 + 한국 2 교차검증) |
| 인포그래픽 고유 규격 | **없음** — A4/A3 차용 | 확정 (업계 통설) |

## Scope Boundary
- **포함**: 절대 mm↔px 계약, 규격별 mm 기반 안전영역(px 고정 상수 제거), A계열 프리셋, 인쇄용 포스터 청사진, SVG 도련 확장 + 재단 표시.
- **제외**:
  - **PDF 생성·래스터화** — 별도 후보. 이번엔 "발주 가능한 SVG"까지다.
  - 실제 인쇄 발주·비용 — 사용자 소유.
  - `@page` CSS 경로 (위 근거로 채택하지 않음), 컬러 프로파일(CMYK)·오버프린트.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **규격(mm)이 정본이다.** 청사진은 자기가 어떤 규격의 논리 px인지 선언하고, px는 거기서 파생된다. 지금은 반대로 px가 정본이고 규격이 추론된다.
- 재단 표시는 **벡터로 그린다** — CSS `@page`에 의존하지 않는다(브라우저 지원 없음).
- 안전영역과 게시 여백은 **다른 필드**다 — 목적이 다르다(재단 오차 대비 vs 게시물이 가려지지 않게). 한 값으로 뭉개지 않는다.
- 출처 없는 수치는 **유추임을 코드에 명시한다** — 포스터 안전영역이 그렇다.
- 검증: Vitest(환산·규격 매칭·기하) + **산출물을 그 형식 그대로 렌더해 눈으로 확인**(읽기용 산출물의 게이트 — 화면 UI 아님).
- 디자인: 산출물은 인쇄물이다. `askewly-design`은 화면 UI 대상이므로 **호출하지 않는다**(전역 규약). 편집기 표시가 바뀌면 그때만.
- 배포/운영: 해당 없음.
- 검토 후 제외: 인증·결제·시크릿 — 걸리지 않음.

## 결정 로그
- status: resolved
- **재단 표시·도련 출력 방식**: SVG에 직접 그린다 (사용자 확정 2026-07-20).
- **mm 계약 방향**: 청사진이 `printSpecId`를 선언하고 mm이 정본이 된다. 종횡비 매칭은 검증 수단으로 남기고 규격 판정의 근거로 쓰지 않는다.
- **포스터 안전영역**: 명함의 3mm 원칙을 유추 적용하되 "출처 확인 실패 — 유추"임을 코드 주석과 문서에 남긴다. 지어낸 값을 근거 있는 값처럼 쓰지 않는다.
- **기존 포스터 청사진(1080×1350, 4:5)**: 소셜 비율이므로 **인쇄 규격으로 이전하지 않고 그대로 둔다.** 인쇄용은 A계열 청사진을 **따로** 만든다 — 소셜 산출물도 실사용 대상이라 없애면 손실이다.
- 서명 재기준선이 발생한다(청사진 추가·안전영역 변경). 근거를 `rebaselines`에 남긴다.
- 사용자 결정 필요 항목: 없음(범위·출력 방식은 2026-07-20 사용자 승인).

## Step 트리

- [ ] **step-1 — 절대 mm 계약**
  - Artifact: 청사진이 자기 규격을 선언하고, 논리 px ↔ mm ↔ 인쇄 px 환산이 명시적 함수로 존재한다. `SAFE_AREA_INSET` px 고정 상수가 사라지고 규격별 mm 기반 검사로 대체된다.
  - Files: write `packages/template-core/src/print-spec.ts`, `catalog.ts`, `types.ts`, `blueprints/registry.ts`, 관련 테스트.
  - Dependencies: TH10 complete
  - Verify: 명함 청사진이 어떤 규격인지 코드가 **답할 수 있다**. 300dpi 인쇄 px가 계산되고 리서치의 예시값(85×55mm → 1004×650px)과 일치한다.
  - Failure probe: 규격을 선언하지 않은 청사진은 컴파일이 거부한다. 종횡비가 선언 규격과 어긋나면 검증이 잡는다.
  - Commit: changeset `absolute-mm-contract`.

- [ ] **step-2 — 규격 프리셋 확장 + 인쇄용 포스터**
  - Artifact: A계열(A3·A2·A1) 프리셋이 추가되고 인포그래픽이 A4/A3를 차용한다. 인쇄용 포스터 청사진이 A계열로 신설된다(기존 소셜 비율 청사진은 보존).
  - Files: write `packages/template-core/src/print-spec.ts`, `blueprints/registry.ts`, `__fixtures__/signatures.json`, 관련 테스트.
  - Dependencies: step-1
  - Verify: 모든 포맷에서 `matchPrintSpec`이 `null`이 아니다(소셜 청사진 제외 — 그건 의도된 `null`). 인포그래픽이 A계열과 규격을 공유한다는 관계가 코드에 명시된다.
  - Failure probe: A계열 종횡비(1.414)에서 벗어난 치수를 넣으면 규격 검증이 거부한다.
  - Commit: changeset `print-spec-presets`.

- [ ] **step-3 — 도련 + 재단 표시 SVG 출력**
  - Artifact: 인쇄 규격을 가진 청사진의 SVG가 **도련 포함 크기**로 나오고 재단 표시가 벡터로 그려진다. 배경이 재단선을 넘어 도련까지 확장된다.
  - Files: write `packages/template-core/src/exporters.ts`, `scripts/check-export-artifacts.mjs`, 관련 테스트.
  - Dependencies: step-2
  - Verify: 산출물을 **그 형식 그대로 렌더해 눈으로 확인** — 재단 표시가 네 모서리에 있고 배경이 도련까지 찬다. 게이트가 도련 기하를 입력(규격 mm)에서 유도해 검사한다.
  - Failure probe: 도련 확장을 제거하면 게이트가 exit≠0. 재단 표시를 지우면 파싱 검사가 잡는다.
  - Commit: changeset `bleed-and-crop-marks`.

## 검증/DoD
- **DoD**: 도련·안전영역이 mm 기반으로 선언되고, 명함·포스터에 발주 요건을 충족하는 규격 프리셋이 있으며, 내보낸 SVG가 도련과 재단 표시를 담고, full-bleed 배치가 가능하다. 산출물을 실물로 렌더해 확인한다.
- **Evidence**: `evidence/template-production-hardening/th11-print-spec.md` + 도련 포함 산출물 렌더 이미지

## finding 큐
- PDF 생성·300dpi 래스터화는 범위 밖 — 실제 발주 직전 후보.
- CMYK 컬러 프로파일 미고려. 화면 sRGB 값이 그대로 나간다.
- 포스터 안전영역 수치의 1차 출처는 여전히 없다 — 발주 전 인쇄소에 확인할 대상.

## 진행 로그
- 2026-07-20 계획 작성. 리서치가 `@page` 경로를 배제해 출력 방식을 사용자에게 물어 SVG 직접 그리기로 확정.
