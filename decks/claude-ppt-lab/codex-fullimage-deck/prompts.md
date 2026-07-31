# Full-image slide prompts and self-check

All five slides were generated with `image_gen` as complete raster slides, then uniformly resampled to 1920×1080 without changing the rendered content. No PPTX file or editable presentation object was created.

## 01.png — cover

Prompt: Premium Korean design-studio editorial slide on cream `#F4F3EE`, with ink `#15130F`, navy `#2F4B7C`, and coral `#C65A3B`. Top-left kicker, top-right `Askewly`, left-aligned claim headline. Render exactly: `영상 하나로 PPT 파이프라인을 다시 세웠습니다` and `Askewly Design 하루 회고 · 2026-07-31`.

Self-check: PASS. The title and subtitle are legible and match the required Korean text; no ghost characters seen.

## 02.png — reproduction before adoption

Prompt: Premium Korean editorial process slide. Render exactly: `재현이 먼저, 흡수는 그다음입니다.`, five-step sequence `01 관찰`, `02 분해`, `03 재현`, `04 비교`, `05 기록`, and statistic cards `흡수 채택 3`, `기준 이미지 2`. Cream/navy/coral palette, kicker top-left, `Askewly` top-right.

Self-check: PASS. Headline, five step labels, and both required statistics are readable; no typo or stray text seen.

## 03.png — output

Prompt: Premium Korean editorial data slide. Render exactly: `하루에 커밋 34개, goal 세 개가 닫혔습니다.`; bar labels `SP1 7`, `SP2 2`, `SP3 4`, `PB 5`; right-side stats `34 커밋`, `5 PPTX`, `10 라운드`. Require lowercase Latin `g-o-a-l` in the headline, never `9`.

Self-check: PASS after one targeted regeneration. The visible headline uses `goal` correctly; all four bar labels and all three statistics match the requested values. No ghost characters seen.

## 04.png — grammar

Prompt: Premium Korean editorial transformation slide. Render exactly: `품질은 렌더가 아니라 그래머에서 나옵니다.`, `FAIL`, `그래머`, `프레임 앵커 4`, `정보 3계층`. Visualize a clear FAIL-to-grammar arrow plus four anchors and three information tiers.

Self-check: PASS. Required headline and labels are legible and correct; no typo or ghost text seen.

## 05.png — next action

Prompt: Premium Korean editorial closing slide. Render exactly: `다음 액션.`, then numbered actions `01 구성안 게이트`, `02 워크트리 병합`, `03 리디자인 트랙`. Cream/navy/coral palette, kicker top-left, `Askewly` top-right.

Self-check: PASS. The closing title and three action labels are visible and match the required Korean text; no typo or stray character seen.
