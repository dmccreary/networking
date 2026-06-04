// Anatomy of a Man-in-the-Middle Attack (and TLS Defense)
// CANVAS_HEIGHT: 596
// Three phases: plaintext MITM succeeds, TLS-without-verification still leaks,
// TLS with proper certificate verification blocks the attack.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 498;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a', RED = '#e53935', GREEN = '#2e7d32';
const PHASES = ['1: Plaintext', '2: TLS, no verify', '3: TLS + verify'];
let phase = 0, step = 0, isPlaying = false, frameAcc = 0;
let showChain = false, showPinned = false;
let tabButtons = [], stepButton, playButton, resetButton, chainBtn, pinBtn;

function scenes() {
  if (phase === 0) return [
    { d: 'Client sends "Send $1000 to Alice" in cleartext.', msg: { txt: '$1000→Alice', enc: false, where: 'ca' } },
    { d: 'Attacker reads the plaintext and rewrites it.', msg: { txt: '$10000→Mallory', enc: false, where: 'at', bad: true } },
    { d: 'Server processes the forged message. Attack SUCCEEDS.', msg: { txt: '$10000→Mallory', enc: false, where: 'as', bad: true }, fail: true }
  ];
  if (phase === 1) return [
    { d: 'Client starts TLS but skips certificate verification.', msg: { txt: 'TLS hello', enc: true, where: 'ca' } },
    { d: 'Attacker presents a FAKE certificate; client accepts it.', msg: { txt: 'fake cert', enc: true, where: 'at', bad: true } },
    { d: 'Attacker opens its own TLS session to the real server.', msg: { txt: 'TLS hello', enc: true, where: 'as' } },
    { d: 'Attacker decrypts, reads, re-encrypts. Attack SUCCEEDS.', msg: { txt: '🔓 reads all', enc: true, where: 'at', bad: true }, fail: true }
  ];
  // phase 3
  const s = [
    { d: 'Client starts TLS to what it thinks is the server.', msg: { txt: 'TLS hello', enc: true, where: 'ca' } },
    { d: 'Attacker presents a fake certificate signed by an unknown CA.', msg: { txt: 'fake cert', enc: true, where: 'at', bad: true } },
    { d: 'Client validates the certificate chain against trusted CAs.', chain: showChain },
    { d: 'Validation FAILS — unknown CA. Connection refused. Attack BLOCKED.', blocked: true }
  ];
  if (showPinned) s.push({ d: 'With certificate pinning, even a CA-signed fake is rejected (pin mismatch).', blocked: true, pin: true });
  return s;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  let x = 10;
  PHASES.forEach((p, i) => { const b = createButton(p); b.position(x, drawHeight + 8); b.mousePressed(() => { phase = i; step = 0; updateTabs(); }); tabButtons.push(b); x += 130; });
  stepButton = createButton('Step ▶'); stepButton.position(x + 6, drawHeight + 8); stepButton.mousePressed(() => { isPlaying = false; playButton.html('Play'); const L = scenes(); if (step < L.length) step++; });
  playButton = createButton('Play'); playButton.position(x + 76, drawHeight + 8); playButton.mousePressed(() => { if (step >= scenes().length) step = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); });
  resetButton = createButton('Reset'); resetButton.position(x + 136, drawHeight + 8); resetButton.mousePressed(() => { step = 0; isPlaying = false; playButton.html('Play'); });
  chainBtn = createButton('Show certificate chain'); chainBtn.position(10, drawHeight + 46); chainBtn.mousePressed(() => { showChain = !showChain; chainBtn.html(showChain ? 'Hide certificate chain' : 'Show certificate chain'); });
  pinBtn = createButton('Show pinned certificate'); pinBtn.position(200, drawHeight + 46); pinBtn.mousePressed(() => { showPinned = !showPinned; pinBtn.html(showPinned ? 'Hide pinned certificate' : 'Show pinned certificate'); });
  updateTabs();
  describe('A man-in-the-middle attack shown in three phases: a plaintext ' +
    'connection is altered, a TLS connection without verification is still ' +
    'intercepted, and a TLS connection with certificate verification blocks it.', LABEL);
}
function updateTabs() { tabButtons.forEach((b, i) => b.style('font-weight', i === phase ? '700' : '400')); }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const L = scenes();
  if (isPlaying) { frameAcc++; if (frameAcc > 44) { frameAcc = 0; if (step < L.length) step++; else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Man-in-the-Middle  —  Phase ' + PHASES[phase], canvasWidth / 2, 6);

  const y = 150;
  const cx = canvasWidth * 0.16, ax = canvasWidth * 0.5, srx = canvasWidth * 0.84;
  // links
  stroke('#cfd8dc'); strokeWeight(3); line(cx, y, ax, y); line(ax, y, srx, y);
  noStroke(); fill('#b0bec5'); textAlign(CENTER, TOP); textSize(10);
  text('client believes: direct to server', (cx + srx) / 2, y - 40);

  drawNode(cx, y, 'Client', '#1976d2');
  drawNode(ax, y, 'Attacker', RED);
  drawNode(srx, y, 'Server', SLATE);

  // current scene
  const sc = L[min(step, L.length) - 1] || null;
  if (sc) drawScene(sc, cx, ax, srx, y);

  // step descriptions accumulated
  noStroke(); textAlign(LEFT, TOP); textSize(13);
  let dy = 250;
  for (let i = 0; i < min(step, L.length); i++) {
    fill(L[i].fail ? RED : (L[i].blocked ? GREEN : '#37474f'));
    text((i + 1) + '. ' + L[i].d, margin, dy, canvasWidth - 2 * margin, 30); dy += 30;
  }

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Step ' + min(step, L.length) + ' / ' + L.length, 470, drawHeight + 56);
}

function drawNode(x, y, label, col) {
  noStroke(); fill(col); stroke('#37474f'); strokeWeight(1.5); rectMode(CENTER); rect(x, y, 90, 48, 8); rectMode(CORNER);
  noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(13); text(label, x, y);
}

function drawScene(sc, cx, ax, srx, y) {
  if (sc.msg) {
    const m = sc.msg; let mx = ax;
    if (m.where === 'ca') mx = (cx + ax) / 2;
    else if (m.where === 'as') mx = (ax + srx) / 2;
    else mx = ax;
    noStroke(); fill(m.bad ? RED : (m.enc ? GREEN : AMBER)); rectMode(CENTER); rect(mx, y - 60, 130, 26, 4); rectMode(CORNER);
    fill('white'); textAlign(CENTER, CENTER); textSize(11); text((m.enc ? '🔒 ' : '') + m.txt, mx, y - 60);
  }
  if (sc.chain) {
    const bx = canvasWidth * 0.5 - 90;
    noStroke(); fill(255, 255, 255, 240); stroke('#b0bec5'); rect(bx, y - 130, 180, 70, 6);
    noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(10);
    text('Chain check:\n  leaf cert → intermediate CA → root CA\n  Is root in trusted store? NO →', bx + 8, y - 126, 170, 60);
  }
  if (sc.blocked) { noStroke(); fill(GREEN); textAlign(CENTER, TOP); textSize(15); text(sc.pin ? '🔒 Pinned cert mismatch — blocked' : '✓ Connection refused — MITM blocked', canvasWidth / 2, y - 100); }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
