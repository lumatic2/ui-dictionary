# changeset — M35 Figma 브리지 후속 3건

> 2026-08-06 · goal `queue-drain` · plan `archive/plans/2026-08-06-m35-figma-followups.md`
> evidence `evidence/queue-drain/m35-figma-followups.md`

## 무엇이 바뀌었나

**`scripts/figma-push-snapshot.mjs`** — 구간 분할 4종 추가: `--from/--to`(루트 직속 자식 인덱스, 루트 노드는 `from=0` 청크에만) · `--roots <id,id>`(자식이 적어 인덱스로 못 자를 때) · `--assemble`(청크 결과의 중복·누락을 id 집합으로 판정, Figma 접속 불요) · `--self-test`(7항). 걷기 로직은 문자열 상수 하나로 두고 페이로드와 self-test 가 같은 소스를 evaluate 한다.

**`scripts/generate-figma-variables-sync.mjs`** — 계약 §2.2 의 `description` 복사 구현(7월부터 미구현) · `--read`(쓰기 0 페이로드) · `--no-remove`(계약 §2.4 삭제 스위치, 기본값은 삭제) · 직렬화 지점의 U+2028/U+2029 이스케이프.

**`docs/design-system/figma-bridge-contract.md`** — §2.2 에 구현 상태·빈 값 처리·이스케이프 규칙, §2.4 에 `--no-remove`·`--read`·"0/0/0 **또는 updated-only**" 명시.

**Figma 실파일** — primitive/semantic 재동기화(신규 2·갱신 112·삭제 0), description 23종 기입.

## 왜 (계약으로 남길 것 4건)

1. **기본 호출은 바이트가 같아야 한다.** 회수 diff 가 페이로드 포맷에 의존하므로, 옵션을 더할 때 옵션 없는 경로는 글자 그대로 보존한다. 편집 전 산출물과 `cmp` 로 확인한다.
2. **"안 한다"는 코드로 강제되어야 한다.** 초안은 "이번 실행에서 삭제 안 함"이었는데 페이로드에는 `v.remove()` 가 박혀 있었다 — 합의와 코드가 어긋나면 승인은 무의미하다. 스위치를 만들고, 기본값은 계약을 따르게 했다.
3. **쓰기 전에 읽을 수단이 있어야 한다.** upsert 는 값만 갱신해 되돌리기 어렵다. 그런데 이 레포에는 변수를 읽는 도구가 없었다(스냅숏 스크립트는 노드 속성용). 읽기 모드를 먼저 만들고 나서 썼다.
4. **`JSON.stringify` 는 U+2028/U+2029 를 날것으로 낸다.** JS 소스로는 합법이지만 `use_figma` 파서는 줄바꿈으로 읽는다. 직렬화 지점에서 막고, 픽스처로 재현→폐구를 남긴다.

## 무엇이 증명되지 않았나

**20kb 절단 해소는 실증하지 못했다.** M14 가 절단당한 서브트리 `35:3`(102노드)이 파일에서 사라졌고(현재 최대 26노드), 절단 자체가 재현되지 않는다. 라이브에서 증명된 것은 **분할·조립의 정확성**(26=13+13, 중복 0, 누락 probe 발동)까지다. 큰 서브트리가 다시 생기면 그때 실증한다.
