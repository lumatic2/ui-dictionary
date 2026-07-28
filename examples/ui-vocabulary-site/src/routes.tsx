import { createBrowserRouter, redirect } from "react-router"
import App from "./App"
import { legacyRedirectPath } from "@/lib/url-mapping"

/**
 * UE5 step-1: 모든 라우트가 기존 App(화면 상태 기계)을 렌더하는 어댑터 단계.
 * 경로 스킴 정본은 `src/lib/url-mapping.ts`. step-2 에서 라우트별 lazy 모듈로 분리한다.
 */

const APP_PATHS = [
  "/",
  "/terms/:termId",
  "/patterns",
  "/patterns/:collectionSlug",
  "/docs",
  "/docs/:collectionSlug",
  "/search",
  "/colors",
  "/recipes",
  "/pro",
  "/download",
  "/get-started",
]

export const router = createBrowserRouter([
  ...APP_PATHS.map((path) => ({
    path,
    element: <App />,
    ...(path === "/"
      ? {
          loader({ request }: { request: Request }) {
            const target = legacyRedirectPath(new URL(request.url))
            return target ? redirect(target) : null
          },
        }
      : {}),
  })),
  {
    path: "*",
    loader() {
      return redirect("/")
    },
  },
])
