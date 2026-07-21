# TH11 — 인쇄 규격 mm 기반 재정의 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th11-print-spec-mm.md`
- 리서치: `research/2026-07-20-template-production-hardening-print-spec.md`
- Changesets: 185 `absolute-mm-contract` · 186 `print-spec-presets` · 187 `bleed-and-crop-marks`

## 무엇이 문제였나

청사진 px가 정본이고 규격을 종횡비로 역추론했다. 그 방식에는 **답을 낼 수 없는 질문**이 있다:
`business-card-vertical`(600×1050)은 `kr-90x50`(오차 0.0159)과 `us-3.5x2`(오차 0.0000) **양쪽 허용 오차 안**이다. 90mm인지 88.9mm인지 코드가 모르니 300dpi 인쇄 파일을 만들 수 없었다.

## 무엇이 바뀌었나

| | 이전 | 이후 |
|---|---|---|
| 규격 판정 | 종횡비 역추론(모호) | 청사진이 `printSpecId` 선언, 타입이 강제 |
| 안전 여백 | 전 포맷 24px 고정 상수 | 규격 mm 유래 (명함 38/36px, A계열 12px) |
| 인쇄 규격 | 명함 3종만 | + A계열 4종(A4·A3·A2·A1) |
| 인쇄용 청사진 | 명함 2종 | + A3 포스터, A4 인포그래픽 |
| 내보낸 SVG | 재단 크기 그대로 | 도련 포함 지면 + 재단 표시 8선 |

## 측정값

```
mm→px 환산 (300dpi):  85mm=1004  55mm=650  A4=2480×3508  A3=3508×4961   ← 리서치 예시와 일치

청사진                    매체    규격            여백    논리 px      SVG 지면
business-card-minimal    print   us-3.5x2       38px   1050×600    1202×752
business-card-vertical   print   kr-90x50       36px    600×1050     744×1194
product-poster-print-a3  print   iso-a3         12px   1169×1654   1217×1702
infographic-print-a4     print   iso-a4         12px    827×1169     875×1217
product-poster-hero      screen  (소셜 4:5)      24px   1080×1350   1080×1350
infographic-stats        screen  (규격 없음)      24px   1200×1600   1200×1600
```

테스트 **162 → 190** (template-core), agent-design 98 무회귀. `npm run verify` 4단계 exit 0, 내보내기 산출물 18 → **24개**.

## DoD 대조

| DoD 항목 | 상태 |
|---|---|
| 도련·안전영역이 mm 기반으로 선언 | 완료 — `printSpecs` mm이 유일한 출처, px 상수 제거 |
| 명함·포스터에 발주 요건 규격 프리셋 | 완료 — 명함 3 + A계열 4 |
| 내보낸 SVG가 도련·재단 표시를 담음 | 완료 — 지면 확장 + 벡터 8선 |
| full-bleed 배치 가능 | 완료 — 전면 배경이 도련까지 확장 |
| 산출물을 실물로 렌더해 확인 | 완료 — `th11/bleed-and-crop-marks.png`, `th11/crop-mark-corner-detail.png` |

## 실패 probe (전부 실제 실행)

| step | 되돌린 것 | 결과 |
|---|---|---|
| 1 | 규격 판정 → 종횡비 추론 | `expected 'kr-business-card-90x50' to be 'us-business-card-3.5x2'` |
| 1 | 안전 여백 → 24px 고정 | `expected 24 to be 38` |
| 1 | 청사진의 `output` 제거 | 컴파일 거부 (TS2741) |
| 2 | A3를 297×400으로 훼손 | 4 failed — 비율·300dpi 환산·청사진 비율 검증 |
| 2 | 인포그래픽 인쇄판 제거 | 5 failed — `infographic에 인쇄용 청사진이 없다` |
| 3 | 배경의 도련 확장 제거 | **처음 PASS** → 게이트 보강 후 3 failed, exit 1 |
| 3 | 재단 표시 제거 | 4 failed, exit 1 |

## 이 milestone이 남긴 교훈

**probe가 두 번, 코드가 아니라 검증의 결함을 드러냈다.**

- step-1: 계약을 되돌렸는데 통과했다 — 기존 청사진이 우연히 전부 종횡비로도 맞아떨어져 테스트가 계약의 필요성을 증명하지 못했다.
- step-3: 배경 확장을 되돌렸는데 통과했다 — exporter 자체 backdrop이 같은 상자를 그려 "있는가" 검사를 대신 만족시켰다. **존재 검사는 중복이 있으면 무력하다.** "재단 크기 그대로인 사각형이 남아 있지 않은가"로 바꾸자 걸렸다.

TH9에서 처음 나온 동어반복 함정이 형태를 바꿔 두 번 더 나타났다. probe를 설계할 때 "이 게이트가 **이것만으로** 실패하는가"를 물어야 한다.

## 남은 부채

- 포스터 안전영역·재단 표시 선 길이의 1차 출처 없음 — 코드에 유추임을 명시. 발주 전 인쇄소 확인 대상.
- CMYK 컬러 프로파일 미고려(화면 sRGB 값이 그대로 나감).
- PDF 생성·300dpi 래스터화는 범위 밖.
- A2·A1 프리셋은 정의만 있고 쓰는 청사진이 없다.
- 인쇄용 HTML에는 도련·표시가 없다(SVG 경로 전용).
