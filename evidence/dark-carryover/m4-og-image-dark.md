# Evidence — M4: og-image 3안 품질 비교·선택 교체

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m4-og-image-dark.md` · Changeset: `changesets/20260801-m4-og-image-dark/`

## step-1 — 시안 생성·비교

| 항목 | 결과 |
|---|---|
| 생성 경로 | `codex exec -` stdin 지시문(내장 image_gen) — 프롬프트 전문 `tmp/og-image/prompt-dark.txt`·`prompt-light.txt` (재생성 소스) |
| 산출물 | `og-dark.png`·`og-light.png` 각 1200×630 (PIL 실측) — 워드마크·태그라인 텍스트 왜곡 0 |
| 3안 시트 | `tmp/og-image/compare-sheet.png` — A(다크)/B(라이트)/C(기존 SVG 렌더) × 라이트/다크 채팅 목업 |
| 기존 SVG 판정 재료 | 한국어 카피 잘림("…시스템으") + 태그라인이 목업에 가려짐 + 구 teal 브랜딩 — QA1 영어 단일 정책 불일치 |
| 포맷 근거 | research `2026-08-01-dark-carryover-goal-inventory.md` §C — SVG 를 지원 포맷으로 명시한 규격 없음(FB·LinkedIn 접근일 2026-08-01) |
| 사용자 선택 | (관측 게이트 대기) |

## step-2 — 메타 배선 (선택 후 기입)
