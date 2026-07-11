import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type DocsCodeBlockVariant = {
  id: string
  label: string
  code: string
}

type DocsCodeBlockProps = {
  variants: DocsCodeBlockVariant[]
  className?: string
}

/**
 * Documentation code block with language/package-manager tabs and a copy
 * button. `article-documentation-layout`'s `<pre>` block only defines a
 * single code sample with local scroll — this adds tab switching between
 * equivalent variants (e.g. npm/yarn/pnpm) and one-click copy.
 */
export function DocsCodeBlock({ variants, className }: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Tabs defaultValue={variants[0]?.id} className={cn("w-full max-w-2xl", className)}>
      <div className="flex items-center justify-between">
        <TabsList variant="line">
          {variants.map((variant) => (
            <TabsTrigger key={variant.id} value={variant.id}>
              {variant.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {variants.map((variant) => (
        <TabsContent key={variant.id} value={variant.id} className="relative">
          <Button
            aria-label="Copy code"
            className="absolute right-2 top-2"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => handleCopy(variant.code)}
          >
            {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </Button>
          <pre className="overflow-x-auto rounded-md bg-foreground p-4 pr-10 text-background">
            <code className="text-xs">{variant.code}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
