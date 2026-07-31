# M4 — og-image 3안 품질 비교·선택 교체 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m4-og-image-dark.md` · Changeset: `changesets/20260801-m4-og-image-dark/`

## 1. 결과

사이트 링크 카드가 사용자 선택안 **A — imagegen 다크 톤 PNG(1200×630)** 로 교체돼 실배포에 나갔다. codex imagegen 으로 다크·라이트 2종을 생성해 기존 SVG 와 3안 × 라이트/다크 채팅 목업 비교를 관측시켰고, 사용자가 A 를 확정했다. 메타는 절대 URL(`https://ui.askewly.com/og-image.png`)·`image/png` 로 배선, 구 SVG 삭제, dist 755 라우트 구 참조 0.

## 2. 이슈와 해결

- 기존 og-image.svg 는 한국어 카피 잘림 + 구 teal 브랜딩으로 영어 단일 정책(QA1)·현 브랜드와 불일치 상태였음 — 교체가 품질·정책 양면에서 정당화됨.
- 구 메타가 상대경로 `/og-image.svg` — 일부 크롤러가 상대 URL 을 못 읽는 문제를 절대 URL 로 함께 교정.
- imagegen 텍스트 왜곡 리스크(failure probe)는 실현되지 않음 — 워드마크·태그라인 왜곡 0, 후처리 합성 불요.

## 3. 증거

- Evidence: `evidence/dark-carryover/m4-og-image-dark.md` — 생성 프롬프트·3안 시트·dist 검증·배포 확인.
- 실표면: 실배포 `https://ui.askewly.com/og-image.png` 200 + `Content-Type: image/png`(823530B) 실측, 라이브 홈 meta 가 신규 절대 URL 을 서빙, 카드 디버거(opengraph.xyz)가 신규 PNG 를 크롤·FB 카드 미리보기로 렌더 확인.
- 재현: `curl -sI https://ui.askewly.com/og-image.png` + `curl -s https://ui.askewly.com/ | grep og:image`.
- 크기 회고: changeset 1개·커밋 2건(시안 생성 / 배선·배포) — steps=2 계획 정합. 시안 생성+관측 게이트와 배선+실배포 검증은 독립 응집 변경.
