# SQ2 — 구조 결함 O5·O6·O7 수리 완료 보고 (2026-07-28)

## 1. 결과

- UE1 관측 이월 구조 결함 3건 수리 완료, 실배포 반영 + **사람 관측 1회 통과**(2026-07-28).
- O5: 히어로 primary CTA 부활 → `/get-started` 시작 가이드 실콘텐츠 착지(노출 정책 위반 없음, SPA 폴백 함수 포함). O6: `/docs` 랜딩 = 소개+허브(기존 미배선 DocsCatalogLanding 재작성, 기본 착지 docs-all 전환). O7: 사이드바 term 링크 항목 타입 도입 → Application UI 축 Components 그룹(기본 컴포넌트 용어 16종 직행).
- 사용자 결정 3건은 계획 단계에서 전부 소진(AskUserQuestion) — 실행 중 추가 결정 0.

## 2. 이슈와 해결

- fresh 계획 검증자(sonnet) 지적 3건을 실측 확인 후 계획에 선반영 — functions 경로 오기(레포 루트가 정본), 기존 DocsCatalogLanding 누락, 사이드바 filter 패턴과 term 직행 충돌.
- O6 1차 구현에서 허브가 docs-all 매칭 용어 수백 행 덤프(풀페이지 14,000px)에 묻힘 — 스크린샷으로 적발, 랜딩에서 목록 억제.
- 신규 페이지 카피의 `⌘K` 안내가 사이트 상단바 표기(`Ctrl F`)와 불일치 — 정합화.
- 크기 회고: step 3개·changeset 디렉터리 1개(README 3절) — milestone 라벨 정합.

## 3. 증거

- evidence: `evidence/site-quality/sq2-structural-defects.md` (결함별 실측 표·회귀 게이트·실배포 확인·관측 기록)
- 실표면: 실배포 `ui.askewly.com` 실브라우저(Playwright) — `/get-started` 직접 진입 렌더·`/docs` 허브·홈 히어로 CTA·`/patterns/application-ui` Components 그룹, 콘솔 에러 0 + **사용자 사람 관측 1회 통과**.
- 재현: dev 서버 + 세션 scratchpad `sq2_step{1,2,3}_check.py`(Playwright) · `npx @askewly/design verify src/components --ext tsx` → 7건(SQ1 이월 타이포)만 출력, 색 0 유지.
- 평가 못 함: 없음.
