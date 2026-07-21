// FIXTURE — 정상 케이스: 토큰만 쓴 코드.
// 기대: 위반 0건. 오탐 예외를 넓게 뚫어도 이 파일은 계속 PASS 여야 한다.
export const Clean = () => (
  <div className="bg-primary text-foreground border-border">
    <span className="text-muted-foreground">tokens only</span>
  </div>
)
