# Evidence — M5: finding 소수리 (search title + llms 정합 게이트)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m5-finding-fixes.md` · Changeset: `changesets/20260801-m5-finding-fixes/`

## step-1 — /search 런타임 title 정합

| 검증 | 결과 |
|---|---|
| 원인 확정 | page-meta 에 search 유형 부재 — `/search` 는 URL 스킴상 plus\|docs+query 라 Patterns 라벨 상속 |
| 수리 후 실브라우저 | `/search?q=button` → **"Search — Askewly Design"** · `/patterns` "Patterns —…" · `/docs` "Docs —…" · `/terms/accordion` "아코디언 —…" (무회귀 4종) |
| 게이트 | build+prerender 755 PASS |
| 커밋 | `c66e772` |

## step-2 — llms 정합 게이트 + 오탐 기록

| 검증 | 결과 |
|---|---|
| PASS 경로 | `node scripts/check-llms-sync.mjs` → PASS (watched 4 paths: public/llms*·tokens.css·DESIGN.md) |
| **FAIL 경로 실증** | `knowledge/dark-mode.md` 에 임시 1줄 추가 → **FAIL exit 1**, 어긋난 파일 경로 출력 → 원복 → PASS exit 0 |
| 작업 트리 청정 | 게이트 실행 후 `git status --short` 에 재생성 부산물 잔존 0 (검사 전 dirty 면 exit 2 거부) |
| EOL 오탐 차단 | `.gitattributes` 신설 — llms·tokens.css·DESIGN.md `text eol=lf` 고정(fresh 검증자 지적 선제 반영) |
| 배선 | 사이트 `npm run lint` = oxlint → lint:colors → **lint:llms** 체인 — 실행 PASS 확인 |

## 오탐 판정 기록 — 로고 버튼 일반 모드 포커스 링

- M3 감사의 "일반 모드에서도 포커스 불가시" finding 은 **오탐**. 실측(2026-08-01): 키보드 Tab 포커스 시 `:focus-visible` 매치 + `focus-visible:ring-2 ring-ring` 이 brand violet `rgb(111,45,189)` 2px 링으로 렌더.
- 감사 때 프로그램적 `el.focus()` 는 `:focus-visible` 을 태우지 않아 링이 안 보였던 측정 아티팩트. 코드 무변경.
- 교훈: 포커스 가시성 감사는 실키 입력(Tab)으로 잰다 — programmatic focus 는 focus-visible 휴리스틱 밖.
