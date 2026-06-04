// Signal Quality Across Distance (BER vs. Distance)
// CANVAS_HEIGHT: 585
// Shows how attenuation, noise, interference, and modulation order combine to
// produce bit errors. Bloom levels: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 440;
let controlHeight = 145;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;
let sliderLeftMargin = 230;

const AMBER = '#F5A623', SLATE = '#546e7a';
const ALPHA_DB_PER_KM = 0.22;

let distSlider, powerSlider, noiseSlider;
let interSelect, modSelect, fecButton, shannonButton;
let useFEC = false, showShannon = false;

const MODS = { 'NRZ (1 b/sym)': 1, '4-QAM (2 b/sym)': 2, '16-QAM (4 b/sym)': 4, '64-QAM (6 b/sym)': 6 };
let errorFlags = [];     // per displayed bit
let refreshCounter = 0;
const N_BITS = 40;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  distSlider = createSlider(0, 100, 20, 1);
  powerSlider = createSlider(0, 30, 15, 1);
  noiseSlider = createSlider(-100, -30, -85, 1);
  [distSlider, powerSlider, noiseSlider].forEach((s, i) => {
    s.position(sliderLeftMargin, drawHeight + 10 + i * 28);
    s.size(canvasWidth - sliderLeftMargin - margin);
  });

  interSelect = createSelect(); interSelect.position(70, drawHeight + 102);
  ['off', 'low', 'high'].forEach(o => interSelect.option(o));
  modSelect = createSelect(); modSelect.position(270, drawHeight + 102);
  Object.keys(MODS).forEach(o => modSelect.option(o));

  fecButton = createButton('FEC: off'); fecButton.position(480, drawHeight + 102);
  fecButton.mousePressed(() => { useFEC = !useFEC; fecButton.html(useFEC ? 'FEC: on' : 'FEC: off'); });
  shannonButton = createButton('Show Shannon'); shannonButton.position(560, drawHeight + 102);
  shannonButton.mousePressed(() => { showShannon = !showShannon; shannonButton.html(showShannon ? 'Hide Shannon' : 'Show Shannon'); });

  describe('A signal-quality lab: as distance, transmit power, noise floor, ' +
    'interference, and modulation order change, the receiver waveform degrades ' +
    'and the bit-error rate is computed live.', LABEL);
}

function metrics() {
  const dist = distSlider.value(), tx = powerSlider.value(), nf = noiseSlider.value();
  const interAdd = { off: 0, low: 6, high: 14 }[interSelect ? interSelect.value() : 'off'];
  const prx = tx - ALPHA_DB_PER_KM * dist;       // dBm
  const snrDb = prx - (nf + interAdd);
  const snrLin = Math.max(0.0001, Math.pow(10, snrDb / 10));
  const bps = MODS[modSelect ? modSelect.value() : 'NRZ (1 b/sym)'];
  const M = Math.pow(2, bps);
  let ber = 0.5 * Math.exp(-snrLin / M);
  ber = constrain(ber, 1e-9, 0.5);
  const berEff = useFEC && ber < 0.1 ? ber * ber * 4 : ber;   // FEC sharply cuts low BER
  const bandwidthHz = 10e6;
  const capacity = bandwidthHz * Math.log2(1 + snrLin);       // bps
  const rate = bps * bandwidthHz;                              // bps achieved
  return { dist, tx, nf, interAdd, prx, snrDb, snrLin, bps, M, ber, berEff, capacity, rate, ampFrac: constrain(Math.pow(10, (prx - tx) / 20), 0.05, 1) };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const m = metrics();
  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Signal Quality Across Distance', canvasWidth / 2, 6);

  // refresh error pattern periodically
  refreshCounter++;
  if (refreshCounter > 18 || errorFlags.length !== N_BITS) {
    refreshCounter = 0; errorFlags = [];
    for (let i = 0; i < N_BITS; i++) {
      let err = random() < m.berEff;
      let corrected = false;
      if (err && useFEC && m.ber < 0.1) { corrected = true; }
      errorFlags.push(corrected ? 'corrected' : (err ? 'error' : 'ok'));
    }
  }

  drawScope(margin, 40, canvasWidth - 2 * margin, 130, m);
  drawConstellation(canvasWidth - 170 - margin, 184, 150, m);
  drawChannel(margin, 184, canvasWidth - 200 - 2 * margin, 90, m);
  drawBitStrip(margin, 300, canvasWidth - 2 * margin, m);
  drawReadout(margin, 348, m);

  // slider labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('Distance: ' + m.dist + ' km', 10, drawHeight + 20);
  text('Transmit power: ' + m.tx + ' dBm', 10, drawHeight + 48);
  text('Noise floor: ' + m.nf + ' dBm', 10, drawHeight + 76);
  textSize(12); fill('#455a64');
  text('Interference:', 10, drawHeight + 110);
  text('Modulation:', 200, drawHeight + 110);
}

