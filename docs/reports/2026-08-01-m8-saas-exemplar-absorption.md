# M8 · SaaS exemplar 흡수 (Linear·Vercel/Geist → 대시보드 밀도·저소음 위계) — 완료 보고

Date: 2026-08-01 · Goal: `reference-diversification` (연쇄 2/2 — goal 마감) · Plan: `archive/plans/2026-08-01-m8-saas-exemplar-absorption.md`

## 1. 결과

Tier 2 소스(Linear·Vercel/Geist)가 RL 루프를 완주해 goal `reference-diversification` 이 닫혔다. 산출물: ① `knowledge/dashboard-density.md` 신설 — 밀도≠소음 대원칙·주의 예산(내비는 도착 후 후퇴)·structure felt not seen(여백→배경→라운딩→선 순서)·상태색은 스케일 인접 단계·텍스트 2단 위계 + 에이전트 판정 절차, llms 노출(자산 170) ② terms 보강 3건(sidebar-nav·divider·table-density-control) ③ ledger 에 t2 source 행 — 이제 장부가 tailwind/t1/t2 세 소스 축을 가진다. Linear 2026-03 리프레시 원문이 밀도 판정의 뼈대를 제공했고, Geist 10-스케일 역할 밴드는 우리 3-tier 토큰의 상태색 규칙로 번역됐다.

## 2. 이슈와 해결

- Linear 실제품 내부는 로그인 벽 → 공식 리프레시 원문(2026-03-12, 전후 비교 서술 포함)으로 대체하고 한계를 capture 문서에 기록.
- inbox 스키마 실측: `pattern_group: style` 은 10종 어휘 밖 — audit ERROR 로 적발(게이트 실효 확인), `application-ui` 로 정정.
- 후속 배치 후보 3건(Stripe·Radix·Around)은 plan finding 큐 등재 — 수요 발생 시 새 milestone. 프로세스 교훈 1건(피처 플래그 리프레시 롤아웃)은 표면 밖 보류.
- DoD 잔여 1건: goal 마감 일괄 push 는 사용자 승인 대기(배포 배칭 규약) — 로컬 검증까지 완료.

## 3. 증거

- Evidence: `evidence/reference-diversification/m8-saas-exemplar-absorption.md` · Changeset: `changesets/20260801-m8-saas-exemplar-absorption/README.md` · 동결: `research/2026-08-01-m8-dashboard-density-capture.md`
- 검증: validate-recipes(47)·validate-ui-vocabulary(563)·재생성·check-llms-sync PASS·build 755 routes·oxlint 기존 경고만·lint:colors 0·build:data terms=563·audit:visuals 신규 fallback 0. build:catalog 생략(recipe 0 — 개정 규약 근거 명시).
- 실표면: 실브라우저(vite preview :4322)에서 `/terms/divider` 열어 보강 description("기본값은 선이 아니라 여백이다")·신규 anti_use 렌더를 눈으로 확인 — 통과. llms.txt 에 knowledge/dashboard-density 링크 노출 확인.
- 재현: `node scripts/check-llms-sync.mjs` (PASS) · `cd examples/ui-vocabulary-site && npm run build && npm run audit:visuals` · 커밋 9f47b3f·0439163.
- 크기 회고: changeset 1개·step 2개 + 통합 검증 — M7 배관 재사용으로 얇아진 것이 설계 의도(연쇄 2/2). 목표(Tailwind 편중 해소 1라운드)는 연쇄 전체가 담았다 — 과소 그릇 아님.
