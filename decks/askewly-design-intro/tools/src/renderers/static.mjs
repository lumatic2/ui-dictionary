export function createStaticRenderers({ escapeHtml, renderIcon }) {
  function itemTitle(item) {
    return escapeHtml(item.title || item.label || '');
  }

  function itemBody(item) {
    return escapeHtml(item.body || item.value || '');
  }

  function hasRecipe(slide, name) {
    return String(slide.recipe || '').toLowerCase().includes(name);
  }

  function slideVariant(slide) {
    return String(slide.variant || slide.recipeOptions?.variant || '').toLowerCase();
  }

  function hasVariant(slide, names) {
    return names.includes(slideVariant(slide));
  }

  function slideChrome(slide) {
    return slide.assets?.frame === 'device' || slide.assets?.screenshot;
  }
  
  function renderDeviceFrame(slide) {
    const image = slide.assets?.screenshot || slide.assets?.image;
    const label = slide.assets?.placeholder || slide.body || slide.title;
    return `<section class="device-frame">
      <div class="device-bar"><span class="device-dot"></span><span class="device-dot"></span><span class="device-dot"></span></div>
      <div class="device-screen">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(label)}">` : `<div class="device-placeholder"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(slide.assets?.caption || 'Replace with a local screenshot asset')}</span></div>`}</div>
    </section>`;
  }

  function renderArchitectureHelper(slide) {
    const items = (slide.items || []).slice(0, 4);
    const center = slide.body || slide.assets?.caption || slide.title;
    return `<section class="asset-architecture">
      <div class="asset-arch-center">${renderIcon(slide.icon, 'layers', 'contained')}<strong>${escapeHtml(center)}</strong></div>
      <div class="asset-arch-row">${items.map((item) => `<article class="asset-arch-node">${renderIcon(item.icon, 'target')}<div class="card-title">${itemTitle(item)}</div><div class="card-body">${itemBody(item)}</div></article>`).join('')}</div>
    </section>`;
  }

  function renderMetricCardHelper(slide) {
    const metrics = (slide.metrics || (slide.items || []).map((item) => ({ label: item.title || item.label, value: item.value || item.body, unit: item.unit || '' }))).slice(0, 3);
    return `<section class="asset-metric-cards">${metrics.map((metric) => `<article class="asset-metric-card">${renderIcon(metric.icon, 'chart', 'contained')}<div class="asset-metric-value">${escapeHtml(metric.value ?? '')}${metric.unit ? `<span>${escapeHtml(metric.unit)}</span>` : ''}</div><div class="stat-label">${escapeHtml(metric.label || '')}</div></article>`).join('')}</section>`;
  }

  function renderSourceBadgeHelper(slide) {
    const label = slide.assets?.sourceBadge || slide.sourceNote || 'Source available';
    const caption = slide.assets?.caption || slide.body || 'Use this badge when the citation needs to be visible without crowding the slide.';
    return `<section class="asset-source-badge">${renderIcon(slide.icon, 'fileText', 'contained')}<div><div class="comparison-label">${escapeHtml(label)}</div><div class="card-body">${escapeHtml(caption)}</div></div></section>`;
  }

  function renderAssetHelper(slide) {
    if (slide.assets?.helper === 'architecture') return renderArchitectureHelper(slide);
    if (slide.assets?.helper === 'metric-card') return renderMetricCardHelper(slide);
    if (slide.assets?.helper === 'source-badge') return renderSourceBadgeHelper(slide);
    return '';
  }
  
  function renderCard(item, className = 'card') {
    return `<article class="${className}">${renderIcon(item.icon, 'check', className === 'summary-card' ? 'subtle' : 'marker')}<div class="card-title">${itemTitle(item)}</div><div class="card-body">${itemBody(item)}</div></article>`;
  }
  
  function renderGeneric(slide) {
    const items = slide.items || [];
    const helper = renderAssetHelper(slide);
    if (helper) return helper;
    if (slideChrome(slide)) return renderDeviceFrame(slide);
    if (items.length === 0 && slide.body) return `<p class="body-copy">${escapeHtml(slide.body)}</p>`;
    return `<div class="grid">${items.map((item) => renderCard(item)).join('')}</div>`;
  }
  
  function renderHeroCards(slide) {
    const items = (slide.items || []).slice(0, 3);
    if (items.length === 0) return renderGeneric(slide);
    if (hasRecipe(slide, 'upstream')) {
      return `<div class="recipe-hero-cards">${items.map((item, index) => `<article class="recipe-hero-card"><div class="recipe-card-label">${itemTitle(item)}</div><div class="recipe-card-text">${itemBody(item)}</div>${renderIcon(item.icon, index === 0 ? 'sparkles' : 'layers', 'hero')}</article>`).join('')}</div>`;
    }
    return `<div class="hero-card-grid">${items.map((item, index) => `<article class="hero-card"><div><div class="hero-card-index">${String(index + 1).padStart(2, '0')}</div>${renderIcon(item.icon, index === 0 ? 'sparkles' : 'layers', 'hero')}<div class="card-title">${itemTitle(item)}</div></div><div class="card-body">${itemBody(item)}</div></article>`).join('')}</div>`;
  }

  function renderCover(slide) {
    const items = (slide.items || []).slice(0, 3);
    const chips = items.length > 0 ? `<div class="cover-chips">${items.map((item) => `<span class="cover-chip">${itemTitle(item)}</span>`).join('')}</div>` : '';
    return `<section class="cover-lockup">${chips}</section>`;
  }

  function renderClosing(slide) {
    const items = (slide.items || []).slice(0, 3);
    const actions = items.length > 0 ? `<div class="closing-actions">${items.map((item) => `<article class="closing-action">${renderIcon(item.icon, 'check', 'inline')}<div><div class="card-title">${itemTitle(item)}</div><div class="card-body">${itemBody(item)}</div></div></article>`).join('')}</div>` : '';
    return `<section class="closing-lockup">${actions}</section>`;
  }
  
  function renderComparison(slide) {
    const items = slide.items || [];
    const left = items[0] || { title: 'Before', body: slide.body || '' };
    const right = items[1] || items[2] || { title: 'After', body: '' };
    const extra = items.slice(2, 4);
    if (hasRecipe(slide, 'reference-compare') || hasVariant(slide, ['split-scorecard', 'delta-table'])) {
      const variant = slideVariant(slide);
      if (variant === 'delta-table') {
        return `<section class="ref-delta-table">${slide.body ? `<p class="ref-lead">${escapeHtml(slide.body)}</p>` : ''}${items.slice(0, 4).map((item, index) => `<article class="ref-delta-row" style="--delay:${index * 0.08}s"><div class="ref-delta-key">${itemTitle(item)}</div><div class="ref-delta-before">${escapeHtml(item.before || item.body || '')}</div><div class="ref-delta-after">${escapeHtml(item.after || item.value || '')}</div></article>`).join('')}</section>`;
      }
      return `<section class="ref-scorecard"><article class="ref-score-panel muted"><div class="ref-score-label">${itemTitle(left)}</div><p>${itemBody(left)}</p>${extra[0] ? `<b>${itemTitle(extra[0])}</b><span>${itemBody(extra[0])}</span>` : ''}</article><div class="ref-score-axis"><span>VS</span></div><article class="ref-score-panel emphasis"><div class="ref-score-label">${itemTitle(right)}</div><p>${itemBody(right)}</p>${extra[1] ? `<b>${itemTitle(extra[1])}</b><span>${itemBody(extra[1])}</span>` : ''}</article></section>`;
    }
    if (hasRecipe(slide, 'upstream')) {
      const rows = items.slice(0, 3);
      return `<div class="recipe-comparison">${slide.body ? `<div class="recipe-comparison-title">${escapeHtml(slide.body)}</div>` : ''}${rows.map((item, index) => `<div class="recipe-comparison-row" style="--delay:${index * 0.12}s"><div><div class="recipe-comp-label">${itemTitle(item)}</div><div class="recipe-comp-old">${escapeHtml(item.before || item.body || '')}</div></div><div class="recipe-comp-arrow">→</div><div class="recipe-comp-new">${escapeHtml(item.after || item.value || '')}</div></div>`).join('')}</div>`;
    }
    return `<div class="comparison">
      <article class="comparison-panel">${renderIcon(left.icon, 'layers', 'subtle')}<div class="comparison-label">${itemTitle(left) || 'BEFORE'}</div><div class="card-body">${itemBody(left)}</div>${extra[0] ? `<hr style="border:0;border-top:1px solid var(--border-card);margin:18px 0">${renderIcon(extra[0].icon, 'check', 'marker')}<div class="card-title">${itemTitle(extra[0])}</div><div class="card-body">${itemBody(extra[0])}</div>` : ''}</article>
      <article class="comparison-panel emphasis">${renderIcon(right.icon, 'target', 'hero')}<div class="comparison-label">${itemTitle(right) || 'AFTER'}</div><div class="card-body">${itemBody(right)}</div>${extra[1] ? `<hr style="border:0;border-top:1px solid var(--accent-border);margin:18px 0">${renderIcon(extra[1].icon, 'check', 'marker')}<div class="card-title">${itemTitle(extra[1])}</div><div class="card-body">${itemBody(extra[1])}</div>` : ''}</article>
    </div>`;
  }
  
  function renderStepFlow(slide) {
    const items = (slide.items || []).slice(0, 5);
    if (items.length === 0) return renderGeneric(slide);
    if (hasRecipe(slide, 'reference-process') || hasVariant(slide, ['milestone-rail', 'swimlane-checklist'])) {
      const variant = slideVariant(slide);
      if (variant === 'swimlane-checklist') {
        return `<section class="ref-swimlane">${items.slice(0, 4).map((item, index) => `<article class="ref-lane" style="--delay:${index * 0.08}s"><div class="ref-lane-no">${String(index + 1).padStart(2, '0')}</div><div><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></div></article>`).join('')}</section>`;
      }
      return `<section class="ref-milestone"><div class="ref-milestone-rail"></div>${items.map((item, index) => `<article class="ref-milestone-item ${item.active ? 'active' : ''}" style="--pos:${index}; --delay:${index * 0.08}s"><span></span><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></article>`).join('')}</section>`;
    }
    if (hasRecipe(slide, 'roadmap')) {
      return `<div class="recipe-roadmap">${slide.body ? `<div class="recipe-roadmap-label">${escapeHtml(slide.body)}</div>` : ''}<div class="recipe-roadmap-bar" style="--roadmap-count:${items.length}">${items.map((item, index) => `<article class="recipe-roadmap-step ${item.active || index === Math.floor(items.length / 2) ? 'active' : ''}"><div class="recipe-roadmap-seg"></div><div class="recipe-roadmap-title">${itemTitle(item)}</div><div class="recipe-roadmap-desc">${itemBody(item)}</div></article>`).join('')}</div></div>`;
    }
    if (hasRecipe(slide, 'three-stage')) {
      const stages = items.slice(0, 3);
      return `<div class="recipe-three-stage">${stages.map((item, index) => `<article class="recipe-stage"><div class="recipe-stage-num">${String(index + 1).padStart(2, '0')}</div>${renderIcon(item.icon, index === 0 ? 'layers' : 'check', 'hero')}<div class="recipe-stage-title">${itemTitle(item)}</div><div class="recipe-stage-desc">${itemBody(item)}</div></article>${index < stages.length - 1 ? '<div class="recipe-stage-arrow">→</div>' : ''}`).join('')}</div>`;
    }
    if (hasRecipe(slide, 'upstream')) {
      return `<div class="recipe-steps">${items.map((item, index) => `<article class="recipe-step"><div class="recipe-step-num">${index + 1}</div><div class="recipe-step-copy"><div class="recipe-step-title">${itemTitle(item)}</div><div class="recipe-step-desc">${itemBody(item)}</div></div></article>`).join('')}</div>`;
    }
    return `<div class="steps" style="--step-count:${items.length}">
      <div class="step-track">${items.map((item, index) => `<div class="step-node"><span class="step-num">${String(index + 1).padStart(2, '0')}</span></div>`).join('')}</div>
      <div class="step-cards">${items.map((item, index) => `<article class="step">
      <div class="step-icon">${renderIcon(item.icon, index === 0 ? 'fileText' : 'check', 'inline')}</div>
      <div class="card-title">${itemTitle(item)}</div>
      <div class="card-body">${itemBody(item)}</div>
    </article>`).join('')}</div>
    </div>`;
  }
  
  function renderDiagram(slide) {
    const items = slide.items || [];
    const center = items[0] || { title: slide.title, body: slide.body || '' };
    const nodes = items.slice(1, 7);
    if (hasRecipe(slide, 'reference-diagram') || hasVariant(slide, ['hub-spoke', 'layer-stack'])) {
      const variant = slideVariant(slide);
      if (variant === 'layer-stack') {
        return `<section class="ref-layer-stack">${items.slice(0, 5).map((item, index) => `<article class="ref-layer-card" style="--depth:${index}; --delay:${index * 0.08}s"><div class="ref-layer-index">${String(index + 1).padStart(2, '0')}</div><div><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></div></article>`).join('')}</section>`;
      }
      return `<section class="ref-hub-spoke"><article class="ref-hub">${renderIcon(center.icon, 'target', 'contained')}<h3>${itemTitle(center)}</h3><p>${itemBody(center)}</p></article><div class="ref-spokes">${nodes.slice(0, 6).map((item, index) => `<article class="ref-spoke" style="--delay:${index * 0.07}s">${renderIcon(item.icon, 'layers', 'inline')}<h4>${itemTitle(item)}</h4><p>${itemBody(item)}</p></article>`).join('')}</div></section>`;
    }
    if (hasRecipe(slide, 'upstream') || hasRecipe(slide, 'diagram-box')) {
      return `<div class="recipe-diagram"><div class="recipe-diagram-center">${renderIcon(center.icon, 'target', 'contained')}<div class="recipe-diagram-title">${itemTitle(center)}</div><div class="recipe-diagram-desc">${itemBody(center)}</div></div><div class="recipe-diagram-arrows">↓</div><div class="recipe-diagram-row">${nodes.slice(0, 6).map((item) => `<article class="recipe-diagram-node"><div class="recipe-diagram-node-title">${itemTitle(item)}</div><div class="recipe-diagram-node-desc">${itemBody(item)}</div></article>`).join('')}</div></div>`;
    }
    const positions = [
      { className: 'pos-left-top', x: 230, y: 102 },
      { className: 'pos-right-top', x: 770, y: 102 },
      { className: 'pos-left-bottom', x: 230, y: 278 },
      { className: 'pos-right-bottom', x: 770, y: 278 },
      { className: 'pos-top', x: 500, y: 62 },
      { className: 'pos-bottom', x: 500, y: 318 },
    ];
    const links = nodes.map((_, index) => {
      const pos = positions[index] || positions[index % positions.length];
      return `<line x1="500" y1="190" x2="${pos.x}" y2="${pos.y}" />`;
    }).join('');
    return `<div class="diagram"><div class="diagram-canvas">
      <svg class="diagram-links" viewBox="0 0 1000 380" aria-hidden="true">${links}</svg>
      <article class="diagram-center">${renderIcon(center.icon, 'target', 'contained')}<div class="card-title">${itemTitle(center)}</div><div class="card-body">${itemBody(center)}</div></article>
      ${nodes.map((item, index) => {
        const pos = positions[index] || positions[index % positions.length];
        return `<article class="diagram-node ${pos.className}"><div class="diagram-index">${String(index + 1).padStart(2, '0')}</div>${renderIcon(item.icon, 'layers', 'inline')}<div><div class="card-title">${itemTitle(item)}</div><div class="card-body">${itemBody(item)}</div></div></article>`;
      }).join('')}
    </div></div>`;
  }
  
  function renderSummary(slide) {
    const helper = renderAssetHelper(slide);
    const items = (slide.items || []).slice(0, 6);
    if (hasRecipe(slide, 'reference-grid') || hasVariant(slide, ['feature-mosaic', 'metric-led'])) {
      const variant = slideVariant(slide);
      if (variant === 'metric-led') {
        return `<section class="ref-metric-led">${items.slice(0, 4).map((item, index) => `<article class="ref-metric-card" style="--delay:${index * 0.08}s"><div class="ref-metric-value">${escapeHtml(item.value || item.label || String(index + 1).padStart(2, '0'))}</div><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></article>`).join('')}</section>`;
      }
      return `<section class="ref-mosaic">${items.slice(0, 5).map((item, index) => `<article class="ref-mosaic-card ${index === 0 ? 'feature' : ''}" style="--delay:${index * 0.07}s">${renderIcon(item.icon, index === 0 ? 'sparkles' : 'check', 'marker')}<h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></article>`).join('')}</section>`;
    }
    if (hasRecipe(slide, 'grid-2x2')) {
      return `<div class="recipe-grid-2x2">${items.map((item, index) => `<article class="recipe-feature-card" style="--delay:${index * 0.06}s">${renderIcon(item.icon, index === 0 ? 'sparkles' : 'check', 'marker')}<div class="recipe-feature-name">${itemTitle(item)}</div><div class="recipe-feature-desc">${itemBody(item)}</div></article>`).join('')}</div>`;
    }
    if (hasRecipe(slide, 'upstream')) {
      const cards = items.map((item, index) => `<article class="recipe-summary-card" style="--delay:${index * 0.08}s"><div class="recipe-summary-head">${renderIcon(item.icon, 'check', 'marker')}<div class="recipe-summary-name">${itemTitle(item)}</div></div><div class="recipe-summary-desc">${itemBody(item)}</div></article>`).join('');
      const conclusion = slide.body ? `<div class="recipe-conclusion"><div>${escapeHtml(slide.body)}</div></div>` : '';
      return `<div class="recipe-summary-grid">${cards}</div>${conclusion}`;
    }
    const cards = items.map((item) => renderCard(item, 'summary-card')).join('');
    const conclusion = slide.body ? `<div class="conclusion">${escapeHtml(slide.body)}</div>` : '';
    if (slide.assets?.helper === 'architecture' && helper) return helper;
    if (helper && items.length > 0) return `<div class="summary-grid">${cards}</div>${conclusion}${helper}`;
    if (helper) return helper;
    return `<div class="summary-grid">${cards}</div>${conclusion}`;
  }

  function renderCaseMap(slide) {
    const items = (slide.items || []).slice(0, 5);
    if (items.length === 0) return renderGeneric(slide);
    return `<div class="caseMap">
      <div class="rail">
      ${items.map((item) => {
        const image = item.image || item.screenshot || item.asset || item.thumbnail;
        const thumb = image
          ? `<div class="railThumb"><img src="${escapeHtml(image)}" alt="${itemTitle(item)}"></div>`
          : `<div class="railThumb placeholder"><span>IMAGE</span></div>`;
        return `<div class="railItem">${thumb}<div class="railCopy"><h3>${itemTitle(item)}</h3>${item.label ? `<b>${escapeHtml(item.label)}</b>` : ''}<p>${itemBody(item)}</p></div></div>`;
      }).join('')}
      </div>
    </div>`;
  }

  function renderSplitScreen(slide) {
    const image = slide.assets?.screenshot || slide.assets?.image;
    const items = (slide.items || []).slice(0, 4);
    const bullets = items.length > 0 ? `<ul class="projectIntroList">${items.map((item) => `<li><b>${itemTitle(item)}</b>${item.body ? `<span>${itemBody(item)}</span>` : ''}</li>`).join('')}</ul>` : '';
    const lead = slide.body ? `<p class="projectLead">${escapeHtml(slide.body)}</p>` : '';
    const visual = image
      ? `<div class="projectIntroMedia"><img src="${escapeHtml(image)}" alt="${escapeHtml(slide.assets?.caption || slide.title)}"></div>`
      : `<div class="projectIntroMedia placeholder"><div class="projectIntroPlaceholder"><span>${escapeHtml(slide.assets?.caption || 'SCREENSHOT PLACEHOLDER')}</span></div></div>`;
    return `<section class="projectIntro"><article class="projectIntroText">${lead}${bullets}</article>${visual}</section>`;
  }

  function renderTimelineCards(slide) {
    const items = (slide.items || []).slice(0, 4);
    if (items.length === 0) return renderGeneric(slide);
    if (hasRecipe(slide, 'reference-timeline') || hasVariant(slide, ['alternating-cards', 'event-strip'])) {
      const variant = slideVariant(slide);
      if (variant === 'event-strip') {
        return `<section class="ref-event-strip">${items.map((item, index) => `<article class="ref-event" style="--delay:${index * 0.08}s"><div class="ref-event-date">${escapeHtml(item.time || item.label || String(index + 1).padStart(2, '0'))}</div><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></article>`).join('')}</section>`;
      }
      return `<section class="ref-alternating-timeline"><div class="ref-alt-line"></div>${items.map((item, index) => `<article class="ref-alt-card ${index % 2 ? 'down' : 'up'}" style="--delay:${index * 0.08}s"><span>${escapeHtml(item.time || item.label || String(index + 1).padStart(2, '0'))}</span><h3>${itemTitle(item)}</h3><p>${itemBody(item)}</p></article>`).join('')}</section>`;
    }
    const conclusion = slide.body ? `<div class="problemBottom">${escapeHtml(slide.body)}</div>` : '';
    return `<section class="lumosProblem">
      <div class="problemLine">${items.map((item, index) => `<div class="problemTick" style="left:${8 + index * (84 / Math.max(items.length - 1, 1))}%"><span>${escapeHtml(item.time || item.label || String(index + 1).padStart(2, '0'))}</span></div>`).join('')}</div>
      <div class="problemCards">${items.map((item) => `<article class="problemCard ${item.emphasis ? 'hl' : ''}"><h3>${itemTitle(item)}</h3><b>${escapeHtml(item.label || '')}</b><p>${itemBody(item)}</p></article>`).join('')}</div>
      ${conclusion}
    </section>`;
  }

  function renderPipelineLanes(slide) {
    const items = (slide.items || []).slice(0, 9);
    if (items.length === 0) return renderGeneric(slide);
    const primary = items.slice(0, 5);
    const controls = items.slice(5, 9);
    return `<section class="pipeline">
      <div class="pipeSteps">${primary.map((item) => `<article class="pipeStep"><b>${itemTitle(item)}</b><span>${item.value ? `<strong>${escapeHtml(item.value)}</strong>` : ''}${itemBody(item)}</span></article>`).join('')}</div>
      ${controls.length > 0 ? `<div class="principles">${controls.map((item, index) => `<article class="principle"><div class="pnum">${String(index + 1).padStart(2, '0')}</div><p><b>${itemTitle(item)}</b><br>${itemBody(item)}</p></article>`).join('')}</div>` : ''}
    </section>`;
  }

  function renderResultTransitions(slide) {
    const items = (slide.items || []).slice(0, 3);
    if (items.length === 0) return renderGeneric(slide);
    if (hasRecipe(slide, 'reference-result') || hasVariant(slide, ['transition-board', 'outcome-ladder'])) {
      const variant = slideVariant(slide);
      if (variant === 'outcome-ladder') {
        return `<section class="ref-outcome-ladder">${items.map((item, index) => `<article class="ref-ladder-step" style="--delay:${index * 0.1}s"><div class="ref-ladder-stat">${escapeHtml(item.stat || item.value || String(index + 1).padStart(2, '0'))}</div><div><h3>${itemTitle(item)}</h3><p>${escapeHtml(item.after || item.body || '')}</p></div></article>`).join('')}</section>`;
      }
      return `<section class="ref-transition-board">${items.map((item, index) => `<article class="ref-transition-pair" style="--delay:${index * 0.08}s"><div class="ref-transition-title">${itemTitle(item)}</div><div class="ref-transition-before">${escapeHtml(item.before || item.body || '')}</div><div class="ref-transition-arrow">→</div><div class="ref-transition-after">${escapeHtml(item.after || item.value || '')}</div></article>`).join('')}</section>`;
    }
    return `<section class="hTrans">${items.map((item, index) => `<article class="hTransRow">
      <div class="hTransLabel"><div class="hTransNo">전환 ${String(index + 1).padStart(2, '0')}</div><div class="hTransName">${itemTitle(item)}</div></div>
      <div class="hTransBefore"><div class="hTIcon hTIconB">${renderIcon(item.beforeIcon || item.icon, 'layers', 'inline')}</div><div class="hTBText">${escapeHtml(item.before || item.body || '')}</div></div>
      <div class="hTransArr">→</div>
      <div class="hTransAfter"><div class="hTIcon hTIconA">${renderIcon(item.afterIcon || 'check', 'check', 'inline')}</div><div class="hTAText">${escapeHtml(item.after || item.value || '')}</div></div>
      ${item.stat ? `<div class="hTransStat"><b>${escapeHtml(item.stat)}</b><span>${escapeHtml(item.unit || '')}</span></div>` : ''}
    </article>`).join('')}</section>`;
  }

  const renderers = {
    cover: renderCover,
    closing: renderClosing,
    'hero-cards': renderHeroCards,
    'comparison-2col': renderComparison,
    'step-flow': renderStepFlow,
    'diagram-box': renderDiagram,
    'summary-grid': renderSummary,
    'case-map': renderCaseMap,
    'split-screen': renderSplitScreen,
    'timeline-cards': renderTimelineCards,
    'pipeline-lanes': renderPipelineLanes,
    'result-transitions': renderResultTransitions,
  };

  return { renderGeneric, renderers };
}
