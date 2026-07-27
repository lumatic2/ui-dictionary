# 완료 — UE4: Pro 잠금 + 오너 언락

> 완료: 2026-07-28 · work `ue4-pro-lock-owner-unlock` (milestone UE4, goal `ui-encyclopedia`) · 배치: `archive/reports/2026-07-28-ue4-pro-lock-owner-unlock.md` (record — 작성 후 동결)

## 1. 결과

Tailwind Plus 방식 잠금이 실서비스에서 동작한다: 비로그인은 컬렉션당 첫 예제만 Code, 나머지는 Pro 칩+Get the code 모달, 용어 바리에이션 Pro 변형은 블러 잠금. 오너 계정(Google 로그인, 이메일 SHA-256 대조 — 원문은 번들·레포 비노출) 로그인 시 전 예제 Code 탭·복사와 전 변형 조작이 열린다. goal `ui-encyclopedia` 의 마지막 milestone — UE1~UE5 전부 완료.

## 2. 이슈와 해결

- 관측 왕복에서 배포면 결함 3건이 나와 함께 수리: ① 사이트 다크모드에서 카탈로그 가독성 붕괴 → **라이트 고정**(사용자 결정, 다크는 별도 정비 후보) ② OAuth 시작이 same-origin 프록시 경유라 CSRF state 쿠키가 콜백 호스트(askewly.com)와 어긋나 로그인이 `askewly.com/?auth=error` 로 낙하 → **시작만 authority 직행**으로 수리(세션 쿠키는 Domain=.askewly.com 공유라 나머지 경로 무변경) ③ `_redirects` 200 rewrite 가 이 Pages 프로젝트에서 미적용 → SPA fallback 을 **Pages Functions** 로 이전.
- 부수 사고: 라이트 고정 첫 커밋이 TS6133 빌드 실패 상태로 push(`| tail` 이 exit code 를 삼킴) — 즉시 회복, 이후 `${PIPESTATUS[0]}` 확인.
- 한계 명시: 클라이언트 표시 층 게이트(정적 SPA — 우회 가능). 결제 도입 시 서버 게이팅 재설계.

## 3. 증거

- changeset: `changesets/20260728-ue4-pro-lock-owner-unlock` (step-1~3)
- 검증: 세션 mock 3계정 Playwright(비로그인·타 계정 잠금 유지 / 오너 전체 언락) PASS · tsc·build·lint 0 · 배포 스모크(앱 경로 딥링크 전부 200·llms.txt·404 보존). 전문: `evidence/ui-encyclopedia/ue4-pro-lock.md`
- 크기 회고: changeset 1개(절 3개)이나 배포면·인증 플로우 수리 3건이 얹힌 통합 검증 — milestone-grade 정합(연쇄 승인분).
- 실표면: 사용자 지시로 사용자 실브라우저·실계정을 에이전트가 대행 조작 — 실서비스에서 Google 로그인 → 보던 페이지 복귀 → 세션 email 대조 → Code 탭 8/8·unlocked 칩 7·바리에이션 오버레이 0 실측, 스크린샷 `evidence/ui-encyclopedia/ue4-terms-unlocked.png` (관측 3회 왕복, 결함 3건 수리 포함).
- 재현: https://ui.askewly.com/patterns/marketing-footers 에서 오너 Google 계정 로그인 → Code 탭·`/terms/accordion` 변형 확인
