# PLAN — DOG5 슬라이드 매체 신설

> 생성: 2026-07-22 · 갈래: product · scope 결정: 슬라이드 **제작** 파이프라인(템플릿·렌더러)은 손대지 않는다 — 규격 계약과 게이트까지
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `design-output-gates` 결정 로그 확정 4건 중 "매체 범위: 화면+인쇄+슬라이드 3종"에 DOG5가 포함되어 있고, DOG5는 리서치 완료·타 milestone 의존성 없음(horizon 의존 표: "DOG5 → 리서치 완료"만)으로 독립 착수 가능. horizon 자체의 미결 2건(타이포 임계값·검사 파일 범위)은 DOG3 대상이며 이 milestone과 무관.)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`, 2026-07-22 확장에서 슬라이드·지면이 범위에 들어옴)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG5 — 슬라이드 매체 신설. 리서치 → 규격 계약 → 기계 검증 가능 항목만 게이트로. 레포에 0건인 매체를 세운다.
- **리서치 입력**: `research/2026-07-22-design-output-gates-slide-spec.md`(이 milestone의 1차 입력, §6 기계 검증 가능성 판정표가 게이트 범위를 정함), `research/2026-07-20-template-production-hardening-print-spec.md`(자매 리서치 — 구성·톤을 이어받음)

## 왜 이게 먼저인가

매체 실사(horizon 본문)가 확인한 것: 인쇄 규격은 레포에 있지만 슬라이드는 **완전 0건** — 파일도, 코드도, 리서치도 없었다. 이번 리서치(`research/2026-07-22-design-output-gates-slide-spec.md`)로 그 공백을 처음 채웠고, 동시에 위험한 사실도 드러났다: 슬라이드 "규칙"으로 통용되는 것 대부분(안전영역 90/93%, 본문 24/30pt, 6×6 규칙)이 **1차 출처가 없거나 아예 다른 도메인(방송 표준)에서 차용됐다.** 반면 캔버스 치수와 WCAG 대비는 공식 문서로 확정된다.

이 milestone을 지금 여는 이유는 horizon 의존 표에서 DOG5가 "리서치 완료"만 조건으로 걸려 있어 DOG1~DOG3(검사기 정확도·배포)과 병렬로 진행 가능하기 때문이다. 미루면 프리모템 4("슬라이드를 화면처럼 다뤘다")·5("화면용 토큰을 또 지면에 깔았다")가 반복될 시간만 늘어난다.

## Scope Boundary
- **포함**:
  - 슬라이드 캔버스 규격 레지스트리(세 도구 프리셋 + 4:3 레거시) — `print-spec.ts`의 "선언이 정본" 패턴을 잇는 자매 계약.
  - WCAG 대비 계산(레포에 기존 구현 없음 — 이 milestone이 처음 추가).
  - 통설/유추 항목(안전영역·최소 글자·6×6)의 근거 등급 데이터 + 옵트인 경고 게이트.
  - `docs/design-system/`에 규격 문서 신설 + `llms.txt` 등재 + 배포본 fetch로 검증.
- **제외**:
  - **슬라이드 제작 파이프라인(템플릿·렌더러)** — horizon 비목표. `TemplateBlueprint`/`BlueprintOutput`(`packages/template-core/src/types.ts:74-81`)에 `medium: 'slide'`를 추가하지 않는다 — 아직 슬라이드 청사진이 하나도 없는 상태에서 컴파일러 배선까지 하면 제작 파이프라인 영역을 침범한다. 이번엔 독립 계약 모듈(`slide-spec.ts`)로 낸다.
  - **마무리 절차(SKILL.md) 배선** — DOG6 몫. DOG5는 문서와 코드까지, "언제 이 게이트를 부르는가"는 DOG6이 정한다.
  - **npm 배포** — DOG2 몫. 이 milestone의 검증 코드는 로컬 테스트로만 확인한다.
  - **5b(프로젝터 대비 보정)** — 리서치 §6 판정표가 이미 "불가능"으로 판정(정량 근거 자체가 없음). 코드화하지 않는다.
- execution mode: continuous
- 중단점(stop points): completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. `slide-spec.ts`·`slide-spec.test.ts`는 신규 파일이므로 삭제로 되돌린다. `docs/design-system/slide-spec.md`와 `llms.txt` 등재는 이전 커밋으로 되돌리면 배포본도 그 시점으로 복원된다(정본이 git이므로).

## 스캐폴딩 결정
- source-of-truth: 규격 값의 정본은 `research/2026-07-22-design-output-gates-slide-spec.md`(그 리서치가 인용하는 공식 벤더 문서가 최종 1차 출처). 코드(`slide-spec.ts`)는 그 리서치의 파생물 — 리서치가 갱신되면 코드도 갱신한다. 청사진이 자기 규격 id를 선언하고 스펙 테이블이 참조되는 구조는 `print-spec.ts`(`matchPrintSpec`/`validateSpecDeclaration`)와 동형이다.
- 검증: 근거 등급별로 함수를 분리한다 — `validateSlideDeclaration`(확정 사실: 캔버스 비율·WCAG, 기본 on) vs `checkSlideHeuristics`(통설/유추: 안전영역·최소 글자·6×6, 기본 off·옵트인). 두 함수를 하나로 합치면 통설이 확정 사실인 척 슬며시 켜지는 리서치의 핵심 위험이 코드에 재발한다.
- 배포/운영: 로컬 라이브러리 코드 + 정적 문서. 서버·시크릿 무관. 문서 배포 경로는 `scripts/generate-llms-txt.mjs`(SSOT `docs/design-system/*.md` → `examples/ui-vocabulary-site/public/llms/**` 복사 + `public/llms.txt` 재생성) — 손으로 `public/llms.txt`나 `public/llms/`를 편집하지 않는다(파일 자체 주석: "index is derived — do not edit by hand").
- 자기선언 도메인 — 데이터(근거 등급 표시): 모든 규칙 값에 `evidenceGrade: 'confirmed' | 'inferred' | 'folklore'` 필드를 달아 통설을 확정 사실처럼 노출하지 않는다(리서치가 지목한 이 milestone의 가장 큰 위험).
- 자기선언 도메인 — 문서 배포 검증: step-3 Verify는 로컬 파일 존재가 아니라 배포본 fetch로 확인한다(VL2 선례, `CLAUDE.md` "완료 보고서 위치" 절 인접 규율과 같은 계열 — "존재"와 "배포"를 혼동하지 않는다).
- 검토 후 제외: 인증·결제·시크릿·CI 배선 — 이 milestone은 로컬 라이브러리 코드와 문서 등재까지이며 위 항목들과 접점이 없다. 템플릿 컴파일러/`TemplateBlueprint` 확장도 위 "제외" 항목에 이미 사유를 적었으므로 여기서는 반복하지 않는다.

## 결정 로그
- status: resolved
- **확정 (리서치 근거로 자체 해결)**:
  1. **기본 캔버스 규격 = PowerPoint Widescreen 13.333×7.5in(`pptx-widescreen-16-9`)로 등재하되, "기본값 강제"는 하지 않는다.** 근거: 세 도구 중 PowerPoint의 Widescreen이 "2013년부터 그 도구의 명시적 기본값"이라고 공식 문서로 확인되고(리서치 §1.1), 세 도구·다섯 프리셋(13.333×7.5in / 10×5.625in / 4:3 10×7.5in / Google Slides 10×5.625in·960×540px / Keynote 1920×1080px)의 절대 치수가 서로 다르므로(리서치 §1.4) 어느 것도 암묵적으로 강제하지 않고 전부 레지스트리에 등재해 **선언**하게 한다(`print-spec.ts`의 "선언이 정본" 패턴). "기본"은 등재 순서·문서 예시에서의 우선 표기일 뿐 코드가 자동 선택하지 않는다.
  2. **통설/유추 항목(안전영역·최소 글자·6×6)의 기본 동작 = 옵트인, 켜면 경고(비차단).** 근거: 안전영역은 아예 다른 도메인(방송 SMPTE)에서 차용, 최소 글자·6×6은 개인 경험칙으로 1차 실증이 없다(리서치 §2~4). 인쇄물 안전영역(`print-spec.ts`의 3mm 유추값)조차 "같은 물리 현상(재단 오차)의 유추"라는 최소한의 연결고리가 있는데, 슬라이드 안전영역은 그 연결고리도 약하다. 근거 없는 임계값을 기본으로 켜두면 프리모템 2(전체 스캔 옵트인 사유)와 같은 패턴의 실패— "쓰다 보니 성가셔서 무시당한다"—가 재발한다. 확정 사실(캔버스 비율·WCAG 대비)만 기본 on(경고)으로 둔다.
  3. **5b(프로젝터 대비 보정)는 코드화하지 않는다.** 리서치 §6 판정표가 "불가능"으로 판정 — 재고 근거 자체가 없어 임계값을 못 정한다. `print-spec.ts`가 근거 없는 마감 표시(재단 표시 선 길이)를 주석으로만 남긴 선례를 그대로 따른다.
- **사용자가 뒤집을 수 있는 지점(추천안 적용, 실행 전 재검토 환영)**: 결정 2는 horizon 결정 3("경고로 시작")보다 한 단계 더 보수적으로(옵트인) 잡았다 — horizon 결정 3은 "차단이냐 경고냐"의 축이고, 이 결정은 "항상 켜진 경고냐 옵트인 경고냐"라는 별개의 축이다. 사용자가 "통설이라도 항상 경고로 노출하자"고 판단하면 `checkSlideHeuristics`의 `enable` 기본값을 `true`로 바꾸는 1줄 수정으로 뒤집을 수 있다(설계가 이미 그 전환을 위해 분리돼 있다).

## Step 트리

- [ ] **step-1 — 확정 사실만으로 규격 계약이 선다**
  - Artifact: `packages/template-core/src/slide-spec.ts`에 (a) `slidePresets` 레지스트리 — PowerPoint Widescreen(13.333×7.5in)·PowerPoint On-screen Show(10×5.625in)·PowerPoint Standard 4:3(10×7.5in)·Google Slides 기본(10×5.625in, 960×540px)·Keynote 16:9(1920×1080px) 5개, 각 항목에 근거 URL+접근일 주석. (b) `validateSlideDeclaration(declared)` — 선언한 프리셋 id와 실제 px 비율을 대조(`print-spec.ts`의 `validateSpecDeclaration` 패턴 재사용, `SlideSpecViolation` 유니온 타입). (c) `contrastRatio()`/`meetsWcagContrast()` — WCAG 2.1 상대 휘도 공식 그대로 구현, 일반 텍스트 4.5:1·큰 텍스트(18pt 이상 또는 14pt bold 이상) 3:1 판정.
  - Files: write `packages/template-core/src/slide-spec.ts`, `packages/template-core/src/slide-spec.test.ts`.
  - Dependencies: 없음
  - Verify: `npm test` (`packages/template-core`, vitest) 중 `slide-spec.test.ts`가 PASS — (1) 5개 프리셋의 절대 치수가 리서치 §1.4 표와 정확히 일치(PowerPoint Widescreen과 Google Slides 기본은 **비율은 같고 절대 치수가 다름**을 단언하는 테스트 포함), (2) 종횡비가 선언과 다른 가짜 선언에 `SPEC_RATIO_MISMATCH`류 위반 반환, (3) `contrastRatio('#767676', '#FFFFFF')`가 WebAIM 공개 예시값(약 4.5:1)과 오차 0.05 이내로 일치, `meetsWcagContrast` 큰 텍스트 임계(3:1)와 일반 텍스트 임계(4.5:1) 분기가 각각 정확히 갈린다.
  - Failure probe: PowerPoint Widescreen과 Google Slides 기본의 `width`를 실수로 같은 값(예: 둘 다 10in)으로 두면 "절대 치수가 다름" 단언이 실패해 드러난다. `contrastRatio`에서 상대 휘도의 감마 보정(sRGB → linear) 단계를 빼먹으면 WebAIM 알려진 값과 어긋나 (3)이 실패한다.
  - Commit: changeset `slide-spec-contract`.

- [ ] **step-2 — 통설 항목이 근거 등급을 달고 옵트인으로 들어온다**
  - Artifact: `slide-spec.ts`에 (a) `SlideHeuristicViolation` 타입(각 항목에 `evidenceGrade: 'inferred' | 'folklore'` 필드 필수). (b) `checkSlideHeuristics(declaration, textRegions, options)` — 3규칙: 안전영역 인셋(title-safe 90%/action-safe 93%, `evidenceGrade: 'inferred'` — SMPTE 방송 표준 차용), 본문 최소 글자(24pt 하한, 30pt 권장, `evidenceGrade: 'folklore'` — Guy Kawasaki 10/20/30 규칙), 슬라이드당 정보량 상한(불릿 ≤6·불릿당 단어 ≤6, `evidenceGrade: 'folklore'` — 6×6 규칙). `options.enable`(기본 `false`)이 꺼져 있으면 빈 배열, 켜져 있어도 `severity: 'warning'`만 반환하고 예외를 던지지 않는다.
  - Files: write `packages/template-core/src/slide-spec.ts`, `packages/template-core/src/slide-spec.test.ts`.
  - Dependencies: step-1
  - Verify: (1) `options` 생략(기본값) 시, 명백한 위반 fixture(본문 8pt·불릿 10개·단어 12개·안전영역 밖 텍스트)에도 `checkSlideHeuristics`가 빈 배열을 반환한다. (2) `{ enable: true }`면 위 fixture에서 3규칙 위반이 모두 보고되고 각 violation에 `evidenceGrade`가 채워져 있다. (3) 안전영역 안·24pt 이상·불릿 6개 이하 fixture는 `enable: true`에서도 위반 0건. (4) 반환된 모든 violation의 `severity`가 `'warning'`뿐 — 호출부 어디서도 이 결과로 예외를 던지지 않는다(비차단 확인).
  - Failure probe: `enable` 분기를 빼먹고 항상 실행하게 하면 (1)이 실패한다. `evidenceGrade`를 하드코딩 없이 누락시키면 (2)가 실패해 "통설을 확정 사실처럼 침묵으로 내보내는" 회귀를 잡는다.
  - Commit: changeset `slide-heuristics`.

- [ ] **step-3 — 슬라이드 규격이 에이전트 경로에 실린다**
  - Artifact: `docs/design-system/slide-spec.md` 신설 — 5개 캔버스 프리셋 표, WCAG 대비 기준, 통설/유추 3항목의 근거 등급 표(리서치 §8 "확정 사실 vs 확정 못 한 것" 요약을 그대로 인용, 출처 URL+접근일 유지), `checkSlideHeuristics` 옵트인 사용법. `scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS`(또는 해당 section)에 새 항목 등록 → 생성 스크립트 재실행으로 `public/llms/docs/design-system/slide-spec.md`·`public/llms.txt` 파생.
  - Files: write `docs/design-system/slide-spec.md`, edit `scripts/generate-llms-txt.mjs`(항목 등록), 생성물 `examples/ui-vocabulary-site/public/llms/docs/design-system/slide-spec.md`·`examples/ui-vocabulary-site/public/llms.txt`(스크립트 재실행 산출물, 손으로 편집 금지).
  - Dependencies: step-2
  - Verify: `node scripts/generate-llms-txt.mjs`가 exit 0(스크립트 자체가 "인덱스 링크에 실제 파일이 없으면 non-zero" 검사를 이미 함). 배포 후 **배포본 fetch**로 확인 — `https://ui.askewly.com/llms.txt` 응답에 `docs/design-system/slide-spec.md` 링크가 보이고, 그 링크를 다시 fetch한 응답이 마크다운 헤더(`#`)로 시작한다(HTML/404가 아님 — entry-protocol.md의 fetch 검증 규율). 로컬 파일 존재만으로 이 leaf를 닫지 않는다.
  - Failure probe: 로컬에 `slide-spec.md`만 두고 `generate-llms-txt.mjs` 등록·배포를 건너뛰면 배포본 fetch가 404 또는 구버전 `llms.txt`를 반환해 Verify가 실패한다 — 이것이 실사 결함 5·7(VL8과 같은 병리: 자산은 있는데 에이전트 경로 밖)이 슬라이드에서 반복되지 않았음을 증명하는 지점이다.
  - Commit: changeset `slide-medium-publication`.

## 검증/DoD
- **DoD**: 슬라이드 규격 계약(`slide-spec.ts`)이 존재하고, 기계 검증 가능 항목(캔버스 치수·WCAG 대비)만 기본 게이트가 되며, 통설/유추 항목(안전영역·최소 글자·6×6)은 옵트인 경고로 들어오고, 각 항목의 근거 등급(`evidenceGrade`)이 데이터에 명시되고, 규격 문서가 배포본 fetch로 확인된다.
- **Evidence**: `evidence/design-output-gates/dog5-slide-medium.md` — step별 테스트 출력, 배포본 fetch 응답 스니펫, 근거 등급 표 최종본.
- **회귀 게이트**: `npm test`(`packages/template-core`, vitest) + `npm run build`(`packages/template-core`, tsc) 전부 PASS. 문서 등재 후 `node scripts/generate-llms-txt.mjs` exit 0. 레포 루트 `npm run verify`는 이 milestone이 건드리지 않는 표면(`check:lines`/`check:overflow`/`check:exports`/template-production-system)이므로 회귀 확인 차원에서 함께 통과 확인한다.

## 수치 출처
- 캔버스 프리셋 절대 치수(13.333×7.5in, 10×5.625in, 10×7.5in, 960×540px, 1920×1080px)·WCAG 대비 임계(4.5:1/3:1/18pt/14pt)·근거 등급 분류(안전영역 90%/93%, 24pt/30pt, 6×6)는 전부 `research/2026-07-22-design-output-gates-slide-spec.md`가 1차 인용한 공식 문서 수치를 그대로 옮긴 것이며, 이 plan에서 새로 측정하거나 추정하지 않았다. step-1 Verify의 WebAIM 대비 예시값(#767676/#FFFFFF ≈ 4.5:1)은 실행 시 `npm test` 출력으로 직접 재현해 대조한다 — 리서치 문서가 직접 인용한 수치는 아니며 WCAG 공식 대비 공식의 공개 예시로 코드 정확성만 검증하는 용도다.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성.
