# HANDOFF

## 이어서 할 일
> 2026-08-06 세션 종료 시 기록 (goal `docs-block-and-theme-derive` 완주 — M29 이식 경로 완결 + M30 custom 다크 판본)

- **active goal 0 — 다음은 `/harness-plan`.** 큐(우선순위 사용자 소유): ① **`bg-foreground`/`text-background` 반전 9개 파일 일괄 판정** — 다크에서 밝은 덩어리가 된다. 이번에 docs-site 가 렌더하는 3종만 고쳤다(`docs-code-block`·`api-reference-layout`·`terminal-demo-panel`). 나머지: marketing hero·colors-page·contrast-duo-card·article-documentation-layout·auth-gate-modal·action-sheet-destructive-confirmation·bottom-sheet-detents·recipe-gallery-demos·term-visual ② 책 스터디(사용자 주도) ③ D2 Presenton 벤치 ④ Around 재판정 ⑤ Figma 후속 3건(청크 옵션화·§2.2 description 생성기·신규 토큰 sync 재실행).
- 재현: `npx --yes @askewly/design@0.4.2 init <빈 vite react-ts dir> --block docs-site --color violet --yes` → 인쇄된 6단계 그대로 → `npx tsc -b` → `npm run build`. 상세: `docs/reports/2026-08-06-m29-docs-block-and-alias.md`·`…-m30-custom-dark-face.md`.
- **CLI 계약 4건(승계 필독)**: ① dep 은 registry 선언이 아니라 **이식 파일 import 실측**이 정본 ② 블록 export 는 `page.tsx` 파생, 미발견 시 심볼 날조 금지 ③ **인쇄되는 `npm i` 목록에 빌드 도구 플러그인을 섞지 않는다**(그래서 `vite-tsconfig-paths` 미권장) ④ **`requiredCssVars` 는 조합 asset + primitive 까지 전이적으로 실측**해 선언과 대조 — 선언이 좁으면 검사가 통과해 버리고 이식처에서 색이 빠진다.
- **블록 JSON 의 asset regDeps 는 라이브 절대 URL** — `--registry` 로컬 서빙으로는 asset 변경분이 안 온다. 로컬 관측은 asset 파일 직접 복사, 라이브 확인은 배포 후 별도 1회.
- `/pt` `custom` 테마 다크 첫 실전 관측 대기(스모크 픽스처로만 확인). recharts `isAnimationActive` 노출 검토 승계.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 경로가 "인쇄된 안내를 그대로 따르면 되는" 수준까지 정합 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-06 완주 M29·M30(goal `docs-block-and-theme-derive` close). 직전 2026-08-05 M28.
- 다음 차례: `/harness-plan` — 큐에서 goal 선택

### 현재 상태 / 주의점
- ui-dictionary main 클린·push 완료(`04a8941`). custom-skills push 완료(`2b3a8ac`). `@askewly/design@0.4.2` npm 라이브, registry 57종·블록 3종 CF Pages 라이브.
- **knowledge-graph 는 로컬 커밋만 하고 push 안 했다**(`1bab3c1` — 노드 2건). 이유: 다른 세션 커밋 `2352210` 이 `nodes/디자인/design-md-google-official-spec.md` 를 manifest 에 등록하지 않아 **`validate` 가 실패 상태**다. 남의 작업이라 안 고쳤다 — push 전에 그쪽 정리 필요.
- **세션 종료 시 dev 서버 정리 의무 (승계·이번에도 필요했음)** — `TaskStop` 은 래퍼만 죽이고 node 자식이 살아남는다. `netstat -ano | grep :<port>` → `Stop-Process -Id <pid> -Force`. 이번 세션 6개(4319·4327·4331·4335·4341·8899·4351) 정리 완료.
- **도구 이스케이프 함정(이번에 2회)**: heredoc python 으로 JS 를 패치할 때 JSON 이스케이프가 `\r?\n` 을 **진짜 개행**으로 바꿔 정규식 리터럴이 깨진다. `node --check` 로 즉시 확인하고, 안 되면 바이트 단위(`bytes([92])`) 치환.
- untracked `glow-t1/t2.png`·`archive/plans/m17*.md` 수정 잔존 — 사용자/타 세션 소유, 건드리지 않음.
