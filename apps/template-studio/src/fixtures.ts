import { compileTemplate, type AssetManifestEntry, type TemplateFormat, type TemplateProject, type TemplateRequest } from '@askewly/template-core'

const assets: AssetManifestEntry[] = [
  { id: 'portrait', role: 'portrait', uri: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80', mimeType: 'image/jpeg', width: 800, height: 1000, provenance: { provider: 'stock', source: 'Unsplash fixture' } },
  { id: 'product', role: 'product', uri: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80', mimeType: 'image/jpeg', width: 1000, height: 800, provenance: { provider: 'stock', source: 'Unsplash fixture' } },
]
const requests: Record<TemplateFormat, TemplateRequest> = {
  'business-card': { id: 'studio-card', format: 'business-card', width: 1050, height: 600, tokenSetId: 'askewly.warm', content: { name: '전유성', role: 'AI Builder · askewly', contact: 'hello@askewly.com' } },
  'product-poster': { id: 'studio-poster', format: 'product-poster', width: 1080, height: 1350, tokenSetId: 'askewly.warm', content: { product: '흙과 손 · 매일컵', headline: '손이 빚은 하루의 그릇', cta: '이번 가마 보기' } },
  infographic: { id: 'studio-info', format: 'infographic', width: 1200, height: 1600, tokenSetId: 'askewly.warm', content: { title: '편집 가능한 제작 시스템', stat: '3 formats', explanation: '브리프와 토큰이 텍스트·이미지·도형을 보존한 장면으로 이어집니다.', source: '출처: Askewly Design 고정 fixture' } },
}
export const studioProjects = Object.fromEntries(Object.entries(requests).map(([format, request]) => [format, compileTemplate(request, assets)])) as Record<TemplateFormat, TemplateProject>
