// TLS 1.3 Handshake Walkthrough
// CANVAS_HEIGHT: 658
// Step through the TLS 1.3 handshake messages and the keys derived at each
// stage, with TLS 1.2 comparison, 0-RTT mode, and a compromised-CA failure.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 560;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a', GREEN = '#2e7d32', RED = '#e53935';

let step = 0, isPlaying = false, frameAcc = 0;
let compare12 = false, zeroRTT = false, badCA = false;
let stepButton, playButton, resetButton, cmpBtn, zeroBtn, caBtn;

// TLS 1.3 message flights
function flow13() {
  const f = [];
  if (zeroRTT) f.push({ dir: 'cs', t: 'ClientHello + early_data', info: 'key_share, PSK from ticket; 0-RTT app data', lock: true, key: 'Early Secret → 0-RTT keys' });
  else f.push({ dir: 'cs', t: 'ClientHello', info: 'supported_versions, cipher_suites, key_share, client_random', key: 'client_random recorded' });
  f.push({ dir: 'sc', t: 'ServerHello', info: 'key_share, server_random', key: '(EC)DHE shared secret → Handshake Secret' });
  f.push({ dir: 'sc', t: '{Certificate, CertificateVerify, Finished}', info: 'encrypted with handshake keys', lock: true, verify: true, key: 'handshake keys active' });
  f.push({ dir: 'cs', t: '{Finished}', info: 'encrypted; client verified server', lock: true, key: 'Master Secret → application keys' });
  f.push({ dir: 'both', t: 'Application Data', info: 'encrypted with application keys', lock: true });
  return f;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 8); stepButton.mousePressed(() => { isPlaying = false; playButton.html('Play'); const L = flow13(); if (step < L.length) step++; });
  playButton = createButton('Play'); playButton.position(80, drawHeight + 8); playButton.mousePressed(() => { if (step >= flow13().length) step = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); });
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 8); resetButton.mousePressed(() => { step = 0; isPlaying = false; playButton.html('Play'); });
  cmpBtn = createButton('Show TLS 1.2'); cmpBtn.position(205, drawHeight + 8); cmpBtn.mousePressed(() => { compare12 = !compare12; cmpBtn.html(compare12 ? 'Hide TLS 1.2' : 'Show TLS 1.2'); });
  zeroBtn = createButton('0-RTT: OFF'); zeroBtn.position(10, drawHeight + 46); zeroBtn.mousePressed(() => { zeroRTT = !zeroRTT; zeroBtn.html('0-RTT: ' + (zeroRTT ? 'ON' : 'OFF')); step = 0; });
  caBtn = createButton('Compromised CA: OFF'); caBtn.position(120, drawHeight + 46); caBtn.mousePressed(() => { badCA = !badCA; caBtn.html('Compromised CA: ' + (badCA ? 'ON' : 'OFF')); step = 0; });
  describe('A step-by-step TLS 1.3 handshake between client and server with a ' +
    'key-derivation panel, plus toggles for TLS 1.2 comparison, 0-RTT, and a ' +
    'compromised certificate authority.', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const L = flow13();
  if (isPlaying) { frameAcc++; if (frameAcc > 42) { frameAcc = 0; if (step < L.length) step++; else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('TLS 1.3 Handshake Walkthrough' + (zeroRTT ? '  (0-RTT)' : ''), canvasWidth / 2, 6);

  const areaW = compare12 ? canvasWidth * 0.62 : canvasWidth;
  drawHandshake(L, margin, areaW - margin);
  drawKeyPanel(L, areaW, canvasWidth - margin);
  if (compare12) drawTls12(areaW + 4, canvasWidth);

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Step ' + min(step, L.length) + ' / ' + L.length, 320, drawHeight + 56);
}

function drawHandshake(L, x0, x1) {
  const cx = lerp(x0, x1, 0.22), sx = lerp(x0, x1, 0.78);
  const top = 70, bottom = drawHeight - 24;
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(14); text('Client', cx, 42); text('Server', sx, 42);
  stroke('#90a4ae'); strokeWeight(2); line(cx, top, cx, bottom); line(sx, top, sx, bottom);
  const rowH = (bottom - top - 10) / L.length;
  for (let i = 0; i < min(step, L.length); i++) {
    const m = L[i]; const y = top + 16 + i * rowH;
    const verifyFail = m.verify && badCA;
    drawMsg(m, cx, sx, y, verifyFail);
    if (verifyFail) { noStroke(); fill(RED); textAlign(CENTER, TOP); textSize(13); text('✗ Certificate from unknown/compromised CA — handshake ABORTED', (cx + sx) / 2, y + 22); break; }
  }
}

function drawMsg(m, cx, sx, y, fail) {
  if (m.dir === 'both') {
    stroke(GREEN); strokeWeight(2); line(cx, y, sx, y); fill(GREEN); noStroke(); triangle(sx, y, sx - 9, y - 4, sx - 9, y + 4); triangle(cx, y + 6, cx + 9, y + 2, cx + 9, y + 10);
  } else {
    const fromX = m.dir === 'cs' ? cx : sx, toX = m.dir === 'cs' ? sx : cx;
    stroke(fail ? RED : (m.dir === 'cs' ? AMBER : SLATE)); strokeWeight(2);
    line(fromX, y, toX, y + 8);
    noStroke(); fill(fail ? RED : (m.dir === 'cs' ? AMBER : SLATE)); const dir = m.dir === 'cs' ? 1 : -1; triangle(toX, y + 8, toX - dir * 9, y + 4, toX - dir * 9, y + 12);
  }
  noStroke(); fill('#263238'); textAlign(CENTER, BOTTOM); textSize(12);
  text((m.lock ? '🔒 ' : '') + m.t, (cx + sx) / 2, y - 1);
  fill('#607d8b'); textSize(9.5); textAlign(CENTER, TOP); text(m.info, (cx + sx) / 2, y + 10, abs(sx - cx) - 10, 22);
}

function drawKeyPanel(L, x0, x1) {
  const px = (x0 + x1) / 2 - 70, py = drawHeight - 150, pw = 150, ph = 130;
  // Show accumulating derived keys based on step
  noStroke(); fill('#37474f'); textAlign(CENTER, BOTTOM); textSize(11);
  const keys = [];
  for (let i = 0; i < min(step, L.length); i++) if (L[i].key) keys.push(L[i].key);
  // panel near center-bottom of handshake area
  const cxw = lerp(x0, x1, 0.5);
  noStroke(); fill(255, 255, 255, 235); stroke('#b0bec5'); rect(cxw - 110, 70, 220, 96, 6);
  noStroke(); fill('#1565c0'); textAlign(CENTER, TOP); textSize(11); text('Key derivation', cxw, 74);
  fill('#263238'); textAlign(LEFT, TOP); textSize(9.5);
  for (let i = 0; i < keys.length; i++) text('• ' + keys[i], cxw - 102, 92 + i * 14, 200, 14);
}

function drawTls12(x0, x1) {
  stroke('#cfd8dc'); strokeWeight(1); line(x0, 40, x0, drawHeight - 20);
  noStroke(); fill('#6a1b9a'); textAlign(CENTER, TOP); textSize(13); text('TLS 1.2 (2-RTT)', (x0 + x1) / 2, 44);
  const cx = lerp(x0, x1, 0.3), sx = lerp(x0, x1, 0.78);
  stroke('#90a4ae'); strokeWeight(1.5); line(cx, 70, cx, drawHeight - 30); line(sx, 70, sx, drawHeight - 30);
  const msgs = ['ClientHello', 'ServerHello,Cert,Done', 'ClientKeyExch,CCS,Fin', 'CCS, Finished', 'Application Data'];
  const dirs = ['cs', 'sc', 'cs', 'sc', 'both'];
  for (let i = 0; i < msgs.length; i++) {
    const y = 90 + i * 70;
    const fromX = dirs[i] === 'sc' ? sx : cx, toX = dirs[i] === 'sc' ? cx : sx;
    stroke(dirs[i] === 'sc' ? SLATE : AMBER); strokeWeight(1.5); line(fromX, y, toX, y + 6);
    noStroke(); fill('#263238'); textAlign(CENTER, BOTTOM); textSize(9); text(msgs[i], (cx + sx) / 2, y - 1);
  }
  noStroke(); fill('#6a1b9a'); textAlign(CENTER, TOP); textSize(10); text('2 round trips before data', (x0 + x1) / 2, drawHeight - 28);
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
