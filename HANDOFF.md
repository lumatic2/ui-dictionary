# HANDOFF

## 이어서 할 일
> 2026-08-04 세션 종료 시 기록 (harvest 3연쇄 + CLI 출고: M20~M26 — 당일 6-goal, registry 28→55, npm 0.4.0 라이브)

- **active goal 0 — 다음은 `/harness-plan`.** 남은 큐(우선순위 사용자 소유): 킥스타트 기본값 폴리싱(M19 코멘트) · 두 번째 블록 marketing-landing(st4 조합 패턴 12종 재료) · CLI verify chart.tsx `[stroke='#ccc']` 속성 셀렉터 오탐 patch(0.4.x — verify 예외/SKIP 목록) · 책 스터디(사용자 주도) · dark/light SSOT 파생 · D2 · Around.
- 킥스타트 재현(이제 라이브): `npx --yes @askewly/design@0.4.0 init <빈 dir> --block saas-app-shell --color cosmos --yes` — `--registry` 불요, 라이브 `ui.askewly.com/r` 소비 실증됨(M26).
- harvest 이월 큐 소진 — 잔여는 씬 계약 밖 명시분만(brain 2D 폴백·3D 라벨 오버랩 회피·raycast — `evidence/harvest/m25-batch4.md`). 회수 절차 정본 = `docs/design-system/harvest-contract.md`(시간차 스크린샷 의무 포함).
- CF Pages 자동 배포 확인 1회 권장: `curl -s https://ui.askewly.com/r/registry.json | grep -c name` (55 기대) — 실호스팅은 CF Pages(Vercel 아님 — M20 census 실측 정정).
- Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행) — 다음 Figma 세션 묶음, 승계.
- `/pt` 브랜드 탐지 첫 실전 관측 대기 — 승계. recharts `isAnimationActive` 노출 검토 finding 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 회수 루프(산출물→저장고)가 계약+4배치 실적으로, 킥스타트가 npm 라이브로 실현 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-04 완주: M20~M21(teardown 29·회수 계약)·M22~M23(소스 채굴·배치 2)·M24(배치 3+motion 게이트)·M25(배치 4)·M26(CLI 0.4.0 출고)
- 다음 차례: `/harness-plan` — 큐에서 goal 선택

### 현재 상태 / 주의점
- main 클린·push 완료(`abff900`). registry 55종·llms(계약 4문서+knowledge 3편)·CLI 0.4.0(npm Trusted Publishing) 전부 라이브.
- generate-registry 계약 확장 주의: plain asset 도 선언 npm 의존(`item.dependencies`)+등재 자산 참조(`@/components/<asset>`→regDeps URL) 허용, react-dom 은 기본 표면. probe 원복은 `git checkout` 금지(autocrlf CRLF 오염 — M24 실발생, 역편집으로).
- lint-hardcoded-colors ALLOWLIST 13entries — 추출 데모·씬·팔레트 파일은 콘텐츠 판정(사유 주석 있음). `src/lib/palette-generator.ts` 는 shim(정본 = `components/palette-generator-core.tsx`).
- untracked `tmp-patterns-reference.png`·`archive/plans/m17*.md` 로컬 수정 잔존 — 사용자/타 세션 소유, 건드리지 않음.
