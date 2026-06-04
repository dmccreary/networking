// Wireless Performance vs. Distance (Link Adaptation)
// CANVAS_HEIGHT: 600
// Drag the client away from the AP and watch link adaptation step the Wi-Fi
// modulation (MCS) down as SNR falls. Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a';
const CH_WIDTH_MHZ = 80;

// MCS tables per Wi-Fi generation: {name, minSNR(dB), bits/symbol, code}
const MCS_BASE = [
  { name: 'BPSK', snr: 4, bps: 1, code: 0.5 },
  { name: 'QPSK', snr: 8, bps: 2, code: 0.5 },
  { name: '16-QAM', snr: 14, bps: 4, code: 0.5 },
  { name: '64-QAM', snr: 22, bps: 6, code: 0.75 }
];
const MCS = {
  'Wi-Fi 5': MCS_BASE.concat([{ name: '256-QAM', snr: 28, bps: 8, code: 0.83 }]),
  'Wi-Fi 6': MCS_BASE.concat([{ name: '256-QAM', snr: 28, bps: 8, code: 0.83 }, { name: '1024-QAM', snr: 33, bps: 10, code: 0.83 }]),
  'Wi-Fi 7': MCS_BASE.concat([{ name: '256-QAM', snr: 28, bps: 8, code: 0.83 }, { name: '1024-QAM', snr: 33, bps: 10, code: 0.83 }, { name: '4096-QAM', snr: 38, bps: 12, code: 0.83 }])
};

let client = { x: 0, init: false };
let dragging = false;
let walls = 0, neighborAPs = 0;
let interSlider, genSelect, wallBtn, neighborBtn, shannonBtn, resetBtn;
let showShannon = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  interSlider = createSlider(0, 20, 0, 1); interSlider.position(200, drawHeight + 10); interSlider.size(canvasWidth - 200 - margin);
  genSelect = createSelect(); genSelect.position(120, drawHeight + 44); Object.keys(MCS).forEach(o => genSelect.option(o)); genSelect.selected('Wi-Fi 6');
  wallBtn = createButton('Add wall'); wallBtn.position(260, drawHeight + 44); wallBtn.mousePressed(() => walls = (walls + 1) % 4);
  neighborBtn = createButton('Add neighbor AP'); neighborBtn.position(340, drawHeight + 44); neighborBtn.mousePressed(() => neighborAPs++);
  shannonBtn = createButton('Show Shannon limit'); shannonBtn.position(485, drawHeight + 44); shannonBtn.mousePressed(() => { showShannon = !showShannon; shannonBtn.html(showShannon ? 'Hide Shannon limit' : 'Show Shannon limit'); });
  resetBtn = createButton('Reset'); resetBtn.position(640, drawHeight + 44); resetBtn.mousePressed(() => { walls = 0; neighborAPs = 0; interSlider.value(0); });
  describe('A Wi-Fi link-adaptation lab: dragging the client from the access ' +
    'point lowers SNR, stepping modulation down through a staircase of MCS ' +
    'levels, with a live constellation diagram and optional Shannon-limit curve.', LABEL);
}

function planGeom() { return { x: margin + 40, y: 70, w: canvasWidth - 2 * margin - 60, h: 70 }; }
function snrAtDist(dpx, totalW) {
  const distM = (dpx / totalW) * 50;       // map px to up to ~50 m
  const txP = 30;
  const pl = 40 + 20 * Math.log10(max(distM, 1));   // path loss dB
  const interf = interSlider.value() + neighborAPs * 4;
  return txP - pl - walls * 6 - interf + 60;          // calibrated to land in usable dB
}
function pickMCS(snr, gen) { const t = MCS[gen]; let m = null; for (const r of t) if (snr >= r.snr) m = r; return m; }
function rateOf(m) { return m ? m.bps * m.code * CH_WIDTH_MHZ : 0; }   // Mbps (schematic)

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const g = planGeom();
  if (!client.init) { client.x = g.x + g.w * 0.45; client.init = true; }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Wireless Link Adaptation', canvasWidth / 2, 8);

  const gen = genSelect.value();
  const distPx = client.x - g.x;
  const snr = snrAtDist(distPx, g.w);
  const mcs = pickMCS(snr, gen);
  const rate = rateOf(mcs);

  // floor plan
  noStroke(); fill('#eceff1'); rect(g.x, g.y, g.w, g.h); noFill(); stroke('#90a4ae'); rect(g.x, g.y, g.w, g.h);
  // AP
  noStroke(); fill(AMBER); rectMode(CENTER); rect(g.x, g.y + g.h / 2, 30, 36, 5); rectMode(CORNER);
  stroke('#c77f12'); strokeWeight(2); line(g.x, g.y + g.h / 2 - 18, g.x, g.y + g.h / 2 - 28); noStroke(); fill('#c77f12'); circle(g.x, g.y + g.h / 2 - 29, 5);
  noStroke(); fill('#3e2723'); textAlign(CENTER, TOP); textSize(10); text('AP', g.x, g.y + g.h / 2 + 20);
  // walls
  for (let i = 0; i < walls; i++) { const wx = g.x + g.w * (0.25 + i * 0.18); stroke('#9e9e9e'); strokeWeight(7); line(wx, g.y, wx, g.y + g.h); }
  // link line + SNR
  stroke(SLATE); strokeWeight(2); line(g.x, g.y + g.h / 2, client.x, g.y + g.h / 2);
  noStroke(); fill('#37474f'); textAlign(CENTER, BOTTOM); textSize(12); text('SNR ' + snr.toFixed(1) + ' dB', (g.x + client.x) / 2, g.y + g.h / 2 - 6);
  // client
  fill('#eceff1'); stroke('#37474f'); strokeWeight(2); rectMode(CENTER); rect(client.x, g.y + g.h / 2, 30, 20, 3); rectMode(CORNER);
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(9); text('drag me', client.x, g.y + g.h / 2 + 12);

  drawMCSPlot(g, gen, distPx, rate);
  drawConstellation(mcs, snr);
  drawReadout(snr, mcs, rate, gen);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Interference: +' + interSlider.value() + ' dB', 10, drawHeight + 20);
  fill('#455a64'); textSize(12); text('Generation:', 35, drawHeight + 54);
}

