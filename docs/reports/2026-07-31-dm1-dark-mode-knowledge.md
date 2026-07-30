# DM1 — 다크모드 지식·용어 자산화 (완료)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-dm1-dark-mode-knowledge.md` · Changeset: `changesets/20260731-dm1-dark-mode-knowledge/`

## 1. 결과

'다크모드'의 정의 정본이 생겼다. `knowledge/dark-mode.md`(정의=재설계된 별도 팔레트 ≠ 반전, 인접 개념 경계 4종, 디자인 판정 규칙 5, 웹 구현 판정 규칙 6, 참조 구현 4 — 출처 URL+접근일 전건)가 llms 배포 경로에 배선됐고, terms.yml에 `dark-mode` 항목(별칭 5·related 양방향·Tier A 출처 3)이 등재되어 전용 Light/Dark 병치 시각 variant로 렌더된다. 사전 754→755 라우트.

## 2. 이슈와 해결

- 계획 초안이 존재하지 않는 `theme-switch` variant를 전제 — fresh 검증자가 실측 적발, `term-visual.tsx`에 `dark-mode` variant 신설로 계획 수정 후 실행(스코프 문구도 정정).
- llms 재생성 failure probe 중 `git checkout` 원복이 작업 수정까지 되돌림 — 재적용으로 해소. 세션 시작 후 main이 원격 갱신(pdf 워크트리 머지 dbedbe7)돼 있어 파생 사본(medium-taxonomy) 동기화 커밋 1건 부수 발생.

## 3. 증거

- Evidence: `evidence/dark-mode/dm1-knowledge.md` — 검증 표 전건 PASS (strict-duplicates 0 · validate 563 ok · build 755 routes · lint · audit:visuals 비-fallback · llms 오타 경로 exit 1 probe).
- 실표면: preview 브라우저에서 `/terms/dark-mode` 상세 실렌더(Light/Dark variant·출처 3건 표시 스크린샷 확인) + `/search?q=다크모드` 정확 일치 티어 1위 노출 + 콘솔 에러 0 — assertion 실평가 통과.
- 재현: `node scripts/generate-llms-txt.mjs && python scripts/validate-ui-vocabulary.py && cd examples/ui-vocabulary-site && npm run build && npm run audit:visuals` 후 `npx vite preview` → `/terms/dark-mode`.
- 크기 회고: changeset 1개·커밋 3건으로 닫힘 — step 2개가 각각 독립 검증을 가졌으나 규모상 milestone 하한선. 라벨 정합 관측으로 기록.
