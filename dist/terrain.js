/* Explanatory terrain, generated locally. This is not reconstructed field data. */
(() => {
  const panel = document.querySelector('.terrain-panel');
  const diagram = panel.querySelector('svg');
  const controls = document.createElement('div');
  controls.className = 'terrain-controls';
  controls.innerHTML = '<div role="group" aria-label="Terrain illustration view"><button aria-pressed="true" data-view="section">Cross-section</button><button aria-pressed="false" data-view="terrain">Terrain study</button></div><span>EXPLANATORY MODEL</span>';
  panel.prepend(controls);
  const canvas = document.createElement('canvas');
  canvas.className = 'terrain-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Illustrative three-dimensional terrain mesh with an orange failure zone. Not a reconstruction of a real site.');
  canvas.hidden = true;
  diagram.after(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { controls.remove(); canvas.remove(); return; }
  let angle = -.55, desiredAngle = -.55, frame = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const height = (x, z) => 1.5 * Math.exp(-((x + .3) ** 2 / 1.1 + z ** 2 / 2.7))
    + .38 * Math.exp(-((x - 1.1) ** 2 / .4 + (z + .7) ** 2 / .5))
    + .04 * Math.sin(x * 9 + z * 3) * Math.cos(z * 6);
  function draw(time = 0) {
    frame = null;
    if (canvas.hidden || document.hidden || (!panel.closest('.slide').classList.contains('active') && !document.body.classList.contains('study-mode'))) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.clearRect(0, 0, w, h);
    angle += (desiredAngle - angle) * .06;
    const a = angle + (reduced.matches || document.body.classList.contains('motion-paused') ? 0 : Math.sin(time / 6500) * .045);
    const scale = Math.min(w / 4.5, h / 2.8);
    const project = (x, y, z) => {
      const rx = x * Math.cos(a) - z * Math.sin(a);
      const rz = x * Math.sin(a) + z * Math.cos(a);
      return [w / 2 + rx * scale, h * .67 + rz * scale * .35 - y * scale * .7];
    };
    const cells = [], steps = 32;
    for (let iz = 0; iz < steps; iz++) for (let ix = 0; ix < steps; ix++) {
      const x = ix / steps * 3.5 - 1.75, z = iz / steps * 3.5 - 1.75, d = 3.5 / steps;
      const pts = [[x,z],[x+d,z],[x+d,z+d],[x,z+d]];
      const failure = x > -.15 && x < .8 && Math.abs(z - .3) < .25 + (x + .15) * .3;
      cells.push({ pts: pts.map(([px,pz]) => project(px,height(px,pz),pz)), depth: x * Math.sin(a) + z * Math.cos(a), failure, altitude:height(x,z) });
    }
    cells.sort((a,b) => a.depth - b.depth);
    for (const cell of cells) {
      ctx.beginPath(); cell.pts.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath();
      ctx.fillStyle = cell.failure ? `rgba(160,87,42,${.65 + cell.altitude*.15})` : `rgb(${20+cell.altitude*15},${47+cell.altitude*19},${37+cell.altitude*13})`;
      ctx.fill(); ctx.strokeStyle = cell.failure ? '#efa660aa' : '#a9c6a04f'; ctx.lineWidth = .65 * dpr; ctx.stroke();
    }
    ctx.font = `${12*dpr}px monospace`; ctx.fillStyle = '#b9cdbd';
    ctx.fillText('SCHEMATIC / NOT TO SCALE', 12*dpr, h-14*dpr);
    if (!reduced.matches && !document.body.classList.contains('motion-paused')) frame = requestAnimationFrame(draw);
  }
  function start() { if (frame === null) frame = requestAnimationFrame(draw); }
  controls.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const terrain = button.dataset.view === 'terrain';
    canvas.hidden = !terrain; diagram.toggleAttribute('hidden', terrain);
    controls.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    panel.querySelector('.caption').textContent = terrain ? 'Move across the terrain to change the viewpoint. Orange marks an illustrative failure zone.' : 'A ground-level perspective preserves the context of the slope.';
    if (terrain) start(); else if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
  }));
  canvas.addEventListener('pointermove', event => { const r=canvas.getBoundingClientRect(); desiredAngle=-.55+(event.clientX-r.left-r.width/2)/r.width*.65; start(); });
  canvas.addEventListener('pointerleave', () => { desiredAngle=-.55; start(); });
  new ResizeObserver(start).observe(canvas);
  new MutationObserver(start).observe(panel.closest('.slide'), {attributes:true, attributeFilter:['class']});
  new MutationObserver(start).observe(document.body, {attributes:true, attributeFilter:['class']});
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener('change', start);
})();
