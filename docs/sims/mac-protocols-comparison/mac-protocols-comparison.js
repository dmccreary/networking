// MAC Protocol Comparison
// CANVAS_HEIGHT: 600
// Four medium-access protocols (Pure ALOHA, CSMA/CD, CSMA/CA, Token Passing)
// on one shared medium, comparing collision rate, fairness, and throughput.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 478;
let controlHeight = 122;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a', GREEN = '#43a047', RED = '#e53935', GRAY = '#b0bec5';
const MODES = ['Pure ALOHA', 'CSMA/CD', 'CSMA/CA', 'Token Passing'];
let activeMode = 0;
let compareMode = false;
let isPlaying = false;

let devSlider, loadSelect, propSelect;
let tabButtons = [], playButton, resetButton, compareButton;
let stepAcc = 0;

let sims = [];   // one Sim per mode (compare); single view uses sims[activeMode]

function newSim(mode, n) {
  return { mode, n, backoff: new Array(n).fill(0), token: 0,
    succ: 0, coll: 0, idle: 0, slots: 0, devSucc: new Array(n).fill(0),
    history: [], lastTx: [] };
}
function loadProb() { return { low: 0.15, medium: 0.35, high: 0.6 }[loadSelect ? loadSelect.value() : 'medium']; }
function propFactor() { return (propSelect ? propSelect.value() : 'small') === 'large' ? 1.0 : 0.4; }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  let x = 10;
  MODES.forEach((m, i) => { const b = createButton(m); b.position(x, drawHeight + 8); b.mousePressed(() => { activeMode = i; rebuild(); updateTabs(); }); tabButtons.push(b); x += m.length > 8 ? 110 : 92; });
  compareButton = createButton('Compare all'); compareButton.position(x, drawHeight + 8);
  compareButton.mousePressed(() => { compareMode = !compareMode; compareButton.html(compareMode ? 'Single view' : 'Compare all'); });

  devSlider = createSlider(2, 8, 5, 1); devSlider.position(150, drawHeight + 46); devSlider.size(canvasWidth - 150 - margin);
  devSlider.input(rebuild);

  loadSelect = createSelect(); loadSelect.position(70, drawHeight + 84); ['low', 'medium', 'high'].forEach(o => loadSelect.option(o)); loadSelect.selected('medium');
  propSelect = createSelect(); propSelect.position(230, drawHeight + 84); ['small', 'large'].forEach(o => propSelect.option(o));
  playButton = createButton('Play'); playButton.position(380, drawHeight + 84); playButton.mousePressed(() => { isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); });
  resetButton = createButton('Reset'); resetButton.position(440, drawHeight + 84); resetButton.mousePressed(rebuild);

  rebuild(); updateTabs();
  describe('Four medium-access-control protocols animated on a shared medium ' +
    'with competing devices, showing successes, collisions, and backoff, plus ' +
    'live throughput, collision-rate, and fairness readouts.', LABEL);
}

function rebuild() { const n = devSlider ? devSlider.value() : 5; sims = MODES.map((m, i) => newSim(i, n)); }
function updateTabs() { tabButtons.forEach((b, i) => b.style('font-weight', (!compareMode && i === activeMode) ? '700' : '400')); }

function stepSim(s) {
  const n = s.n, p = loadProb(), pf = propFactor();
  s.slots++;
  let txers = [];
  if (s.mode === 0) {                       // Pure ALOHA
    for (let i = 0; i < n; i++) if (random() < p) txers.push(i);
  } else if (s.mode === 1) {                // CSMA/CD
    for (let i = 0; i < n; i++) {
      if (s.backoff[i] > 0) { s.backoff[i]--; continue; }
      if (random() < p) txers.push(i);
    }
    // collisions only among those that started together within prop window
    if (txers.length > 1 && random() > pf * 0.6) {
      // sensing avoided some collisions: keep only one sometimes
      if (random() < 0.5) txers = [txers[0]];
    }
  } else if (s.mode === 2) {                // CSMA/CA
    for (let i = 0; i < n; i++) {
      if (s.backoff[i] > 0) { s.backoff[i]--; continue; }
      if (random() < p) { if (random() < 0.6) { s.backoff[i] = floor(random(1, 4)); } else txers.push(i); }
    }
  } else {                                  // Token Passing
    if (random() < p) txers = [s.token];
    s.token = (s.token + 1) % n;            // token always advances
  }

  if (s.mode <= 2) {
    if (txers.length === 0) { s.idle++; s.lastTx = []; pushHist(s, 'idle', []); }
    else if (txers.length === 1) { s.succ++; s.devSucc[txers[0]]++; s.lastTx = txers; pushHist(s, 'succ', txers); }
    else {
      s.coll++; s.lastTx = txers; pushHist(s, 'coll', txers);
      // backoff for colliding devices (CD/CA)
      if (s.mode >= 1) for (const i of txers) s.backoff[i] = floor(random(1, (s.mode === 2 ? 6 : 4)));
    }
  } else { // token
    if (txers.length === 1) { s.succ++; s.devSucc[txers[0]]++; s.lastTx = txers; pushHist(s, 'succ', txers); }
    else { s.idle++; s.lastTx = []; pushHist(s, 'idle', []); }
  }
}
function pushHist(s, kind, txers) { s.history.push({ kind, txers: txers.slice() }); if (s.history.length > 80) s.history.shift(); }