function drawScope(x, y, w, h, m) {
  noStroke(); fill('#263238'); rect(x, y, w, h, 4);
  const senderY = y + h * 0.28, recvY = y + h * 0.72, amp = h * 0.16;
  const bits = '10110100101101';
  const bw = w / bits.length;
  // sender clean
  stroke(AMBER); strokeWeight(2); noFill(); beginShape();
  for (let i = 0; i < bits.length; i++) { const lvl = bits[i] === '1' ? senderY - amp : senderY + amp; vertex(x + i * bw, lvl); vertex(x + (i + 1) * bw, lvl); }
  endShape();
  // receiver degraded (amplitude scaled + noise)
  stroke(SLATE); strokeWeight(2); noFill(); beginShape();
  for (let i = 0; i < bits.length; i++) {
    const base = bits[i] === '1' ? -1 : 1;
    const n1 = randomGaussian() * amp * (1 - m.ampFrac) * 0.6;
    vertex(x + i * bw, recvY + base * amp * m.ampFrac + n1);
    vertex(x + (i + 1) * bw, recvY + base * amp * m.ampFrac + randomGaussian() * amp * (1 - m.ampFrac) * 0.6);
  }
  endShape();
  // decision threshold
  stroke('white'); strokeWeight(1); drawDashed(x, recvY, x + w, recvY);
  noStroke(); fill('#cfd8dc'); textAlign(LEFT, TOP); textSize(11);
  text('Sender (clean)', x + 6, y + 4); text('Receiver (degraded) + decision threshold', x + 6, y + h * 0.55);
}

function drawConstellation(x, y, sz, m) {
  noStroke(); fill('#263238'); rect(x, y, sz, sz, 4);
  noStroke(); fill('#cfd8dc'); textAlign(LEFT, TOP); textSize(10); text(modSelect.value().split(' ')[0] + ' constellation', x + 4, y + 2);
  const side = Math.sqrt(m.M);
  const pad = 22, cell = (sz - 2 * pad) / Math.max(1, side - 1);
  const spread = constrain(1.5 / Math.sqrt(m.snrLin), 0.02, cell * 0.45);
  for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) {
    const cx = x + pad + c * cell, cy = y + pad + r * cell;
    for (let k = 0; k < 6; k++) { fill('#90caf9'); circle(cx + randomGaussian() * spread * cell * 0.5, cy + randomGaussian() * spread * cell * 0.5, 2); }
    fill(AMBER); circle(cx, cy, 4);
  }
}

function drawChannel(x, y, w, h, m) {
  noStroke(); fill('#eceff1'); rect(x, y, w, h, 4);
  noStroke(); fill('#37474f'); textAlign(LEFT, TOP); textSize(11); text('Signal amplitude vs. distance (attenuation + noise floor)', x + 4, y + 2);
  // amplitude curve
  stroke(AMBER); strokeWeight(2); noFill(); beginShape();
  for (let i = 0; i <= 60; i++) { const d = i / 60 * 100; const a = Math.pow(10, (-ALPHA_DB_PER_KM * d) / 20); vertex(x + (i / 60) * w, y + h - 16 - a * (h - 26)); }
  endShape();
  // noise floor scatter
  stroke(SLATE); strokeWeight(1);
  const floorY = y + h - 16 - constrain((m.nf + 100) / 70, 0, 1) * (h - 26) * 0.3;
  for (let i = 0; i < 60; i++) { const px = x + random(w); point(px, floorY + randomGaussian() * 3); }
  // current distance marker
  stroke('#e53935'); strokeWeight(2); const mx = x + (m.dist / 100) * w; line(mx, y + 16, mx, y + h);
  noStroke(); fill('#e53935'); textAlign(CENTER, TOP); textSize(9); text(m.dist + ' km', mx, y + h - 12);
}

function drawBitStrip(x, y, w, m) {
  noStroke(); fill('#263238'); textAlign(LEFT, BOTTOM); textSize(12); text('Received bits:', x, y - 2);
  const bw = (w) / N_BITS;
  for (let i = 0; i < N_BITS; i++) {
    const f = errorFlags[i] || 'ok';
    fill(f === 'ok' ? '#43a047' : (f === 'corrected' ? '#fdd835' : '#e53935'));
    rect(x + i * bw + 1, y, bw - 2, 22, 2);
  }
  noStroke(); textAlign(LEFT, CENTER); textSize(11);
  fill('#43a047'); text('■ ok', x, y + 34); fill('#e53935'); text('■ error', x + 60, y + 34);
  if (useFEC) { fill('#f9a825'); text('■ FEC-corrected', x + 130, y + 34); }
}

function drawReadout(x, y, m) {
  noStroke(); textAlign(LEFT, TOP); textSize(13);
  const berStr = m.berEff < 1e-4 ? m.berEff.toExponential(1) : m.berEff.toFixed(4);
  fill(m.berEff > 0.01 ? '#c62828' : '#1b5e20');
  text('SNR: ' + m.snrDb.toFixed(1) + ' dB     BER: ' + berStr + (useFEC ? '  (with FEC)' : ''), x, y + 40);
  fill('#37474f'); textSize(12);
  text('Received power: ' + m.prx.toFixed(1) + ' dBm', x, y + 60);
  if (showShannon) {
    fill('#1565c0'); textSize(12);
    text('Shannon capacity ≈ ' + (m.capacity / 1e6).toFixed(1) + ' Mbps   ·   achieved ≈ ' + (m.rate / 1e6).toFixed(0) + ' Mbps (' + m.bps + ' b/sym)', x, y + 80);
  }
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 8); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); [distSlider, powerSlider, noiseSlider].forEach(s => s.size(canvasWidth - sliderLeftMargin - margin)); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
