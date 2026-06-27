# PRD — UI Vocabulary Encyclopedia

## Problem

바이브코딩 사용자와 초급 UI/UX 학습자는 원하는 화면 요소의 이름을 몰라 AI에게 구체적으로 요청하지 못한다. "예쁘게 만들어줘" 대신 "카드, 토글, 드롭다운, 모달을 넣어줘"처럼 말할 수 있으려면 이름, 생김새, 쓰임을 함께 익히는 자료가 필요하다.

## Product Goal

UI 컴포넌트와 화면 요소의 이름, 생김새, 쓰임, AI 프롬프트 표현을 한 화면에서 배울 수 있는 웹 백과사전을 만든다.

Seed visual: a local reference screenshot used only for layout direction. The runtime site must not depend on a local Desktop file.

## Target Users

- UI 용어를 잘 모르는 바이브코딩 사용자
- UI/UX 디자인을 처음 공부하는 사람
- AI에게 화면을 더 정확하게 지시하고 싶은 개발자/기획자

## MVP Scope

- 용어 데이터셋: 6개 카테고리, 1차 60개 용어
- 검색: 한국어 이름, 영어 이름, alias, 설명 기반 검색
- 카드 그리드: 용어명 옆에 실제 UI가 어떻게 생겼는지 보이는 미니 컴포넌트 포함
- 상세 보기: 생김새, 쓰임, 피해야 할 상황, 비슷한 용어와 차이, AI에게 말하는 문장
- 포스터 뷰: seed 이미지처럼 카테고리별 요약을 한 화면에 볼 수 있는 레이아웃

## Non-Goals

- 퀴즈 기능은 만들지 않는다.
- 로그인, 계정, 서버 저장 기능은 MVP에 넣지 않는다.
- 이미지 생성 모델에 의존하지 않는다. 웹 컴포넌트를 캡처하거나 다운로드하는 방향으로 해결한다.
- cookbook을 먼저 통합하지 않는다. vocabulary site가 먼저다.

## Success Criteria

- 사용자가 "토글", "모달", "드롭다운"을 검색해 같은 카드를 찾을 수 있다.
- 사용자가 "toggle", "modal", "dropdown"으로도 같은 카드를 찾을 수 있다.
- 카드만 봐도 컴포넌트의 형태를 대략 이해할 수 있다.
- 각 용어는 AI 프롬프트에 바로 넣을 수 있는 한국어 문장을 가진다.
- seed 이미지처럼 용어 옆에 실제 UI 미니 컴포넌트가 배치된다.

## Open Follow-Ups

- 포스터 PNG 다운로드는 MVP 이후 H3에서 구현한다.
- cookbook과의 연결은 term detail 하단 advanced link로 나중에 붙인다.
