export function createShellRenderers({
  escapeHtml,
  fileName,
  LAYOUT_META,
  FONT_LINKS,
  resolveTheme,
  canvasPreset,
  commonCss,
  indexCss,
  iconSvg,
  renderLayout,
  headExtras,
  slideScripts,
}) {
  function renderNav(slides, index) {
    const prev = slides[index - 1];
    const next = slides[index + 1];
    return `<nav class="slide-nav"><div class="slide-nav-inner">
      <div class="nav-left"><a href="index.html">${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}</a></div>
      <div class="nav-center">${prev ? `<a href="${fileName(prev)}" onclick="event.preventDefault(); navigateTo(this.href)">← 이전</a>` : '<span class="nav-disabled">← 이전</span>'} &nbsp;·&nbsp; ${next ? `<a href="${fileName(next)}" onclick="event.preventDefault(); navigateTo(this.href)">다음 →</a>` : '<span class="nav-disabled">다음 →</span>'}</div>
      <div class="nav-right"><span class="nav-wordmark">Askewly</span></div>
    </div></nav>`;
  }

  function navScript(slides, index) {
    const prev = slides[index - 1] ? fileName(slides[index - 1]) : '';
    const next = slides[index + 1] ? fileName(slides[index + 1]) : '';
    const lines = [];
    if (next) lines.push(`if (e.key === 'ArrowRight') navigateTo('${next}');`);
    if (prev) lines.push(`if (e.key === 'ArrowLeft') navigateTo('${prev}');`);
    return `<script>
  function navigateTo(url) {
    if (document.startViewTransition) {
      document.startViewTransition(() => { window.location.href = url; });
      return;
    }
    document.body.classList.add('fade-out');
    setTimeout(function() { window.location.href = url; }, 250);
  }
  document.addEventListener('keydown', function(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
    ${lines.join('\n  ')}
  });
  </script>`;
  }

  function renderSlideMain(deck, slide) {
    const effect = slide.effect || deck.meta.effects || 'rise';
    const typography = slide.typography || deck.meta.typography || 'standard';
    const pattern = slide.assets?.pattern ? '<div class="slide-pattern"></div>' : '';
    const title = escapeHtml(slide.title);
    const visualHeaderLayouts = new Set(['cover', 'closing', 'qr-embed', 'three-scene', 'before-after']);
    const titleOnlyLayouts = new Set(['cover', 'closing']);
    const hasVisualFrame = slide.assets?.frame === 'device' || slide.assets?.screenshot || slide.assets?.image;
    const reserveKicker = !slide.kicker && !visualHeaderLayouts.has(slide.layout) && !hasVisualFrame;
    const source = slide.sourceNote ? `<p class="source-note">${escapeHtml(slide.sourceNote)}</p>` : '';
    const exportFallback = slide.exportFallback ? `<aside class="export-fallback-note" aria-label="Export fallback">${escapeHtml(slide.exportFallback)}</aside>` : '';
    return `<main class="container layout-${escapeHtml(slide.layout)} effect-${escapeHtml(effect)} type-${escapeHtml(typography)}">
    ${pattern}
    <header class="slide-header ${slide.kicker ? 'has-kicker' : 'no-kicker'}${reserveKicker ? ' reserve-kicker' : ''}">
      ${slide.kicker ? `<div class="kicker">${escapeHtml(slide.kicker)}</div>` : ''}
      <h1 class="title">${title}</h1>
      ${slide.subtitle && !titleOnlyLayouts.has(slide.layout) ? `<p class="subtitle">${escapeHtml(slide.subtitle)}</p>` : ''}
    </header>
    <section class="slide-content">
      ${renderLayout(slide)}
    </section>
    ${exportFallback}
    ${source}
  </main>`;
  }

  function renderSlide(deck, slide, index) {
    const template = resolveTheme(deck.meta.template || 'light');
    const canvas = canvasPreset(deck);
    const effect = slide.effect || deck.meta.effects || 'rise';
    const typography = slide.typography || deck.meta.typography || 'standard';
    const title = escapeHtml(slide.title);
    const notes = slide.notes ? `<script type="application/json" class="speaker-notes">${JSON.stringify(slide.notes)}</script>` : '';
    return `<!DOCTYPE html>
  <html lang="${escapeHtml(deck.meta.language || 'ko')}">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  ${FONT_LINKS[template] || FONT_LINKS.light}
  ${headExtras(slide)}
  <script>
  const __slideParams = new URLSearchParams(window.location.search);
  if (__slideParams.has('print')) document.documentElement.classList.add('print-mode');
  if (__slideParams.has('capture')) document.documentElement.classList.add('capture-mode');
  </script>
  <style>${commonCss(template, canvas)}</style>
  </head>
  <body class="theme-${escapeHtml(template)} effect-${escapeHtml(effect)} type-${escapeHtml(typography)}">
  ${renderSlideMain(deck, slide)}
  ${renderNav(deck.slides, index)}
  ${notes}
  ${navScript(deck.slides, index)}
  ${slideScripts(slide)}
  </body>
  </html>`;
  }

  function renderIndex(deck) {
    const template = resolveTheme(deck.meta.template || 'light');
    const canvas = canvasPreset(deck);
    const sections = [];
    deck.slides.forEach((slide) => {
      const last = sections.at(-1);
      if (!last || last.section !== slide.section) {
        sections.push({ section: slide.section, slides: [] });
      }
      sections.at(-1).slides.push(slide);
    });
    const sectionHtml = sections.map(({ section, slides }) => {
      const firstNo = String(slides[0].no).padStart(2, '0');
      const lastNo = String(slides.at(-1).no).padStart(2, '0');
      const range = firstNo === lastNo ? firstNo : `${firstNo}-${lastNo}`;
      return `<section class="section"><div class="section-header"><span class="num-range">${range}</span> ${escapeHtml(section)}</div><div class="deck-grid">${slides.map((slide) => {
        const interactive = LAYOUT_META[slide.layout]?.kind === 'interactive';
        return `<a class="deck-card" href="${fileName(slide)}" onclick="event.preventDefault(); navigateTo(this.href)"><span class="card-num">${String(slide.no).padStart(2, '0')}</span><span class="card-title">${escapeHtml(slide.title)}</span><span class="card-file">${fileName(slide)}</span>${interactive ? `<span class="badge-interactive">${iconSvg('interactive')}<span>INTERACTIVE</span></span>` : ''}</a>`;
      }).join('')}</div></section>`;
    }).join('\n');
    return `<!DOCTYPE html>
  <html lang="${escapeHtml(deck.meta.language || 'ko')}">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deck.meta.title)} — 비주얼 자료</title>
  ${FONT_LINKS[template] || FONT_LINKS.light}
  <style>${indexCss(template, canvas)}</style>
  </head>
  <body class="theme-${escapeHtml(template)}">
  <main class="container">
    <h1 class="page-title">${escapeHtml(deck.meta.title)} — 비주얼 자료</h1>
    <p class="page-subtitle">전체 ${deck.slides.length}개 슬라이드 · 클릭하여 개별 페이지로 이동</p>
    ${sectionHtml}
  </main>
  <script>
  function navigateTo(url) {
    if (document.startViewTransition) {
      document.startViewTransition(() => { window.location.href = url; });
      return;
    }
    document.body.classList.add('fade-out');
    setTimeout(function() { window.location.href = url; }, 250);
  }
  </script>
  </body>
  </html>`;
  }

  function renderPrint(deck) {
    const template = resolveTheme(deck.meta.template || 'light');
    const canvas = canvasPreset(deck);
    const extras = [...new Set(deck.slides.map((slide) => headExtras(slide)).filter(Boolean))].join('\n  ');
    return `<!DOCTYPE html>
  <html lang="${escapeHtml(deck.meta.language || 'ko')}" class="print-mode">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deck.meta.title)} — print</title>
  ${FONT_LINKS[template] || FONT_LINKS.light}
  ${extras}
  <style>@page { size: ${canvas.width}px ${canvas.height}px; margin: 0; }
  ${commonCss(template, canvas)}</style>
  </head>
  <body class="theme-${escapeHtml(template)} print-document">
  ${deck.slides.map((slide) => `<section class="print-page" data-slide="${String(slide.no).padStart(2, '0')}" data-layout="${escapeHtml(slide.layout)}" data-export-fallback="${slide.exportFallback ? 'true' : 'false'}">
  ${renderSlideMain(deck, slide)}
</section>
${slideScripts(slide)}`).join('\n')}
  </body>
  </html>`;
  }

  return { renderSlide, renderIndex, renderPrint };
}
