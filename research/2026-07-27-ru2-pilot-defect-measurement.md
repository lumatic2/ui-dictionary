# RU2 재료 — 파일럿 실물 실측 (타이포·레이아웃)

> 2026-07-27 · 소비처: milestone RU2 (horizon `real-use-lap`) · 직접 조사
> 대상: `examples/getdesign-pptx-pilot/` (6장 native PPTX + 웹 — `2e83cf8` 로 main 이식)

## 왜 실측했나

RU1 의 결함 D1~D9 가 소실됐다(→ `evidence/real-use-lap/ru1-deck-production.md`). RU2 는 물려받을 결함 목록이 없다. 반면 **RU1 의 덱과 달리 이 파일럿은 남아 있어 실제로 열어서 잴 수 있다.** 사용자가 지목한 2축(타이포·레이아웃)을 이 실물에서 수치로 확정하는 것이 이 리서치의 목적이다.

전부 실행·계산 관측이다. 추정 없음.

## 발견 1 — 게이트는 있는데 PPTX 를 못 본다 ★

DOG3 가 타이포 단계 검사기를, DOG1~2 가 색 검사기를 만들어 `@askewly/design@0.2.0` 으로 npm 에 배포했다. DOG6 이 그 호출을 `askewly-design` 마무리 절차에 배선했다.

파일럿에 실제로 돌렸다:

```
$ npx @askewly/design@0.2.0 verify examples/getdesign-pptx-pilot/src --ext mjs,jsx,css
verify FAIL — 23 violation(s) in 6 file(s)
  styles.css:17 [typography-scale-exceeded] font-size steps: 11, 12, 13, 14, 15, 17, 19, 20, 23, 28 (10 > limit 5)
  ...hex-literal 22건
```

**게이트는 정상 작동하며 웹 쪽 위반을 정확히 잡는다.** 그런데:

```
$ ... | grep -c "generate-pptx"
0
```

**`generate-pptx.mjs` 는 한 건도 검사되지 않았다.** PPTX 의 타이포는 CSS `font-size` 가 아니라 JS 객체 속성 `fontSize: 34` 로 선언되기 때문이다. 검사기의 정규식이 그 형태를 모른다.

즉 **사용자가 눈으로 본 결함이 정확히 게이트의 사각지대에 있다.** VL8·DOG5 와 같은 병리의 세 번째 변형이다 — 자산은 있는데(검사기) 대상 표면 밖이다.

## 발견 2 — 타이포: PPTX 11단계 (한도 5)

`generate-pptx.mjs` 가 실제로 렌더하는 글자 크기:

| pt | 쓰임 |
|---|---|
| 34 | 1장 제목 |
| 29 | 2~6장 제목 |
| 16 | 6장 패널 본문 |
| 13.5 | 본문 |
| 13 | 6장 "DESIGN.md" |
| 12 | 카드 제목 |
| 9 | 버튼 |
| 8 | 쪽번호 |
| 7.5 | eyebrow · 헤더 로고 |
| 6.8 | 카드 번호 |
| 6.5 | 푸터 |

**11단계.** 검사기 한도는 5다. 웹(10단계)보다 나쁘다. (`addTitle` 의 기본값 31 은 항상 덮여 쓰이지 않는 죽은 값이라 셈에서 뺐다.)

단계가 비율이 아니라 **임의값**이다 — 6.5 / 6.8 / 7.5 / 8 / 9 는 서로 1.05~1.13배로, 인쇄 거리에서 구분되지 않는 차이다. 구분 안 되는 단계는 위계를 만들지 못하고 정렬만 흐트러뜨린다.

### 파생 결함 — 선언한 크기가 렌더되는 크기가 아니다

제목·본문·카드 텍스트에 `fit: "shrink"` 가 걸려 있다. 상자에 안 맞으면 PowerPoint 가 자동 축소한다. 따라서 **소스의 34pt 가 화면의 34pt 라는 보장이 없고**, 슬라이드마다 제목 실제 크기가 다를 수 있다. 타이포 단계를 소스에서 읽어 검사하는 방식 자체가 이 옵션 앞에서 무력해진다.

## 발견 3 — 레이아웃: 그리드가 없다

`node` 로 좌표를 계산한 결과 (LAYOUT 13.333×7.5 in):

| 결함 | 실측 |
|---|---|
| **제목 상자가 카드 열을 침범** | 제목 우측단 9.520 in vs 카드 좌측단 8.200 in → **1.320 in 침범**. 카드1과 1.360 sq-in, 카드2와 0.475 sq-in 실제 겹침 |
| **좌우 여백 비대칭** | 좌 0.620 in / 우 0.683 in → 0.063 in 차이 |
| **푸터 베이스라인 어긋남** | 푸터 y=7.020 vs 쪽번호 y=6.960 → 0.060 in |
| **세로 리듬 없음** | 헤더선→eyebrow 0.51 / eyebrow→제목 0.40 / 카드간 0.33 — 공배수 없음 |
| **좌표가 매직넘버** | x 값이 0.62 · 8.2 · 8.5 · 12.05 로 흩어짐. 열 정의·거터 상수 없음 |

제목 침범이 가장 중하다. `fit: "shrink"` 가 있어 **글자가 짧으면 안 보이고 길면 카드 위로 올라탄다** — 즉 결함이 내용 길이에 따라 나타났다 사라진다. 사용자가 "여러 부족함"이라고 표현한 성격과 맞는다.

## 발견 4 — 발표 게이트 미실행

DOG5 가 만든 `validateSlideDeclaration` 은 `ROADMAP.md` RU1 Gap 줄이 적은 대로 **실사용 0회**다. 이 파일럿도 통과시킨 적 없다. 파일럿의 검증(`verify:pptx`)이 확인하는 것은 `slides=6 nativeText nativeShapes flattenedImages=false` 뿐 — **편집 가능성만 보고 조판 품질은 안 본다.**

## RU2 로 넘기는 판단 재료

측정이 말하는 것은 "덱을 예쁘게 고치자"가 아니다:

1. **결함은 이미 기계가 잴 수 있는 종류다** — 11단계, 1.32 in 침범, 0.063 in 비대칭은 전부 수치다. 사람 취향 문제가 아니다.
2. **그런데 기계가 그 표면을 안 본다** — 검사기는 CSS/TSX 를 보고 PPTX 생성기를 안 본다.
3. **따라서 "검사기를 하나 더 만든다"가 아니라 "있는 검사기가 이 표면을 보게 한다"가 RU2 의 뼈대여야 한다** — DOG horizon 의 교훈과 같은 형태다.
4. **D10(브리프 건너뜀)은 별개 층이다** — 타이포·레이아웃은 "어떻게 보이나", D10 은 "무엇을 말하나". 같은 milestone 에 섞으면 둘 다 흐려진다.

## 포화

좁은 기술 확인이라 외부 소스가 없다. 대상 파일 6개(`theme.mjs`·`generate-pptx.mjs`·`deck-content.mjs`·`styles.css`·`App.jsx`·`verify-pptx.mjs`)를 전수 읽고 검사기를 실행·좌표를 계산해 닫았다. 새 사실이 더 나올 표면이 레포 안에 없다 — **포화 종료.**

## 재현

```bash
npx @askewly/design@0.2.0 verify examples/getdesign-pptx-pilot/src --ext mjs,jsx,css
grep -oE 'fontSize: [0-9.]+' examples/getdesign-pptx-pilot/src/generate-pptx.mjs | sort -u
```
