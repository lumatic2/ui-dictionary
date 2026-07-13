# Roadmap Gap Review

Date: 2026-07-13

## North Star
AskewlyDesign의 코드 네이티브 캔버스를 실제 React UI를 보고 만들고 되돌릴 수 있는 Mac 우선 편집 제품으로 끌어올린다. Details: `docs/horizons/2026-07-askewlydesign-editor-quality.md`.

## Current State
- canonical operations, hierarchy, selection, direct manipulation, property metadata, registry insertion, agent bridge의 기술 proof와 core 52-test 기준선은 존재한다.
- Electron의 folder open, trusted/recent project, file catalog와 cross-platform lifecycle도 이미 있다.
- 그러나 live Mac 실행은 package별 install/build를 수동으로 요구했고, production 기본 화면은 1,000-node fixture와 dev command로 시작했다.
- 캔버스는 실제 React tree 대신 이름표 box를 flat absolute layer로 렌더한다. layout metadata, source round-trip, desktop human Undo/Redo도 제품 계약과 실제 동작 사이 간극이 있다.

## Gap
- 문서가 기록한 "production environment" 완성과 실제 사용자가 보는 편집기 품질이 일치하지 않는다.
- 실제 UI가 보이지 않는 상태에서 toolbar·asset·agent 기능을 더하면 placeholder 편집기를 정교하게 만드는 데 그친다.
- Mac의 reproducible baseline이 없어 이후 품질 개선의 회귀를 신뢰성 있게 측정할 수 없다.

## Approved Horizon Sequence
- EQ0 — Mac Reproducible Baseline
- EQ1 — Real React Rendering Contract
- EQ2 — Editor State And Editing Fidelity
- EQ3 — Components And Assets
- EQ4 — Trusted Co-Creation And Mac Delivery

## Recommendation
EQ0로 검증 가능한 Mac 기준선을 먼저 고정한 뒤, EQ1에서 실제 React 렌더링 계약을 닫는다. 수익화 horizon은 폐기하지 않고 보류한다.
