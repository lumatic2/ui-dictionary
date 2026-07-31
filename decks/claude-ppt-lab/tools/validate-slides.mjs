#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANONICAL_THEMES } from './src/theme.mjs';
import { lintPrinciples } from './src/lint-principles.mjs';

const root = process.cwd();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const argsOnly = process.argv.slice(2).filter((arg) => arg !== '--lint');
const lintEnabled = process.argv.includes('--lint');
const slidesPath = argsOnly[0] || path.join(root, 'content', 'slides.json');
const layoutMetaPath = path.join(scriptDir, 'layout-meta.json');
const schemaPath = path.join(scriptDir, 'slides.schema.json');

function fail(message) {
  console.error(`slides validation failed: ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${file}: ${error.message}`);
    return null;
  }
}

const deck = readJson(slidesPath);
if (!deck) process.exit(1);

const layoutMetaFile = readJson(layoutMetaPath);
if (!layoutMetaFile?.layouts) fail(`${layoutMetaPath} must contain a layouts object`);
const layoutMeta = layoutMetaFile?.layouts || {};

const allowedTemplates = new Set(CANONICAL_THEMES);
const allowedModes = new Set(['arrow', 'scroll-snap']);
const allowedCanvas = new Set(['hd']);
const allowedEffects = new Set(['none', 'rise', 'scale', 'fade', 'focus']);
const allowedTypography = new Set(['standard', 'compact', 'executive']);
const allowedLayouts = new Set(Object.keys(layoutMeta));

