# M35 완료 보고 — Figma 브리지 후속 3건

Date: 2026-08-06 · Plan: `plans/2026-08-06-m35-figma-followups.md` · Changeset: `changesets/20260806-m35-figma-followups/`

## 1. 결과

M14 가 이월한 브리지 부채 3건을 닫았다. ① 스냅숏 페이로드 구간 분할(`--from/--to`·`--roots`·`--assemble`·`--self-test` 7항) — 인자 없으면 **바이트 동일**이라 회수 diff 포맷 무변경 ② 계약 §2.2 `description` 복사 구현(7월부터 미구현) + 쓰기 전 상태를 뜨는 `--read`(쓰기 호출 0건) + 삭제 스위치 `--no-remove`(기본값은 계약대로 삭제) ③ 라이브 재동기화 — 드리프트 예고 후 사용자 승인, primitive `created 1/updated 73/removed 0` · semantic `1/39/0 · unresolved 0`, 2차 실행 **updated-only**, description **23종** 기입, 삭제 **0**. 실파일 표본 4종 사람 확인.

## 2. 이슈와 해결

- **계획의 실증 대상이 사라졌다.** M14 가 20kb 절단을 겪은 서브트리 `35:3`(102노드)이 파일에 없다(`node not found`). 전 페이지를 훑어도 최대 26노드라 절단이 재현되지 않는다. 청크 실증을 `6:3`으로 대체해 **분할·조립의 정확성**(26 = 13+13, 중복 0, 범위 초과 라이브 거부, 누락 probe 발동)까지만 증명하고, "절단을 넘겼다"는 증명되지 않았음을 evidence·changeset·아래 §3에 명시했다.
- **초안의 삭제 결정이 코드와 정반대였다(계획 검증자 사전 적발).** "이번 실행에서 삭제 안 함"이었지만 페이로드에는 `v.remove()`가 박혀 있었고 계약 §2.4도 삭제를 규정한다. `--no-remove` 스위치 + 삭제 후보 목록 승인으로 바꿨다. 실제로는 orphan이 0이라 삭제가 발생하지 않았다.
- **쓰기 전 스냅숏을 뜰 도구가 없었다(검증자 적발).** 스냅숏 스크립트는 노드 속성용이라 변수를 읽지 않는다. `--read`를 step-2 범위로 끌어와 먼저 만들고 그 다음에 썼다.
- **U+2028 함정 재현·폐구.** `JSON.stringify`가 U+2028/U+2029를 날것으로 내보내는 것을 픽스처로 재현하고 직렬화 이스케이프로 막았다. 값은 무손실 복원된다.
- **자체 적발 버그 1건**: `--assemble`이 후속 플래그에서 안 끊겨 `--expect 4`의 값 `4`를 파일로 읽었다 — 첫 `--`에서 끊도록 수정.
- **드리프트 없음** — 계획 대비 범위 이탈 없음. 대상 노드 변경은 계획이 지정한 대상이 소멸한 데 따른 대체이며 그 사실을 기록했다.
- **크기 회고**: 3 step · changeset 1디렉터리 · 통합 검증(라이브 왕복) 보유 — milestone-grade 정합.

## 3. 증거

- `evidence/queue-drain/m35-figma-followups.md` · 커밋 9f0d512(step-1) · 87072c0(step-2) · 39fada8(step-3)
- 게이트: `figma-push-snapshot --self-test` **7/7** · `figma-return-diff --self-test` 4항 PASS · 기본 페이로드 `cmp` 바이트 동일 · 생성기 2회 실행 산출 동일
실표면: API/외부 시스템 — 사용자의 Figma 실파일(`xY42P22E7CtnvuxX8ZzZec`, 어스큐리 팀)에 실제로 썼다. 쓰기 전 읽기 전용 스냅숏(112종·description 0건) → 드리프트 예고(신규 2·갱신 112·삭제 후보 0) → 사용자 승인 → sync 1/2 `{created:1, updated:73, removed:0}`, sync 2/2 `{created:1, updated:39, removed:0, unresolved:0}` → 2차 실행 `{created:0, updated:74, removed:0}`·`{created:0, updated:40, removed:0}` → 읽기로 표본 4종 대조(총 114종, description 23종). 반환값이 실제 평가된 카운터이고, 예고 수치와 일치했다. 청크는 노드 `6:3`에서 단일 26 대 청크 13+13 조립 26(중복 0)을 라이브 실행으로 확인했다.
배선: 신설 장치 = 스냅숏 분할·조립 옵션과 생성기의 `--read`/`--no-remove`/description. 호출자는 이 브리지 절차 자체(사람이 재동기화·회수 시 실행)이고, **실발화 1회 증거**는 이번 step-3에서 description이 실린 페이로드가 실파일에 적용돼 23종의 설명이 실제로 기입된 것, `--read` 페이로드가 쓰기 전 스냅숏을 실제로 반환한 것, 그리고 `--from/--to`로 만든 로직이 라이브에서 13+13을 반환한 것이다.
재현: `node scripts/figma-push-snapshot.mjs --self-test` → 7/7 · `node scripts/figma-push-snapshot.mjs 6:3 out.js` 후 `git show HEAD~3:scripts/figma-push-snapshot.mjs` 산출과 `cmp` · `node scripts/generate-figma-variables-sync.mjs --read` → 쓰기 호출 0건 · `--no-remove` → `v.remove()` 0건 · `node scripts/figma-push-snapshot.mjs --assemble <r0.json> <r1.json> --expect 26` → OK, 하나만 주면 FAIL
평가 못 함: ① **20kb 절단 해소는 실증하지 못했다** — 대상 서브트리(102노드)가 파일에서 사라져 절단이 재현되지 않는다. 증명된 것은 분할·조립의 정확성까지다 ② `35:3`·`40:2`가 언제·왜 사라졌는지 확인하지 않았다(사용자 파일 편집 이력) ③ 청크 페이로드의 속성 스냅숏 전문(fills·characters)을 라이브에서 받아 대조하지 않았다 — id 집합 수준 검증이다 ④ "사용자 변경 → 코드 반영" 구간은 이번에도 미실증(M14 partial 승계 — 변경이 실제로 생겨야 성립).
