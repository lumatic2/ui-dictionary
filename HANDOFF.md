# HANDOFF

## 이어서 할 일
> 2026-08-05 세션 종료 시 기록 (M28 CLI 0.4.1 폴리싱 완주 — 킥스타트 handoff 정합 + verify 오탐 제거)

- **active goal 0 — 다음은 `/harness-plan`.** 큐(우선순위 사용자 소유): ① **`@/` alias 안내 누락**(0.4.x — `kickstart.ts` Next steps 가 `@/...` 를 쓰라면서 vite `resolve.alias`·tsconfig `paths` 설정은 안내 안 함. 신선 vite 에서 `tsc -b` 6건 실패, E2E 2회 모두 수기 보완. 1줄 추가 수준) ② docs-site 블록(3호 — docs 계열 asset 기존재) ③ dark/light SSOT 파생 ④ 책 스터디(사용자 주도) · D2 · Around.
- M28 재현: `npx --yes @askewly/design@0.4.1 init <빈 dir> --block marketing-landing --color teal --yes` → 인쇄된 설치 목록 그대로 → 인쇄된 export 로 진입점 → `npm run build`. 상세: `docs/reports/2026-08-05-m28-cli-polish-041.md`.
- **CLI 계약 2건(승계 필독)**: ① dep 은 registry 선언이 아니라 **이식 파일 import 실측**이 정본(`importedPackages`) — 상류 shadcn 선언은 하한 ② 블록 export 는 `page.tsx` 에서 파생(`blockExportName`), 미발견 시 심볼 날조 금지.
- **블록 JSON 의 asset regDeps 는 라이브 절대 URL** — `--registry` 로컬 서빙으로는 asset 변경분이 안 온다. 로컬 관측은 asset 파일 직접 복사, 라이브 확인은 배포 후 별도 1회.
- Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행) 승계. `/pt` 브랜드 탐지 첫 실전 관측 대기 승계. recharts `isAnimationActive` 노출 검토 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 경로가 "인쇄된 안내를 그대로 따르면 되는" 수준까지 정합 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-05 완주 M28(goal `cli-polish-041` close). 직전 2026-08-04 M20~M27.
- 다음 차례: `/harness-plan` — 큐에서 goal 선택

### 현재 상태 / 주의점
- main 클린·push 완료(`6103bfe`). `@askewly/design@0.4.1` npm 라이브. registry 56종·블록 2종 CF Pages 배포됨(marketing-landing 에서 mesh-gradient-surface 사용 빠짐 — asset 자체는 registry 유지).
- **세션 종료 시 dev 서버 정리 의무 (승계·이번에 실제 필요했음)** — `TaskStop` 은 래퍼만 죽이고 **node 자식이 살아남는다**. `netstat -ano | grep :<port>` 로 확인 후 `Stop-Process -Id <pid> -Force`. 이번 세션 정리 후 `generate-registry` 재실행으로 잠금 해제 확인함.
- 전역 지침 모순 처리(2026-08-05): 세션 주입 `요청 없이 AgentTool 금지` 는 디스크 어디에도 없다(Orca 스폰 템플릿 추정, `CLAUDE_CODE_CHILD_SESSION=1`). 해석 우선순위를 전역 `CLAUDE.md` 오케스트레이션 절에 명문화 + `harness-plan` 에 자기 재검토 폴백 추가(custom-skills `888f300`). **문구 자체를 좁히는 건 사용자 몫.**
- generate-registry 계약 주의(승계): plain asset 도 선언 npm 의존+등재 자산 참조 허용, react-dom 기본 표면. probe 원복 `git checkout` 금지(autocrlf CRLF 오염 — 역편집으로).
- untracked `glow-t1/t2.png`·`archive/plans/m17*.md` 수정 잔존 — 사용자/타 세션 소유, 건드리지 않음.
