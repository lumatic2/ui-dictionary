// FIXTURE — 경계: 정확히 5단계(= 우리 토큰 스케일 전부). PASS 기대.
// 이 파일이 FAIL 이면 임계값이 자기 디자인 시스템을 위반으로 만든다는 뜻이다.
export const Five = () => (
  <section>
    <h1 className="text-2xl">40</h1>
    <h2 className="text-xl">28</h2>
    <h3 className="text-lg">20</h3>
    <p className="text-base">16</p>
    <span className="text-sm">14</span>
  </section>
)
