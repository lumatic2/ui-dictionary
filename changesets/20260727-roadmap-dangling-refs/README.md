# ROADMAP 이 없는 파일 6개를 가리키고 있었다

> 2026-07-27 · horizon `real-use-lap` 유지보수 (milestone 아님) · changeset #267

## 왜 — 상태판이 가리키는 곳에 파일이 없다

`ROADMAP.md` 는 살아있는 문서(상태판)다. 거기 적힌 경로는 읽히라고 있는 것이지 장식이 아니다. 전수 감사했더니 **17개 참조 중 6개가 깨져 있었다.**

원인이 하나가 아니라 **셋**이었다.

### 원인 1 — `archive/*` gitignore 가 아카이브를 삼킨다 (1건)

하네스 §0 배치 규약은 완료된 plan·horizon 을 완료 경계에서 `archive/` 로 옮기라고 한다. 그런데 이 레포 `.gitignore` 6번 줄이 `archive/*` 다.

**gitignore 는 이미 추적 중인 파일에는 영향이 없다.** 그래서 사고가 조용하다 — `git mv` 로 옮기면 옛 경로의 삭제만 기록되고 새 경로의 add 는 막힌다. 커밋은 성공하고, 파일은 워크트리에만 남는다.

실측: `archive/horizons/2026-07-editor-legibility.md` 가 `5e2ee26`(EU5 완료·horizon close)에서 이렇게 사라졌다. ROADMAP 은 계속 이 경로를 가리켰고, 디스크에도 없었다.

같은 부류의 **두 번째** 사고다. 첫 번째는 2026-07-21 병합에서 완료 보고서가 같은 이유로 유실된 것이 드러나 `!archive/reports/` 예외와 CLAUDE.md 경고가 추가됐다 — **그때 plans·horizons 는 같이 고쳐지지 않았다.**

### 원인 2 — 아카이브 후 ROADMAP 포인터 미갱신 (3건)

`cf8bdaf`(vocabulary-in-use close)가 VL7·VL8 plan 과 horizon 문서를 `archive/` 로 옮겼다. 파일은 **무사히 추적되고 있다**(이미 tracked 였으므로 원인 1 에 안 걸림). ROADMAP 만 옛 경로를 계속 가리켰다.

하네스 §B3 의 "이동 후 옛 백링크는 정정하지 않는다(record 동결)" 는 **record 문서**에 적용되는 규칙이다. ROADMAP 은 record 가 아니라 living 상태판이라 이 면제 대상이 아니다. 실제로 같은 레포가 `template-production-hardening`·`editor-legibility` 에 대해서는 포인터를 `archive/` 로 갱신해 뒀다 — 규칙이 아니라 누락이었다.

### 원인 3 — 포인터만 쓰고 파일을 안 만들었다 (2건)

`2db25ac`(2026-07-23, 하네스 재조립 C4)가 `real-use-lap` horizon 과 RU1 milestone 을 ROADMAP 에 등록하면서 `plans/horizons/2026-07-real-use-lap.md` 와 `evidence/real-use-lap/ru1-deck-production.md` 를 가리켰다. 그 커밋이 건드린 파일은 `CLAUDE.md`·`OBJECTIVE.md`·`README.md`·`ROADMAP.md` **4개뿐**이다. 둘 다 만들어진 적이 없다.

RU1 이 예약 선언한 changeset 267~286 도 **0건 사용**이다. 이 changeset 이 267 을 처음 쓴다. 즉 RU1 의 작업물은 evidence 로도 changeset 으로도 남지 않았고, **`ROADMAP.md` 의 Summary 한 문단이 전부**다.

## 무엇을

| # | 대상 | 조치 |
|---|---|---|
| 1 | `.gitignore` | `!archive/horizons/`·`!archive/plans/` 예외 추가 (기존 `!archive/reports/` 와 같은 이유) |
| 2 | `archive/horizons/2026-07-editor-legibility.md` | `5e2ee26^` 에서 복구 (84줄) + `git add -f` |
| 3 | `ROADMAP.md` ×3 | `plans/…` → `archive/…` 포인터 갱신 (vocabulary-in-use horizon, VL7·VL8 plan) |
| 4 | `evidence/real-use-lap/ru1-deck-production.md` | **소실 기록**으로 신설 — 원본 증거가 아님을 명시 |
| 5 | `plans/horizons/2026-07-real-use-lap.md` | ROADMAP 기록에서 재구성, 재구성 한계 명시 |

### 소실된 것을 복원하지 않았다

RU1 의 결함 D1~D9 와 덱 10장은 회수 불가다. **추정으로 채우지 않았다** — 그럴듯한 재구성은 소실을 은폐하는 기록이 된다. evidence 파일은 "무엇이 남았고 무엇이 없는지"만 적는다.

재구성한 horizon 문서도 마찬가지로 닫는 기준·무감독 분량을 **미확정으로 비워 뒀다.** 원본에 있었는지 알 수 없는 것을 지어내면 승인 근거가 오염된다. 문서 말미에 "미확정 항목이 채워지기 전에는 horizon 승인 근거로 삼지 않는다"를 박았다.

## Contract

- **source of truth**: `ROADMAP.md`(상태판) · `.gitignore`(추적 규약). 둘 다 이 레포가 정본, 배포본 없음
- **deploy/sync target**: 해당 없음 — 레포 내부 문서·설정만
- **compatibility**: 기존 `!archive/reports/` 예외와 동거. `archive/market/` 등 나머지는 계속 차단
- **out of scope**: `docs/reports/` 배치 규약 변경, `archive/` 전체 추적 전환, RU2 설계(별건)

## Verification

- [x] **ROADMAP 참조 전수 재감사** — 17개 중 깨진 것 0건
- [x] **gitignore 예외 동작** — probe 파일로 실측: `archive/horizons/`·`archive/plans/` trackable, `archive/market/` 여전히 ignored
- [x] **복구 파일 무결성** — `archive/horizons/2026-07-editor-legibility.md` 84줄, `5e2ee26^` 원본과 동일
- [x] **Failure probe** — 아래

### Failure probe — 예외를 빼면 사고가 재현되나

`!archive/horizons/`·`!archive/plans/` 두 줄을 제거한 상태에서 새 파일 add 를 시도하면 `archive/market/__probe.md` 와 동일하게 **ignored (add 차단)** 로 떨어진다. 즉 이 두 줄이 없으면 다음 horizon close 때 `5e2ee26` 과 똑같이 조용히 유실된다.

probe 결과 (2026-07-27 실측):

```
archive/horizons/__probe.md        trackable (add 가능)   ← 예외 적용됨
archive/plans/__probe.md           trackable (add 가능)   ← 예외 적용됨
archive/market/__probe.md          ignored (add 차단)     ← 옛 동작 유지 = 대조군
```

대조군(`market`)이 여전히 차단되는 것이 중요하다 — 예외가 `archive/*` 전체를 무력화한 게 아니라 두 경로만 열었음을 보인다.

## 남는 위험

`archive/` 아래 **새 하위 디렉터리**가 생기면 같은 사고가 또 난다(예: 훗날 `archive/research/`). 근본 해결은 `archive/*` 를 걷어내고 폐기물만 개별 지정하는 것이지만, 이 changeset 은 관측된 사고만 고친다. 후보로 남긴다.
