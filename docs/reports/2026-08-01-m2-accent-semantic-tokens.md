# M2 — 강조·상태색 시맨틱 토큰 신설 + "토큰 부재" 마커 전수 해소 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m2-accent-semantic-tokens.md` · Changeset: `changesets/20260801-m2-accent-semantic-tokens/`

## 1. 결과

DM2 가 "토큰 부재" 사유로 예외 처리했던 강조·상태색 전부가 3-tier 토큰이 됐다. primitive 4램프(indigo·skyx·emerald·rose, 실사용 Tailwind shade 값 그대로) + `askewly.violet-deep`, semantic `emphasis.*` 6종·`status.*` 10종·`action.primary-hover`·`text.on-destructive` — 각 라이트/다크 값. 셸 5파일의 마커 17건이 토큰 클래스로 치환·제거됐고(장식 아바타 1건은 콘텐츠 재판정 잔존), `#5f22a8` 리터럴이 소멸했으며, 사이트는 이제 verify·스캐너 기준 색 예외 0 이다. docs Foundations Color 아티클과 llms 배포물도 신설 토큰을 반영한다.

## 2. 이슈와 해결

- **generate-tokens.mjs 가 COLOR_MAPPINGS 등재분만 방출** — 토큰 추가만으로 tokens.css 에 안 나감. 매핑 18변수 배선(계획 Files 누락 write — artifact "재생성 배선"에 내재 판정, 진행 로그 기록).
- **emphasis solid 버튼 위 텍스트가 새 text-white 예외를 만들 뻔** — `emphasis.on-solid`(white/white) 즉석 추가로 해소(additive, 재승인 불요 판정).
- **장식 아바타 5색은 토큰 승격 대신 콘텐츠 재판정** — 색 자체가 콘텐츠(사람 구분)라 시맨틱 역할 없음, 5색 토큰은 과설계. 마커 사유 정정으로 잔존.
- llms 재생성이 M1 `copy-language.md` 미반영분을 부수 정합화 — M1 마감 시 generate-llms-txt 미실행이 원인(재발 방지 후보: 소스→llms 정합 검사, finding 큐).
- 완료 감사: 드리프트 = 위 2건(기록 완료, 방향성 확장 아님). 순조로움 의심 = "라이트 무손실" 구간 — 값 동일성 논증에 더해 실렌더(다크 스크린샷·CSS 변수 해석 실측·콘솔 0)로 교차 확인.

## 3. 증거

- Evidence: `evidence/dark-carryover/m2-accent-semantic-tokens.md` — step 별 검증 표 전건.
- 실표면: 로컬 빌드 산출물(vite preview)을 Playwright 로 실구동 — docs 라이트/다크 실렌더 스크린샷 회귀 없음, `.dark` 에서 신설 변수 다크값 해석 assertion(`--emphasis-surface: oklch(25.7% .09 281.288)` 등) 성공, 콘솔 에러 0. 실배포 반영은 goal 마감(M4) 일괄 배포 시 — 계획된 배치.
- 재현: `node scripts/generate-tokens.mjs && node scripts/generate-llms-txt.mjs` → `cd examples/ui-vocabulary-site && npm run lint && npm run build && npx @askewly/design verify src/components --ext tsx` (verify PASS — 90 files, no color literals).
- 크기 회고: changeset 1개·커밋 3건(토큰+배선 / 치환 / 문서+마감) — steps=3 계획 정합. milestone 은 SSOT·생성기·셸 5파일·문서를 가로지르는 통합 검증을 가졌으므로 step-grade 아님.
