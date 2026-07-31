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
      <div class="nav-left">${prev ? `<a href="${fileName(prev)}" onclick="event.preventDefault(); navigateTo(this.href)">← 이전</a>` : '<span class="nav-disabled">← 이전</span>'}</div>
      <div class="nav-center"><a href="index.html">${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')} · Index</a></div>
      <div class="nav-right">${next ? `<a href="${fileName(next)}" onclick="event.preventDefault(); navigateTo(this.href)">다음 →</a>` : '<span class="nav-disabled">다음 →</span>'}</div>
    </div></nav>`;
  }

  function deckSyncId(deck) {
    return String(deck.meta.title || 'deck').toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').slice(0, 40);
  }

  // 창 간 동기 헬퍼 — 3경로 겸용: BroadcastChannel(동일 origin) + localStorage storage 이벤트 +
  // window.postMessage 릴레이(스피커↔opener). 실크롬은 file:// 문서를 opaque origin 으로 취급해
  // BC·localStorage 가 둘 다 조용히 죽는다(HU4 사용자 관측 실측 — Playwright headless 와 다름).
  // postMessage 는 '*' 타깃으로 origin 무관하게 닿고, opener 브라우징 컨텍스트는 본편이
  // full navigation 으로 재로드돼도 유지된다. 중복 수신은 from+seq 로 dedupe.
  function syncHelperScript(deck) {
    return `function createDeckSync() {
    var KEY = 'deck-sync::${deckSyncId(deck)}';
    var id = Math.random().toString(36).slice(2), seq = 0, seen = {}, handlers = [], bc = null;
    var peers = []; // postMessage 상대 (스피커: opener / 본편: 메시지를 보내온 스피커 창)
    if (window.opener && window.opener !== window) peers.push(window.opener);
    function addPeer(w) {
      if (!w || w === window) return;
      for (var i = 0; i < peers.length; i++) if (peers[i] === w) return;
      peers.push(w);
    }
    try { bc = new BroadcastChannel(KEY); } catch (e) {}
    function dispatch(msg) {
      if (!msg || msg.channel !== KEY || msg.from === id) return;
      var k = msg.from + ':' + msg.seq;
      if (seen[k]) return; seen[k] = true;
      handlers.forEach(function (h) { h(msg); });
    }
    if (bc) bc.onmessage = function (e) { dispatch(e.data); };
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY || !e.newValue) return;
      try { dispatch(JSON.parse(e.newValue)); } catch (err) {}
    });
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.channel !== KEY) return;
      addPeer(e.source);
      dispatch(e.data);
    });
    return {
      send: function (msg) {
        msg.from = id; msg.seq = ++seq; msg.t = Date.now(); msg.channel = KEY;
        if (bc) try { bc.postMessage(msg); } catch (e) {}
        try { localStorage.setItem(KEY, JSON.stringify(msg)); } catch (e) {}
        for (var i = 0; i < peers.length; i++) {
          try { peers[i].postMessage(msg, '*'); } catch (e) {}
        }
      },
      on: function (h) { handlers.push(h); },
      addPeer: addPeer
    };
  }`;
  }

  function navScript(deck, slides, index) {
    const prev = slides[index - 1] ? fileName(slides[index - 1]) : '';
    const next = slides[index + 1] ? fileName(slides[index + 1]) : '';
    const files = slides.map((slide) => fileName(slide));
    // fragment: item 의 fragment 순번을 (item 인덱스, 순번) 쌍으로 임베드 — 런타임이
    // .slide-content article 문서 순서(items 렌더 순서와 동일)로 매핑해 태깅한다.
    const fragments = (slides[index].items || [])
      .map((item, itemIndex) => ({ unit: itemIndex, order: item.fragment }))
      .filter((entry) => Number.isFinite(entry.order))
      .sort((a, b) => a.order - b.order);
    return `<script>
  function navigateTo(url) {
    if (document.startViewTransition) {
      document.startViewTransition(() => { window.location.href = url; });
      return;
    }
    document.body.classList.add('fade-out');
    setTimeout(function() { window.location.href = url; }, 250);
  }
  var __fragNext = null, __fragPrev = null;
  document.addEventListener('keydown', function(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      if (__fragNext && __fragNext()) { e.preventDefault(); return; }
      ${next ? `e.preventDefault(); navigateTo('${next}');` : ''}
    }
    if (e.key === 'ArrowLeft') {
      if (__fragPrev && __fragPrev()) { e.preventDefault(); return; }
      ${prev ? `e.preventDefault(); navigateTo('${prev}');` : ''}
    }
    if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var w = window.open('speaker.html', 'deck-speaker', 'width=1180,height=740');
      if (window.__deckSync && w) window.__deckSync.addPeer(w);
    }
  });
  // 스피커 뷰 동기 + fragment 단계 공개 (export 캡처 모드에서는 침묵 — 산출물 무오염)
  if (!document.documentElement.classList.contains('print-mode') && !document.documentElement.classList.contains('capture-mode')) {
    ${syncHelperScript(deck)}
    var __FILES = ${JSON.stringify(files)};
    var __INDEX = ${index};
    var __FRAGS = ${JSON.stringify(fragments)};
    var __sync = createDeckSync();
    window.__deckSync = __sync;
    var __frag = { list: [], revealed: 0 };
    if (__FRAGS.length) {
      var __units = document.querySelectorAll('.slide-content article');
      __FRAGS.forEach(function (f) {
        var el = __units[f.unit];
        if (el) { el.classList.add('fragment-pending'); __frag.list.push(el); }
      });
      __fragNext = function () {
        if (__frag.revealed >= __frag.list.length) return false;
        var el = __frag.list[__frag.revealed++];
        el.classList.remove('fragment-pending');
        el.classList.add('fragment-revealed');
        __announce();
        return true;
      };
      __fragPrev = function () {
        if (__frag.revealed <= 0) return false;
        var el = __frag.list[--__frag.revealed];
        el.classList.remove('fragment-revealed');
        el.classList.add('fragment-pending');
        __announce();
        return true;
      };
    }
    function __announce() {
      __sync.send({ type: 'slide', index: __INDEX, fragment: __frag.revealed, fragTotal: __frag.list.length });
    }
    __announce();
    __sync.on(function (msg) {
      if (msg.type === 'hello') { __announce(); return; }
      if (msg.type === 'step' && typeof msg.dir === 'number') {
        if (msg.dir > 0) {
          if (__fragNext && __fragNext()) return;
          ${next ? `navigateTo('${next}');` : ''}
        } else {
          if (__fragPrev && __fragPrev()) return;
          ${prev ? `navigateTo('${prev}');` : ''}
        }
        return;
      }
      if (msg.type === 'navigate' && typeof msg.index === 'number') {
        var f = __FILES[msg.index];
        if (f && msg.index !== __INDEX) navigateTo(f);
      }
    });
  }
  </script>`;
  }

  function renderSpeaker(deck) {
    const template = resolveTheme(deck.meta.template || 'light');
    const canvas = canvasPreset(deck);
    const data = deck.slides.map((slide, i) => ({
      no: slide.no,
      title: slide.title,
      file: fileName(slide),
      notes: Array.isArray(slide.notes) ? slide.notes.join('\n') : (slide.notes || ''),
    }));
    return `<!DOCTYPE html>
  <html lang="${escapeHtml(deck.meta.language || 'ko')}">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deck.meta.title)} — Speaker</title>
  ${FONT_LINKS[template] || FONT_LINKS.light}
  <style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { background: #16161a; color: #f2f2f5; font-family: 'Pretendard Variable', Pretendard, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  header.bar { display: flex; align-items: center; gap: 16px; padding: 10px 16px; background: #202027; font-size: 14px; }
  header.bar .pos { font-variant-numeric: tabular-nums; font-weight: 700; }
  header.bar .timer { margin-left: auto; font-variant-numeric: tabular-nums; font-size: 20px; font-weight: 700; }
  header.bar button { background: #33333d; color: inherit; border: 0; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 12px; }
  main { flex: 1; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 12px; padding: 12px 16px 16px; min-height: 0; }
  .previews { display: flex; flex-direction: column; gap: 12px; min-height: 0; }
  .frame { position: relative; background: #000; border-radius: 8px; overflow: hidden; }
  .frame.current { flex: 2.2; }
  .frame.next { flex: 1; }
  .frame .tag { position: absolute; top: 8px; left: 8px; z-index: 2; font-size: 11px; letter-spacing: .08em; background: rgba(0,0,0,.55); padding: 2px 8px; border-radius: 4px; }
  /* iframe 은 논리 캔버스 원치수로 두고 transform scale 로 프레임에 맞춘다 (잘림 방지) */
  .frame iframe { width: ${canvas.width}px; height: ${canvas.height}px; border: 0; background: #000; transform-origin: 0 0; position: absolute; left: 50%; top: 50%; }
  aside.notes { background: #202027; border-radius: 8px; padding: 16px 18px; display: flex; flex-direction: column; min-height: 0; }
  aside.notes .notes-head-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  aside.notes h2 { font-size: 12px; letter-spacing: .1em; opacity: .55; }
  aside.notes button { margin-left: auto; background: #33333d; color: inherit; border: 0; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 12px; }
  aside.notes textarea { flex: 1; width: 100%; background: transparent; color: inherit; border: 0; outline: none; resize: none; font: inherit; font-size: 17px; line-height: 1.65; }
  aside.notes .notes-hint { font-size: 11px; opacity: .45; margin-top: 8px; }
  .waiting { opacity: .6; font-size: 14px; }
  </style>
  </head>
  <body>
  <header class="bar">
    <span class="pos" id="pos">— / ${String(deck.slides.length).padStart(2, '0')}</span>
    <span id="slide-title" class="waiting">발표 창(슬라이드)에서 S 키를 눌러 연결하거나, 슬라이드를 이동하면 동기화됩니다</span>
    <span class="timer" id="timer">00:00</span>
    <button id="timer-reset" type="button">타이머 리셋</button>
  </header>
  <main>
    <div class="previews">
      <div class="frame current"><span class="tag">CURRENT</span><iframe id="cur" title="current slide"></iframe></div>
      <div class="frame next"><span class="tag">NEXT</span><iframe id="nxt" title="next slide"></iframe></div>
    </div>
    <aside class="notes">
      <div class="notes-head-row"><h2>SPEAKER NOTES</h2><button id="notes-copy" type="button">수정본 전체 복사</button></div>
      <textarea id="notes" placeholder="—" spellcheck="false"></textarea>
      <div class="notes-hint">이 창에서 고친 노트는 발표 세션 동안만 유지된다 — 정본 반영은 「수정본 전체 복사」 후 slides.json 의 notes 에 붙여넣기.</div>
    </aside>
  </main>
  <script>
  ${syncHelperScript(deck)}
  var DATA = ${JSON.stringify(data)};
  var cur = -1;
  var sync = createDeckSync();
  // 노트 편집 — 창 세션 메모리 + (가능하면) localStorage. file:// opaque origin 에선 메모리만.
  var edits = {};
  var NOTES_KEY = 'deck-notes::${deckSyncId(deck)}';
  try { edits = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch (e) {}
  var notesEl = document.getElementById('notes');
  notesEl.addEventListener('input', function () {
    if (cur < 0) return;
    edits[cur] = notesEl.value;
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(edits)); } catch (e) {}
  });
  document.getElementById('notes-copy').addEventListener('click', function () {
    var out = DATA.map(function (d, i) {
      return String(d.no).padStart(2, '0') + ' ' + d.title + '\\n' + (edits[i] !== undefined ? edits[i] : (d.notes || ''));
    }).join('\\n\\n');
    (navigator.clipboard ? navigator.clipboard.writeText(out) : Promise.reject()).then(function () {
      document.getElementById('notes-copy').textContent = '복사됨';
      setTimeout(function () { document.getElementById('notes-copy').textContent = '수정본 전체 복사'; }, 1500);
    }).catch(function () { window.prompt('복사 (Ctrl+C):', out); });
  });
  function show(i, fragment, fragTotal) {
    if (i < 0 || i >= DATA.length) return;
    var pos = String(DATA[i].no).padStart(2, '0') + ' / ' + String(DATA.length).padStart(2, '0');
    if (fragTotal > 0) pos += ' · +' + fragment + '/' + fragTotal;
    document.getElementById('pos').textContent = pos;
    if (i === cur) return;
    cur = i;
    var d = DATA[i], n = DATA[i + 1];
    var titleEl = document.getElementById('slide-title');
    titleEl.textContent = d.title; titleEl.classList.remove('waiting');
    document.getElementById('cur').src = d.file + '?capture';
    document.getElementById('nxt').src = n ? n.file + '?capture' : 'about:blank';
    notesEl.value = edits[i] !== undefined ? edits[i] : (d.notes || '');
  }
  sync.on(function (msg) { if (msg.type === 'slide' && typeof msg.index === 'number') show(msg.index, msg.fragment || 0, msg.fragTotal || 0); });
  sync.send({ type: 'hello' });
  // 하트비트 — 본편이 full navigation 으로 재로드되면 새 문서는 스피커를 모른다.
  // opener WindowProxy 는 내비게이션을 살아남으므로 주기적 hello 로 재연결한다(dedupe 로 무해).
  setInterval(function () { sync.send({ type: 'hello' }); }, 1200);
  var CANVAS = { w: ${canvas.width}, h: ${canvas.height} };
  function fitPreviews() {
    ['cur', 'nxt'].forEach(function (fid) {
      var el = document.getElementById(fid), frame = el.parentElement;
      var s = Math.min(frame.clientWidth / CANVAS.w, frame.clientHeight / CANVAS.h);
      el.style.transform = 'scale(' + s + ')';
      el.style.left = ((frame.clientWidth - CANVAS.w * s) / 2) + 'px';
      el.style.top = ((frame.clientHeight - CANVAS.h * s) / 2) + 'px';
    });
  }
  window.addEventListener('resize', fitPreviews);
  fitPreviews();
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') sync.send({ type: 'step', dir: 1 });
    if (e.key === 'ArrowLeft') sync.send({ type: 'step', dir: -1 });
  });
  var t0 = Date.now();
  document.getElementById('timer-reset').addEventListener('click', function () { t0 = Date.now(); });
  setInterval(function () {
    var s = Math.floor((Date.now() - t0) / 1000);
    document.getElementById('timer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }, 500);
  </script>
  </body>
  </html>`;
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
  ${navScript(deck, deck.slides, index)}
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

  // 단일 파일 standalone — N개 슬라이드 문서를 한 문서의 <section> 상태 전환으로 병합한다.
  // full navigation(모드 1) 대신 active 토글: display:none↔contents 라 활성화 시 진입 애니메이션이 재생된다.
  function renderStandalone(deck) {
    const template = resolveTheme(deck.meta.template || 'light');
    const canvas = canvasPreset(deck);
    const extras = [...new Set(deck.slides.map((slide) => headExtras(slide)).filter(Boolean))].join('\n  ');
    const sections = deck.slides.map((slide, index) => `<section class="deck-page${index === 0 ? ' active' : ''}" data-index="${index}" data-slide="${String(slide.no).padStart(2, '0')}">
  ${renderSlideMain(deck, slide)}
</section>
${slideScripts(slide)}`).join('\n');
    return `<!DOCTYPE html>
  <html lang="${escapeHtml(deck.meta.language || 'ko')}" class="standalone-mode">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deck.meta.title)}</title>
  ${FONT_LINKS[template] || FONT_LINKS.light}
  ${extras}
  <style>${commonCss(template, canvas)}
  .deck-page { display: none; }
  .deck-page.active { display: contents; }
  .standalone-pos { position: fixed; right: 18px; bottom: 14px; z-index: 50; font-size: 12px; letter-spacing: .08em; opacity: .45; font-variant-numeric: tabular-nums; pointer-events: none; }
  </style>
  </head>
  <body class="theme-${escapeHtml(template)}">
  ${sections}
  <div class="standalone-pos" id="standalone-pos">01 / ${String(deck.slides.length).padStart(2, '0')}</div>
  <script>
  (function () {
    var pages = Array.prototype.slice.call(document.querySelectorAll('.deck-page'));
    var cur = 0;
    function show(i) {
      if (i < 0 || i >= pages.length || i === cur) return;
      pages[cur].classList.remove('active');
      cur = i;
      pages[cur].classList.add('active');
      document.getElementById('standalone-pos').textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(pages.length).padStart(2, '0');
    }
    document.addEventListener('keydown', function (e) {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); show(cur + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show(cur - 1); }
      if (e.key === 'Home') show(0);
      if (e.key === 'End') show(pages.length - 1);
    });
  })();
  </script>
  </body>
  </html>`;
  }

  return { renderSlide, renderIndex, renderPrint, renderSpeaker, renderStandalone };
}
