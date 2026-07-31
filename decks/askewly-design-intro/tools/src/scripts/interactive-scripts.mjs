export function createSlideScripts({ escapeHtml }) {
  function slideId(slide, suffix) {
    return `${suffix}-${String(slide.no).padStart(2, '0')}-${slide.slug}`;
  }
  
  function headExtras(slide) {
    if (slide.layout === 'chart-interactive') {
      return '<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>';
    }
    if (slide.layout === 'three-scene') {
      return `<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}</script>`;
    }
    return '';
  }
  
  function chartScript(slide) {
    const chartId = slideId(slide, 'chart');
    const chartVariant = escapeHtml(slide.variant || slide.chartVariant || 'ranked-bars');
    const chartType = escapeHtml(slide.chartType || '');
    return `<script>
  (function() {
    const dataEl = document.getElementById('${chartId}-data');
    const canvas = document.getElementById('${chartId}');
    if (!dataEl || !canvas || !window.Chart) return;
    const raw = JSON.parse(dataEl.textContent || '[]');
    const labels = raw.map((item) => item.label || item.title || '');
    const base = raw.map((item) => Number(String(item.value || 0).replace(/,/g, '')) || 0);
    const css = getComputedStyle(document.documentElement);
    const token = (name) => css.getPropertyValue(name).trim();
    const fontFamily = token('--font-main') || getComputedStyle(document.body).fontFamily || 'sans-serif';
    const palette = [token('--chart-1'), token('--chart-2'), token('--chart-3'), token('--chart-4'), token('--accent-start'), token('--accent-end')].filter(Boolean);
    // 색은 의미를 인코딩할 때만 쓴다: 조각이 곧 범주인 원형 차트만 팔레트를 순환하고,
    // 단일 시리즈 막대·선은 한 색으로 그린다(emphasis 항목만 accent).
    const seriesColor = token('--chart-1') || palette[0];
    const emphasisColor = token('--accent-end') || seriesColor;
    const barColors = raw.map((item) => (item && item.emphasis ? emphasisColor : seriesColor));
    const withAlpha = (hex, alpha) => {
      const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
      if (!m) return hex;
      const n = parseInt(m[1], 16);
      return 'rgba(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + alpha + ')';
    };
    const variantType = {
      'balance-radar': 'radar',
      'ranked-bars': 'bar',
      'trend-line': 'line',
      'share-doughnut': 'doughnut',
      'polar-balance': 'polarArea'
    };
    const variant = '${chartVariant}';
    const type = '${chartType}' || variantType[variant] || 'bar';
    const isRadar = type === 'radar';
    const isRadial = isRadar || type === 'doughnut' || type === 'polarArea';
    const isLine = type === 'line';
    const isRanked = variant === 'ranked-bars';
    const hasMetricTable = variant === 'share-doughnut' || variant === 'polar-balance';
    const radialOptions = isRadar
      ? { scales: { r: { angleLines: { color: token('--border-card') }, grid: { color: token('--border-card') }, pointLabels: { color: token('--text-primary'), font: { family: fontFamily, weight: 800, size: 13 } }, ticks: { display: false, font: { family: fontFamily } }, suggestedMin: 0, suggestedMax: 100 } } }
      : type === 'polarArea'
        ? { radius: '88%', scales: { r: { angleLines: { display: false }, grid: { color: token('--border-card') }, ticks: { display: false, font: { family: fontFamily } }, suggestedMin: 0 } } }
        : type === 'doughnut'
          ? { cutout: '58%', radius: '92%' }
        : { scales: { x: { ticks: { color: token('--text-secondary'), font: { family: fontFamily, weight: 750 } }, grid: { color: token('--border-card') }, suggestedMin: 0 }, y: { ticks: { color: token('--text-secondary'), font: { family: fontFamily, weight: 750 } }, grid: { color: token('--border-card') }, suggestedMin: 0 } } };
    const chart = new Chart(canvas.getContext('2d'), {
      type,
      data: { labels, datasets: [{
        label: '${escapeHtml(slide.chartLabel || slide.title)}',
        data: base,
        backgroundColor: isRadar || isLine
          ? withAlpha(seriesColor, 0.18)
          : isRadial
            ? palette
            : barColors,
        borderColor: isRadar || isLine ? seriesColor : isRadial ? token('--surface-raised') : barColors,
        pointBackgroundColor: seriesColor,
        borderWidth: isRadar ? 3 : isRadial ? 2 : 2,
        tension: isLine ? 0.38 : 0,
        fill: isLine,
        borderRadius: isRanked ? 8 : 0
      }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: isRanked ? 'y' : 'x',
        plugins: {
          legend: { display: (isRadial || isLine) && !hasMetricTable, position: type === 'doughnut' ? 'right' : 'top', labels: { color: token('--text-secondary'), font: { family: fontFamily, weight: 800 }, boxWidth: 12 } },
          tooltip: { titleFont: { family: fontFamily }, bodyFont: { family: fontFamily } }
        },
        ...radialOptions
      }
    });
    chart.update('none');
  })();
  </script>`;
  }
  
  function threeScript(slide) {
    const sceneId = slideId(slide, 'three');
    return `<script type="module">
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
  (function() {
    const shell = document.getElementById('${sceneId}');
    const canvas = document.getElementById('${sceneId}-canvas');
    if (!shell || !canvas) return;
    const css = getComputedStyle(document.documentElement);
    const color = css.getPropertyValue('--accent-start').trim() || '#111111';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, shell.clientWidth / shell.clientHeight, 0.1, 100);
    camera.position.set(2.8, 2.2, 4.2);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(shell.clientWidth, shell.clientHeight, false);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 4, 5);
    scene.add(light);
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.18 });
    const accentTwo = new THREE.MeshStandardMaterial({ color: css.getPropertyValue('--accent-end').trim() || '#2cbfd3', roughness: 0.5, metalness: 0.1 });
    function addCoreCube() {
      group.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), material));
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.9, 1.9, 1.9)), new THREE.LineBasicMaterial({ color: 0x888888 })));
    }
    function addDeviceStack() {
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 1.7), material);
      base.position.y = -0.55;
      group.add(base);
      for (let i = 0; i < 3; i += 1) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.08, 0.95), i === 1 ? accentTwo : material);
        panel.position.set((i - 1) * 0.48, -0.18 + i * 0.34, (i - 1) * -0.12);
        panel.rotation.x = -0.45;
        panel.rotation.z = (i - 1) * 0.08;
        group.add(panel);
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.58, 0.1, 0.98)), new THREE.LineBasicMaterial({ color: 0x999999 })));
        group.children.at(-1).position.copy(panel.position);
        group.children.at(-1).rotation.copy(panel.rotation);
      }
    }
    function addNodeOrbit() {
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 16), material);
      group.add(core);
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6;
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 12), i % 2 ? accentTwo : material);
        node.position.set(Math.cos(angle) * 1.45, Math.sin(angle * 0.7) * 0.38, Math.sin(angle) * 1.45);
        group.add(node);
        const line = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), node.position.clone()]);
        group.add(new THREE.Line(line, new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.55 })));
      }
    }
    const sceneType = shell.dataset.scene || 'core-cube';
    if (sceneType === 'device-stack') addDeviceStack();
    else if (sceneType === 'node-orbit') addNodeOrbit();
    else addCoreCube();
    scene.add(group);
    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    function resize() {
      const width = shell.clientWidth;
      const height = shell.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(shell);
    window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
    resize();
    animate();
  })();
  </script>`;
  }
  
  function beforeAfterScript(slide) {
    const wrapId = slideId(slide, 'ba');
    return `<script>
  (function() {
    const wrap = document.getElementById('${wrapId}');
    const range = document.getElementById('${wrapId}-range');
    if (!wrap || !range) return;
    range.addEventListener('input', () => wrap.style.setProperty('--pos', range.value + '%'));
  })();
  </script>`;
  }
  
  function slideScripts(slide) {
    switch (slide.layout) {
      case 'chart-interactive': return chartScript(slide);
      case 'three-scene': return threeScript(slide);
      case 'before-after': return beforeAfterScript(slide);
      default: return '';
    }
  }

  return { headExtras, slideScripts };
}
