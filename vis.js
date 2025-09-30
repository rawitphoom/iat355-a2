// ========== Utility: easeOutCubic ==========
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ========== Animated Bars ==========
function animateBars() {
  const svg = document.getElementById('barChart');
  if (!svg) return;

  const baseline = 210; // y where bars rest
  const duration = 900; // ms
  const bars = svg.querySelectorAll('.bar');

  // Start with height 0 at baseline
  bars.forEach(bar => {
    bar.setAttribute('y', baseline);
    bar.setAttribute('height', 0);
    bar.style.filter = 'drop-shadow(0 6px 8px rgba(0,0,0,.35))';
  });

  const start = performance.now();
  requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const e = easeOutCubic(t);

    bars.forEach(bar => {
      const h = parseFloat(bar.dataset.h);
      const curH = h * e;
      bar.setAttribute('height', curH);
      bar.setAttribute('y', baseline - curH);
    });

    if (t < 1) requestAnimationFrame(step);
  });

  // Tooltip on hover
  const tip = document.getElementById('tooltip');
  function showTip(e, label, value) {
    tip.textContent = `${label}: ${value}`;
    tip.style.left = `${e.clientX}px`;
    tip.style.top = `${e.clientY}px`;
    tip.style.opacity = 1;
  }
  function hideTip() {
    tip.style.opacity = 0;
  }

  bars.forEach(bar => {
    const label = bar.dataset.label || '';
    const value = bar.dataset.h || '';
    bar.addEventListener('mousemove', e => showTip(e, label, value));
    bar.addEventListener('mouseleave', hideTip);
  });
}

// ========== Creative Animated SVG ==========
function buildCreative() {
  const svg = document.getElementById('creative');
  if (!svg) return;
  const W = 600, H = 260;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // --- defs (gradient) ---
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS(defs.namespaceURI, 'linearGradient');
  grad.setAttribute('id', 'bggrad');
  grad.setAttribute('x1', '0%'); grad.setAttribute('x2', '0%');
  grad.setAttribute('y1', '0%'); grad.setAttribute('y2', '100%');

  const s1 = document.createElementNS(defs.namespaceURI, 'stop');
  s1.setAttribute('offset', '0%');   s1.setAttribute('stop-color', '#0f172a');
  const s2 = document.createElementNS(defs.namespaceURI, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#111827');
  grad.append(s1, s2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // --- background ---
  const bg = document.createElementNS(svg.namespaceURI, 'rect');
  bg.setAttribute('x', 0); bg.setAttribute('y', 0);
  bg.setAttribute('width', W); bg.setAttribute('height', H);
  bg.setAttribute('fill', 'url(#bggrad)');
  svg.appendChild(bg);

  // --- subtle stars ---
  const stars = document.createElementNS(svg.namespaceURI, 'g');
  stars.setAttribute('opacity', '0.6');
  for (let i = 0; i < 70; i++) {
    const c = document.createElementNS(svg.namespaceURI, 'circle');
    c.setAttribute('cx', Math.random() * W);
    c.setAttribute('cy', Math.random() * H);
    c.setAttribute('r', Math.random() * 1.2 + 0.2);
    c.setAttribute('fill', '#e9e9e981');
    stars.appendChild(c);
  }
  svg.appendChild(stars);

  // --- pulsing core ---
  const core = document.createElementNS(svg.namespaceURI, 'circle');
  core.setAttribute('cx', W/2);
  core.setAttribute('cy', H/2);
  core.setAttribute('r', 22);
  core.setAttribute('fill', '#7cc7ff');
  core.setAttribute('filter', 'drop-shadow(0 0 18px #7cc7ff88)');
  svg.appendChild(core);

  // --- orbit group (rotates) ---
  const orbitGroup = document.createElementNS(svg.namespaceURI, 'g');
  orbitGroup.setAttribute('transform', `translate(${W/2}, ${H/2})`);
  svg.appendChild(orbitGroup);

  const orbits = [];
  const rings = [46, 76, 106];
  rings.forEach((radius, i) => {
    const ring = document.createElementNS(svg.namespaceURI, 'circle');
    ring.setAttribute('r', radius);
    ring.setAttribute('cx', 0);
    ring.setAttribute('cy', 0);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'rgba(255,255,255,.12)');
    orbitGroup.appendChild(ring);

    // orbiting dots
    const g = document.createElementNS(svg.namespaceURI, 'g');
    for (let k=0; k< (i+2)*3; k++) {
      const dot = document.createElementNS(svg.namespaceURI, 'circle');
      dot.setAttribute('r', 4);
      dot.setAttribute('fill', ['#ffa24d','#82e39b','#c9a8ff'][i % 3]);
      g.appendChild(dot);
    }
    orbitGroup.appendChild(g);
    orbits.push({ radius, group:g, count: g.childNodes.length, speed: 0.5 + i * 0.25 });
  });

  // --- flowing wave ---
  const wave = document.createElementNS(svg.namespaceURI, 'path');
  wave.setAttribute('fill', 'none');
  wave.setAttribute('stroke', '#7cc7ff99');
  wave.setAttribute('stroke-width', 2);
  wave.setAttribute('filter', 'drop-shadow(0 0 10px #7cc7ff66)');
  svg.appendChild(wave);

  // --- animate ---
  let t0 = performance.now();
  function tick(now) {
    const t = (now - t0) / 1000;

    // pulse core
    const r = 18 + Math.sin(t * 2.3) * 6;
    core.setAttribute('r', r);

    // rotate orbits + place dots
    orbitGroup.setAttribute(
      'transform', `translate(${W/2}, ${H/2}) rotate(${t*12})`
    );

    orbits.forEach(o => {
      for (let i=0; i<o.count; i++) {
        const a = (i / o.count) * Math.PI * 2 + t * o.speed;
        const x = Math.cos(a) * o.radius;
        const y = Math.sin(a) * o.radius;
        const dot = o.group.childNodes[i];
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
      }
    });

    // wave points
    const pts = [];
    const amp = 12;
    const k = 0.015;
    for (let x=20; x<=W-20; x+=8) {
      const y = H - 40 + Math.sin(t*1.6 + x*k) * amp;
      pts.push([x, y]);
    }
    // build smooth path
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i=1; i<pts.length; i++) {
      const [x,y] = pts[i];
      d += ` L ${x} ${y}`;
    }
    wave.setAttribute('d', d);

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  animateBars();
  buildCreative();
});
