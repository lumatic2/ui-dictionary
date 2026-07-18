import { describe,expect,it } from 'vitest'
import { compileTemplate } from './compiler.js'
import { formatPackCatalog } from './blueprints/registry.js'
import { listBlueprints,validateFormatIntegrity } from './catalog.js'
import type { AssetManifestEntry,TemplateRequest } from './types.js'
const assets:AssetManifestEntry[]=[{id:'product',role:'product',uri:'x.webp',mimeType:'image/webp',width:1000,height:800,provenance:{provider:'local',source:'fixture'}}]
const content={name:'Askewly',role:'Builder',contact:'a@b.co',product:'Cup',headline:'Crafted daily',cta:'Buy',title:'Template facts',stat:'3',unit:'formats',explanation:'Structured scenes',source:'Askewly fixture'}
describe('six-format catalog',()=>{it('exposes 6 blueprints and compiles all',()=>{expect(listBlueprints()).toHaveLength(6);for(const blueprint of formatPackCatalog){const request:TemplateRequest={id:blueprint.id,format:blueprint.format,width:blueprint.width,height:blueprint.height,tokenSetId:'brand.test',content};const project=compileTemplate(request,assets,blueprint);expect(validateFormatIntegrity(project)).toEqual([])}});it('rejects missing infographic source/unit',()=>{const b=formatPackCatalog.find(x=>x.format==='infographic')!;const p=compileTemplate({id:'bad',format:'infographic',width:b.width,height:b.height,tokenSetId:'x',content},assets,b);p.request.content.source='';p.request.content.unit='';expect(validateFormatIntegrity(p)).toEqual(expect.arrayContaining(['SOURCE_REQUIRED','UNIT_REQUIRED']))})})
