# ECT 완료 보고서 이관 — archive/ 는 gitignore 다

> 2026-07-21 · milestone ECT5 step-0 · changeset #243

## 왜

`ECT1~ECT4` 완료 보고서 4건이 `archive/reports/` 에 있었다. 그런데 `.gitignore:6` 에 `archive/`
가 있어 **한 번도 커밋된 적이 없다** — 워크트리가 사라지면 같이 사라지는 상태였다.

같은 결함을 다른 기기가 먼저 발견해 자기 쪽 보고서 8건을 `docs/reports/` 로 옮기고
규약을 `CLAUDE.md` 에 박았다(`e7124ad`). 이쪽 4건은 그 병합에 들어오지 않아 남아 있었다.
harness §0 배치 규약의 기본값이 `archive/reports/` 라 다음 세션이 또 거기에 쓸 수 있다 —
레포 규약(`CLAUDE.md` §완료 보고서 위치)이 기본값을 덮는다.

## 무엇을

- `archive/reports/2026-07-21-ect{1,2,3,4}-*.md` 4건 → `docs/reports/` 이동.
- 이제 `docs/reports/` 에 ECT 4건 + VL 8건 = **12건이 나란히 추적된다.**

## 검증

- [x] `git ls-files` 기준 ECT 보고서 4건이 `docs/reports/` 에 추적된다.
- [x] `archive/reports/` 에 남은 파일 0건.
- [x] probe — `git check-ignore docs/reports/<파일>` 이 아무것도 반환하지 않는다(무시 안 됨).
- [x] probe — `git check-ignore archive/reports/x.md` 는 여전히 `.gitignore:6` 을 반환한다(경로 자체의 무시는 유지).

## 남기는 것

이 changeset 은 내용을 바꾸지 않는다 — **위치만** 바꾼다. 보고서 본문은 그대로다.
