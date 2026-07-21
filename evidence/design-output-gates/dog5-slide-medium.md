# Evidence — DOG5 슬라이드 매체 신설

> 2026-07-22 · horizon `design-output-gates` · milestone DOG5 · changesets 261·262·263

## 1. 규격 계약 (step-1)

`packages/template-core/src/slide-spec.ts` 신설. 확정 사실만 — 캔버스 프리셋 5종 + WCAG 대비.

```
$ npx vitest run src/slide-spec.test.ts
 ✓ src/slide-spec.test.ts (11 tests)
 Tests  11 passed (11)
```

### 프리셋 근거 등급

| 프리셋 | 캔버스 | 등급 | 근거 |
|---|---|---|---|
| `pptx-widescreen-16-9` | 13.333 × 7.5 in | `confirmed` | Microsoft 공식 페이지가 수치 직접 명시 |
| `pptx-onscreen-16-9` | 10 × 5.625 in | `confirmed` | 동일 |
| `pptx-standard-4-3` | 10 × 7.5 in | `confirmed` | 동일 |
| `gslides-default-16-9` | 960 × 540 px | `inferred` | 공식 페이지는 **프리셋 이름만** 밝힘, 수치는 2차 출처 |
| `keynote-16-9` | 1920 × 1080 px | `inferred` | Apple 1차 확인 실패 |

### Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| A | 상대 휘도의 감마 보정(sRGB→linear) 제거 | **2건 실패** — WebAIM 예시값 불일치 + 크기별 분기 케이스 |
| B | Widescreen 치수를 On-screen Show와 동일하게 | **2건 실패** — "절대 치수가 다르다" 단언 붕괴 |

B가 이 step의 핵심 위험을 정면으로 잡는다: **비율 일치는 규격 일치가 아니다.**

## 2. 통설 옵트인 (step-2)

```
$ npx vitest run src/slide-spec.test.ts
 Tests  17 passed (17)      # 11 → +6
```

| 규칙 | 실제 출처 | 등급 |
|---|---|---|
| 안전영역 90% | SMPTE ST 2046-1:2009 — **TV 방송 표준**. 슬라이드 전용 1차 출처 없음 | `inferred` |
| 본문 24pt | Guy Kawasaki 10/20/30 — 저자 특정되나 숫자의 실증 없음 | `folklore` |
| 6×6 | 창안자·1차 연구 특정 실패 | `folklore` |

기본 동작 확인:
- `checkSlideHeuristics(messy, { canvas })` → `[]` (명백한 위반 fixture에도)
- `checkSlideHeuristics(messy, { canvas, enable: true })` → 4 code 전부 보고, 모든 항목에 `evidenceGrade`·`basis` 존재, `severity`는 전부 `'warning'`

### Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| C | `enable` 분기 제거(항상 실행) | **1건 실패** — "기본값에서는 아무것도 보고하지 않는다" |
| D | 모든 `evidenceGrade`를 `confirmed`로 위조 | **2건 실패** — "확정 사실인 척 나가지 않는다" + 등급 구분 |

⚠ **사고**: probe 원복에 `git checkout <file>`을 써서 아직 커밋되지 않은 step-2 구현을 통째로 날렸다(HEAD가 step-1이었다). 재작성으로 복구했고 결과는 동일하다. **미커밋 상태에서 `git checkout`은 되돌리기가 아니라 삭제다.**

## 3. 배포본 fetch (step-3)

**전파 대기**: 15초 폴링 **20회(약 5분)**. DOG4(15회)보다 길었다.

```
$ curl -sf https://ui.askewly.com/llms.txt | grep -n "slide-spec.md"
43:- [docs/design-system/slide-spec.md](https://ui.askewly.com/llms/docs/design-system/slide-spec.md): Slide contract: five canvas presets across PowerPoint/Google Slides/Keynote (16:9 alone does NOT fix the canvas — 13.333in vs 10in), WCAG contrast, and the folklore rules (safe area, 24pt minimum, 6x6) shipped opt-in with an evidence grade attached to every value

$ curl -sI https://ui.askewly.com/llms/docs/design-system/slide-spec.md | head -n 1
HTTP/1.1 200 OK
```

**마크다운인지 확인**(HTML/404가 아님 — entry-protocol fetch 검증 규율):

```
$ curl -sf .../slide-spec.md | head -c 120 | od -c
0000000   #       S   l   i   d   e       S   p   e   c     342 200 224 ...
```

첫 바이트가 `#`. 내용 도달 확인:

```
28:| `pptx-widescreen-16-9` | PowerPoint | 13.333 × 7.5 in | 16:9 | `confirmed` |
67:**기본값은 꺼져 있다.** 켜도 `severity: 'warning'`이고 무엇도 차단하지 않는다.
71:| 안전영역 (title-safe) | 캔버스 90% | **SMPTE ST 2046-1:2009 — TV 방송 표준.** 슬라이드 전용 1차 출처 없음 | `inferred` |
```

**분류표 발표 행이 실체를 가리키는지**(DOG4가 남긴 빈칸):

```
$ curl -sf .../medium-taxonomy.md | grep -o "발표 (deck).\{0,90\}"
발표 (deck)** | 슬라이드 덱 | [slide-spec.md](./slide-spec.md) | 선언한 **캔버스 프리셋**과 실제 비율이 맞는가(`validateSlid…
```

## 4. 회귀 게이트

```
$ npx vitest run          (packages/template-core)  → 13 files / 214 tests PASS
$ npx tsc --noEmit                                  → exit 0
$ node scripts/generate-llms-txt.mjs                → exit 0 (160 assets)
$ node scripts/generate-print-spec-doc.mjs --check  → exit 0
$ npm run verify                (repo root)         → exit 0
```

## 5. 한계

- **슬라이드 청사진이 여전히 0건이다.** 계약과 검증 함수만 있고 만들 대상이 없다. `TemplateBlueprint.output.medium`에 `'slide'`를 넣지 않은 것은 의도된 보류다 — 만들 것이 없는 상태의 컴파일러 배선은 제작 파이프라인(horizon 비목표) 침범이다.
- **아무도 이 검사를 자동으로 부르지 않는다.** DOG6이 마무리 절차에 배선한다. 등재 ≠ 호출.
- **`checkSlideHeuristics`는 텍스트 영역을 인자로 받는다** — 실제 슬라이드 파일(pptx/Google Slides)에서 그 영역을 추출하는 경로는 없다. 계약은 섰지만 입력 파이프가 없다.
- **프로젝터 보정은 영구 공백일 수 있다.** 리서치가 정량 계수를 못 찾았고, 못 찾은 이유가 "아직 안 찾아서"가 아니라 표준이 없어서일 가능성이 높다.
