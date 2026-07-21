# changeset: cascade + sticky live preview

- Date: 2026-07-19
- Milestone: ST2 (`plans/2026-07-19-st2-cascade-preview.md`)
- 사용자 지시: "위에서 정한 게 아래에 바로 적용 + 폭포로 점차 완성되는 사이트를 미리보며"

## 변경

- `templates/brief-studio.html` 렌더러 전면 교체 — ① **캐스케이드 컨텍스트**(CTX: 선택값 ?? 타일 부스트 ?? 추천 1순위): 액센트·타이포·구성·헤더·푸터·카드·아이콘·모션 후보가 전부 "선택된 베이스 위"에서 렌더, 와이어프레임 액센트 바·버튼·radius도 컨텍스트 반영 ② **하위만 리렌더**(renderFrom — 상위·자기 선택 보존) ③ **스티키 라이브 미리보기**: 우측 400px 패널에 미니 사이트(헤더 변형·히어로[이미지 반영]·카드 3[스타일·radius·밀도]·푸터 변형) 실시간 조립, 좁은 뷰포트(≤1080px)는 static 상단 배치.
- `docs/design-system/brief-studio.md` — 캐스케이드·미리보기 절 + 영향순 배치 명문. llms 배포.

## 검증 checklist (Playwright evaluate 실측)

- [x] 캐스케이드: base=pure-dark 선택 → accent 후보 배경 rgb(250,248,244)→rgb(22,22,26) 변화
- [x] Failure probe A(선택 보존): accent=blue 선택 후 base 재변경 → blue 선택 유지
- [x] 미리보기 반영: pv-site에 #20599C(선택 액센트) + 베이스 배경 존재
- [x] 스티키: computed position sticky
- [x] 스크린샷 2장 (st2-preview-a/b — 선택 진행에 따른 조립 변화)
- [ ] curl 캐스케이드 절 배포 (폴링)
