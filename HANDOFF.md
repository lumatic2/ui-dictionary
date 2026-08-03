# HANDOFF

## 이어서 할 일
> 2026-08-04 세션 종료 시 기록 (goal `reusable-composition` 완주: M18 블록 계층 + M19 킥스타트 원커맨드)

- **active goal 0 — 다음은 `/harness-plan`.** 남은 큐(우선순위 사용자 소유): harvest 회수 계약(해커톤 산출물→자산 승격 — 원 설계안 ③, 저장고 복리 성장의 핵심) · 킥스타트 기본값 폴리싱(M19 관측 코멘트 "더 다듬으면 좋겠다") · CLI npm publish(킥스타트 라이브 소비 전제 — cli-release-procedure.md, 사용자 승인 게이트) · 두 번째 블록(marketing-landing — st4 조합 패턴 12종이 재료) · 구 큐(책 스터디·dark/light SSOT 파생·D2·Around).
- 킥스타트 재현: `node packages/cli/dist/index.js init <빈 dir> --block saas-app-shell --yes` (라이브 registry 는 publish 전이라 `--registry` 로 로컬 `public/r` 서빙 필요 — 라이브 JSON 은 push 로 배포됐으나 CLI 가 npm 미출고).
- 블록 소비 정본 = entry-protocol A-0 + block-contract §7/§8. 이월 finding: recharts 진입 애니메이션이 정적 캡처에서 차트를 빈 면으로 보이게 함(`isAnimationActive` 옵션 노출 검토).
- Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행)은 다음 Figma 세션 묶음 — 직전 핸드오프 승계.
- `/pt` 브랜드 탐지 첫 실전 관측 대기 — 직전 핸드오프 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — "일회성 작업에서 → 반복 가능한 루프로" 축이 착수 경로(블록+킥스타트)로 실현 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-04 완주: M18(외부 흡수 실사→dashboard-01 베이스·block-contract·generate-registry 블록 지원·신선 이식 실증) + M19(init --block 원커맨드·E2E 사용자 관측 통과)
- 다음 차례: `/harness-plan` — 큐에서 goal 선택 (harvest 회수 계약이 자연 후속)

### 현재 상태 / 주의점
- main 클린·push 완료(`17c18ae`) — 승인 커밋부터 마감까지 12커밋, Vercel 재배포로 `/r/saas-app-shell.json`(meta.tier·requiredCssVars 28)·llms(block-contract·entry-protocol A-0) 라이브 반영 예정 — 라이브 확인 1회 권장: `curl -s https://ui.askewly.com/llms.txt | grep block-contract`.
- 사이트에 shadcn primitives 4종 신설(sidebar·chart·breadcrumb·label + hooks/use-mobile) + recharts 의존 추가 + index.css `--sidebar-*` 별칭 — 다크는 토큰 별칭이라 자동 유지.
- 검증 스크립트 계약 변경: generate-registry 가 블록 분기(target 전건·registry:component 전건·purity gate 확장) 소유, CLI verify SKIP_FILES 에 askewly-brand.css 추가.
- untracked `tmp-patterns-reference.png`·`archive/plans/m17*.md` 로컬 수정 잔존 — 사용자/타 세션 소유, 건드리지 않음.
