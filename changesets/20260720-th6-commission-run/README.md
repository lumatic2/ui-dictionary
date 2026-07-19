# changeset: TH6 실사용 의뢰 실연 (askewly 명함)

- Date: 2026-07-20
- Plan: TH6 step 1 (`plans/2026-07-20-th6-real-commission.md`)
- 증거: `evidence/template-production-hardening/th6-commission.md` + `th6/`

코드 변경 없음 — TH1~TH11 산출물만 호출해 실제 결과물 1건을 끝까지 만든 실연이다.
남는 것은 산출물과 관측 기록이며, 그 기록이 **결함 3건**을 포함한다.

## 통과

- `selectBlueprint`가 의뢰에서 청사진을 골랐다(`business-card-vertical`).
- Codex imagegen 라이브 실호출로 504×396 PNG 소재 생성.
- 브라우저 스튜디오에서 JSON 가져오기 → 색 토큰 편집 → Revision 1 → 3형식 내보내기.
- 편집이 산출물까지 살아남았다(`role.tokenBindings.color = brand.primary`, SVG에 `#2f7d4f`).
- SVG를 그 형식 그대로 렌더해 도련·재단 표시 육안 확인.

## 결함

1. **내보낸 SVG가 자기완결적이지 않다** — 소재 URI가 파일 경로라 SVG(1.4KB)와 PNG(316KB)가 따로 다니고, `<img>`로 끼우면 그림 없이 조용히 렌더된다. 발주 차단 가능. (finding 큐 최상단)
2. **소재 생성 302.9초** — 대화형 편집 흐름에 넣을 수 없는 지연. 진행 표시·취소 없음.
3. **편집기가 사람 판단 불가 판정** — 사용자가 화면을 보고 "뭐가 뭔지 분간이 안 된다, Figma만큼이라도 UI 업그레이드 필요"로 판정. TH11 인쇄 산출물은 같은 자리에서 통과.

## Verification

- [x] 전 루프 9단계 실행 기록 (`th6/commission-log.json`)
- [x] 최종 산출물을 그 형식 그대로 렌더 (`th6/final-artifact-render.png`)
- [x] 사람 확인 게이트 실행 — 인쇄 통과 / 편집기 판단 불가
