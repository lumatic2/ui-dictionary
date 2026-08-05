# M30 — `custom` 테마의 다크 판본

> 2026-08-06 · plan `plans/2026-08-05-m30-custom-dark-face.md` · cross-repo(`custom-skills/promoted/pt`)

## 무엇이 비어 있었나

4번째 테마 선택지 `custom` 은 M17(2026-08-04)부터 있었다. 비어 있던 것은 **다크 얼굴** 하나 —
`DESIGN.md` frontmatter 에 `themes.dark` 오버라이드 **37행**(ui-dictionary 기준, `tokens/askewly.tokens.json`
의 semantic 색 토큰 **37/37** 다크 보유와 정확히 일치)이 실려 있는데 **변환기가 `themes` 를 한 번도 읽지
않았다**(grep 0건). 그래서 "내 레포 브랜드로 만든 어두운 덱"이 불가능했고, 발표장 조명이 어두우면
브랜드를 포기하고 canonical `dark` 로 가야 했다.

## 구현 (step-1)

- `parseThemeOverrides(fmText, mode)` — `themes.<mode>` 의 **점 경로 리프**를 수집한다. 참조는 primitive 를
  가리키고 primitive 는 모드와 무관하므로, base leaves 에 덮어쓰기만 하면 기존 `resolve`/`get` 이 그대로
  동작한다. **다크 전용 규칙 세트를 만들지 않았다** — 규칙이 둘이면 어느 쪽이 정본인지 알 수 없어진다.
- `--mode light|dark`. **미지정은 기존 동작 유지**(M17 브랜드 탐지 경로 무회귀).
- 다크를 달라 했는데 실을 것이 없으면 **exit≠0**. flat(`colors:`) 양식은 형식 판정 **뒤에** 거부한다 —
  순서가 뒤집히면 flat 사용자가 "themes 를 못 찾았다"는 엉뚱한 안내를 받는다.

## 검증

| 검사 | 결과 |
|---|---|
| `--self-test` | **13/13** (기존 6 + 신규 7) · 배포본에서도 13/13 |
| 두 모드 변수 수 | 각 **29** (`customThemeErrors` 통과 — 누락·미지 0) |
| 다크 ≠ 라이트 | **24/29** 상이 (라이트 복사면 병합 실패 — self-test 가 고정) |
| 참조 미해석 | **0** (`{color.` 잔존 없음) |
| WCAG AA (다크) | 18.60 · 16.73 · 7.79:1 |
| M17 경로 회귀 | 모드 미지정 산출이 M30 이전 실측과 **29/29 동일** |
| canonical 3종 | **diff 0** (dark·light·askewly 무변경) |
| 다크 부재 프로젝트 | 킥스타트 생성 flat `DESIGN.md` 에 `--mode dark` → **exit 1** + 형식 안내 |

## 실덱 관측 (step-2 — 사람 게이트)

`fixtures/custom-theme-smoke` 를 라이트/다크 두 판본으로 빌드해 실브라우저(1280×720) 렌더.
스크린샷 4장(표지·카드 × 2모드) — 세션 scratchpad `m30shots/`, 사용자 제시는 Artifact 1본.

- 실측 CSS 변수 — 다크: `--bg-primary #0b0d14`(= SSOT `gray.12`) · `--text-primary #fafafa` ·
  `--accent-start #b9faf8` · `--accent-end #a663cc`. 라이트: `#fafafa` / `#0b0d14` / `#6f2dbd` / `#a663cc`.
- 콘솔 에러 **0**.

### 사용자 판정 — 다크 액센트는 민트로 둔다 (2026-08-06)

SSOT 다크에서 `action.primary` 는 `gray.1`(거의 흰색)이고, 변환기의 `isNeutral` 이 무채색을 액센트에서
배제하므로 다음 후보인 `action.secondary` = askewly **민트**(`#b9faf8`)가 `accent-start` 가 된다.
즉 라이트는 보라→오키드, 다크는 민트→오키드다.

**이것은 결함이 아니라 SSOT 가 다크에서 실제로 그렇게 정의돼 있어서 나온 결과**이고, 사용자가 실덱을
보고 **"민트로 두지"** 로 확정했다. 다크 전용 액센트 예외를 만들지 않는다 — 계획 기술결정 ⑤ 유지.

## 배선

- `SKILL.md` §6: `custom` 항목에 두 얼굴 명시 + 「밝기 선택(M30)」 문단(커맨드 2줄 + 다크 부재 시 canonical
  제안). `references/style-system.md` 커스텀 테마 절에 계약 추가.
- 호출자 = `/pt` 덱 제작 절차 §7-5 의 브랜드 탐지 단계. **실발화 증거** = 이 관측이 그 경로로
  `--mode dark` 를 실제로 돌려 덱 2본을 렌더했다.
- 배포는 `bash ~/projects/custom-skills/setup.sh` 단일 경로(배포본 직접 편집 금지) — 배포 후 배포본
  self-test 13/13 재확인, 소스↔배포본 정합 훅 통과.

## 재현

```bash
cd ~/projects/custom-skills/promoted/pt/scripts
node design-md-to-theme.mjs --self-test                                    # 13/13
node design-md-to-theme.mjs ~/projects/ui-dictionary/DESIGN.md out.json --mode dark
```

## 남긴 것

- 없음. `slide-spec.md` §6 의 "dark/light canonical 테마의 SSOT 파생" 잔여 줄은 **철회**로 정리했다 —
  그 줄이 가리키던 작업이 사용자 의도와 다른 물건이었기 때문이며, 경위와 교훈을 같은 자리에 남겼다.
