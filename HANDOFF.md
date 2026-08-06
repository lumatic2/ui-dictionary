# HANDOFF

## 이어서 할 일
> 2026-08-06 세션 종료 시 기록 (goal `queue-drain` 완주 — M32~M35 4건)

- **active goal 0 — 다음은 `/harness-plan`.** 큐 잔여는 ① 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도 — **별도 워크트리**, main 에서 건드리지 않음) 하나뿐. 구 큐 ②③④(D2 Presenton·Around 재판정·Figma 후속 3건)는 M33·M34·M35 로 **전부 종결**.
- **M33 이 남긴 A 판정 1건 (별도 milestone 후보)**: `/pt` G2→G3 에 **레이아웃별 슬롯 계약을 생성 시점 강제**로 넣을지. 근거·대조표 `research/2026-08-06-m33-presenton-bench.md` §4-①. 나머지 후보는 `docs/findings.md` §H.
- **M32 가 남긴 결함 1건**: `color-palette-generator` 가 소비처에 없는 사이트 전용 `--askewly-violet` 을 요구한다(포커스 링 투명). 같은 파일에 `slate-*`·`bg-white` 등 기존 verify 위반군이 있어 restyle 단위 작업. `docs/findings.md` §G.
- **M35 미실증 1건**: `use_figma` 20kb 절단 해소는 증명 못 했다 — M14 가 절단당한 노드 `35:3`(102노드)이 Figma 파일에서 **사라졌고** 현재 최대 서브트리가 26노드(`6:3`)라 재현이 안 된다. 큰 트리가 생기면 `figma-push-snapshot.mjs --from/--to` 로 재시도.
- **신설 명령 (승계)**: `node scripts/generate-registry.mjs --self-test|--print-measured` · `node scripts/figma-push-snapshot.mjs --self-test|--from/--to|--roots|--assemble` · `node scripts/generate-figma-variables-sync.mjs --read|--no-remove`.
- **계약 5건(승계 필독)**: ① `requiredCssVars` 선언 자리는 tier 마다 다르다 — 블록은 항목 top-level, 비블록은 `meta` (한쪽만 게이트하면 54종이 검사 밖) ② 누락은 실패·초과는 통과(선언을 실측으로 좁히지 않는다) ③ 상류 shadcn 21종은 우리 필드를 못 가진다 — 브랜드 CSS 가 27종 중 25종을 정의해 **경계**로 확정(`block-contract.md` §4.2) ④ `JSON.stringify` 는 U+2028/U+2029 를 날것으로 낸다 — `use_figma` 파서가 깨진다 ⑤ Figma 2차 실행 판정은 `0/0/0` **또는 updated-only**(0/0/0 만 걸면 정상 실행이 실패로 뜬다).
- `/pt` 요약 문서 stale 2건 정정 필요 — `research/2026-07-31-html-upgrade-goal-refs.md` §0 "레이아웃 18종"→실측 **19종**, §1 "단일 HTML 배포 미보유"→실제 **보유**. record 동결이라 원문 대신 `docs/findings.md` §H 에 정정만 기록됨.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품(내 디자인 색채를 남의 레포·매체에 입힌다) (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-06 완주 M32·M33·M34·M35(goal `queue-drain` close). 같은 날 M29~M31.
- 다음 차례: `/harness-plan` — 새 goal 개설(큐가 비었다)

### 현재 상태 / 주의점
- main 클린·push 완료(`c3bfc07`). ROADMAP 146줄(상한 150 — 다음 `/harness-done` 에서 compact 여지 확인).
- `@askewly/design@0.4.3` 유지(M32 는 registry 데이터만 바꿔 **CLI 출고 없음**). registry 57종 라이브 반영 완료 — CF Pages 반영은 즉시가 아니다(이번 실측 **폴링 9회 ≈ 4분**, M31 은 2분).
- **Figma 실파일 상태 변경됨** — `xY42P22E7CtnvuxX8ZzZec` 에 변수 114종(primitive 74·semantic 40), description 23종 기입. M14 가 쓰던 노드 `35:3`·`40:2` 는 부재.
- Presenton 이미지 `ghcr.io/presenton/presenton:latest` **5.27GB** 가 로컬에 남아 있다 — 불필요하면 `docker rmi`. (Docker 는 사용자가 종료함.)
- untracked `glow-t1/t2.png` 잔존 — 사용자 소유, 건드리지 않음.
