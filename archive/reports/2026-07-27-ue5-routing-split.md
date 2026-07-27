# 완료 — UE5 페이지 분리 (라우팅 전환)

> 완료: 2026-07-27 · UE5 (goal `ui-encyclopedia`) · 배치: `archive/reports/2026-07-27-ue5-routing-split.md` (record — 작성 후 동결)

## 1. 결과

사이트가 진짜 URL 경로를 갖는다 — `/terms/accordion` · `/patterns/marketing-header-sections` · `/docs/getting-started-setup` · `/search?q=`. 구 쿼리 URL 전 형태는 자동 리다이렉트로 하위호환되고, 뒤로가기는 브라우저 기본 동작이 됐다. 초기 로드 청크가 3,324kB → 1,758kB(-47%, gzip -40%)로 줄었고 App.tsx 는 23,507줄 → 약 6,300줄.

## 2. 이슈와 해결

- `Clipboard`·`Move` 등 DOM 전역과 겹치는 lucide 아이콘이 "Cannot find name" 에 안 잡혀 절단 후 타입 에러로 발견 — tsc 반복으로 소진.
- 계획 편차(정직): `src/pages/*` 신설 대신 기존 컴포넌트 파일 경계로 분리 — 같은 효과(청크 분할·App 셸화)를 더 작은 이동 diff 로. Pro/Download/카탈로그 골격(약 6천 줄)의 완전 분리는 finding 큐로 이월.
- SSG/prerender 는 계획대로 범위 밖 — SEO 완성은 UE3 콘텐츠와 함께 별도 후보.
- 배포 유의: 경로 라우팅은 정적 호스팅 SPA fallback 설정 필요 — 배포 시점에 deployment.md 갱신 (changeset 기록).

## 3. 증거

- changeset: `changesets/20260727-ue5-routing-split` (step-1·2·3)
- 검증: UE5 회귀 스위트 10항 PASS(리다이렉트 4형태·OAuth 리턴 포함) · 통합 시나리오 5항 PASS · `npx tsc -b` 0 에러 · build·lint exit 0 · 청크 전/후 실측(-47%) · failure probe 2건(리다이렉트 오염 적발·동기 롤백 시 감소 소멸). 전문: `evidence/ui-encyclopedia/ue5-routing-split.md`
- 크기 회고: changeset 디렉터리 1개(절 3개), 독립 응집 변경 3건(라우터 골격/절단·분할/회귀) — milestone-grade 정합.
- 실표면: 사용자가 실제 브라우저에서 검색→상세→헤더 목록→뒤로가기→주소창 경로 확인 — "응 그렇게 된다" (관측 1회 왕복 통과).
- 재현: `cd examples/ui-vocabulary-site && npm run dev` 후 `/terms/accordion`·`/?page=term&id=accordion`(리다이렉트)·`npm run build`(청크 확인)
