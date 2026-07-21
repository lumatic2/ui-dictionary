# VL6 — 프로토콜 재배선 증거

> 2026-07-21 · plan `plans/2026-07-21-vl6-protocol-rewiring.md`

## 1. VL1 갭 장부 대조

| VL1 계측 | VL6 이후 |
|---|---|
| 호출 5단계 중 용어 사전 등장 **0회** | N-1이 첫 단계로 부른다 |
| entry-protocol의 용어 언급 **0회** | 용어 조회 절 신설 + 자산 3개 링크 |
| 요소 미정일 때의 결정 단계 **없음** | N-2 신설, A/B/C 진입 전 필수 |
| 레시피가 없을 때의 폴백 **없음**(C-1이 "있으면"에서 끝남) | N-3 분기 + C-1 본문 수정 |

## 2. 우회 경로 추적

A/B/C 각 분기 위에 명시: *"All three branches assume N-1…N-3 already ran. If you arrive here with the element still undecided, go back — none of the branches below will decide it for you."*

- **A(새 화면)**: 분류→레시피 직행 경로가 N-1~N-3 뒤로 밀렸다.
- **B(개선)**: 진단 결과가 "잘못된 요소를 썼다"이면 N-2로 돌아가라는 문장을 1단계에 삽입.
- **C(단일 컴포넌트)**: `Fetch the matching recipe if one exists`의 열린 끝을 폴백으로 연결.

우회 가능한 읽기 경로: **0**.

## 3. 자기 적용 — combobox

VL3에서 손으로 한 판단을 새 프로토콜로 되짚었다. 같은 답에 도달한다.

```
N-1  인덱스에 combobox 등재 → 샤드 input-pickers.yml         (2 fetch)
N-2  군집 single-choice-input · option-set-known=open-ended → combobox
N-3  recipes [] · code_assets [] → no-asset-fallback 경로
```

```
요소 결정: combobox (군집: single-choice-input)
- 갈린 축: option-set-known=open-ended → 목록이 데이터에서 오면 고정 목록으로 표현할 수 없다 (Carbon 명시)
- 기각: select — 미리 정해진 목록이 아니다 / radio-group — 옵션 수가 상한을 넘는다
- 자산: 폴백(no-asset-fallback) — recipes·code_assets 둘 다 비어 있음
```

블록의 모든 필드가 채워졌다. 빈 칸 0.

## 4. 배포 등재

`llms.txt` 섹션 10개 중 신설 2개: `## Vocabulary (562 UI terms)`(VL2), `## Decisions (which element to use)`(VL6). 자산 157개, 무결성 검사 통과.

군집 파일은 손으로 쓰는 정본이라 생성기가 **디렉터리를 훑어 전부 등재**한다 — 새 군집을 추가하면 자동으로 실린다. 설명은 frontmatter(name·question·candidates)에서 뽑아 손으로 적는 드리프트를 없앴다.

## 5. probe

| probe | 결과 |
|---|---|
| 진입점 없이 등재 | `decisions/README.md` 제거 후 재생성 → `군집 인덱스 없이 등재하면 에이전트가 진입점을 못 찾는다` exit 1 |
| 필수 단계 밀림 | `Always` 절(자가 판정·사람 확인) 위치 9행, 신설 절 20행 — 밀려나지 않음 |
| 참조 무결성 | `audit-vocabulary-reach.mjs --strict` → 무결성 PASS |
| 판별 데이터 | `validate-decisions.py` → PASS 6 clusters |

## 6. 라이브 배포 확인 (2026-07-21, main 병합 후)

배포는 Cloudflare Pages 이며 `main` push 로 자동 빌드된다. 확인 시점에 새 자산이 404 로 보였으나 **fetch 캐시였다** — 쿼리스트링으로 캐시를 피해 재확인하니 전부 올라와 있었다.

| 확인 | 결과 |
|---|---|
| `llms.txt` 섹션 | 10개 — `## Vocabulary (562 UI terms)`, `## Decisions (which element to use)` 신설분 포함 |
| `entry-protocol.md` | N-1·N-2·N-3 절 존재. `term`/`vocabulary`/`dictionary` **34회**(VL1 계측 시점 **0회**) |
| 용어 인덱스 | `vocabulary/index.md` → "용어 562개 / 그룹 58개" |
| 그룹 샤드 | `vocabulary/input-pickers.yml` → `combobox` 본문, `visual_anatomy` 4개 그대로 |
| 판별 군집 | `decisions/single-choice-input.md` → 축 5개, `option-set-known` 의 source 가 Carbon URL |

**조회 실측(라이브)**: 인덱스 → 그룹 샤드 **2 fetch** 로 `combobox` 본문 도달. horizon 닫는 기준 1의 실배포분 충족.

## 7. 정정 — VL1 계측값 하나

VL1 장부는 프로토콜의 용어 언급을 "0회"로 적었고 그것은 그 시점에 정확했다. 지금 배포본은 34회다. 계측이 틀린 게 아니라 **배선이 바뀐 것**이다 — 두 수치를 나란히 남긴다.
