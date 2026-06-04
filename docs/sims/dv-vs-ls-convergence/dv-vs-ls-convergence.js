// Distance-Vector vs. Link-State Convergence
// CANVAS_HEIGHT: 618
// The same 6-router network converges under RIP (distance vector) and OSPF
// (link state) when a link fails. Watch DV climb slowly (count-to-infinity)
// while LS jumps immediately. Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 520;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;
let sliderLeftMargin = 250;

const SLATE = '#546e7a', GREEN = '#43a047', RED = '#e53935', AMBER = '#F5A623', BLUE = '#1976d2';
const INF = 16;
const TARGET = 'R6';

const routers = [
  { id: 'R1', nx: 0.15, ny: 0.25 }, { id: 'R2', nx: 0.5, ny: 0.15 },
  { id: 'R3', nx: 0.5, ny: 0.5 }, { id: 'R4', nx: 0.85, ny: 0.3 },
  { id: 'R5', nx: 0.5, ny: 0.85 }, { id: 'R6', nx: 0.85, ny: 0.75 }
];
const links = [
  { a: 'R1', b: 'R2', c: 1 }, { a: 'R2', b: 'R3', c: 1 }, { a: 'R1', b: 'R3', c: 4 },
  { a: 'R3', b: 'R4', c: 1 }, { a: 'R4', b: 'R5', c: 1 }, { a: 'R3', b: 'R5', c: 3 },
  { a: 'R5', b: 'R6', c: 1 }, { a: 'R4', b: 'R6', c: 2 }, { a: 'R2', b: 'R4', c: 2 }
];
let failed = null;        // link index that failed

let dv = {};              // distance-vector estimates {cost,next}
let ls = {};              // link-state result {cost,next}
let dvRounds = 0, lsTicks = 0, dvStable = false, failedApplied = false;
let isPlaying = false, frameAcc = 0;

let failSelect, stepButton, playButton, resetButton, shButton, prButton, speedSlider;
let splitHorizon = true, poisonReverse = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  failSelect = createSelect(); failSelect.position(120, drawHeight + 10);
  links.forEach((l, i) => failSelect.option(l.a + '–' + l.b + ' (cost ' + l.c + ')'));
  failSelect.selected(links[6].a + '–' + links[6].b + ' (cost ' + links[6].c + ')');   // R5-R6
  stepButton = createButton('Step ▶'); stepButton.position(360, drawHeight + 10); stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(430, drawHeight + 10); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(490, drawHeight + 10); resetButton.mousePressed(reset);
  shButton = createButton('Split horizon: ON'); shButton.position(10, drawHeight + 46); shButton.mousePressed(() => { splitHorizon = !splitHorizon; shButton.html('Split horizon: ' + (splitHorizon ? 'ON' : 'OFF')); });
  prButton = createButton('Poison reverse: OFF'); prButton.position(150, drawHeight + 46); prButton.mousePressed(() => { poisonReverse = !poisonReverse; prButton.html('Poison reverse: ' + (poisonReverse ? 'ON' : 'OFF')); });
  speedSlider = createSlider(1, 6, 2, 1); speedSlider.position(sliderLeftMargin, drawHeight + 80); speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  reset();
  describe('A six-router network shown twice: RIP distance-vector on the left ' +
    'and OSPF link-state on the right. When a link fails, link-state ' +
    'reconverges almost immediately while distance-vector updates slowly.', LABEL);
}

function adjacency(excludeFailed) {
  const adj = {}; routers.forEach(r => adj[r.id] = []);
  links.forEach((l, i) => { if (excludeFailed && failed === i) return; adj[l.a].push({ n: l.b, c: l.c }); adj[l.b].push({ n: l.a, c: l.c }); });
  return adj;
}
function dijkstra(target, excludeFailed) {
  const adj = adjacency(excludeFailed);
  const cost = {}, par = {}; routers.forEach(r => cost[r.id] = INF); cost[target] = 0;
  const done = new Set();
  while (done.size < routers.length) {
    let u = null; routers.forEach(r => { if (!done.has(r.id) && (u === null || cost[r.id] < cost[u])) u = r.id; });
    if (u === null || cost[u] >= INF) break; done.add(u);
    for (const { n, c } of adj[u]) if (cost[u] + c < cost[n]) { cost[n] = cost[u] + c; par[n] = u; }
  }
  // next hop from x toward target: neighbor of x on the tree (child relationship)
  const next = {}; routers.forEach(r => { let cur = r.id; if (cur === target) { next[cur] = '—'; return; } next[cur] = par[cur] || '—'; });
  return { cost, next };
}

function reset() {
  failed = null; failedApplied = false; dvRounds = 0; lsTicks = 0; dvStable = false; isPlaying = false; if (playButton) playButton.html('Play');
  const conv = dijkstra(TARGET, false);
  dv = {}; ls = {};
  routers.forEach(r => { dv[r.id] = { cost: conv.cost[r.id], next: conv.next[r.id] }; ls[r.id] = { cost: conv.cost[r.id], next: conv.next[r.id] }; });
}

