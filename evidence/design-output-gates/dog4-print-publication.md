# Evidence — DOG4 인쇄 근거가 에이전트 경로에 실린다

> 2026-07-22 · horizon `design-output-gates` · milestone DOG4 · changesets 258·259·260

## 1. 드리프트 검사 (step-1)

`docs/design-system/print-spec.md`는 손으로 쓴 문서가 아니라 `packages/template-core/dist/index.js`에서 값을 뽑아 만든 생성물이다.

```
$ npm --prefix packages/template-core run build
> @askewly/template-core@0.1.0 build
> tsc

$ node scripts/generate-print-spec-doc.mjs
wrote docs\design-system\print-spec.md (7 specs)

$ node scripts/generate-print-spec-doc.mjs --check
print-spec.md OK — 정본과 일치한다.
check exit=0
```

**Failure probe — 생성물임의 왕복 증명**

```
# print-spec.ts 의 kr-business-card-85x55.bleedMm: 3 → 5, 재빌드 후
$ node scripts/generate-print-spec-doc.mjs --check
DRIFT: 커밋된 print-spec.md 가 print-spec.ts 로부터 재생성한 결과와 다르다.
고치는 법: node scripts/generate-print-spec-doc.mjs
probe exit=1

# 원복 후 재빌드
$ node scripts/generate-print-spec-doc.mjs --check
print-spec.md OK — 정본과 일치한다.
restored exit=0
```

왕복이 성립해야 "생성물"이 증명된다 — 실패만 보면 항상 실패하는 검사기와 구분되지 않는다.

**값 대조**: 표의 7개 키(`kr-business-card-90x50`, `kr-business-card-85x55`, `us-business-card-3.5x2`, `iso-a4`~`iso-a1`)가 `printSpecs` 실제 키와 일치. 환산 예시 85mm → 1004px은 리서치 검증 예시(85×55mm → 1004×650px, `research/2026-07-20-template-production-hardening-print-spec.md`)와 일치.

## 2. 매체 게이트 대조 (step-2)

행별 게이트 셀을 뽑아 대조했다.

```
medium-taxonomy OK
exit=0
```

- 화면 행: `다크모드`·`상태` 존재
- 인쇄 행: `래스터화`·`PyMuPDF`·`도련` 존재, `print-spec.md` 링크 존재
- 발표 행: `DOG5` 명시 (규격·게이트 미정을 미정이라고 적음)
- 세 게이트 셀이 **서로 다른 문자열**
- 계기 사고 `2026-07-20` 인용 존재

**Failure probe** — 인쇄 행 게이트 셀을 화면 행과 같은 문구로 치환:

```
인쇄 행에 래스터화 없음
인쇄 행에 PyMuPDF 없음
인쇄 행에 도련 없음
게이트 서술이 겹친다
probe exit=1
```

원복 후 `exit=0`. 매체를 나눠 적었다는 사실만으로는 게이트가 갈렸다는 증거가 안 된다 — 이 probe가 그 상태를 잡는다.

## 3. 배포본 fetch (step-3) — 이 milestone의 실표면

로컬 파일 존재는 검증으로 치지 않는다(VL8 규율: "로컬에 있다고 배포된 게 아니다").

**전파 대기**: push 후 Cloudflare Pages 자동배포 반영까지 15초 간격 폴링 **15회(약 3분 30초)** 소요.

### 3-1. 인덱스 등재

```
$ curl -sf https://ui.askewly.com/llms.txt | grep -n "medium-taxonomy.md\|print-spec.md"
42:- [docs/design-system/medium-taxonomy.md](https://ui.askewly.com/llms/docs/design-system/medium-taxonomy.md): Which gate applies to what: screen / print / deck each fail differently, so each is checked differently. Read this BEFORE assuming the screen checklist (states, dark mode) is the whole job — a print piece that passes it can still be broken paper
43:- [docs/design-system/print-spec.md](https://ui.askewly.com/llms/docs/design-system/print-spec.md): Print contract: trim sizes (KR/US business cards, ISO A4–A1), bleed, safe area, posting margin, 300dpi mm→px conversion, and the validation API. Generated from packages/template-core — the code is canonical
```

### 3-2. 문서 응답

```
$ curl -sI https://ui.askewly.com/llms/docs/design-system/print-spec.md      | head -n 1
HTTP/1.1 200 OK
$ curl -sI https://ui.askewly.com/llms/docs/design-system/medium-taxonomy.md | head -n 1
HTTP/1.1 200 OK
```

### 3-3. 내용 도달 확인 (200은 빈 파일도 낸다)

```
$ curl -sf https://ui.askewly.com/llms/docs/design-system/print-spec.md | grep -n "kr-business-card-85x55\|300dpi 에서"
31:| `kr-business-card-85x55` | 한국 카드지갑 규격 명함 85×55mm | 85×55mm | 3mm | 3mm | — | 1004×650px |
54:300dpi 에서 1mm ≈ 11.811px.

$ curl -sf https://ui.askewly.com/llms/docs/design-system/medium-taxonomy.md | grep -c "PyMuPDF"
2
```

**HTTP 200 만으로 끝내지 않은 이유**: 200은 문서가 도달했다는 증거지 *내용이 온전하다*는 증거가 아니다. DOG2에서 같은 종류의 착각을 했다 — 패키지 존재(HTTP 200)를 버전 존재로 읽었다. 그래서 실제 값(85×55 행의 1004×650px, 환산 상수 11.811)이 배포본에서 읽히는지까지 확인했다.

## 4. 회귀 게이트

```
$ node scripts/generate-print-spec-doc.mjs --check   → exit 0
$ node scripts/generate-llms-txt.mjs                 → exit 0 (159 assets, 무결성 검사 내장)
$ npm run verify                                     → exit 0
$ npm --prefix packages/template-core run build      → 성공
```

## 5. 한계

- **인쇄 게이트는 아직 아무도 부르지 않는다.** 이 milestone은 근거를 에이전트 경로에 실었을 뿐이고, 마무리 절차가 매체에 따라 이 문서를 지시하게 하는 것은 DOG6이다. 등재 ≠ 호출.
- **래스터화 게이트는 문서 규정일 뿐 기계 검증이 없다.** 색·타이포처럼 `verify`가 잡는 항목이 아니라 사람/에이전트가 수행하는 절차다. 자동화 가능성은 DOG7 관측 입력으로 남긴다.
- **발표 매체 칸은 비어 있다** — 의도적. DOG5가 채운다.
