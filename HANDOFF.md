# HANDOFF

## 이어서 할 일
> 2026-08-01 세션 종료 시 기록

- **수동 QA 계속(사용자 예고)**: 사용자가 실배포를 눈으로 보며 결함을 가져온다 → 새 goal 로 `/harness-plan`. 현재 active goal 0.
- **다크모드 이월 3건(사용자 판단 대기)**: ① 토큰 부재 강조색(대응 시맨틱 토큰 신설 필요 — DM2 가 사유 마커로 남김) ② `@media (forced-colors: active)` 미대응 ③ 다크 전용 og-image 제작 여부. 성격이 토큰설계·접근성·에셋으로 각각 달라 묶지 말 것.
- **토큰 타이포 스케일 확장 판단**(M1 발견): SSOT 5단계에 헤딩(30/48/72)·마이크로 라벨(10/12)이 없어 화면들이 Tailwind 기본값을 상시 빌려 쓰고 `xl`(28)은 실화면 미사용. 임계 7 상향으로 증상만 덮은 상태 — 근거는 `docs/reports/2026-08-01-m1-carryover-maintenance.md` §4 + `evidence/carryover-maintenance/m1-closeout.md` 의 3화면 구성 표.
- 『인터랙티브 웹 애니메이션』 책 스터디 자산화(사용자 주도, 2026-07-28 확정).
- 워크트리 `발표-슬라이드-만드는-법`: 미병합 63커밋 — 사용자 작업 중, 끝나면 `/merge-worktree`.

### 검사기 사용법이 바뀌었다 (M1, @askewly/design 0.3.0)
- 타이포 임계 **5 → 7**(실측 재산정). 반응형 변형은 브레이크포인트별로 따로 계수하므로 `text-5xl md:text-7xl` 은 더 이상 2단계가 아니다.
- 한 파일에 화면이 여럿이면 파일 상단에 `// askewly-typography-ok: <사유>` — **사유 필수**(빈 사유는 위반). 현재 4파일 적용, 단일 화면에는 붙이지 않는다.
- 사이트 검사: `cd examples/ui-vocabulary-site && npx @askewly/design verify src/components --ext tsx` → 현재 PASS(위반 0).

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품 축(2026-07-31 사용자 승인, `CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — goal `carryover-maintenance` 완주(2026-08-01, M1). 직전 `site-polish` 완주.
- 다음 차례: 사용자 QA 결함 대기 → `/harness-plan`

### 현재 상태 / 주의점
- main push 완료(`c107137`), 실배포 라이브 확인(`ui.askewly.com/get-started` 200 + `lang="en"` + 영어 메타).
- `@askewly/design@0.3.0` npm 배포 완료 — **경로가 바뀌었다**: 토큰 발급 말고 `gh workflow run publish-cli.yml --ref main`(OIDC, 게이트·전파확인·레포밖 실증 자동). 정본 `docs/design-system/cli-release-procedure.md`.
- **사이트 카피·SEO 메타 = 영어 단일 확정** — `docs/design-system/copy-language.md` 정본, 한국어 전환 재제안 금지(관측 회귀 이력). 콘텐츠(용어 562건·docs 아티클)는 한국어 유지가 정책.
- ROADMAP 158줄로 line budget(150) 초과 — 다음 `/harness-done` 에서 compact 대상.
- untracked `tmp-patterns-reference.png` 방치 중(에이전트가 만든 것 아님 — 처분은 사용자).
