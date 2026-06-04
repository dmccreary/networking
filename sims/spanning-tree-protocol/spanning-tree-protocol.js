// Spanning Tree in Action
// CANVAS_HEIGHT: 600
// Animates STP building a loop-free tree from a redundant switch topology:
// BPDU exchange, root election, and forwarding/blocking port selection, with
// link- and root-failure reconvergence. Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const SLATE = '#546e7a', AMBER = '#F5A623', GREEN = '#43a047', RED = '#e53935', YELLOW = '#fdd835';

// switches with bridge IDs (priority.macTail); lowest wins root
let switches = [
  { id: 'S1', bid: 32768.11, nx: 0.20, ny: 0.30 },
  { id: 'S2', bid: 32768.22, nx: 0.50, ny: 0.18 },
  { id: 'S3', bid: 4096.33, nx: 0.50, ny: 0.55 },   // lowest → root
  { id: 'S4', bid: 32768.44, nx: 0.80, ny: 0.35 },
  { id: 'S5', bid: 32768.55, nx: 0.80, ny: 0.72 }
];
let links = [
  ['S1', 'S2'], ['S1', 'S3'], ['S2', 'S3'], ['S3', 'S4'], ['S4', 'S5'], ['S3', 'S5']
];
let disabled = new Set();    // disabled link indices

let phase = 0;               // 0 listening, 1 BPDU, 2 root, 3 ports
let isPlaying = false, frameAcc = 0;
let showBPDU = false;
let stp = null;              // computed result

let stepButton, playButton, resetButton, bpduButton, failButton, rootFailButton, speedSlider;
let sliderLeftMargin = 250;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 8); stepButton.mousePressed(() => { isPlaying = false; playButton.html('Play'); phase = min(3, phase + 1); });
  playButton = createButton('Play'); playButton.position(80, drawHeight + 8); playButton.mousePressed(() => { if (phase >= 3) phase = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); });
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 8); resetButton.mousePressed(() => { phase = 0; disabled.clear(); compute(); });
  bpduButton = createButton('Show BPDU contents'); bpduButton.position(205, drawHeight + 8); bpduButton.mousePressed(() => { showBPDU = !showBPDU; bpduButton.html(showBPDU ? 'Hide BPDU contents' : 'Show BPDU contents'); });
  failButton = createButton('Inject link failure'); failButton.position(10, drawHeight + 44); failButton.mousePressed(injectLinkFailure);
  rootFailButton = createButton('Inject root failure'); rootFailButton.position(160, drawHeight + 44); rootFailButton.mousePressed(injectRootFailure);
  speedSlider = createSlider(1, 5, 2, 1); speedSlider.position(sliderLeftMargin, drawHeight + 82); speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  compute();
  describe('A five-switch redundant topology where the Spanning Tree Protocol ' +
    'elects a root bridge and selects forwarding and blocking ports to remove ' +
    'loops, with link- and root-failure reconvergence.', LABEL);
}

function activeLinks() { return links.map((l, i) => ({ l, i })).filter(o => !disabled.has(o.i)); }
function swById(id) { return switches.find(s => s.id === id); }

function compute() {
  // root = lowest bid among active switches
  const present = switches.filter(s => !s.down);
  let root = present[0];
  for (const s of present) if (s.bid < root.bid) root = s;
  // Dijkstra (unit cost) from root over active links; tie-break by neighbor bid
  const adj = {};
  present.forEach(s => adj[s.id] = []);
  for (const { l } of activeLinks()) {
    if (swById(l[0]).down || swById(l[1]).down) continue;
    adj[l[0]].push(l[1]); adj[l[1]].push(l[0]);
  }
  const cost = {}, parent = {};
  present.forEach(s => cost[s.id] = Infinity);
  cost[root.id] = 0;
  const visited = new Set();
  while (visited.size < present.length) {
    let u = null;
    for (const s of present) if (!visited.has(s.id) && (u === null || cost[s.id] < cost[u])) u = s.id;
    if (u === null || cost[u] === Infinity) break;
    visited.add(u);
    for (const v of adj[u]) {
      const nc = cost[u] + 1;
      if (nc < cost[v] || (nc === cost[v] && swById(u).bid < (parent[v] ? swById(parent[v]).bid : Infinity))) { cost[v] = nc; parent[v] = u; }
    }
  }
  // tree edges = (node, parent)
  const treeEdges = new Set();
  present.forEach(s => { if (parent[s.id]) treeEdges.add(edgeKey(s.id, parent[s.id])); });
  stp = { root: root.id, cost, parent, treeEdges };
}
function edgeKey(a, b) { return [a, b].sort().join('-'); }

function injectLinkFailure() {
  const act = activeLinks(); if (!act.length) return;
  const pick = act[floor(random(act.length))];
  disabled.add(pick.i); switches.forEach(s => s.down = false); compute(); phase = 3;
}
function injectRootFailure() {
  if (!stp) return; const r = swById(stp.root); r.down = true; compute(); phase = 3;
}

