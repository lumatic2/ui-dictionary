# Evidence — DM1: 다크모드 지식·용어 자산화

- Date: 2026-07-31
- Plan: `plans/2026-07-31-dm1-dark-mode-knowledge.md`
- Changeset: `changesets/20260731-dm1-dark-mode-knowledge/`

## step-1 — knowledge/dark-mode.md + llms 배선

| 검증 | 결과 |
|---|---|
| llms 재생성 (`node scripts/generate-llms-txt.mjs`) | PASS — llms.txt 50행에 `knowledge/dark-mode.md` 노출, 165 assets 복사 |
| 기존 knowledge 목록 무손실 | PASS — expressive-stack·motion-principles·motion-references 3건 유지(총 4파일) |
| 출처 URL+접근일 | PASS — 전 절 인용 유지 (`research/2026-07-31-dark-mode-goal-dark-mode.md` 기반) |
| Failure probe: 오타 경로 감지 | PASS — 존재하지 않는 경로 등재 시 `SSOT source missing` throw·exit 1 확인 후 원복 |

## step-2 — terms.yml '다크모드' 등재 + 시각 variant

| 검증 | 결과 |
|---|---|
| `audit-ui-vocabulary-candidates.mjs --strict-duplicates` | PASS — warnings 0 |
| `validate-ui-vocabulary.py` | PASS — terms ok: 563 (style 37, +1) |
| `npm run build` | PASS — prerender 755 routes (754→755, /terms/dark-mode 추가) |
| `npm run lint` | PASS — 기존 warning만(신규 0) |
| `npm run audit:visuals` | PASS — dark-mode 는 fallback(32건 기존)·generic(0) 어디에도 없음 (신규 variant 렌더) |
| 상세 페이지 렌더 | PASS — preview 브라우저 `/terms/dark-mode`: Light/Dark 병치 variant·정의·빠른 판단·출처 3건(Tier A) 렌더, 스크린샷 확인 |
| Failure probe: 검색 정확 일치 티어 | PASS — `/search?q=다크모드`: "정확 일치 1"(다크모드 hero 행) · 연관 1(스위치), 콘솔 에러 0 |

## 산출물

- `knowledge/dark-mode.md` — 정의·경계 4종·디자인 판정 규칙 5·웹 구현 판정 규칙 6·참조 구현 4
- `scripts/generate-llms-txt.mjs` Knowledge 섹션 등재 → `https://ui.askewly.com/llms/knowledge/dark-mode.md` (배포 시)
- `docs/ui-vocabulary/terms.yml` `dark-mode` 항목 (+`theme-token` 역방향 related)
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` `dark-mode` variant (Light/Dark 병치 — 다크 쪽은 의도적 리터럴 색: 순검정 회피 + 표면 밝기 elevation 을 보여주는 데모 콘텐츠)
