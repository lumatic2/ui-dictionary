export type RegistryCollection = 'shadcn' | 'layout' | 'project' | 'recipe'

export interface RegistryEntry {
  id: string
  slug: string
  name: string
  collection: RegistryCollection
  category: string
  description: string
  defaultSize: { width: number; height: number }
  defaultProps: Record<string, string | number | boolean | null>
  variants: Record<string, string>
  keywords: string[]
}
