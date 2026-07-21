# DOG1 — 검사기 정확도 evidence

> horizon `design-output-gates` · milestone DOG1
> 이 문서는 기록(record)이다. step 진행에 따라 섹션을 **추가**하고, 앞 섹션의 관측값은 고치지 않는다.

## step-1 — 지금 상태를 실측해 고정한다 (2026-07-22)

고치기 전에 잰다. 아래는 **현재 코드(`packages/cli/src/verify.ts`, 무수정)** 로 fixture 4종을 돌린 있는 그대로의 출력이다.

실행: `node packages/cli/dist/index.js verify <fixture 1개만 든 디렉터리> --ext tsx`
(파일별로 격리해 돌렸다 — 한 디렉터리에 몰아 넣으면 파일 단위 집계에 섞인다.)

### 관측 원본

| fixture | 기대(고친 뒤) | **현재 실측** | exit | 판정 |
|---|---|---|---|---|
| `svg.tsx` | 위반 0 | **위반 2** — `6 [hex-literal] fill="#000000"` · `7 [raw-color-fn] stroke="rgb(255, 255, 255)"` | 1 | **오탐** |
| `comment.tsx` | 위반 0 | **위반 2** — `5 [hex-literal] // design ref: #FF0000 …` · `6 [raw-color-fn] /* legacy palette: rgb(10, 20, 30) … */` | 1 | **오탐** |
| `oneline.tsx` | 위반 2 | **위반 1** — `4 [hex-literal]` 만. 같은 줄의 `rgb(1,2,3)` 은 보고되지 않음 | 1 | **누락** |
| `clean.tsx` | 위반 0 | 위반 0 — `verify PASS — 1 file(s) scanned` | 0 | 정상 |

### horizon 실사와의 대조

horizon 문서 "실사로 나온 진짜 결함" 표 1·2·3번과 **전부 일치한다.**

| horizon 결함 # | 선언 | step-1 실측 | 일치 |
|---|---|---|---|
| 1 SVG 내부 오탐 | `<svg><path fill="#000000"/></svg>` → 위반 보고 | `svg.tsx:6` hex-literal 보고 | ✅ |
| 2 주석 오탐 | `// design ref: #FF0000 …` → 위반 보고 | `comment.tsx:5` hex-literal 보고 | ✅ |
| 3 한 줄 다중 위반 누락 | `raw-color-fn` 이 조용히 유실 | `oneline.tsx` 위반 1건(2건이어야 함) | ✅ |

### step-1에서 추가로 드러난 것 (horizon 실사보다 넓다)

horizon 실사는 오탐을 **hex 리터럴**로만 확인했는데, fixture를 규칙별로 갈라 보니 **`raw-color-fn` 도 똑같이 오탐**이다:

- `svg.tsx:7` — SVG `stroke="rgb(255, 255, 255)"` 가 잡힌다
- `comment.tsx:6` — 블록 주석 안의 `rgb(10, 20, 30)` 이 잡힌다

즉 오탐은 규칙 하나의 문제가 아니라 **두 규칙 모두가 문맥(SVG 블록·주석)을 안 보는 구조적 문제**다. step-2의 예외 처리는 규칙별로 붙이지 말고 **스캔 전 단계에서 문맥을 걷어내는 방식**이어야 한다 — 안 그러면 앞으로 규칙이 늘 때마다 같은 오탐이 반복된다.

### 재현 방법 (Failure probe)

이 step은 코드를 바꾸지 않으므로 실패 조건은 하나다 — **기록한 출력이 실제 실행 결과와 다르면 이 step은 무효다.**

```bash
cd packages/cli && npm run build
for n in svg comment oneline clean; do
  mkdir -p /tmp/one-$n && cp test/fixtures/verify-regression/$n.tsx /tmp/one-$n/
  node dist/index.js verify /tmp/one-$n --ext tsx
done
```

위 표의 위반 수·규칙명·줄번호가 그대로 재현되어야 한다.

### 기준선 요약 (step-2·3이 뒤집어야 할 숫자)

- 오탐: **4건** (svg 2 + comment 2)
- 누락: **1건** (oneline의 `raw-color-fn`)
- 정탐: clean.tsx PASS 유지 — step-2에서 예외를 넓게 뚫어도 이 값은 안 바뀌어야 한다
