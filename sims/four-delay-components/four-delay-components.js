// Anatomy of a Packet's Journey — The Four Delay Components
// CANVAS_HEIGHT: 600
// A packet crosses Sender → R1 → R2 → Receiver. Each stage is decomposed into
// transmission, propagation, queuing, and processing delay, accumulated into a
// stacked bar. Bloom levels: Understand, Apply, Analyze.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 430;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;
let sliderLeftMargin = 250;

// colors
const C_TRANS = '#F5A623', C_PROP = '#64b5f6', C_QUEUE = '#e53935', C_PROC = '#43a047';

let sizeSlider, rateSlider, distSlider, loadSlider;
let stepButton, playButton, resetButton, formulaButton, stressButton;
let showFormulas = false, stressTest = false;

const SPEED_LIGHT_FIBER = 2.0e8;   // m/s, ~2/3 c in fiber
const D_PROC = 20e-6;              // 20 µs processing per router

let stage = 0;        // 0..N stages
let isPlaying = false;
let stageProg = 0;    // 0..1 within current stage

// stage list: type + hop label
const stages = [
  { type: 'trans', from: 0, to: 1 }, { type: 'prop', from: 0, to: 1 }, { type: 'queue', at: 1 }, { type: 'proc', at: 1 },
  { type: 'trans', from: 1, to: 2 }, { type: 'prop', from: 1, to: 2 }, { type: 'queue', at: 2 }, { type: 'proc', at: 2 },
  { type: 'trans', from: 2, to: 3 }, { type: 'prop', from: 2, to: 3 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sizeSlider = createSlider(64, 9000, 1500, 1);
  rateSlider = createSlider(0, 100, 50, 1);          // log mapped
  distSlider = createSlider(1, 10000, 1000, 1);      // km
  loadSlider = createSlider(0, 95, 30, 1);           // percent
  [sizeSlider, rateSlider, distSlider, loadSlider].forEach((s, i) => {
    s.position(sliderLeftMargin, drawHeight + 10 + i * 30);
    s.size(canvasWidth - sliderLeftMargin - margin);
  });

  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 134); stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(80, drawHeight + 134); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 134); resetButton.mousePressed(doReset);
  formulaButton = createButton('Show formulas'); formulaButton.position(205, drawHeight + 134);
  formulaButton.mousePressed(() => { showFormulas = !showFormulas; formulaButton.html(showFormulas ? 'Hide formulas' : 'Show formulas'); });
  stressButton = createButton('Stress test'); stressButton.position(330, drawHeight + 134);
  stressButton.mousePressed(() => { stressTest = !stressTest; stressButton.html(stressTest ? 'Hide stress test' : 'Stress test'); });

  describe('A packet crossing three hops with the four delay components — ' +
    'transmission, propagation, queuing, and processing — shown at each stage ' +
    'and accumulated into a stacked latency bar.', LABEL);
}

function rate() { return 1e6 * Math.pow(10, rateSlider.value() / 100 * 5); }   // 1 Mbps .. 100 Gbps
function dTrans() { return (sizeSlider.value() * 8) / rate(); }
function dProp() { return (distSlider.value() * 1000) / SPEED_LIGHT_FIBER; }
function dQueue() { const u = loadSlider.value() / 100; return (u / (1 - u + 0.01)) * dTrans(); }

function totals() {
  return {
    trans: 3 * dTrans(), prop: 3 * dProp(), queue: 2 * dQueue(), proc: 2 * D_PROC
  };
}

