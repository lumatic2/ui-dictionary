import type { TemplateBlueprint } from '../types.js'

export const blueprintRegistry: TemplateBlueprint[] = [
  {
    id: 'business-card-minimal', format: 'business-card', width: 1050, height: 600, density: 'airy', priority: 10,
    slots: [
      { id: 'accent', kind: 'shape', required: true, bounds: { x: 0, y: 0, width: 32, height: 600 }, tokenBindings: { fill: 'brand.primary' }, shape: 'rectangle' },
      { id: 'name', kind: 'text', contentKey: 'name', required: true, bounds: { x: 90, y: 150, width: 580, height: 90 }, tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' }, maxChars: 40 },
      { id: 'role', kind: 'text', contentKey: 'role', required: true, bounds: { x: 90, y: 250, width: 580, height: 48 }, tokenBindings: { color: 'text.secondary' }, maxChars: 60 },
      { id: 'contact', kind: 'text', contentKey: 'contact', required: true, bounds: { x: 90, y: 420, width: 580, height: 44 }, tokenBindings: { color: 'text.secondary' }, maxChars: 100 },
      { id: 'portrait', kind: 'image', assetRole: 'portrait', required: false, bounds: { x: 730, y: 80, width: 240, height: 440 }, tokenBindings: {} },
    ],
  },
  {
    id: 'product-poster-hero', format: 'product-poster', width: 1080, height: 1350, density: 'balanced', priority: 10,
    slots: [
      { id: 'backdrop', kind: 'shape', required: true, bounds: { x: 0, y: 0, width: 1080, height: 1350 }, tokenBindings: { fill: 'surface.canvas' }, shape: 'rectangle' },
      { id: 'product-image', kind: 'image', assetRole: 'product', required: true, bounds: { x: 120, y: 110, width: 840, height: 690 }, tokenBindings: {} },
      { id: 'headline', kind: 'text', contentKey: 'headline', required: true, bounds: { x: 120, y: 850, width: 840, height: 150 }, tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' }, maxChars: 70 },
      { id: 'product', kind: 'text', contentKey: 'product', required: true, bounds: { x: 120, y: 1010, width: 840, height: 60 }, tokenBindings: { color: 'text.secondary' }, maxChars: 80 },
      { id: 'cta', kind: 'text', contentKey: 'cta', required: true, bounds: { x: 120, y: 1130, width: 360, height: 80 }, tokenBindings: { color: 'brand.primary' }, maxChars: 30 },
    ],
  },
  {
    id: 'infographic-stats', format: 'infographic', width: 1200, height: 1600, density: 'balanced', priority: 10,
    slots: [
      { id: 'backdrop', kind: 'shape', required: true, bounds: { x: 0, y: 0, width: 1200, height: 1600 }, tokenBindings: { fill: 'surface.canvas' }, shape: 'rectangle' },
      { id: 'title', kind: 'text', contentKey: 'title', required: true, bounds: { x: 100, y: 100, width: 1000, height: 160 }, tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' }, maxChars: 80 },
      { id: 'stat', kind: 'text', contentKey: 'stat', required: true, bounds: { x: 100, y: 420, width: 1000, height: 300 }, tokenBindings: { color: 'brand.primary', fontFamily: 'type.display' }, maxChars: 50 },
      { id: 'explanation', kind: 'text', contentKey: 'explanation', required: true, bounds: { x: 100, y: 800, width: 1000, height: 420 }, tokenBindings: { color: 'text.secondary' }, maxChars: 360 },
      { id: 'source', kind: 'text', contentKey: 'source', required: true, bounds: { x: 100, y: 1430, width: 1000, height: 60 }, tokenBindings: { color: 'text.muted' }, maxChars: 160 },
    ],
  },
]
