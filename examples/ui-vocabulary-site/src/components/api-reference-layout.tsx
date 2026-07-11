import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type ApiReferenceParam = {
  name: string
  type: string
  required?: boolean
  description: string
  nested?: ApiReferenceParam[]
}

export type ApiReferenceSample = {
  language: string
  label: string
  code: string
}

type ApiReferenceLayoutProps = {
  method: string
  path: string
  params: ApiReferenceParam[]
  samples: ApiReferenceSample[]
  response: string
}

function ParamRow({ param, depth = 0 }: { param: ApiReferenceParam; depth?: number }) {
  return (
    <div className="flex flex-col gap-1" style={{ paddingLeft: depth * 16 }}>
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-sm font-medium">{param.name}</code>
        <span className="text-xs text-muted-foreground">{param.type}</span>
        <Badge variant={param.required ? "default" : "outline"} className="text-[10px]">
          {param.required ? "required" : "optional"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{param.description}</p>
      {param.nested?.length ? (
        <div className="flex flex-col gap-2 border-l pl-3">
          {param.nested.map((child) => (
            <ParamRow key={child.name} param={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * API reference layout: left column carries parameter documentation, right
 * column is a sticky panel with language-switchable request samples and the
 * response body. Distinct from `article-documentation-layout`'s on-this-page
 * rail — this right column holds executable code/response, not section labels.
 */
export function ApiReferenceLayout({ method, path, params, samples, response }: ApiReferenceLayoutProps) {
  return (
    <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="min-w-0 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Badge className="font-mono uppercase">{method}</Badge>
          <code className="text-sm">{path}</code>
        </div>
        <div className="flex flex-col gap-5">
          {params.map((param) => (
            <ParamRow key={param.name} param={param} />
          ))}
        </div>
      </div>
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <Tabs defaultValue={samples[0]?.language}>
          <TabsList>
            {samples.map((sample) => (
              <TabsTrigger key={sample.language} value={sample.language}>
                {sample.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {samples.map((sample) => (
            <TabsContent key={sample.language} value={sample.language}>
              <pre className={cn("overflow-x-auto rounded-md bg-foreground p-4 text-background")}>
                <code className="text-xs">{sample.code}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">Response</p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-4">
            <code className="text-xs">{response}</code>
          </pre>
        </div>
      </aside>
    </div>
  )
}
