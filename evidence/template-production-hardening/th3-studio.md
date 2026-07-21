# TH3 — AskewlyDesign 템플릿 편집 배선 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th3-studio-real-editing.md` (2026-07-20 개정 — 편집 표면 단일화)
- Changesets: `20260720-studio-token-driven-render`, `20260720-askewly-design-template-gallery`, `20260720-askewly-design-roundtrip-and-studio-retire`

## 계획 개정

착수 시 계약은 "스튜디오는 좁은 표면으로 유지, 범용 캔버스와 통합하지 않는다"였다. step-1 완료 후 사용자 지시로 **편집 표면을 AskewlyDesign 하나로** 단일화했다. 근거는 실측이었다 — 컴파일된 템플릿의 `scene`이 이미 AskewlyDesign의 `CanvasDocument`이고(6종 `validateDocument` VALID), step-2로 만들려던 편집 기능이 이미 그 앱에 있었다.

사용자 결정 2건: 스튜디오 **은퇴** / 진입은 **청사진 6종 갤러리**.

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 토큰 변경이 렌더를 바꾼다 | computed style 관측 | 캔버스 `#f7f2e8` → `#1c2320`, 이름 `#2b241b` → `#f4efe4` | PASS |
| 6종을 골라 캔버스에서 편집 | 앱에서 직접 | 서명 6개 전부 상이, 텍스트 편집 rev 1→2 | PASS |
| 왕복에서 편집 상태 무손실 | 내보내기→가져오기 | 전환 후 되가져와 10노드·편집분·서명 일치 | PASS |
| 편집 표면 하나만 남는다 | 스튜디오 은퇴 | `apps/template-studio` 삭제, archive 이동 | PASS |

## 실패 경로 확인

| # | 무엇을 훼손했나 | 결과 |
|---|---|---|
| 1 | 없는 `tokenSetId` | 진단 패널 + 빗금 표면, 폴백 색 주입 0 |
| 2 | 없는 청사진 id (카드 주입) | `열기 실패` 표시, 기존 캔버스 6노드·편집값 보존 |
| 3 | 없는 토큰 세트로 시작 | `TOKEN_SET_NOT_FOUND` 예외 |
| 4 | 필수 content 공백 | `CONTENT_INCOMPLETE` 예외 |
| 5 | 반복 목록 최소 미달 | 컴파일러 거부 |
| 6 | 깨진 JSON 가져오기 | 차단, 문서 무변경 |
| 7 | 스키마 불일치본 | 차단, 문서 무변경 |
| 8 | 필수 슬롯 삭제본 | `MISSING_CONTENT ...` 차단, 문서 무변경 |

## 근접 실패 2건

1. **왕복 probe가 거짓 결함을 만들 뻔했다.** 합성 `blur`가 React 19의 `onBlur`(=`focusout`)를 발화시키지 못해 텍스트가 커밋되지 않았고, "내보내기가 편집분을 누락한다"는 결과가 나왔다. 도구를 고치자 rev 1→2로 정상 동작. 관측 도구의 결함을 제품 결함으로 기록할 뻔했다.
2. **line-length 가드가 새 파일에서 걸렸다.** `starter.ts`의 SVG 자리표시 문자열이 369자였다. 가드가 실제로 작동한다는 확인이기도 하다.

## 적발 — 중대: 캔버스가 템플릿을 디자인으로 그리지 않는다

템플릿은 열리고 편집되지만 **회색 상자**로 보인다(`th3/askewly-design-business-card.png`). 원인 셋:

1. **토큰 세트 우주가 둘.** `CanvasSurface`는 `editorTokenMaps`(`askewly.default`/`dark`)만 보고, 템플릿의 `askewly.warm`은 **조용히 폴백**된다 — step-1이 스튜디오에서 없앤 그 패턴이 편집기에 그대로 있다.
2. **`background` 바인딩만 해석.** `fill`·`color`·`fontFamily`·`textStyle` 미적용.
3. **이미지 노드 미렌더 + 계약 공백.** `CanvasDocument`에는 `assetId`만 있고 자산 목록은 `TemplateProject.assets`에 있어 편집기가 URI를 찾을 경로가 없다. 내보낸 HTML/SVG도 같은 이유로 색을 담지 못한다(도형 `fill`이 `#000000` 리터럴).

렌더러 + 문서 계약 + 자산 해석에 걸치므로 **milestone 급**이다. TH5(생성 소재로 이미지 슬롯 채우기)의 선행 조건이기도 하다.

## 크기 회고

changeset 3개(선언 `changesets>=3`) — 라벨 정합. 테스트: core 41 → 72, agent-design 78 → 83.
