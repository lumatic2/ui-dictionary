# changeset: VL6 step-4 — 배포 등재 + 회귀

- Date: 2026-07-21 · Plan: VL6 step-4

`llms.txt`에 `## Decisions (which element to use)` 섹션 신설. 군집 파일은 손으로 쓰는 정본이라 생성기가 **있는 것을 전부 등재**한다 — 새 군집을 추가하면 자동으로 실린다. `decision-format.md`도 Contracts에 등재.

각 군집의 설명은 frontmatter에서 뽑는다(name · question · candidates) — 손으로 적으면 드리프트한다.

## 검증

- 재생성 후 157 자산, 무결성 검사 통과, `## Decisions` 섹션에 인덱스 + 군집 6개
- `node scripts/audit-vocabulary-reach.mjs --strict` → 무결성 PASS
- `python scripts/validate-decisions.py` → PASS 6 clusters
- **probe(진입점)**: `decisions/README.md`를 치우고 재생성 → `군집 인덱스 없이 등재하면 에이전트가 진입점을 못 찾는다` exit 1
- **probe(단계 밀림)**: 신설 절이 `Always`(자가 판정·사람 확인)를 밀어내지 않았는지 위치 대조 — 유지
