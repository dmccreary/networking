// NAT Traversal with STUN and TURN
// CANVAS_HEIGHT: 598
// Two peers behind NATs discover external addresses via STUN (cone NAT) and
// fall back to a TURN relay when hole punching fails (symmetric NAT).
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 500;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a', GREEN = '#2e7d32', RED = '#e53935';
const MODES = ['Cone NAT (STUN)', 'Symmetric NAT (TURN)'];
let mode = 0, step = 0, isPlaying = false, frameAcc = 0;
let showSignaling = true, showBandwidth = false;
let tabButtons = [], stepButton, playButton, resetButton, sigBtn, bwBtn;

function scenes() {
  if (mode === 0) return [
    { d: 'Peer A → STUN binding request. STUN replies: external 203.0.113.1:50001.', hi: ['A', 'STUN'] },
    { d: 'Peer B → STUN binding request. STUN replies: external 198.51.100.1:50002.', hi: ['B', 'STUN'] },
    { d: 'Peers exchange candidate addresses via the signaling service.', hi: ['SIG'], sig: true },
    { d: 'Each peer probes the other’s external address; both NATs open mappings.', hi: ['A', 'B'] },
    { d: 'Direct UDP flow established — no relay needed.', direct: true }
  ];
  return [
    { d: 'Both peers get external addresses from STUN.', hi: ['A', 'B', 'STUN'] },
    { d: 'Symmetric NAT uses a different port per destination — the STUN address is useless for B → A.', hi: ['A'], failProbe: true },
    { d: 'Peer A allocates a relay binding on the TURN server.', hi: ['A', 'TURN'] },
    { d: 'Peer B connects to the TURN relay address.', hi: ['B', 'TURN'] },
    { d: 'Traffic flows through the TURN relay' + (showBandwidth ? ' — 2× bytes on the wire vs. direct.' : '.'), relay: true }
  ];
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  let x = 10;
  MODES.forEach((m, i) => { const b = createButton(m); b.position(x, drawHeight + 8); b.mousePressed(() => { mode = i; step = 0; updateTabs(); }); tabButtons.push(b); x += 160; });
  stepButton = createButton('Step ▶'); stepButton.position(x + 6, drawHeight + 8); stepButton.mousePressed(() => { isPlaying = false; playButton.html('Play'); const L = scenes(); if (step < L.length) step++; });
  playButton = createButton('Play'); playButton.position(x + 76, drawHeight + 8); playButton.mousePressed(() => { if (step >= scenes().length) step = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); });
  resetButton = createButton('Reset'); resetButton.position(x + 136, drawHeight + 8); resetButton.mousePressed(() => { step = 0; isPlaying = false; playButton.html('Play'); });
  sigBtn = createButton('Show signaling: ON'); sigBtn.position(10, drawHeight + 46); sigBtn.mousePressed(() => { showSignaling = !showSignaling; sigBtn.html('Show signaling: ' + (showSignaling ? 'ON' : 'OFF')); });
  bwBtn = createButton('Visualize bandwidth: OFF'); bwBtn.position(170, drawHeight + 46); bwBtn.mousePressed(() => { showBandwidth = !showBandwidth; bwBtn.html('Visualize bandwidth: ' + (showBandwidth ? 'ON' : 'OFF')); });
  updateTabs();
  describe('Two peers behind NATs use a STUN server to discover their external ' +
    'addresses for direct connection, and fall back to a TURN relay when a ' +
    'symmetric NAT prevents hole punching.', LABEL);
}
function updateTabs() { tabButtons.forEach((b, i) => b.style('font-weight', i === mode ? '700' : '400')); }

