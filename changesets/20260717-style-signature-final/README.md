# Style Signature 인터뷰 확정 + 판정 편입

- Date: 2026-07-17
- Milestone: AD2 Step 2 (`docs/plans/2026-07-17-ad2-style-signature.md`)
- Scope: `docs/design-system/style-signature.md`(확정), `docs/design-system/entry-protocol.md`(판정 단계 편입 + 프로젝트 토큰 우선 규칙), `scripts/generate-llms-txt.mjs`(Principles 섹션 노출), 재생성 `public/llms.txt`·`public/llms/**`

## What

- **인터뷰 확정 (2026-07-17)**: "특정 스타일을 고정하지 않는다" 방향으로 재구성 — 운용 원칙 5(토큰 파생·액센트=신호·절제된 계층·상태 완비·실험적 터치는 수동) + 비선호 5(좌측 컬러 라인 카드·한글 단어 잘림·어색한 줄바꿈·이모지 아이콘·대충 그린 CSS). 점수제 폐기(사용자 피드백: 이해 불가) → "원칙 전부 + 비선호 0건" 단순 판정. ui-dictionary 구체 규칙(pill 금지 등)은 DESIGN.md 소유의 프로젝트 시그니처로 강등.
- **팔레트 프로젝트별 확정 반영**: entry-protocol 토큰 단계에 "작업 프로젝트의 DESIGN.md/토큰 SSOT 우선, 없으면 askewly tokens.css 기본값" 규칙 추가.
- **판정 루프 편입**: entry-protocol step 3에 "보고 전 style-signature 판정 포함" 의무 추가, llms.txt Principles 섹션에 signature 노출 (45 assets).

## Verification

- [x] `node scripts/generate-llms-txt.mjs` 재생성 + 링크 무결성 PASS (45 assets)
- [x] 실판정 1회 구동: AD1 E2E 산출물 3건 재판정 — r1 pricing(발명 팔레트) FAIL(원칙1, 23건), codex onboarding(발명 팔레트) FAIL(원칙1), r3 settings(토큰 파생) FAIL(비선호2: 한글 keep-all 누락 — 새 기준이 기존 통과작의 결함을 추가 적발)
- [x] 실패 모드: 비스타일 산출물(발명 팔레트 2건)이 PASS로 새지 않음 — 변별력 확인
- [x] 배포 후: `curl https://ui.askewly.com/llms/docs/design-system/style-signature.md` 200 + 정본 내용("canonical, user-approved" 확인, 2026-07-17)
