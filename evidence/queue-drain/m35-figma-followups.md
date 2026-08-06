# M35 evidence — Figma 브리지 후속 3건

Date: 2026-08-06 · Plan: `archive/plans/2026-08-06-m35-figma-followups.md` · 파일: `xY42P22E7CtnvuxX8ZzZec` (어스큐리 팀)

## 1. 청크 옵션화 (step-1)

- `--self-test` **7/7** — 범위 없음=전체 · 첫 청크에만 루트 · 2분할 조립=단일 실행 · 중복 0 · 구간 빠뜨리면 모자람 · 역순 거부 · 범위 초과 거부
- **기본 호출 바이트 동일**: 편집 전 스크립트(`git show HEAD:`)로 만든 페이로드와 `cmp` 일치 → 회수 diff 포맷 무변경
- `figma-return-diff.mjs --self-test` 4항 PASS (포맷 의존 회귀 없음)
- 인자 검증: `--from 3 --to 1` → "invalid range: from > to" · `--from` 단독 → "함께 준다" · `--roots abc` → "invalid node id"
- 실측 버그 1건 자체 적발: `--assemble` 이 후속 플래그에서 안 끊겨 `--expect 4` 의 값 `4` 를 파일로 읽었다 → 첫 `--` 에서 끊도록 수정

## 2. description·읽기 모드·`--no-remove` (step-2)

- description: primitive 74종 중 **5종 보유·69종 생략**, semantic 40종 중 18종 보유. **빈 문자열 0건**(생략 규칙)
- `--read`: 생성 페이로드에 `setValueForMode`·`remove`·`createVariable`·`renameMode`·`addMode` **전부 0건**
- `--no-remove`: 페이로드에 `v.remove()` **0건**(기본 실행은 1건 유지 — 계약 §2.4 기본값 보존)
- 페이로드 3종 파싱 OK · 생성기 2회 실행 산출 동일(멱등)
- **Failure probe 성립** — `$description` 에 따옴표·LF·U+2028·U+2029·백슬래시를 넣은 픽스처로:
  - 수정 전: 페이로드에 **날것 U+2028/U+2029** 가 그대로 실림(use_figma 파서가 줄바꿈으로 읽는 M14 함정 재현)
  - 수정 후: 날것 0건 · 이스케이프 시퀀스 존재 · JSON 복원 시 따옴표·LF·U+2028·U+2029·백슬래시 **전부 무손실**

## 3. 라이브 동기화 (step-3)

**쓰기 전 상태** (읽기 전용 페이로드): primitive 73 · semantic 39(light/dark) = **112**, description **0건**.

**드리프트 실측 → 사용자 승인 → 실행**:

| | 예고 | 실행 결과 |
|---|---|---|
| primitive | created 1 · updated 73 · removed 0 | **created 1 · updated 73 · removed 0** |
| semantic | created 1 · updated 39 · removed 0 | **created 1 · updated 39 · removed 0 · unresolved 0** |

신규 2종 = `color/primitive/black` · `color/semantic/surface/scrim` (M31 이후 벌어진 분). 삭제 후보 **0** — 이번 실행에서 지워진 변수 없음.

**멱등 (계약 §2.4)** — 2차 실행: primitive `created 0 · updated 74 · removed 0`, semantic `created 0 · updated 40 · removed 0 · unresolved 0`. **updated-only** 로 계약 기준 충족(`0/0/0` 만을 게이트로 걸면 정상 실행이 실패로 판정된다).

**표본 관측** (실파일 읽기, 총 114종 중 description 보유 **23** — 예측치와 일치):

| 변수 | description | 값 |
|---|---|---|
| `color/semantic/surface/scrim` | 실림(스크림 설계 근거 전문) | light/dark 둘 다 alias |
| `color/semantic/action/primary-hover` | 실림 | light/dark alias |
| `color/primitive/black` | **(없음)** — SSOT 에 `$description` 없음 | `{r:0,g:0,b:0,a:1}` |
| `color/semantic/surface/base` | **(없음)** — 빈 값으로 덮이지 않음 (**probe ①**) | light/dark alias |

**청크 회수 라이브** — 대상 노드 `6:3`(Landing Hero / Desktop 1440, 직속 자식 2, 서브트리 26):

- 단일 실행 **26**노드
- `--from 0 --to 0` → 13(루트 포함) · `--from 1 --to 1` → 13
- 조립 → **26 unique · 중복 0** = 단일 실행과 일치
- 범위 초과(`--to 9`)는 라이브에서 `range out of bounds: children=2` 로 거부
- **probe ②**: 청크 하나를 빼고 조립 → `assemble FAIL — 누락/초과: 조립 13 != 기대 26`

## 4. 평가 못 한 것

- **원래 결함(use_figma 20kb 절단)의 해소는 실증하지 못했다.** M14 가 절단당했던 서브트리 `35:3`(102노드)이 **현재 파일에 존재하지 않는다**(`node not found`). 파일 전체를 훑은 결과 최대 서브트리가 26노드(`6:3`)라 절단 자체가 재현되지 않는다. 이번 실증이 말하는 것은 "구간 분할과 조립이 라이브에서 정확히 동작한다"까지이고, "20kb 절단을 실제로 넘겼다"는 아니다.
- `35:3`·`40:2` 가 언제·왜 사라졌는지는 확인하지 않았다(사용자 소유 파일의 편집 이력).
- 청크 페이로드의 **속성 스냅숏 전문**(fills·characters 등)을 라이브에서 받아 대조하지는 않았다 — id 집합 수준에서만 조립을 검증했다.