function fmtTime(s) {
  if (s >= 1) return s.toFixed(3) + ' s';
  if (s >= 1e-3) return (s * 1e3).toFixed(2) + ' ms';
  return (s * 1e6).toFixed(1) + ' µs';
}
function fmtRate(r) {
  if (r >= 1e9) return (r / 1e9).toFixed(r >= 1e10 ? 0 : 1) + ' Gbps';
  if (r >= 1e6) return (r / 1e6).toFixed(0) + ' Mbps';
  return (r / 1e3).toFixed(0) + ' kbps';
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text("Anatomy of a Packet's Journey", canvasWidth / 2, 6);

  // advance
  if (isPlaying) {
    stageProg += 0.03;
    if (stageProg >= 1) { stageProg = 0; if (stage < stages.length) stage++; if (stage >= stages.length) { isPlaying = false; playButton.html('Play'); } }
  }

  const nodeY = 120;
  const xs = [margin + 40, canvasWidth * 0.37, canvasWidth * 0.66, canvasWidth - margin - 40];
  const names = ['Sender', 'Router 1', 'Router 2', 'Receiver'];

  // links + buffers + nodes
  for (let i = 0; i < 3; i++) { stroke('#90a4ae'); strokeWeight(3); line(xs[i], nodeY, xs[i + 1], nodeY); }
  drawCurrentStage(xs, nodeY);
  for (let i = 0; i < 4; i++) {
    noStroke(); fill(i === 0 ? C_TRANS : (i === 3 ? '#90a4ae' : SLATEc()));
    if (i === 0 || i === 3) { rectMode(CENTER); rect(xs[i], nodeY, 26, 26, 4); rectMode(CORNER); }
    else drawHex(xs[i], nodeY, 16);
    fill('#263238'); textAlign(CENTER, TOP); textSize(11); text(names[i], xs[i], nodeY + 20);
    if (i === 1 || i === 2) { // input buffer glyph
      const depth = floor(loadSlider.value() / 20);
      for (let q = 0; q < depth; q++) { fill(C_QUEUE); rect(xs[i] - 30 - q * 6, nodeY - 6, 5, 12); }
    }
  }

  // cumulative stacked bar
  drawCumulativeBar(nodeY + 80);

  // current values panel
  drawValues();

  if (stressTest) drawStressPlot();
  if (showFormulas) drawFormulas();

  // slider labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('Packet size: ' + sizeSlider.value() + ' B', 10, drawHeight + 20);
  text('Link rate: ' + fmtRate(rate()), 10, drawHeight + 50);
  text('Distance/hop: ' + distSlider.value() + ' km', 10, drawHeight + 80);
  text('Background load: ' + loadSlider.value() + '%', 10, drawHeight + 110);
}

function SLATEc() { return '#607d8b'; }
function drawHex(cx, cy, r) { fill(SLATEc()); noStroke(); beginShape(); for (let i = 0; i < 6; i++) { const a = PI / 6 + i * PI / 3; vertex(cx + r * cos(a), cy + r * sin(a)); } endShape(CLOSE); }

function drawCurrentStage(xs, nodeY) {
  if (stage >= stages.length) {
    noStroke(); fill('#1b5e20'); textAlign(CENTER, BOTTOM); textSize(14);
    text('✓ Packet delivered — total latency ' + fmtTime(sumTotals()), canvasWidth / 2, nodeY - 30);
    return;
  }
  const st = stages[stage];
  let lbl = '', col = '#000';
  if (st.type === 'trans') {
    col = C_TRANS; lbl = 'Transmission: pushing bits onto link';
    const x0 = xs[st.from], x1 = xs[st.to];
    stroke(C_TRANS); strokeWeight(8);
    line(x0, nodeY, lerp(x0, min(x1, x0 + (x1 - x0) * 0.5), stageProg), nodeY);
  } else if (st.type === 'prop') {
    col = C_PROP; lbl = 'Propagation: leading edge travels the wire';
    const x0 = xs[st.from], x1 = xs[st.to];
    noStroke(); fill(C_PROP); circle(lerp(x0, x1, stageProg), nodeY, 12);
  } else if (st.type === 'queue') {
    col = C_QUEUE; lbl = 'Queuing: waiting in the router buffer';
    noStroke(); fill(C_QUEUE); circle(xs[st.at] - 30, nodeY, 12);
  } else {
    col = C_PROC; lbl = 'Processing: header inspection + forwarding lookup';
    push(); translate(xs[st.at], nodeY - 26); rotate(frameCount * 0.2);
    stroke(C_PROC); strokeWeight(3); noFill(); arc(0, 0, 16, 16, 0, PI + QUARTER_PI); pop();
  }
  noStroke(); fill(col); textAlign(CENTER, BOTTOM); textSize(14);
  text('Stage ' + (stage + 1) + '/' + stages.length + ': ' + lbl, canvasWidth / 2, nodeY - 30);
}