function pos(s) { return { x: margin + s.nx * (canvasWidth - 2 * margin), y: 60 + s.ny * (drawHeight - 120) }; }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { frameAcc += speedSlider.value(); if (frameAcc > 40) { frameAcc = 0; if (phase < 3) phase++; else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Spanning Tree in Action', canvasWidth / 2, 8);

  // links
  for (let i = 0; i < links.length; i++) {
    const a = pos(swById(links[i][0])), b = pos(swById(links[i][1]));
    const dead = disabled.has(i) || swById(links[i][0]).down || swById(links[i][1]).down;
    const inTree = stp && stp.treeEdges.has(edgeKey(links[i][0], links[i][1]));
    stroke(dead ? '#e0e0e0' : '#b0bec5'); strokeWeight(dead ? 1 : 2);
    if (dead) drawDashed(a.x, a.y, b.x, b.y); else line(a.x, a.y, b.x, b.y);
    if (!dead && phase >= 3) {
      // port dots: tree → green both ends; non-tree → blocked (red) on higher-bid end
      if (inTree) { portDot(a, b, GREEN); portDot(b, a, GREEN); }
      else {
        const hi = swById(links[i][0]).bid > swById(links[i][1]).bid ? a : b;
        const lo = hi === a ? b : a;
        portDot(lo, hi, GREEN); portDot(hi, lo, RED);
      }
    } else if (!dead && phase >= 1) {
      // BPDU pulse traveling
      const t = (frameCount % 60) / 60;
      noStroke(); fill(AMBER); circle(lerp(a.x, b.x, t), lerp(a.y, b.y, t), 8);
      if (showBPDU) { fill('#6a1b9a'); textAlign(CENTER, BOTTOM); textSize(8); text('root ' + (stp ? stp.root : '?'), lerp(a.x, b.x, t), lerp(a.y, b.y, t) - 6); }
    }
  }

  // switches
  for (const s of switches) drawSwitch(s);

  // phase label
  const labels = ['Phase 0: all ports LISTENING (yellow)', 'Phase 1: switches exchange BPDUs',
    'Phase 2: lowest bridge ID elected ROOT', 'Phase 3: forwarding (green) / blocking (red) ports set'];
  noStroke(); fill('#37474f'); textAlign(CENTER, BOTTOM); textSize(14); text(labels[phase], canvasWidth / 2, drawHeight - 8);

  // slider label + hint
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Speed: ' + speedSlider.value() + '×', 205, drawHeight + 92);
  fill('#455a64'); textSize(11); text('Click a link to disable it and watch reconvergence.', 380, drawHeight + 56);
}

function portDot(at, toward, col) { const a = at, b = toward; const px = lerp(a.x, b.x, 0.14), py = lerp(a.y, b.y, 0.14); noStroke(); fill(col); circle(px, py, 9); }

function drawSwitch(s) {
  const p = pos(s); const isRoot = stp && stp.root === s.id && phase >= 2 && !s.down;
  noStroke();
  if (s.down) fill('#e0e0e0'); else fill(phase === 0 ? YELLOW : SLATE);
  stroke(isRoot ? AMBER : '#37474f'); strokeWeight(isRoot ? 3 : 1.5);
  rectMode(CENTER); rect(p.x, p.y, 66, 40, 8); rectMode(CORNER);
  noStroke(); fill(s.down ? '#9e9e9e' : (phase === 0 ? '#3e2723' : 'white')); textAlign(CENTER, CENTER); textSize(14);
  text(s.id, p.x, p.y - 5);
  textSize(8); text('bid ' + s.bid.toFixed(2), p.x, p.y + 11);
  if (isRoot) { noStroke(); fill(AMBER); textAlign(CENTER, BOTTOM); textSize(16); text('♔', p.x, p.y - 22); }
  if (s.down) { stroke(RED); strokeWeight(2); line(p.x - 20, p.y - 12, p.x + 20, p.y + 12); }
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 8); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (let i = 0; i < links.length; i++) {
    const a = pos(swById(links[i][0])), b = pos(swById(links[i][1]));
    if (distToSeg(mouseX, mouseY, a.x, a.y, b.x, b.y) < 8) {
      if (disabled.has(i)) disabled.delete(i); else disabled.add(i);
      switches.forEach(s => s.down = false); compute(); phase = 3; return;
    }
  }
}
function distToSeg(px, py, x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy; if (!l2) return dist(px, py, x1, y1); let t = ((px - x1) * dx + (py - y1) * dy) / l2; t = constrain(t, 0, 1); return dist(px, py, x1 + t * dx, y1 + t * dy); }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); speedSlider.size(canvasWidth - sliderLeftMargin - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
