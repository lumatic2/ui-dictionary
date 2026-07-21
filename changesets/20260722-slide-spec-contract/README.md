# 슬라이드 규격 계약 — 확정 사실만으로 세운다

> 2026-07-22 · milestone DOG5 step-1 · changeset #261

## 왜

매체 실사에서 슬라이드는 **완전 0건**이었다 — 파일도, 코드도, 리서치도 없었다. 리서치가 그 공백을 채우면서 위험한 사실도 함께 드러났다: 슬라이드 "규칙"으로 통용되는 것 대부분이 **1차 출처가 없거나 아예 다른 도메인에서 차용**됐다.

- 안전영역 90/93% → **방송 표준**(SMPTE ST 2046-1). TV용이지 슬라이드용이 아니다.
- 본문 24/30pt → Guy Kawasaki 개인 경험칙. "왜 30인가"의 실증 근거 없음.
- 6×6 → 창안자·1차 연구 특정 실패.

반면 **캔버스 치수와 WCAG 대비는 공식 문서로 확정된다.**

step-1은 확정된 것만 담는다.

## 무엇을

`packages/template-core/src/slide-spec.ts`:

- **`slidePresets` 5종** — PowerPoint Widescreen(13.333×7.5in) · On-screen Show(10×5.625in) · Standard 4:3(10×7.5in) · Google Slides 기본(960×540px) · Keynote(1920×1080px). 각 항목에 출처 URL·접근일 주석.
- **`validateSlideDeclaration`** — 선언한 프리셋과 실제 비율 대조. `print-spec.ts`의 "선언이 정본" 패턴 그대로.
- **`contrastRatio` / `meetsWcagContrast` / `wcagThresholdFor`** — WCAG 2.1 상대 휘도 공식. 레포에 대비 계산 구현이 없어 여기서 처음 추가한다.

## 프리셋에도 근거 등급을 달았다

`evidenceGrade`는 통설 항목(step-2)만의 필드가 아니다. 프리셋 사이에도 근거 두께가 다르다:

| 프리셋 | 등급 | 왜 |
|---|---|---|
| PowerPoint 3종 | `confirmed` | Microsoft 공식 페이지가 수치를 직접 명시 |
| Google Slides | `inferred` | 공식 페이지는 **프리셋 이름만** 밝히고 수치를 안 쓴다 — 960×540은 2차 출처 |
| Keynote | `inferred` | Apple 공식 문서에서 기본값 1차 확인 실패 |

## 코드가 프리셋을 고르지 않는다

**"16:9"라는 이름만으로 절대 캔버스가 정해지지 않는다** — PowerPoint Widescreen 13.333in과 Google Slides 기본 10in은 비율이 같고 크기가 1.333배 다르다. 인쇄에서 90×50과 85×55가 갈린 것과 같은 구조다.

그래서 암묵 기본값을 두지 않았다. 등재 순서상 Widescreen이 먼저인 것은 문서 예시 표기 순서일 뿐이다.

## 비율만 보고 절대 치수는 강제하지 않는다

같은 프리셋을 2배 해상도로 내보내는 것(1280×720 ↔ 1920×1080)은 정상이고, 그것까지 위반으로 잡으면 규칙이 실무를 이긴다. 잡아야 할 것은 **16:9라고 선언하고 4:3으로 만든 것**이다.

## 프로젝터 보정은 코드화하지 않았다

리서치 §6 판정표가 "불가능"으로 판정 — 정량 계수의 출처 자체가 없다. 주석으로만 남겼다. **임계값을 지어내면 근거 없는 숫자가 근거 있는 검사기 안에서 돈다.**

## Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| A | 상대 휘도의 감마 보정(sRGB→linear) 제거 | **2건 실패** — WebAIM 예시값 불일치 + 크기별 분기 케이스 |
| B | Widescreen 치수를 On-screen Show와 같게 | **2건 실패** — "절대 치수가 다르다" 단언이 정확히 무너짐 |

B가 이 step의 핵심 위험(비율만 보고 규격이 같다고 착각)을 정면으로 잡는다.

## Contract

- source of truth: `research/2026-07-22-design-output-gates-slide-spec.md` — 코드는 그 파생물, 리서치가 갱신되면 코드도 갱신
- `TemplateBlueprint.output.medium`에 `'slide'`를 **추가하지 않았다** — 슬라이드 청사진이 0건인 상태에서 컴파일러를 배선하면 제작 파이프라인(horizon 비목표)을 침범한다. 독립 계약 모듈로 낸다.
- out of scope: 통설 항목(step-2), 문서·등재(step-3), 마무리 절차 배선(DOG6)

## 검증

- [x] `slide-spec.test.ts` 11 tests PASS
- [x] `packages/template-core` 전체 208 tests PASS (197 → +11)
- [x] `npm run build`(tsc) exit 0
- [x] Failure probe A·B 실행 후 원복
