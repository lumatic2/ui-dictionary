import {
  ApiReferenceLayout,
  type ApiReferenceParam,
  type ApiReferenceSample,
} from "@/components/api-reference-layout"

export type ApiReferenceData = {
  method: string
  path: string
  params: ApiReferenceParam[]
  samples: ApiReferenceSample[]
  response: string
}

/**
 * The reference page. The endpoint block owns method/path/params/samples;
 * this page owns only the framing around it, so adding a second endpoint
 * is one more `ApiReferenceLayout` and one more entry in the data file.
 */
export function ApiPage({ reference }: { reference: ApiReferenceData }) {
  return (
    <div className="min-w-0 flex-1 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        Reference / HTTP API
      </nav>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Events</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        One endpoint writes to the event store. Everything the dashboard, the CLI, and the SDK do
        eventually lands here.
      </p>

      <div className="mt-10">
        <ApiReferenceLayout
          method={reference.method}
          params={reference.params}
          path={reference.path}
          response={reference.response}
          samples={reference.samples}
        />
      </div>
    </div>
  )
}
