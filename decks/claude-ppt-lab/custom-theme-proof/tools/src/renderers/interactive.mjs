export function createInteractiveRenderers({ escapeHtml, renderGeneric, renderIcon }) {
  function slideId(slide, suffix) {
    return `${suffix}-${String(slide.no).padStart(2, '0')}-${slide.slug}`;
  }
  
  function firstLink(slide) {
    return (slide.links && slide.links[0]) || null;
  }

  function chartSwatchToken(index) {
    const tokens = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--accent-start', '--accent-end'];
    return tokens[index % tokens.length];
  }
  
  function renderChartInteractive(slide) {
    const chartId = slideId(slide, 'chart');
    const variant = slide.variant || slide.chartVariant || 'ranked-bars';
    const metrics = slide.metrics || (slide.items || []).map((item) => ({ label: item.title || item.label, value: item.value || item.body || 0, unit: item.unit || '' })).slice(0, 6);
    if (metrics.length === 0) return renderGeneric(slide);
    const showTable = ['share-doughnut', 'polar-balance'].includes(variant);
    const total = metrics.reduce((sum, item) => sum + (Number(String(item.value || 0).replace(/,/g, '')) || 0), 0);
    const tableMode = variant === 'share-doughnut' ? 'share' : variant === 'polar-balance' ? 'balance' : 'value';
    const tableColgroup = tableMode === 'balance' ? '<colgroup><col><col><col></colgroup>' : '<colgroup><col><col></colgroup>';
    const tableHead = tableMode === 'share'
      ? '<tr><th>항목</th><th>비율</th></tr>'
      : '<tr><th>항목</th><th>강도</th><th>비중</th></tr>';
    const table = showTable ? `<table class="chart-metric-table chart-metric-table-${escapeHtml(tableMode)}" aria-label="${escapeHtml(slide.title)} data table">${tableColgroup}<thead>${tableHead}</thead><tbody>
      ${metrics.map((item, index) => {
        const value = Number(String(item.value || 0).replace(/,/g, '')) || 0;
        const pct = total > 0 ? `${Math.round((value / total) * 100)}%` : `${escapeHtml(item.unit || '')}`;
        const label = escapeHtml(item.label || item.title || '');
        const labelCell = ['share', 'balance'].includes(tableMode)
          ? `<span class="chart-label-cell"><span class="chart-swatch" style="--swatch: var(${chartSwatchToken(index)})"></span><span>${label}</span></span>`
          : label;
        if (tableMode === 'balance') {
          const intensity = `${escapeHtml(String(item.value ?? ''))}${item.unit ? escapeHtml(item.unit) : ''}`;
          return `<tr><th>${labelCell}</th><td>${intensity}</td><td>${escapeHtml(pct)}</td></tr>`;
        }
        return `<tr><th>${labelCell}</th><td>${escapeHtml(pct)}</td></tr>`;
      }).join('')}
    </tbody></table>` : '';
    return `<section class="chart-section chart-variant-${escapeHtml(variant)}" data-chart-slide="${slide.no}" data-chart-variant="${escapeHtml(variant)}">
      <div class="chart-wrapper"><div class="chart-canvas-panel"><canvas id="${chartId}" aria-label="${escapeHtml(slide.title)}"></canvas></div>${table}</div>
      <script type="application/json" id="${chartId}-data">${JSON.stringify(metrics)}</script>
    </section>`;
  }
  
  function renderThreeScene(slide) {
    const sceneId = slideId(slide, 'three');
    return `<section class="three-shell" id="${sceneId}" data-three-slide="${slide.no}" data-scene="${escapeHtml(slide.assets?.scene || 'core-cube')}">
      <canvas class="three-canvas" id="${sceneId}-canvas" aria-label="${escapeHtml(slide.title)}"></canvas>
      <div class="three-fallback">${escapeHtml(slide.body || '드래그 회전 · 스크롤 줌')}</div>
    </section>`;
  }
  
  function renderBeforeAfter(slide) {
    const wrapId = slideId(slide, 'ba');
    const before = slide.assets?.before;
    const after = slide.assets?.after;
    const beforeLabel = slide.items?.[0]?.title || 'BEFORE';
    const afterLabel = slide.items?.[1]?.title || 'AFTER';
    const beforeBody = slide.items?.[0]?.body || beforeLabel;
    const afterBody = slide.items?.[1]?.body || afterLabel;
    function renderLayer(kind, src, label, body) {
      const image = src
        ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(label)}">`
        : `<div class="ba-placeholder ba-placeholder-${kind}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(kind === 'before' ? 'Add before image' : 'Add after image')}</span></div>`;
      return `${image}<span class="ba-copy"><b>${escapeHtml(label)}</b><span>${escapeHtml(body)}</span></span>`;
    }
    return `<section class="ba-wrapper" id="${wrapId}">
      <div class="ba-layer ba-after">${renderLayer('after', after, afterLabel, afterBody)}</div>
      <div class="ba-layer ba-before">${renderLayer('before', before, beforeLabel, beforeBody)}</div>
      <div class="ba-tag before">${escapeHtml(beforeLabel)}</div><div class="ba-tag after">${escapeHtml(afterLabel)}</div>
      <div class="ba-divider"></div><div class="ba-handle">⇆</div>
      <input class="ba-range" id="${wrapId}-range" type="range" min="0" max="100" value="50" aria-label="전후 비교 위치">
    </section>`;
  }
  
  function renderQrEmbed(slide) {
    const link = firstLink(slide);
    const url = slide.assets?.url || link?.url || '';
    const qr = slide.assets?.qr || (url ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&color=111111&bgcolor=ffffff&data=${encodeURIComponent(url)}` : '');
    if (!qr) return renderGeneric(slide);
    return `<section class="qr-card">
      <img src="${escapeHtml(qr)}" alt="${escapeHtml(slide.title)} QR 코드">
      <div class="qr-url">${escapeHtml(link?.text || url)}</div>
      <div class="qr-hint">${escapeHtml(slide.body || '카메라 앱으로 스캔')}</div>
    </section>`;
  }

  const renderers = {
    'chart-interactive': renderChartInteractive,
    'three-scene': renderThreeScene,
    'before-after': renderBeforeAfter,
    'qr-embed': renderQrEmbed,
  };

  return { renderers };
}