function applyFailure() {
  failed = failSelect.elt.selectedIndex; failedApplied = true;
  // LS: recompute immediately
  const lsr = dijkstra(TARGET, true); routers.forEach(r => ls[r.id] = { cost: lsr.cost[r.id], next: lsr.next[r.id] });
  lsTicks = 1; dvRounds = 0; dvStable = false;
}

function dvStep() {
  const adj = adjacency(true);
  const prev = {}; routers.forEach(r => prev[r.id] = { ...dv[r.id] });
  let changed = false;
  for (const r of routers) {
    if (r.id === TARGET) { dv[r.id] = { cost: 0, next: '—' }; continue; }
    let best = INF, bestNext = '—';
    for (const { n, c } of adj[r.id]) {
      let advCost = prev[n].cost;
      if (splitHorizon && prev[n].next === r.id) advCost = INF;     // don't advertise back
      const tot = min(INF, c + advCost);
      if (tot < best) { best = tot; bestNext = n; }
    }
    if (best !== prev[r.id].cost || bestNext !== prev[r.id].next) changed = true;
    dv[r.id] = { cost: best, next: best >= INF ? '—' : bestNext };
  }
  dvRounds++;
  if (!changed) dvStable = true;
}

function doStep() {
  isPlaying = false; if (playButton) playButton.html('Play');
  if (!failedApplied) { applyFailure(); return; }
  if (!dvStable) dvStep();
}
function togglePlay() { if (dvStable && failedApplied) return; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { frameAcc += speedSlider.value(); if (frameAcc > 50) { frameAcc = 0; if (!failedApplied) applyFailure(); else if (!dvStable) dvStep(); else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Convergence: Distance-Vector vs. Link-State', canvasWidth / 2, 6);

  const halfW = canvasWidth / 2;
  drawSide(0, halfW, 'RIP (Distance Vector)', dv, true);
  drawSide(halfW, halfW, 'OSPF (Link State)', ls, false);
  stroke('#cfd8dc'); strokeWeight(1); line(halfW, 40, halfW, drawHeight - 40);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Fail link:', 10, drawHeight + 20); text('Speed: ' + speedSlider.value(), 200, drawHeight + 90);
  fill('#455a64'); textSize(11);
  text(failedApplied ? 'Failed: ' + links[failed].a + '–' + links[failed].b : 'Press Step to fail the selected link.', 560, drawHeight + 56);
}

function drawSide(x0, w, title, state, isDV) {
  noStroke(); fill(isDV ? '#6a1b9a' : BLUE); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text(title, x0 + w / 2, 36); textStyle(NORMAL);

  const top = 64, areaH = drawHeight - top - 60;
  const pos = r => ({ x: x0 + 30 + r.nx * (w - 70), y: top + r.ny * areaH });

  // links
  for (let i = 0; i < links.length; i++) {
    const a = pos(routers.find(r => r.id === links[i].a)), b = pos(routers.find(r => r.id === links[i].b));
    const isFail = failedApplied && failed === i;
    if (isFail) { stroke(RED); strokeWeight(2); drawDashed(a.x, a.y, b.x, b.y); }
    else { stroke('#b0bec5'); strokeWeight(1.5); line(a.x, a.y, b.x, b.y); }
    noStroke(); fill(isFail ? RED : '#90a4ae'); textAlign(CENTER, CENTER); textSize(9);
    text(links[i].c, (a.x + b.x) / 2, (a.y + b.y) / 2 - 6);
  }
  // LS flood pulse animation
  if (!isDV && failedApplied && lsTicks > 0 && frameCount % 60 < 30) {
    for (let i = 0; i < links.length; i++) { if (failed === i) continue; const a = pos(routers.find(r => r.id === links[i].a)), b = pos(routers.find(r => r.id === links[i].b)); const t = (frameCount % 30) / 30; noStroke(); fill(BLUE); circle(lerp(a.x, b.x, t), lerp(a.y, b.y, t), 6); }
  }
  // routers
  for (const r of routers) {
    const p = pos(r); const st = state[r.id]; const isTarget = r.id === TARGET;
    const unreachable = st.cost >= INF;
    noStroke(); fill(isTarget ? GREEN : (unreachable ? '#ef9a9a' : SLATE));
    stroke('#37474f'); strokeWeight(1.5); rectMode(CENTER); rect(p.x, p.y, 74, 40, 7); rectMode(CORNER);
    noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(13); text(r.id, p.x, p.y - 8);
    textSize(9); fill(unreachable ? '#b71c1c' : '#e3f2fd');
    text(isTarget ? 'target' : ('→R6: ' + (unreachable ? '∞' : st.cost) + ' via ' + st.next), p.x, p.y + 9);
  }
  // convergence counter
  noStroke(); textAlign(CENTER, TOP); textSize(13);
  if (isDV) { fill(dvStable ? '#1b5e20' : '#c62828'); text(failedApplied ? ('DV rounds: ' + dvRounds + (dvStable ? '  ✓ converged' : '  (updating…)')) : 'converged (steady state)', x0 + w / 2, drawHeight - 52); }
  else { fill('#1565c0'); text(failedApplied ? ('LS flood + Dijkstra: converged in ' + lsTicks + ' step') : 'converged (steady state)', x0 + w / 2, drawHeight - 52); }
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 8); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); speedSlider.size(canvasWidth - sliderLeftMargin - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