function sumTotals() { const t = totals(); return t.trans + t.prop + t.queue + t.proc; }

function drawCumulativeBar(y) {
  const t = totals(); const total = t.trans + t.prop + t.queue + t.proc;
  const segs = [
    { v: t.trans, c: C_TRANS, n: 'Transmission' },
    { v: t.prop, c: C_PROP, n: 'Propagation' },
    { v: t.queue, c: C_QUEUE, n: 'Queuing' },
    { v: t.proc, c: C_PROC, n: 'Processing' }
  ];
  const barW = canvasWidth - 2 * margin;
  noStroke(); fill('#263238'); textAlign(LEFT, BOTTOM); textSize(13);
  text('End-to-end latency = ' + fmtTime(total), margin, y - 6);
  let x = margin;
  for (const s of segs) {
    const w = (s.v / total) * barW;
    fill(s.c); rect(x, y, w, 30);
    if (w > 60) { fill('white'); textAlign(CENTER, CENTER); textSize(11); text(s.n + '\n' + fmtTime(s.v), x + w / 2, y + 15); }
    x += w;
  }
  // legend
  let lx = margin, ly = y + 40; textAlign(LEFT, CENTER); textSize(11);
  for (const s of segs) { fill(s.c); rect(lx, ly - 6, 12, 12); fill('#37474f'); text(s.n, lx + 16, ly); lx += 130; }
}

function drawValues() {
  const t = totals();
  noStroke(); textAlign(RIGHT, TOP); textSize(11); fill('#546e7a');
  text('per hop: d_trans=' + fmtTime(dTrans()) + '  d_prop=' + fmtTime(dProp()) +
       '  d_queue=' + fmtTime(dQueue()) + '  d_proc=' + fmtTime(D_PROC),
       canvasWidth - margin, 36);
}

function drawFormulas() {
  const lines = [
    'd_trans = packet_bits / link_rate',
    'd_prop  = distance / signal_speed',
    'd_queue = (ρ / (1-ρ)) · d_trans   (ρ = load)',
    'd_proc  ≈ constant per router'
  ];
  const w = 330, x = canvasWidth - w - margin, y = 60;
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 245); rect(x, y, w, 18 + lines.length * 16, 8);
  noStroke(); fill('#263238'); textFont('monospace'); textAlign(LEFT, TOP); textSize(12);
  for (let i = 0; i < lines.length; i++) text(lines[i], x + 10, y + 8 + i * 16);
  textFont('Arial');
}

function drawStressPlot() {
  const w = 250, h = 130, x = margin, y = 56;
  stroke('#b0bec5'); fill(255, 255, 255, 245); rect(x, y, w, h, 6);
  noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(11);
  text('End-to-end latency vs. load', x + 8, y + 4);
  const base = 3 * dTrans() + 3 * dProp() + 2 * D_PROC;
  // plot
  stroke('#90a4ae'); strokeWeight(1); line(x + 30, y + h - 16, x + w - 8, y + h - 16); line(x + 30, y + 22, x + 30, y + h - 16);
  noFill(); stroke(C_QUEUE); strokeWeight(2); beginShape();
  let maxL = base + 2 * (0.95 / 0.05) * dTrans();
  for (let i = 0; i <= 60; i++) {
    const u = i / 60 * 0.96;
    const lat = base + 2 * (u / (1 - u + 0.01)) * dTrans();
    const px = lerp(x + 30, x + w - 8, u / 0.96);
    const py = lerp(y + h - 16, y + 22, constrain(lat / maxL, 0, 1));
    vertex(px, py);
  }
  endShape();
  noStroke(); fill('#607d8b'); textSize(9); textAlign(CENTER, TOP);
  text('load → 100%', x + w / 2, y + h - 14);
}

function doStep() { isPlaying = false; playButton.html('Play'); stageProg = 0; if (stage < stages.length) stage++; }
function togglePlay() { if (stage >= stages.length) doReset(); isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }
function doReset() { stage = 0; stageProg = 0; isPlaying = false; playButton.html('Play'); }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  [sizeSlider, rateSlider, distSlider, loadSlider].forEach(s => s.size(canvasWidth - sliderLeftMargin - margin));
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
