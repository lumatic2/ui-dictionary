# 완료 — PB2 bespoke 실증 (goal `pptx-bespoke` 완주)

> 완료: 2026-07-31 · PB2 (goal `pptx-bespoke` 2/2 — 이로써 goal 완주) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

bespoke 트랙이 실사용 품질에 도달했다 — 단 계획의 원래 기준(HTML 렌더 근접)이 관측 FAIL 로 뒤집혀, **brandlogy 편집 그래머**로 기준을 재정의(재승인)한 뒤였다. 산출: askewly-design-intro bespoke(7장)·free-topic-deck(5장, 주제 한 줄→자유 구성·0라운드 전이)·codex 위임 2본(하이브리드·풀-이미지). 관측 왕복 4회의 지적(그림자 계층·카드 일색·구도 반복·글리프 아이콘)을 전부 반영하고, **이미지 3트랙 구도(네이티브 정본/하이브리드/풀-이미지+사실 검수)** 로 사용자 확정. 흡수분은 custom-skills `references/pptx-bespoke.md` §5~8 로 배포(changeset `20260731-pb2-bespoke-absorption`).

## 2. 이슈와 해결

- pptxgenjs shadow 객체 뮤테이션 → **PowerPoint 가 못 여는 파일**(python-pptx 는 통과) — 도형별 새 객체로 해소, §8 박제.
- 기준 자체가 사용자 소유 결정으로 뒤집힘(HTML 미러링 폐기) — decision_required 정지·ledger 기록·재승인 경로 준수.
- 풀-이미지 생성이 콘텐츠(5단계 라벨)를 지어냄 — 생성 자가 점검은 사실 왜곡을 못 잡는다는 실측 → ③트랙 사실 검수 게이트 근거.

## 3. 증거

- evidence: `evidence/slide-pipeline/pb2-bespoke-proof.md` (라운드 장부 v1 3+v2 4·편차 장부·게이트 재정의).
- 실표면: 산출 PPTX 를 PowerPoint 실개봉으로 사용자가 4회 관측(FAIL 1회 포함) — 최종 "그래 ㄱㄱ" 확정. COM assertion(Opened·ChartShapes 1·Workbook 접근 1) 두 덱 PASS·python-pptx(charts 1·비트맵 0·notes 이관) PASS.
- 재현: `cd decks/askewly-design-intro && node tools/export-pptx-bespoke.mjs && pwsh -File ~/.claude/skills/presentation-slides-yusung/scripts/pptx-to-png.ps1 export/askewly-design-intro.bespoke.pptx`
- 크기 회고: step 2개였으나 관측 왕복으로 라운드가 6회(v1 3·v2 4 중 겹침 제외) 확장 — milestone 라벨 정합(재정의 1회 포함). finding: 구성안 게이트(주제→구성안 승인→생성)를 스킬 G 게이트에 정식 배선하는 것은 차기 후보.