function fairness(s) {
  const x = s.devSucc; const sum = x.reduce((a, b) => a + b, 0); const sumSq = x.reduce((a, b) => a + b * b, 0);
  if (sumSq === 0) return 1; return (sum * sum) / (s.n * sumSq);
}
function throughput(s) {
  let eff = s.slots ? s.succ / s.slots : 0;
  if (s.mode === 2) eff *= 0.85;   // CA overhead (IFS + ACK)
  return eff;
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { stepAcc += deltaTime; if (stepAcc > 130) { stepAcc = 0; if (compareMode) sims.forEach(stepSim); else stepSim(sims[activeMode]); } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text(compareMode ? 'MAC Protocols — Side by Side' : 'MAC Protocol: ' + MODES[activeMode], canvasWidth / 2, 6);

  if (compareMode) drawCompare(); else drawSingle(sims[activeMode]);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('Devices: ' + devSlider.value(), 10, drawHeight + 56);
  fill('#455a64'); textSize(12);
  text('Load:', 30, drawHeight + 94); text('Prop:', 195, drawHeight + 94);
}

function drawSingle(s) {
  const n = s.n;
  const medY = 150, medX0 = margin + 60, medX1 = canvasWidth - margin - 60;
  // shared medium
  noStroke(); fill('#cfd8dc'); rect(medX0, medY - 8, medX1 - medX0, 16, 4);
  fill('#607d8b'); textAlign(CENTER, TOP); textSize(11); text('shared medium', (medX0 + medX1) / 2, medY + 10);
  // devices above/below alternating
  for (let i = 0; i < n; i++) {
    const dx = lerp(medX0 + 30, medX1 - 30, n === 1 ? 0.5 : i / (n - 1));
    const above = i % 2 === 0;
    const dy = above ? medY - 70 : medY + 70;
    const txing = s.lastTx.includes(i);
    const collided = txing && s.history.length && s.history[s.history.length - 1].kind === 'coll';
    const inBackoff = s.backoff[i] > 0;
    let col = AMBER;
    if (txing) col = collided ? RED : GREEN; else if (inBackoff) col = GRAY;
    noStroke(); fill(col); rectMode(CENTER); rect(dx, dy, 60, 30, 6); rectMode(CORNER);
    fill(txing || inBackoff ? 'white' : '#3e2723'); textAlign(CENTER, CENTER); textSize(11); text('Dev ' + i, dx, dy);
    // connector + signal
    stroke('#90a4ae'); strokeWeight(1); line(dx, above ? dy + 15 : dy - 15, dx, medY);
    if (txing) { stroke(col); strokeWeight(3); line(dx, above ? dy + 15 : dy - 15, dx, medY); }
  }
  // token glow
  if (s.mode === 3) {
    const ti = (s.token - 1 + n) % n;
    const tx = lerp(medX0 + 30, medX1 - 30, n === 1 ? 0.5 : ti / (n - 1));
    noStroke(); fill(255, 215, 0, 180); circle(tx, medY, 24); fill('#bf6a00'); textAlign(CENTER, CENTER); textSize(9); text('token', tx, medY);
  }
  drawTimeline(s, margin, 270, canvasWidth - 2 * margin, 40);
  drawReadouts(s, margin, 330);
}

function drawCompare() {
  for (let m = 0; m < 4; m++) {
    const y = 40 + m * 104;
    noStroke(); fill('#37474f'); textAlign(LEFT, TOP); textSize(13); text(MODES[m], margin, y);
    drawTimeline(sims[m], margin, y + 20, canvasWidth - 2 * margin - 220, 26);
    // readouts inline
    const s = sims[m]; const rx = canvasWidth - 215;
    fill('#1b5e20'); textSize(11); textAlign(LEFT, TOP);
    text('thru ' + (throughput(s) * 100).toFixed(0) + '%', rx, y + 20);
    fill('#c62828'); text('coll ' + (s.slots ? (s.coll / s.slots * 100).toFixed(0) : 0) + '%', rx + 70, y + 20);
    fill('#1565c0'); text('fair ' + fairness(s).toFixed(2), rx + 140, y + 20);
  }
}

function drawTimeline(s, x, y, w, h) {
  noStroke(); fill('#263238'); textAlign(LEFT, BOTTOM); textSize(11);
  if (h > 30) text('Timeline (recent slots):', x, y - 2);
  const cells = 80; const cw = w / cells;
  for (let i = 0; i < s.history.length; i++) {
    const ev = s.history[i];
    fill(ev.kind === 'succ' ? GREEN : (ev.kind === 'coll' ? RED : GRAY));
    rect(x + i * cw, y, cw - 0.5, h);
  }
  stroke('#b0bec5'); noFill(); rect(x, y, w, h);
}

function drawReadouts(s, x, y) {
  noStroke(); textAlign(LEFT, TOP); textSize(14);
  fill('#1b5e20'); text('Throughput: ' + (throughput(s) * 100).toFixed(1) + '%', x, y);
  fill('#c62828'); text('Collision rate: ' + (s.slots ? (s.coll / s.slots * 100).toFixed(1) : 0) + '%', x + 220, y);
  fill('#1565c0'); text('Fairness (Jain): ' + fairness(s).toFixed(3), x + 460, y);
  fill('#546e7a'); textSize(12); text('Slots simulated: ' + s.slots, x, y + 26);
  const note = ['Devices transmit blindly — collisions are common.',
    'Sense before sending; detect collisions and back off exponentially.',
    'Sense + random backoff + ACK: fewer collisions, lower peak throughput.',
    'Only the token holder may send — no collisions, bounded access time.'][s.mode];
  fill('#37474f'); text(note, x, y + 46, canvasWidth - 2 * margin, 40);
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); if (devSlider) devSlider.size(canvasWidth - 150 - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
