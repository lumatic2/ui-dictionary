# Changeset — M4: og-image 3안 품질 비교·선택 교체

- Milestone: M4 (goal `dark-carryover`, plan: `plans/2026-08-01-m4-og-image-dark.md`)
- Date: 2026-08-01

## step-1 — codex imagegen 다크·라이트 2종 생성 + 3안 비교 관측

- `codex exec -`(stdin 지시문, TH5 실증 경로)로 다크/라이트 1200×630 PNG 각 1종 생성 — 프롬프트 `tmp/og-image/prompt-{dark,light}.txt`, 텍스트 렌더 왜곡 0 실측(후처리 합성 불요).
- 기존 og-image.svg 를 1200×630 렌더 캡처 → 3안 × 라이트/다크 채팅 목업 비교 시트(`tmp/og-image/compare-sheet.png`).
- 발견: 기존 SVG 는 한국어 카피("제품 UI 패턴을 구현 가능한 시스템으…" — 잘림) + 구 teal 브랜딩 — QA1 영어 단일 정책·현 브랜드와 불일치.
- SVG og:image 포맷 근거 URL 확보(research §C — FB·LinkedIn 규격 어느 쪽도 SVG 미명시, X 문서 402 미확인).
- 사용자 선택 대기(3안 비교 관측 게이트).

## step-2 — 메타 배선 + 마감 검증

- 사용자 선택 A(다크) 설치: `public/og-image.png`(1200×630) + 구 SVG 삭제.
- `index.html` og:image/twitter:image 를 절대 URL PNG 로 갱신(상대경로는 일부 크롤러 미해석 — 함께 교정) + type/width/height 정합.
- dist 재프리렌더 755: html `og-image.svg` 참조 0 · PNG 셸 상속·파일 존재. lint·build PASS. 실배포 카드 확인은 일괄 배포 후.
