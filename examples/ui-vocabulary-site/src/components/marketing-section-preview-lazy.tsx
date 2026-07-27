import { lazy, Suspense, type ComponentProps } from "react"

export type { MarketingPreviewVariant } from "@/components/marketing-section-preview"

// UE5 step-2: 데모 변형 렌더러(약 1.7만 줄)를 초기 청크에서 분리한다 —
// 카탈로그 화면이 실제로 프리뷰를 그릴 때만 로드된다.
const MarketingSectionPreviewInner = lazy(() =>
  import("@/components/marketing-section-preview").then((module) => ({ default: module.MarketingSectionPreview }))
)

export function MarketingSectionPreviewLazy(props: ComponentProps<typeof MarketingSectionPreviewInner>) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="min-h-40 w-full animate-pulse rounded-md bg-muted" />}>
      <MarketingSectionPreviewInner {...props} />
    </Suspense>
  )
}
