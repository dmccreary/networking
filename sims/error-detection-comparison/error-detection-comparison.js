// Error Detection in Action
// CANVAS_HEIGHT: 572
// Flip bits in a received frame and see which of parity, the 16-bit Internet
// checksum, and CRC-32 catch the error. Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 452;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a';
const NBITS = 32;
let sent = [];          // original bits
let recv = [];          // editable received bits
let burstMode = false;
let burstButton;
let injBtns = [];
// stats: caught/tested per code
let stats = { parity: [0, 0], checksum: [0, 0], crc: [0, 0] };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  // fixed data pattern 0xA3C50F69
  const hex = 0xA3C50F69;
  for (let i = 0; i < NBITS; i++) sent[i] = (hex >>> (NBITS - 1 - i)) & 1;
  recv = sent.slice();

  let x = 10;
  [1, 2, 4, 8].forEach(n => {
    const b = createButton('Inject ' + n);
    b.position(x, drawHeight + 10); b.mousePressed(() => injectErrors(n));
    injBtns.push(b); x += 78;
  });
  burstButton = createButton('Burst error (5)');
  burstButton.position(x + 6, drawHeight + 10); burstButton.mousePressed(injectBurst);
  const resetB = createButton('Reset frame');
  resetB.position(x + 120, drawHeight + 10); resetB.mousePressed(() => { recv = sent.slice(); });

  describe('A 32-bit frame with three trailing error-detection fields — ' +
    'parity, the 16-bit Internet checksum, and CRC-32. Flipping bits in the ' +
    'received copy shows which codes detect the error.', LABEL);
}

// ---- code computations ----
function bitsToBytes(b) {
  const bytes = [];
  for (let i = 0; i < 4; i++) { let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | b[i * 8 + j]; bytes.push(v); }
  return bytes;
}
function parityOf(b) { return b.reduce((a, x) => a ^ x, 0); }
function checksum16(b) {
  const w0 = parseInt(b.slice(0, 16).join(''), 2);
  const w1 = parseInt(b.slice(16, 32).join(''), 2);
  let s = w0 + w1;
  s = (s & 0xffff) + (s >>> 16);
  return (~s) & 0xffff;
}
function crc32(b) {
  const bytes = bitsToBytes(b);
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc & 1) ? ((crc >>> 1) ^ 0xEDB88320) : (crc >>> 1);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function injectErrors(n) {
  recv = sent.slice();
  const idx = [];
  while (idx.length < n) { const r = floor(random(NBITS)); if (!idx.includes(r)) idx.push(r); }
  for (const i of idx) recv[i] ^= 1;
  tally();
}
function injectBurst() {
  recv = sent.slice();
  const start = floor(random(NBITS - 5));
  for (let i = start; i < start + 5; i++) recv[i] ^= 1;
  tally();
}
function tally() {
  // count whether each code catches this (non-identical) case
  if (recv.join('') === sent.join('')) return;
  const checks = currentChecks();
  ['parity', 'checksum', 'crc'].forEach(k => { stats[k][1]++; if (!checks[k]) stats[k][0]++; });
}
function currentChecks() {
  return {
    parity: parityOf(recv) === parityOf(sent),
    checksum: checksum16(recv) === checksum16(sent),
    crc: crc32(recv) === crc32(sent)
  };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Error Detection in Action', canvasWidth / 2, 6);

  const bw = (canvasWidth - 2 * margin) / NBITS;
  const sentY = 70, recvY = 170, sq = min(bw - 2, 24);

  // sent frame
  noStroke(); fill('#37474f'); textAlign(LEFT, BOTTOM); textSize(13);
  text('Sent frame (32 data bits)', margin, sentY - 4);
  for (let i = 0; i < NBITS; i++) drawBit(margin + i * bw, sentY, bw, sq, sent[i], AMBER, false, i % 8 === 0 ? i : -1);

  // received frame (clickable)
  fill('#37474f'); textAlign(LEFT, BOTTOM); text('Received frame — click a bit to flip it', margin, recvY - 4);
  for (let i = 0; i < NBITS; i++) {
    const flipped = recv[i] !== sent[i];
    drawBit(margin + i * bw, recvY, bw, sq, recv[i], flipped ? '#e53935' : SLATE, flipped, -1);
  }

  // check fields
  drawChecks(70 + 60 + 170, currentChecks());

  // control hints
  noStroke(); fill('#455a64'); textAlign(LEFT, TOP); textSize(12);
  text('Parity catches only an odd number of bit flips. The checksum catches ' +
    'more, but CRC-32 catches all burst errors up to 32 bits and almost all others.',
    10, drawHeight + 56, canvasWidth - 20, 40);
}

function drawBit(x, y, bw, sq, v, col, flipped, label) {
  const cx = x + bw / 2;
  if (label >= 0) { noStroke(); fill('#90a4ae'); textAlign(CENTER, BOTTOM); textSize(9); text(label, cx, y - 1); }
  stroke(flipped ? '#b71c1c' : '#90a4ae'); strokeWeight(flipped ? 2 : 1); fill(col);
  rect(cx - sq / 2, y, sq, sq, 3);
  noStroke(); fill(col === AMBER ? '#3e2723' : 'white'); textAlign(CENTER, CENTER); textSize(12);
  text(v, cx, y + sq / 2);
}

function drawChecks(y, checks) {
  const codes = [
    { k: 'parity', name: '1-bit Parity', sv: parityOf(sent), rv: parityOf(recv), fmt: v => v },
    { k: 'checksum', name: '16-bit Internet Checksum', sv: checksum16(sent), rv: checksum16(recv), fmt: v => '0x' + v.toString(16).padStart(4, '0') },
    { k: 'crc', name: 'CRC-32 (0xEDB88320)', sv: crc32(sent), rv: crc32(recv), fmt: v => '0x' + (v >>> 0).toString(16).padStart(8, '0') }
  ];
  let cy = y;
  const colW = (canvasWidth - 2 * margin) / 3;
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i]; const x = margin + i * colW;
    const ok = checks[c.k];
    stroke('#b0bec5'); fill(255); rect(x, cy, colW - 10, 110, 6);
    noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(13);
    text(c.name, x + 10, cy + 8, colW - 24, 18);
    fill('#546e7a'); textFont('monospace'); textSize(12);
    text('sent: ' + c.fmt(c.sv), x + 10, cy + 34);
    text('recv: ' + c.fmt(c.rv), x + 10, cy + 52);
    textFont('Arial');
    // indicator
    fill(ok ? '#43a047' : '#e53935'); rect(x + 10, cy + 74, 70, 24, 4);
    fill('white'); textAlign(CENTER, CENTER); textSize(13); text(ok ? 'OK' : 'FAIL', x + 45, cy + 86);
    // catch stats
    fill('#607d8b'); textAlign(LEFT, CENTER); textSize(11);
    text('caught ' + stats[c.k][0] + ' / ' + stats[c.k][1] + ' tests', x + 90, cy + 86);
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const bw = (canvasWidth - 2 * margin) / NBITS;
  const recvY = 170, sq = min(bw - 2, 24);
  for (let i = 0; i < NBITS; i++) {
    const cx = margin + i * bw + bw / 2;
    if (mouseX >= cx - sq / 2 && mouseX <= cx + sq / 2 && mouseY >= recvY && mouseY <= recvY + sq) {
      recv[i] ^= 1; tally(); return;
    }
  }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
