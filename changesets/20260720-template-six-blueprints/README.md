# changeset: 청사진 6종 실재화

- Date: 2026-07-20
- Plan: TH2 step 2 (`plans/2026-07-20-th2-blueprint-archetypes.md`)

`-split` 파생 생성기를 삭제하고 6개 청사진을 전부 명시 선언했다. 카탈로그 숫자 6이 실질 6이 됐다.

## 무엇을 바꿨나

| 포맷 | A (기존) | B (신규) | 구별 축 | 실측 |
|---|---|---|---|---|
| 명함 | `business-card-minimal` 가로 1050×600 | `business-card-vertical` 세로 600×1050 | 방향 → 그리드 열 수 | 열 3 vs 2 |
| 제품 포스터 | `product-poster-hero` 이미지 지배 | `product-poster-editorial` 타이포 지배(Swiss) | 이미지:텍스트 비율 + 그리드 | 슬롯 5 vs 6, 열 1 vs 2 |
| 인포그래픽 | `infographic-stats` 단일 초점 | `infographic-comparison` 다중 병렬 | 구조(반복 유닛) | 슬롯 5 vs 3+반복, 열 1 vs 3 |

근거는 `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`. 세 축 모두 **그리드/슬롯 구조 자체**를 바꾸므로 좌표 offset으로 환원되지 않는다.

부수 교정 — `validateFormatIntegrity`의 인포그래픽 수치 요건을 **청사진 인지형**으로 바꿨다. 기존에는 인포그래픽이면 무조건 `stat`/`unit`을 요구해, `stat` 슬롯이 없는 비교형이 쓰지도 않는 필드를 채워야 통과했다. 이제 장면에 `stat` 슬롯이 있을 때만 요구한다. 출처(`source`)는 구조와 무관하게 계속 필수다.

## Verification

- [x] `npm --prefix packages/template-core test` — **31 tests PASS** (기존 21 + 신규 10)
- [x] `npm --prefix packages/template-core run build` — tsc PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0, **6청사진 전부 컴파일·무결성 통과**
- [x] `node scripts/check-line-length.mjs` — PASS
- [x] **TH1 서명 불변식 유지** — signature-lock 테스트 3종 계속 통과

### Failure probe — 구별 게이트가 실제로 막는가

카탈로그의 `business-card-vertical`을 좌표만 옮긴 clone(`x+24`, `width-48`, 구 `-split` 생성 규칙 그대로)으로 임시 교체하고 테스트를 돌렸다:

```
× 청사진 구별 > business-card의 두 청사진은 슬롯 개수 또는 그리드 열 수가 다르다
  → business-card-minimal와 business-card-shifted가 구조적으로 같다
    — 슬롯 5/5, 열 3/3. 좌표만 옮긴 변주는 두 번째 아키타입이 아니다.
  Tests: 1 failed | 30 passed
```

되돌린 뒤 31 passed. **프리모템 2("청사진 B안이 또 좌표 변형으로 퇴화")의 예방 장치가 실제로 작동한다.**

## 주의 — verify manifest 서명이 바뀐 것은 drift가 아니다

`e2e-manifest.json`의 서명이 TH1 시점과 다르다. 원인은 두 가지 의도된 변경이다:

1. request id가 `e2e-<format>` → `e2e-<blueprintId>` (한 포맷에 청사진이 2개라 format 기준 id가 충돌한다)
2. request에 `lists` 필드가 추가됨

**TH1의 불변식은 `signature-lock.test.ts`가 계속 지킨다** — 그 테스트는 고정된 자체 request(`e2e-<format>`, `lists` 없음)를 쓰므로 verify 스크립트 변경에 영향받지 않고, 기준선 3종(`tpl-a5add834`/`tpl-e523954b`/`tpl-f864dd3b`)을 그대로 통과한다.

## finding 큐

- `business-card-vertical`의 인물 슬롯은 안전영역(24px) 때문에 full-bleed 밴드가 아니라 인셋 배치다. 리서치가 기술한 full-bleed photo 아키타입을 구현하려면 도련(bleed) 개념이 필요하다 — step 3에서 다룬다.
- 반복 유닛 텍스트도 `fontSize = max(18, round(height*0.45))` 휴리스틱을 쓴다 (TH1이 적발한 오버플로와 같은 뿌리, TH3 소관).
