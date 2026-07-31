export const CANVAS_PRESETS = {
  hd: { width: 1280, height: 720, scale: 1, label: 'HD 1280x720' },
};

export const CANONICAL_THEMES = ['dark', 'light', 'askewly', 'minimax'];

const PRETENDARD_LINK = '<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" rel="stylesheet">';

export const THEME_ROOTS = {
  dark: `:root {
  --bg-primary: #0A0A0A;
  --bg-card: rgba(18,18,24,0.84);
  --surface-raised: rgba(22,20,31,0.88);
  --border-card: rgba(167,139,250,0.16);
  --text-primary: #edf3fa;
  --text-secondary: #a9b4c2;
  --text-muted: #5a6574;
  --text-sub: #cbd5e1;
  --accent-start: #8b5cf6;
  --accent-end: #2cbfd3;
  --accent-gradient: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  --accent-soft: rgba(139,92,246,0.14);
  --accent-border: rgba(139,92,246,0.42);
  --shadow-accent: rgba(139,92,246,0.22);
  --card-gradient: linear-gradient(145deg, rgba(139,92,246,0.18), rgba(44,191,211,0.045));
  --nav-bg: rgba(10,10,10,0.96);
  --nav-border: rgba(139,92,246,0.28);
  --nav-accent: #a78bfa;
  --nav-hover: #2cbfd3;
  --nav-disabled: #566174;
  --input-bg: rgba(255,255,255,0.06);
  --option-bg: #15131d;
  --hint-bg: rgba(10,10,10,0.86);
  --chart-1: #8b5cf6; --chart-2: #a78bfa; --chart-3: #6f7890; --chart-4: #2cbfd3;
  --font-main: 'Pretendard Variable', Pretendard, 'Noto Sans KR', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
  light: `:root {
  --bg-primary: #F4F7FB;
  --bg-card: #FFFFFF;
  --surface-raised: #FCFDFF;
  --border-card: #C8D3E4;
  --text-primary: #171a21;
  --text-secondary: #566173;
  --text-muted: #8893A5;
  --text-sub: #2d3442;
  --accent-start: #2457D6;
  --accent-end: #087D7A;
  --accent-gradient: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  --accent-soft: #EAF1FF;
  --accent-border: #AEC0EA;
  --shadow-accent: rgb(36 87 214 / 0.12);
  --card-gradient: linear-gradient(145deg, #FFFFFF 0%, #F1F6FE 100%);
  --nav-bg: rgb(244 247 251 / 0.96);
  --nav-border: #C8D3E4;
  --nav-accent: #2457D6;
  --nav-hover: #0F766E;
  --nav-disabled: #A2ACBB;
  --input-bg: #E9EEF6;
  --option-bg: #ffffff;
  --hint-bg: rgb(23 26 33 / 0.85);
  --chart-1: #2457D6; --chart-2: #0F8A7D; --chart-3: #7A86A0; --chart-4: #B76122;
  --font-main: 'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
  askewly: `:root {
  --bg-primary: #F4F3EE;
  --bg-card: #FFFDF7;
  --surface-raised: #FFFFFB;
  --border-card: #D8D0C1;
  --text-primary: #15130F;
  --text-secondary: #4A463D;
  --text-muted: #777164;
  --text-sub: #2B261E;
  --accent-start: #2F4B7C;
  --accent-end: #C65A3B;
  --accent-gradient: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  --accent-soft: #E8F0ED;
  --accent-border: #AEC5C0;
  --shadow-accent: rgb(47 75 124 / 0.13);
  --card-gradient: linear-gradient(145deg, #FFFDF7 0%, #EEF5F1 100%);
  --nav-bg: rgb(244 243 238 / 0.96);
  --nav-border: #D8D0C1;
  --nav-accent: #2F4B7C;
  --nav-hover: #C65A3B;
  --nav-disabled: #ACA493;
  --input-bg: #EAE4D8;
  --option-bg: #FFFDF7;
  --hint-bg: rgb(20 17 13 / 0.85);
  --chart-1: #2F4B7C; --chart-2: #2F9E85; --chart-3: #C65A3B; --chart-4: #7B689B;
  --font-main: 'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
  minimax: `:root {
  --bg-primary: #FFFFFF;
  --bg-card: #FFFFFF;
  --surface-raised: #F7F8FA;
  --border-card: #E5E7EB;
  --text-primary: #0A0A0A;
  --text-secondary: #45515E;
  --text-muted: #A8AAB2;
  --text-sub: #222222;
  --accent-start: #FF5530;
  --accent-end: #EA5EC1;
  --accent-gradient: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  --accent-soft: #FFF1ED;
  --accent-border: #FFC7B8;
  --shadow-accent: rgb(255 85 48 / 0.12);
  --card-gradient: linear-gradient(145deg, #FFFFFF 0%, #F7F8FA 100%);
  --nav-bg: rgb(255 255 255 / 0.96);
  --nav-border: #E5E7EB;
  --nav-accent: #FF5530;
  --nav-hover: #1456F0;
  --nav-disabled: #A8AAB2;
  --input-bg: #F2F3F5;
  --option-bg: #FFFFFF;
  --hint-bg: rgb(10 10 10 / 0.85);
  --chart-1: #FF5530; --chart-2: #1456F0; --chart-3: #A855F7; --chart-4: #EA5EC1;
  --font-main: 'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
};

export const FONT_LINKS = {
  dark: PRETENDARD_LINK,
  light: PRETENDARD_LINK,
  askewly: PRETENDARD_LINK,
  minimax: PRETENDARD_LINK,
};

export function resolveTheme(template = 'light') {
  if (THEME_ROOTS[template]) return template;
  return 'light';
}

export function canvasPreset(deck) {
  return CANVAS_PRESETS[deck?.meta?.canvas] || CANVAS_PRESETS.hd;
}

export function canvasCss(canvas) {
  return `:root {
  --slide-w: ${canvas.width}px;
  --slide-h: ${canvas.height}px;
  --canvas-scale: ${canvas.scale};
  --base-slide-w: 1280px;
  --base-slide-h: 720px;
  --scaled-slide-w: calc(var(--base-slide-w) * var(--canvas-scale));
  --scaled-slide-h: calc(var(--base-slide-h) * var(--canvas-scale));
}`;
}

export function themeCss(template) {
  return THEME_ROOTS[resolveTheme(template)] || THEME_ROOTS.light;
}
