export const CANVAS_PRESETS = {
  hd: { width: 1280, height: 720, scale: 1, label: 'HD 1280x720' },
};

export const CANONICAL_THEMES = ['dark', 'light', 'askewly'];

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
};

export const FONT_LINKS = {
  dark: PRETENDARD_LINK,
  light: PRETENDARD_LINK,
  askewly: PRETENDARD_LINK,
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


// --- 커스텀 브랜드 테마 트랙 (SP2) ---------------------------------------
// meta.template: "custom" + 덱 로컬 content/theme.json 으로 브랜드 테마를 주입한다.
// theme.json 계약: { "name": "...", "vars": { <REQUIRED_THEME_VARS 전건> }, "fontLinks": ["<link ...>"] }
// canonical 3종과 같은 변수 집합을 전건 요구한다 — 누락 키는 조용히 기본값으로 채우지 않는다.

export const REQUIRED_THEME_VARS = [
  'bg-primary', 'bg-card', 'surface-raised', 'border-card',
  'text-primary', 'text-secondary', 'text-muted', 'text-sub',
  'accent-start', 'accent-end', 'accent-gradient', 'accent-soft', 'accent-border',
  'shadow-accent', 'card-gradient',
  'nav-bg', 'nav-border', 'nav-accent', 'nav-hover', 'nav-disabled',
  'input-bg', 'option-bg', 'hint-bg',
  'chart-1', 'chart-2', 'chart-3', 'chart-4',
  'font-main', 'font-mono',
];

export function customThemeErrors(theme) {
  const errors = [];
  if (!theme || typeof theme !== 'object') return ['theme.json must be an object'];
  if (!theme.vars || typeof theme.vars !== 'object') return ['theme.json requires a vars object'];
  const missing = REQUIRED_THEME_VARS.filter((k) => !theme.vars[k]);
  if (missing.length) errors.push(`theme.json vars missing required keys: ${missing.join(', ')}`);
  const unknown = Object.keys(theme.vars).filter((k) => !REQUIRED_THEME_VARS.includes(k));
  if (unknown.length) errors.push(`theme.json vars has unknown keys: ${unknown.join(', ')}`);
  return errors;
}

export function registerCustomTheme(theme) {
  const errors = customThemeErrors(theme);
  if (errors.length) throw new Error(errors.join('; '));
  const lines = REQUIRED_THEME_VARS.map((k) => `  --${k}: ${theme.vars[k]};`).join('\n');
  THEME_ROOTS.custom = `:root {\n${lines}\n}`;
  FONT_LINKS.custom = Array.isArray(theme.fontLinks) && theme.fontLinks.length
    ? theme.fontLinks.join('\n')
    : PRETENDARD_LINK;
  return 'custom';
}
