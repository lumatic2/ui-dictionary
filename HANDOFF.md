# HANDOFF

## 이어서 할 일
> 2026-08-06 세션 종료 시 기록 (goal `dark-inversion-cleanup` 완주 — M31 스크림 토큰 + 0.4.3 출고)

- **active goal 0 — 다음은 `/harness-plan`.** 큐(우선순위 사용자 소유): ① 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도 — **별도 워크트리 세션**, main 에서 건드리지 않음) ② D2 Presenton 벤치 ③ Around 재판정 ④ Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행). **구 큐 ①(`bg-foreground` 반전 9개 파일)은 M31 로 종결** — 상세 `docs/reports/2026-08-06-m31-dark-inversion-cleanup.md`.
- **M31 이 남긴 후속 3건**: ⓐ 상류 shadcn primitive(`ui/button`·`ui/input`)에 `requiredCssVars` 선언이 없다 — 우리 asset 2종만 선언했다 ⓑ `requiredCssVars` 전이 판독은 배선됐으나 **오늘 발화하지 않는다**(선언한 asset 을 조합하는 블록이 아직 없음). `marketing-landing` 은 askewly asset 8종을 끌어오므로 그중 하나에 선언을 붙이면 즉시 실발화 검증 가능 ⓒ 반전 오용 lint 룰은 오탐 위험으로 보류.
- **재현**: `npx --yes @askewly/design@0.4.3 init <빈 vite react-ts dir> --block marketing-landing --color violet --yes` → `grep scrim src/askewly-brand.css` (`--scrim: oklch(0 0 0)` + `--color-scrim` 나와야 정상).
- **CLI 계약 5건(승계 필독)**: ① dep 은 registry 선언이 아니라 **이식 파일 import 실측**이 정본 ② 블록 export 는 `page.tsx` 파생, 미발견 시 심볼 날조 금지 ③ 인쇄되는 `npm i` 목록에 빌드 도구 플러그인을 섞지 않는다 ④ `requiredCssVars` 는 전이적으로 실측해 선언과 대조 ⑤ **토큰 변수 신설은 `@theme inline` 매핑과 한 몸** — 빠뜨리면 유틸이 조용히 사라지고 빌드는 통과한다(M31 probe 실증).
- **`--block` 은 block tier 전용** — component tier asset(`auth-gate-modal` 등)은 `"not a block-tier asset"` 로 정상 거부된다. 소비 경로는 shadcn CLI. 이식 검증 계획을 세울 때 이 구분을 먼저 확인할 것.
- **블록 JSON 의 asset regDeps 는 라이브 절대 URL** — `--registry` 로컬 서빙으로는 asset 변경분이 안 온다. 라이브 반영은 즉시가 아니다(M31 실측: 폴링 4회 ≈ 2분).
- `/pt` `custom` 테마 다크 첫 실전 관측 대기(스모크 픽스처로만 확인). recharts `isAnimationActive` 노출 검토 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품(내 디자인 색채를 남의 레포·매체에 입힌다) (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-06 완주 M31(goal `dark-inversion-cleanup` close). 같은 날 M29·M30, 직전 2026-08-05 M28.
- 다음 차례: `/harness-plan` — 큐에서 goal 선택

### 현재 상태 / 주의점
- ui-dictionary main 클린·push 완료(`dfb56d4`). `@askewly/design@0.4.3` npm 라이브, registry 57종·블록 3종 CF Pages 라이브. ROADMAP 145줄.
- **knowledge-graph 정상화 완료** — validate 실패 원인은 핸드오프 기록(manifest 미등록)이 아니라 **스키마 enum 위반**(`type: rule` 은 허용값 아님)이었다. `decision-rule` 로 정정 후 미푸시 7건 push 완료(`178bfd2`). 신규 노드는 **manifest.json `nodes` 배열 등재가 필수**이고 validate 가 캐시를 채운다.
- **관측 게이트는 "사용자가 실제로 볼 수 있는가"까지가 에이전트 책임** (이번에 두 번 실패): ① dev 서버가 IPv6 에만 바인딩되면 `127.0.0.1` 이 거부된다 → `npm run dev -- --host 127.0.0.1` ② 스크린샷을 대화에 붙여도 **사용자 화면에는 안 보인다** → Artifact 로 제시.
- **세션 종료 시 dev 서버 정리 의무 (승계)** — `netstat -ano | grep :<port>` → `Stop-Process -Id <pid> -Force`. 이번 세션 2개(5173·5180) 정리 완료.
- ⚠ **`git add -A <dir>` 금지** — 이번에 `archive/plans/` 에서 타 세션 변경 1건(M17 진행 로그)을 커밋에 휩쓸었다(`dfb56d4`). 경로를 개별 나열할 것.
- untracked `glow-t1/t2.png` 잔존 — 사용자 소유, 건드리지 않음.
