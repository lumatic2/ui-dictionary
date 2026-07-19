# TH6 step-1 — 실사용 의뢰 1건 (askewly 명함)

- 실행: 2026-07-20
- Plan: `plans/2026-07-20-th6-real-commission.md`
- 의뢰 선택: **명함** (사용자 확정 2026-07-20)
- 산출물: `evidence/template-production-hardening/th6/`

새 기능을 만들지 않고 TH1~TH5·TH9~TH11이 남긴 것만 호출해 실제 결과물 1건을 끝까지 만들었다.

## 전 루프 관측

| 단계 | 무엇을 호출했나 | 실측 |
|---|---|---|
| 1. 의뢰 | `TemplateRequest` — 전유성 / AI Builder · askewly / hello@askewly.com · ui.askewly.com | 600×1050, `askewly.warm` |
| 2. 청사진 선택 | `selectBlueprint` | `business-card-vertical` (2열) — 손으로 고르지 않았다 |
| 3. 규격 | `matchPrintSpec` · `printSheetGeometry` | 한국 표준 90×50mm · 300dpi 591×1063px · 도련 36px · 지면 744×1194 · 규격 위반 0 |
| 4. 소재 | `CodexImageProvider` **라이브 실호출** | 504×396 PNG, **302.9초**, `codex:image_generation:askewly-portrait` |
| 5. 컴파일 | `compileTemplate` | 6노드, `validateTemplateProject` valid, 무결성 위반 0 |
| 6. 편집 | AskewlyDesign 브라우저 실조작 — JSON 가져오기 → 레이어에서 `role` 선택 → 색 토큰 `text.secondary` → `brand.primary` | Revision 0 → **1** |
| 7. 내보내기 | 스튜디오 UI의 JSON/HTML/SVG 버튼 | 6740 / 1069 / 1407 bytes, 다운로드 3건 |
| 8. 왕복 확인 | 내보낸 JSON의 `role.tokenBindings` | `{"color":"brand.primary"}` — 편집이 산출물까지 살아남았다 |
| 9. 실물 렌더 | SVG를 그 형식 그대로 브라우저 렌더 | 재단 표시 8선·도련 확인, **이미지 누락(아래 결함 1)** |

증거: `th6/studio-edit.jpeg`(편집 화면) · `th6/final-artifact-render.png`(최종 산출물) · `th6/commission-log.json`

## 실연이 잡은 결함 (우회하지 않고 계수한다)

### 결함 1 — 내보낸 SVG가 자기완결적이지 않다 **(발주 차단 가능)**

소재 URI가 **파일 경로**다(`C:/Users/.../askewly-portrait.png`). 그 결과:

- 스튜디오에 JSON을 가져오려면 URI를 웹 경로로 **손으로 바꿔야** 했다. 바꾸지 않으면 이미지가 없는 문서가 된다.
- 내보낸 SVG(1,415 bytes)와 PNG(315,785 bytes)가 **따로 다녀야** 한다.
- SVG를 `<img>`로 끼워 렌더하면 외부 참조가 차단돼 **그림 없이 조용히** 그려진다. 인쇄소에 그대로 넘기면 빈 카드가 나온다.

TH5가 "포스터 브라우저 렌더 확인"으로 통과시킨 것은 HTML 경로였다. **SVG 경로의 이 실패는 실사용 루프를 끝까지 돌기 전까지 보이지 않았다.**

→ 소재를 data URI로 인라인하는 것은 export 계약 변경이라 이번 milestone 범위 밖이다. finding 큐 최상단.

### 결함 2 — 소재 생성이 302.9초 걸린다

라이브 imagegen 1건에 5분이다. 계약상 문제는 아니지만 "실사용감"으로는 대화형 편집 흐름에 넣을 수 없는 지연이다. 진행 표시·취소·재시도 경로가 없다.

### 결함 3 — 사람 확인 게이트: 편집기는 **판단 불가** 판정

사용자 판정(2026-07-20):

- **TH11 인쇄 산출물 — 눈으로 확인 완료(통과).**
- **TH10 편집기 — 무엇을 판단해야 하는지 이해되지 않는다.** UI를 뜯어고칠 부분이 너무 많아 화면만 보고는 뭐가 뭔지 분간이 안 된다. **"Figma만큼이라도" UI 업그레이드가 필요하다.**

이건 TH10 구현의 실패가 아니라 **편집기 UI가 아직 판단 가능한 물건이 아니라는 판정**이다. 자동 검증(98 PASS)이 통과해도 사람이 화면을 읽지 못하면 실사용감은 미확인이다.

→ horizon 닫는 기준의 "실사용감" 항목은 이 판정을 반영해야 한다. 편집기 UI 재설계는 별도 horizon/milestone 후보다.

## 판정

전 루프는 **끝까지 돌았다** — 의뢰에서 인쇄용 SVG까지 사람이 손으로 메운 단계 없이(URI 우회 1건 제외) 이어졌다. 다만 산출물이 자기완결적이지 않고(결함 1), 편집 표면은 사람이 판단할 수 있는 상태가 아니다(결함 3).

**무결점 서사를 쓰지 않는다**: 이 실연은 통과 3건·결함 3건이다.
