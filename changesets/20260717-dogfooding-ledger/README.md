# Dogfooding Ledger 인프라

- Date: 2026-07-17
- Milestone: AD3 Step 1 (`docs/plans/2026-07-17-ad3-realwork-dogfooding.md`)
- Scope: `docs/research/dogfooding/ledger.md`(신규)

## What

- AD3 정본 장부 신설: 건별 스키마(id/과제/유형/수행 주체/라우팅 발화/시그니처 판정/마찰/갭/evidence). 부정 결과(미발화·FAIL)도 장부화하는 계약 명시. 갭 열 = AD4 입력.

## Verification

- [x] 스키마가 AD2 판정 형식(원칙 5·비선호 5)과 AD4 갭 입력을 담음
- [x] 실패 모드: '라우팅 발화' 필드가 미발화 기록을 강제(부정 결과 장부화 가능)
