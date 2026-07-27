# UE3 배치 1 — Header Sections · Footers · 증거

> milestone UE3 (배치 1) · goal `ui-encyclopedia` · 2026-07-28
> plan: `plans/2026-07-27-ue3-batch1-header-footer.md` · changeset: `changesets/20260727-ue3-batch1-header-footer/`

## 기계 검증 (실행 관측 — 원문)

```
1 header sections: PASS  guide=True tf=True se=True 10ex=True
2 new header demos render: PASS
3 footers: PASS  bw=True vocab=True 8ex=True
4 dark capture: PASS
CONSOLE ERRORS: 0 · UE3 B1 STEP2/3: PASS
```

- 레퍼런스 장부: `research/2026-07-27-ue3-batch1-references.md` — 헤더 6·푸터 6(전 항목 URL+접근일), 기존 8+7 전수 대조, 갭 3건.
- Header Sections: 10예제 (신규 Type-first·Split editorial) + 안내문에 hero/내비바 구분 명시 + Centered↔Simple 설명 대비.
- Footers: 8예제 (신규 Brand wordmark).
- 수정 variant 타 사용처 grep 결과 없음(회귀 0) · tsc·build·lint exit 0 · 신규 코드 색 리터럴 0.
- 시그니처 자가 판정: 신규 3종이 기존과 뚜렷이 다른 골격(타입 우선/비대칭 그리드/워드마크) — O10 재발 방지 축 충족. 라이트/다크 캡처.

## 사람 관측 (배치 1 DoD 최종 항목)

- 과업: "헤더 목록 다시 봐주세요 — 이제 hero 와의 구분이 읽히고 서로 달라 보이나요? 푸터의 새 워드마크 변형도요."
- **상태: 대기**