function P(nx, ny) { return { x: margin + nx * (canvasWidth - 2 * margin), y: 60 + ny * (drawHeight - 130) }; }
const POS = {
  A: () => P(0.08, 0.5), NATA: () => P(0.27, 0.5),
  B: () => P(0.92, 0.5), NATB: () => P(0.73, 0.5),
  STUN: () => P(0.5, 0.06), TURN: () => P(0.5, 0.96), SIG: () => P(0.5, 0.5)
};

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const L = scenes();
  if (isPlaying) { frameAcc++; if (frameAcc > 46) { frameAcc = 0; if (step < L.length) step++; else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('NAT Traversal — ' + MODES[mode], canvasWidth / 2, 6);

  const sc = L[min(step, L.length) - 1] || null;
  const hi = sc ? (sc.hi || []) : [];

  // base links
  stroke('#cfd8dc'); strokeWeight(2);
  line(POS.A().x, POS.A().y, POS.NATA().x, POS.NATA().y);
  line(POS.NATA().x, POS.NATA().y, POS.NATB().x, POS.NATB().y);
  line(POS.NATB().x, POS.NATB().y, POS.B().x, POS.B().y);

  // active paths from scene
  if (sc) drawScenePaths(sc);

  // nodes
  drawNode('A', POS.A(), 'Peer A', '10.0.0.5:50001', '#1976d2', hi.includes('A'));
  drawNode('B', POS.B(), 'Peer B', '192.168.1.10:50002', '#1976d2', hi.includes('B'));
  drawHex(POS.NATA(), 'NAT-A', '203.0.113.1', hi);
  drawHex(POS.NATB(), 'NAT-B', '198.51.100.1', hi);
  drawNode('STUN', POS.STUN(), 'STUN', 'stun:3478', SLATE, hi.includes('STUN'));
  drawNode('TURN', POS.TURN(), 'TURN relay', 'turn:3478', AMBER, hi.includes('TURN'));
  if (showSignaling) drawNode('SIG', POS.SIG(), 'Signaling', 'candidates', '#6a1b9a', hi.includes('SIG'));

  // narration
  noStroke(); textAlign(LEFT, TOP); textSize(13); let dy = drawHeight - 70;
  for (let i = 0; i < min(step, L.length); i++) { fill(L[i].direct ? GREEN : (L[i].relay ? '#bf6a00' : (L[i].failProbe ? RED : '#37474f'))); text((i + 1) + '. ' + L[i].d, margin, dy, canvasWidth - 2 * margin, 24); dy += 22; }

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12); text('Step ' + min(step, L.length) + ' / ' + L.length, 560, drawHeight + 56);
}

function drawScenePaths(sc) {
  const a = POS.A(), b = POS.B(), na = POS.NATA(), nb = POS.NATB(), stun = POS.STUN(), turn = POS.TURN();
  if (sc.sig && showSignaling) { stroke('#6a1b9a'); strokeWeight(2); drawDashed(a.x, a.y, POS.SIG().x, POS.SIG().y); drawDashed(b.x, b.y, POS.SIG().x, POS.SIG().y); }
  if (sc.direct) { stroke(GREEN); strokeWeight(4); line(a.x, a.y, na.x, na.y); line(na.x, na.y, nb.x, nb.y); line(nb.x, nb.y, b.x, b.y); noStroke(); fill(GREEN); textAlign(CENTER, BOTTOM); textSize(12); text('direct UDP', canvasWidth / 2, na.y - 10); }
  if (sc.failProbe) { stroke(RED); strokeWeight(2); line(na.x, na.y, nb.x, nb.y); const mx = (na.x + nb.x) / 2, my = na.y; noStroke(); fill(RED); textAlign(CENTER, CENTER); textSize(16); text('✗', mx, my - 14); }
  if (sc.relay) {
    stroke(AMBER); strokeWeight(4);
    line(a.x, a.y, na.x, na.y); line(na.x, na.y, turn.x, turn.y); line(turn.x, turn.y, nb.x, nb.y); line(nb.x, nb.y, b.x, b.y);
    noStroke(); fill('#bf6a00'); textAlign(CENTER, TOP); textSize(12); text('relayed via TURN', turn.x, turn.y - 40);
  }
}

function drawNode(id, p, label, sub, col, hot) {
  noStroke(); fill(col); stroke(hot ? GREEN : '#37474f'); strokeWeight(hot ? 3 : 1.5); rectMode(CENTER); rect(p.x, p.y, 96, 40, 7); rectMode(CORNER);
  noStroke(); fill(col === AMBER ? '#3e2723' : 'white'); textAlign(CENTER, CENTER); textSize(12); text(label, p.x, p.y - 6); textSize(8); text(sub, p.x, p.y + 10);
}
function drawHex(p, label, ip, hi) {
  const hot = hi.includes('NATA') || hi.includes('NATB');
  stroke(hot ? GREEN : '#37474f'); strokeWeight(1.5); fill(SLATE);
  beginShape(); for (let i = 0; i < 6; i++) { const a = PI / 6 + i * PI / 3; vertex(p.x + 26 * cos(a), p.y + 26 * sin(a)); } endShape(CLOSE);
  noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(10); text(label, p.x, p.y - 5); textSize(7); text(ip, p.x, p.y + 8);
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 9); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