function drawMCSPlot(g, gen, curDistPx, curRate) {
  const px = margin, py = 175, pw = canvasWidth - 2 * margin - 200, ph = 150;
  noStroke(); fill('#fbfbfb'); stroke('#b0bec5'); rect(px, py, pw, ph);
  noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(12); text('Data rate vs. distance (MCS staircase)', px + 6, py + 4);
  // axes
  stroke('#cfd8dc'); line(px + 36, py + ph - 18, px + pw - 8, py + ph - 18); line(px + 36, py + 22, px + 36, py + ph - 18);
  const maxRate = rateOf(MCS[gen][MCS[gen].length - 1]) * 1.1;
  const x0 = px + 36, x1 = px + pw - 8;
  // staircase
  stroke(AMBER); strokeWeight(2.5); noFill(); beginShape();
  for (let i = 0; i <= 80; i++) { const dpx = (i / 80) * g.w; const s = snrAtDist(dpx, g.w); const m = pickMCS(s, gen); const r = rateOf(m); vertex(lerp(x0, x1, i / 80), lerp(py + ph - 18, py + 22, constrain(r / maxRate, 0, 1))); }
  endShape();
  // Shannon
  if (showShannon) {
    stroke('#1565c0'); strokeWeight(1.5); drawingContext.setLineDash([5, 4]); noFill(); beginShape();
    for (let i = 0; i <= 80; i++) { const dpx = (i / 80) * g.w; const s = snrAtDist(dpx, g.w); const cap = CH_WIDTH_MHZ * Math.log2(1 + Math.pow(10, s / 10)); vertex(lerp(x0, x1, i / 80), lerp(py + ph - 18, py + 22, constrain(cap / maxRate, 0, 1))); }
    endShape(); drawingContext.setLineDash([]);
    noStroke(); fill('#1565c0'); textSize(9); text('Shannon limit', x1 - 70, py + 24);
  }
  // current distance marker
  const cm = lerp(x0, x1, constrain(curDistPx / g.w, 0, 1));
  stroke('#e53935'); strokeWeight(2); line(cm, py + 22, cm, py + ph - 18);
  noStroke(); fill('#607d8b'); textSize(9); textAlign(CENTER, TOP); text('distance →', px + pw / 2, py + ph - 14);
  textAlign(LEFT, BOTTOM); text('Mbps', px + 4, py + 34);
}

function drawConstellation(mcs, snr) {
  const sz = 150, x = canvasWidth - sz - margin, y = 175;
  noStroke(); fill('#263238'); rect(x, y, sz, sz, 4);
  noStroke(); fill('#cfd8dc'); textAlign(LEFT, TOP); textSize(10); text((mcs ? mcs.name : 'no link') + ' constellation', x + 4, y + 2);
  if (!mcs) { fill('#e53935'); textAlign(CENTER, CENTER); textSize(13); text('SNR too low\nno connection', x + sz / 2, y + sz / 2); return; }
  const M = Math.pow(2, mcs.bps); const side = Math.round(Math.sqrt(M));
  const pad = 24, cell = (sz - 2 * pad) / max(1, side - 1);
  const spread = constrain(2.0 / Math.sqrt(Math.pow(10, snr / 10)), 0.02, cell * 0.5);
  for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) {
    const cx = x + pad + c * cell, cy = y + pad + r * cell;
    for (let k = 0; k < 5; k++) { fill('#90caf9'); circle(cx + randomGaussian() * spread * cell, cy + randomGaussian() * spread * cell, 2); }
    fill(AMBER); circle(cx, cy, 3.5);
  }
}

function drawReadout(snr, mcs, rate, gen) {
  noStroke(); textAlign(LEFT, TOP); textSize(14);
  fill('#263238'); text('Generation: ' + gen, margin, 340);
  fill('#1b5e20'); text('Active MCS: ' + (mcs ? mcs.name + '  (' + mcs.bps + ' b/sym, code ' + mcs.code + ')' : 'none'), margin, 360);
  fill('#1565c0'); text('Effective rate ≈ ' + rate.toFixed(0) + ' Mbps', margin, 380);
  fill('#546e7a'); textSize(12); text('Walls: ' + walls + '   Neighbor APs (co-channel): ' + neighborAPs, margin, 402);
}

function mousePressed() { const g = planGeom(); if (abs(mouseX - client.x) < 22 && abs(mouseY - (g.y + g.h / 2)) < 20) dragging = true; }
function mouseDragged() { if (dragging) { const g = planGeom(); client.x = constrain(mouseX, g.x + 6, g.x + g.w); } }
function mouseReleased() { dragging = false; }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); interSlider.size(canvasWidth - 200 - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
