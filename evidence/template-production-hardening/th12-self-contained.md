# TH12 — 자기완결 산출물 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th12-self-contained-artifacts.md`
- Changesets: 189 `self-contained-assets` · 190 `no-external-references`
- 계기: TH6 실연 결함 1

## 같은 렌더 경로, 다른 결과

TH6이 내보낸 SVG를 `<img>`로 끼워 렌더했을 때 **그림이 없었다.** 외부 참조가 차단되기 때문이다.
지금 **똑같은 페이지·똑같은 방식**으로 렌더하면 그림이 있다.

| | 전 | 후 |
|---|---|---|
| 소재 URI | `C:/Users/.../askewly-portrait.png` | `data:image/png;base64,…` (421,070자) |
| SVG 크기 | 1,415 bytes + 별도 PNG 315,785 bytes | **422,460 bytes 한 장** |
| `<img>` 렌더 | 그림 없음 (조용히) | 그림 있음 |
| 스튜디오 가져오기 | URI를 손으로 고쳐야 함 | 그대로 |

증거: `th6/final-artifact-render.png` (교체 전 이미지는 같은 파일명의 이전 커밋에 있다)

## 게이트

`checkNoExternalReferences` — 기대값을 산출물이 아니라 **매니페스트**에서 가져온다:
모든 소재 URI가 `data:`여야 하고, 산출물의 `href`/`src` 중 `data:`가 아닌 것이 있으면 실패한다.

## 실패 probe

| 되돌린 것 | 결과 |
|---|---|
| 공급자 기본 URI를 출력 경로로 | 2 failed — `to start with 'data:image/png;base64,'` |
| 매니페스트 URI를 파일 경로로 | 게이트 **42건** 실패, exit 1 |

## 남은 부채

- 316KB PNG → base64 421KB. 소재 여러 개인 포스터는 문서가 커진다(리사이즈·압축은 별도 후보).
- JSON 산출물이 848KB가 됐다 — 소재가 문서 안에 있으니 당연하지만, 편집기 저장·왕복 체감은 미측정.