const errors = [];
const warnings = [];
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const machineTokenRe = /(?:https?:\/\/|[A-Za-z0-9_-]{29,}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;

function textLength(value) {
  return typeof value === 'string' ? [...value.trim()].length : 0;
}

function warnIfLong(label, field, value, limit, advice) {
  if (textLength(value) > limit) warnings.push(`${label}.${field} is long (${textLength(value)} chars); ${advice}`);
}

function warnIfMachineToken(label, field, value) {
  if (typeof value === 'string' && machineTokenRe.test(value)) {
    warnings.push(`${label}.${field} includes a long URL/id/email token; keep machine strings in source pack, README, or qr/embed fields`);
  }
}

function checkTextField(label, field, value, limit, advice) {
  warnIfLong(label, field, value, limit, advice);
  warnIfMachineToken(label, field, value);
}

function itemCount(slide) {
  return Array.isArray(slide.items) ? slide.items.length : 0;
}

function metricCount(slide) {
  return Array.isArray(slide.metrics) ? slide.metrics.length : 0;
}

function hasUrl(slide) {
  return Boolean(slide.assets?.url || slide.links?.[0]?.url);
}

function polishWarn(label, layout, message) {
  warnings.push(`${label}.${layout} polish: ${message}`);
}

function checkLayoutPolish(label, slide) {
  const items = itemCount(slide);
  const metrics = metricCount(slide);

  switch (slide.layout) {
    case 'cover':
      if (items > 3) polishWarn(label, slide.layout, 'best with 0-3 short audience/context chips');
      break;
    case 'closing':
      if (items < 1) polishWarn(label, slide.layout, 'best with 1-3 compact next-action cards; otherwise use a title-only closing intentionally');
      if (items > 3) polishWarn(label, slide.layout, 'best with 0-3 closing actions; use summary-grid for more points');
      break;
    case 'hero-cards':
      if (items < 1 || items > 3) polishWarn(label, slide.layout, 'best with 1-3 cards; use summary-grid for more points');
      if (!slide.subtitle && !slide.body) polishWarn(label, slide.layout, 'add subtitle/body so the hero has one clear spoken point');
      break;
    case 'comparison-2col':
      if (items < 2) polishWarn(label, slide.layout, 'needs at least 2 items for left/right comparison');
      if (items > 4) polishWarn(label, slide.layout, 'more than 4 points makes the two-column comparison dense; consider summary-grid');
      break;
    case 'step-flow':
      if (items < 3 || items > 5) polishWarn(label, slide.layout, 'best with 3-5 sequential steps');
      break;
    case 'diagram-box':
      if (items < 3) polishWarn(label, slide.layout, 'best with 1 center idea plus at least 2 surrounding nodes');
      if (items > 7) polishWarn(label, slide.layout, 'more than 7 nodes will crowd the diagram');
      break;
    case 'summary-grid':
      if (items < 3 || items > 6) polishWarn(label, slide.layout, 'best with 3-6 summary cards');
      break;
    case 'chart-interactive':
      if (metrics + items < 2) polishWarn(label, slide.layout, 'needs at least 2 data points to justify a chart');
      if (!slide.sourceNote && !slide.metrics?.some((metric) => metric.sourceId)) polishWarn(label, slide.layout, 'data slides should show a source note or metric sourceId');
      break;
    case 'three-scene':
      if (!slide.body && !slide.subtitle) polishWarn(label, slide.layout, 'add body/subtitle explaining what the 3D scene proves');
      break;
    case 'before-after':
      if (!(slide.assets?.before && slide.assets?.after) && items < 2) polishWarn(label, slide.layout, 'needs before/after assets or 2 labeled fallback items');
      break;
    case 'qr-embed':
      if (!hasUrl(slide)) polishWarn(label, slide.layout, 'needs a URL for QR generation');
      if (!slide.body) polishWarn(label, slide.layout, 'add a short scan instruction or expected action');
      break;
    default:
      break;
  }

}

function checkSchemaLayoutEnum() {
  if (!fs.existsSync(schemaPath)) {
    warnings.push(`${schemaPath} not found; layout enum consistency was not checked`);
    return;
  }
  const schema = readJson(schemaPath);
  const schemaLayouts = schema?.$defs?.slide?.properties?.layout?.enum
    || schema?.properties?.slides?.items?.properties?.layout?.enum;
  if (!Array.isArray(schemaLayouts)) {
    warnings.push(`${schemaPath} does not expose properties.slides.items.properties.layout.enum`);
    return;
  }
  const metaLayouts = [...allowedLayouts].sort();
  const sortedSchemaLayouts = [...schemaLayouts].sort();
  const missingInSchema = metaLayouts.filter((layout) => !sortedSchemaLayouts.includes(layout));
  const missingInMeta = sortedSchemaLayouts.filter((layout) => !allowedLayouts.has(layout));
  if (missingInSchema.length > 0 || missingInMeta.length > 0) {
    errors.push(`layout-meta.json and slides.schema.json layout enum differ; missing in schema: ${missingInSchema.join(', ') || 'none'}; missing in metadata: ${missingInMeta.join(', ') || 'none'}`);
  }
}

checkSchemaLayoutEnum();

if (!deck.meta || typeof deck.meta !== 'object') errors.push('meta is required');
if (!Array.isArray(deck.slides) || deck.slides.length === 0) errors.push('slides must be a non-empty array');

if (deck.meta) {
  if (!deck.meta.title) errors.push('meta.title is required');
  if (!allowedTemplates.has(deck.meta.template)) errors.push(`meta.template must be one of ${[...allowedTemplates].join(', ')}`);
  if (!allowedModes.has(deck.meta.mode)) errors.push(`meta.mode must be one of ${[...allowedModes].join(', ')}`);
  if (deck.meta.canvas && !allowedCanvas.has(deck.meta.canvas)) errors.push(`meta.canvas must be hd. Use export-raster-pdf.mjs --viewport/--scale for higher-resolution PDF or PNG output.`);
  if (deck.meta.effects && !allowedEffects.has(deck.meta.effects)) errors.push(`meta.effects must be one of ${[...allowedEffects].join(', ')}`);
  if (deck.meta.typography && !allowedTypography.has(deck.meta.typography)) errors.push(`meta.typography must be one of ${[...allowedTypography].join(', ')}`);
}

const seenNos = new Set();
const seenSlugs = new Set();
const sourceIds = new Set((deck.sources || []).map((source) => source.id));

(deck.slides || []).forEach((slide, index) => {
  const label = `slides[${index}]`;
  const expectedNo = index + 1;
  if (slide.no !== expectedNo) errors.push(`${label}.no must be ${expectedNo}`);
  if (seenNos.has(slide.no)) errors.push(`${label}.no duplicates ${slide.no}`);
  seenNos.add(slide.no);

  if (!slide.slug || !slugRe.test(slide.slug)) errors.push(`${label}.slug must be kebab-case ASCII`);
  if (seenSlugs.has(slide.slug)) errors.push(`${label}.slug duplicates ${slide.slug}`);
  seenSlugs.add(slide.slug);

  if (!slide.title) errors.push(`${label}.title is required`);
  if (!slide.section) errors.push(`${label}.section is required`);
  if (!allowedLayouts.has(slide.layout)) errors.push(`${label}.layout is unknown: ${slide.layout}`);
  if (slide.effect && !allowedEffects.has(slide.effect)) errors.push(`${label}.effect must be one of ${[...allowedEffects].join(', ')}`);
  if (slide.typography && !allowedTypography.has(slide.typography)) errors.push(`${label}.typography must be one of ${[...allowedTypography].join(', ')}`);
  checkTextField(label, 'title', slide.title, 34, 'prefer 2-8 words and move explanation to subtitle/body');
  checkTextField(label, 'subtitle', slide.subtitle, 110, 'split into body/notes or shorten to one spoken sentence');
  checkTextField(label, 'body', slide.body, 170, 'use 1-2 short sentences or move detail to speaker notes');
  checkTextField(label, 'sourceNote', slide.sourceNote, 130, 'keep the on-slide note short and put full citations in content/README.md');
  const meta = layoutMeta[slide.layout] || {};
  if (slide.items && slide.items.length > (meta.maxItems || 6)) warnings.push(`${label}.items has ${slide.items.length} items; ${slide.layout} prefers ${meta.maxItems || 6} or fewer`);
  checkLayoutPolish(label, slide);
  (slide.items || []).forEach((item, itemIndex) => {
    const itemLabel = `${label}.items[${itemIndex}]`;
    checkTextField(itemLabel, 'title', item.title || item.label, 32, 'keep card labels short and move explanation to body');
    checkTextField(itemLabel, 'body', item.body || item.description, 115, 'card body should fit in 1-2 lines');
    checkTextField(itemLabel, 'value', item.value, 28, 'metric values should be compact');
  });
  (slide.links || []).forEach((link, linkIndex) => {
    const linkLabel = `${label}.links[${linkIndex}]`;
    warnIfMachineToken(linkLabel, 'url', link.url);
    checkTextField(linkLabel, 'text', link.text, 48, 'keep visible link labels short');
  });
  if (slide.metrics && !slide.metrics.every((metric) => metric.sourceId || slide.sourceNote)) {
    warnings.push(`${label}.metrics should have sourceId or slide.sourceNote`);
  }
  (slide.metrics || []).forEach((metric, metricIndex) => {
    const metricLabel = `${label}.metrics[${metricIndex}]`;
    checkTextField(metricLabel, 'label', metric.label, 42, 'metric labels should fit under the number');
    checkTextField(metricLabel, 'value', String(metric.value ?? ''), 24, 'metric values should be compact');
  });
  if (slide.sourceIds) {
    slide.sourceIds.forEach((id) => {
      if (!sourceIds.has(id)) warnings.push(`${label}.sourceIds references missing source "${id}"`);
    });
  }
  if (meta.requiresFallback && !slide.exportFallback) {
    warnings.push(`${label}.${slide.layout} should include exportFallback for PDF/PNG capture`);
  }
  Object.entries(slide.assets || {}).forEach(([key, assetPath]) => {
    if (typeof assetPath !== 'string') return;
    if (/^https?:\/\//.test(assetPath)) warnings.push(`${label}.assets.${key} is remote; prefer local assets/ for saved decks`);
    if (path.isAbsolute(assetPath)) errors.push(`${label}.assets.${key} must not be an absolute path`);
  });
});

if (lintEnabled) warnings.push(...lintPrinciples(deck));

errors.forEach((error) => console.error(`ERROR ${error}`));
warnings.forEach((warning) => console.warn(`WARN ${warning}`));

if (errors.length > 0) {
  process.exitCode = 1;
} else {
  console.log(`slides validation passed: ${deck.slides.length} slides, ${warnings.length} warning(s)`);
}
