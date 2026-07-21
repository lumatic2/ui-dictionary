// FIXTURE — 반응형 접두사. 기대: {16, 20}
// md:text-lg 와 순수 text-lg 는 같은 20px 로 합쳐진다 — 한 시점에 한 브레이크포인트만
// 렌더되므로 반응형 재정의는 별도 단계가 아니다.
export const Responsive = () => (
  <div>
    <p className="text-base md:text-lg">반응형 본문</p>
    <p className="text-lg">같은 단계</p>
    <p className="text-center">크기가 아닌 text- 유틸리티는 세지 않는다</p>
  </div>
)
