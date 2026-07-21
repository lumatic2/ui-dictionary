# changeset: VL3 step-2 — 참조 무결성 게이트

- Date: 2026-07-21
- Plan: VL3 step-2 (`plans/2026-07-21-vl3-reference-repair.md`)

## 계획 대비 — 이 step은 절반이 이미 끝나 있었다

plan의 목표는 "끊긴 `term_refs` 91 → 0"이었는데, **VL2 배포가 이미 0으로 만들었다.**
VL1이 "사유가 전부 미배포"라고 계수한 대로다. 그래서 이 step은 참조를 *고치는* 일이 아니라
**다시 깨지지 않게 잠그는** 일이 됐다.

## 무엇을 했나

`audit-vocabulary-reach.mjs`에 `--strict` 무결성 게이트 추가. 계수에 그치지 않고 하나라도
깨지면 exit 1:

1. 배포본 기준 끊긴 `term_refs` 0
2. 배포된 용어 수 = 원본 수 (샤드 누락 감지)
3. 샤드 생성기·매핑 생성기의 `--check` 통과 (양방향 일치·죽은 참조 0 포함)

②③은 각 생성기의 `--check`를 그대로 호출한다 — 같은 규칙을 두 곳에 적으면 갈라진다.

## 검증

- `node scripts/audit-vocabulary-reach.mjs --strict` → `무결성 PASS` exit 0
- **failure probe**: group 없는 용어를 원본에 주입 → exit 1, 실패 사유 2건을 각각 지목
  (`배포된 용어 562 ≠ 원본 563`, `generate-vocabulary-shards.mjs --check 실패`)

## 판정

complete.
