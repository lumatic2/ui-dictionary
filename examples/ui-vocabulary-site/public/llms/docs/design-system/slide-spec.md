# Slide Spec — 발표 매체 규격 계약

지위: **슬라이드 캔버스·대비·통설 규칙의 단일 출처.** 코드 대응물은
`packages/template-core/src/slide-spec.ts`, 근거 정본은
`research/2026-07-22-design-output-gates-slide-spec.md`(모든 출처 URL·접근일 보유).

매체별 게이트 차이는 [medium-taxonomy.md](./medium-taxonomy.md), 지면 규격은
[print-spec.md](./print-spec.md).

## 이 문서를 읽는 법

**슬라이드 규칙의 대부분은 근거가 얇다.** 널리 인용되는 세 규칙(안전영역 90/93%,
본문 24/30pt, 6×6)은 1차 실증이 없거나 아예 다른 도메인에서 차용됐다. 반면 캔버스
치수와 대비 기준은 공식 문서로 확정된다.

그래서 이 문서는 값을 **근거 등급과 함께** 준다. 등급을 지우고 값만 옮기지 말 것.

| 등급 | 뜻 |
|---|---|
| `confirmed` | 1차 출처(표준 문서·공식 벤더 문서)로 확인 |
| `inferred` | 다른 도메인 표준의 유추 적용이거나 2차 출처만 있음 |
| `folklore` | 널리 쓰이지만 1차 실증이 없는 관행 |

## 1. 캔버스 프리셋 (확정 사실 중심)

| id | 도구 | 캔버스 | 비율 | 등급 |
|---|---|---|---|---|
| `pptx-widescreen-16-9` | PowerPoint | 13.333 × 7.5 in | 16:9 | `confirmed` |
| `pptx-onscreen-16-9` | PowerPoint | 10 × 5.625 in | 16:9 | `confirmed` |
| `pptx-standard-4-3` | PowerPoint | 10 × 7.5 in | 4:3 | `confirmed` |
| `gslides-default-16-9` | Google Slides | 960 × 540 px (10 × 5.625 in) | 16:9 | `inferred` |
| `keynote-16-9` | Keynote | 1920 × 1080 px | 16:9 | `inferred` |

**"16:9"라는 이름만으로 절대 캔버스는 정해지지 않는다.** PowerPoint Widescreen
13.333in과 Google Slides 기본 10in은 비율이 같고 크기가 1.333배 다르다. 인쇄에서
한국 명함이 90×50과 85×55로 갈린 것과 같은 구조다 — **비율 일치는 규격 일치가 아니다.**

그래서 **코드가 프리셋을 자동 선택하지 않는다.** 만드는 쪽이 자기 프리셋을 선언하고,
`validateSlideDeclaration()`이 그 선언과 실제 비율을 대조한다.

절대 치수는 강제하지 않는다 — 같은 프리셋을 2배 해상도로 내보내는 것(1280×720 ↔
1920×1080)은 정상이다. 잡는 것은 **16:9라고 선언하고 4:3으로 만든 것**이다.

등급이 갈리는 이유: Google Slides 공식 페이지는 프리셋 **이름만** 밝히고 수치를
쓰지 않으며, Keynote는 Apple 공식 문서에서 기본값 1차 확인에 실패했다.

## 2. 대비 — WCAG 값을 그대로 쓴다 (`confirmed`)

| 텍스트 | AA 임계 |
|---|---|
| 일반 (18pt 미만, 또는 14pt 미만 bold) | **4.5:1** |
| 큰 텍스트 (18pt 이상, 또는 14pt 이상 bold) | **3:1** |

인쇄물과 달리 슬라이드는 **별도 규격을 발명하지 않는다.** 최종 매체가 화면 표시와
물리적으로 다르지 않고(둘 다 발광형 디스플레이 또는 투사), Microsoft 자신이
PowerPoint 접근성 가이드에서 WCAG 값을 그대로 채택한다.

`contrastRatio(fg, bg)` · `meetsWcagContrast(fg, bg, { fontSizePt, bold })`.

> ⚠ **프로젝터 보정은 코드에 없다.** "투사하면 어두워 보이니 대비를 더 확보하라"는
> 방향은 합리적이지만 정량 계수의 출처를 찾지 못했다. 임계값을 지어내면 근거 없는
> 숫자가 근거 있는 검사기 안에서 돌게 된다. 실무에서는 WCAG를 **하한**으로 보고
> 여유를 더 두되, 그 여유는 판단이지 규칙이 아니다.

## 3. 통설·유추 규칙 — 옵트인 (`inferred` / `folklore`)

**기본값은 꺼져 있다.** 켜도 `severity: 'warning'`이고 무엇도 차단하지 않는다.

| 규칙 | 값 | 실제 출처 | 등급 |
|---|---|---|---|
| 안전영역 (title-safe) | 캔버스 90% | **SMPTE ST 2046-1:2009 — TV 방송 표준.** 슬라이드 전용 1차 출처 없음 | `inferred` |
| 본문 최소 크기 | 24pt | Guy Kawasaki 10/20/30 규칙. 저자는 특정되나 "왜 그 숫자인가"의 실증 없음 | `folklore` |
| 불릿 상한 | ≤6개 / 불릿당 ≤6단어 | 6×6 규칙. 창안자·1차 연구 특정 실패 — 방향성만 인지부하 이론이 지지 | `folklore` |

```ts
import { checkSlideHeuristics } from '@askewly/template-core'

// 기본 — 아무것도 보고하지 않는다
checkSlideHeuristics(regions, { canvas })            // []

// 켜기 — 경고만, 예외 없음
checkSlideHeuristics(regions, { canvas, enable: true })
// → [{ code, evidenceGrade, severity: 'warning', basis, message }]
```

반환된 각 violation이 `evidenceGrade`와 `basis`(출처와 그 한계)를 **값으로** 들고
다닌다. 문서 각주는 안 읽히지만 반환값은 읽힌다.

**왜 기본을 껐나.** 근거 없는 임계값을 항상 켜두면 성가셔서 무시당하고, 무시가
습관이 되면 근거 있는 검사(대비·비율)까지 함께 무시당한다. 통설 하나를 켜자고
확정 사실의 신뢰도를 깎는 거래다.

## 4. 확정 못 한 것

리서치가 "출처 확인 실패"로 남긴 항목이다. 이 목록은 **모르는 것을 모른다고 적어둔
것**이지 나중에 채울 빈칸이 아니다.

- 방송 안전영역(90/93%)을 슬라이드에 적용하는 것에 대한 발표 전용 1차 표준
- 6×6 규칙 숫자 자체의 최초 창안자·1차 연구
- 24pt/30pt가 실제 가독성 실험에 기반했다는 근거
- 세 도구 export 시 96 PPI가 벤더 공식값인지
- 프로젝터 환경의 대비 보정 정량 계수
- Google Slides 4:3 프리셋의 정확한 절대 치수
- Keynote 기본값을 명시하는 Apple 1차 출처

## 5. 이 계약이 아직 하지 않는 것

- **슬라이드 청사진이 0건이다.** `TemplateBlueprint.output.medium`에 `'slide'`를
  넣지 않았다 — 만들 것이 없는 상태에서 컴파일러를 배선하면 제작 파이프라인을
  침범한다. 지금은 독립 계약 모듈이다.
- **아무도 이 검사를 자동으로 부르지 않는다.** 마무리 절차가 매체에 따라 이 게이트를
  지시하는 것은 별도 작업이다.
