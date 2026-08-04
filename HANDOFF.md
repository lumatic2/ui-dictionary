# HANDOFF

## 이어서 할 일
> 2026-08-04 세션 종료 시 기록 (M27 marketing-landing 블록 완주 — registry 56, 첫 "산출물→저장고→재조합" 전 구간 완주)

- **active goal 0 — 다음은 `/harness-plan`.** 큐(우선순위 사용자 소유, 세션 말 추천 1순위 = CLI 폴리싱): ① CLI 0.4.x 폴리싱 묶음 4건 — 킥스타트 기본값(M19 코멘트) · verify chart.tsx `[stroke='#ccc']` 속성 셀렉터 오탐(예외/SKIP 목록) · 킥스타트 Next steps 안내문 `SaasAppShell` 하드코딩(M27 finding — kickstart.ts 안내 출력) · primitive 전이 dep(cva) 안내 누락으로 신선 빌드 1회 실패(M27 finding — regDeps 로 이식된 primitives 의 npm deps 집계) ② docs-site 블록(3호 — docs 계열 asset 기존재) ③ dark/light SSOT 파생 ④ 책 스터디(사용자 주도) · D2 · Around.
- M27 재현: `npx --yes @askewly/design@0.4.0 init <빈 dir> --block marketing-landing --color teal --yes` — 라이브 소비 확인됨(`/r/marketing-landing.json` 200, registry 56). 상세: `docs/reports/2026-08-04-m27-marketing-landing-block.md`.
- 블록 재배열 가이드·구성 계약은 `docs/design-system/block-contract.md` §6 marketing-landing 행. 외부 마케팅 블록 기각 근거(재실사 방지): `research/2026-08-04-m27-marketing-block-absorption-survey.md`.
- Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행) — 다음 Figma 세션 묶음, 승계.
- `/pt` 브랜드 탐지 첫 실전 관측 대기 — 승계. recharts `isAnimationActive` 노출 검토 finding 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 저장 단위가 블록 2종(앱 골격+랜딩)으로, 회수 루프가 자기 자산 재조합까지 실현 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-04 완주: M20~M26(harvest 3연쇄+CLI 0.4.0) + M27(marketing-landing 블록)
- 다음 차례: `/harness-plan` — 큐에서 goal 선택

### 현재 상태 / 주의점
- main 클린·push 완료(`2b99fd9`). registry 56종·블록 2종·llms 전부 라이브(CF Pages 배포 확인 2026-08-04).
- **세션 종료 시 자기 dev 서버 정리 의무** — 이번 세션에서 이전 세션 잔존 서버(public/r cwd http.server + vite 4종)가 registry 재생성을 EPERM 차단(실사고). 잠금 프로세스 식별: scratchpad handle64 (`%TEMP%\handle64.exe -accepteula <경로>`).
- generate-registry 계약 주의(승계): plain asset 도 선언 npm 의존+등재 자산 참조 허용, react-dom 기본 표면. probe 원복 `git checkout` 금지(autocrlf CRLF 오염 — 역편집으로).
- untracked `glow-t1/t2.png`·`tmp-patterns-reference.png`·`archive/plans/m17*.md` 수정 잔존 — 사용자/타 세션 소유, 건드리지 않음.
