// Packet Fragmentation Walkthrough
// CANVAS_HEIGHT: 600
// A 4000-byte packet crosses links with shrinking MTUs (9000 → 1500 → 576).
// Compare IPv4 in-transit fragmentation, IPv4 with DF=1 + PMTUD, and IPv6.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 478;
let controlHeight = 122;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;
let sliderLeftMargin = 120;

const AMBER = '#F5A623', RED = '#e53935', SLATE = '#546e7a';
const PACKET_BYTES = 4000;
const MODES = ['IPv4 DF=0 (fragment)', 'IPv4 DF=1 (PMTUD)', 'IPv6 (PMTUD)'];
let mode = 0;
let scenes = [];
let stage = 0;
let isPlaying = false, frameAcc = 0;

let tabButtons = [], stepButton, playButton, resetButton;
let mtu1Slider, mtu2Slider, mtu3Slider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  let x = 10;
  MODES.forEach((m, i) => { const b = createButton(m); b.position(x, drawHeight + 8); b.mousePressed(() => { mode = i; rebuild(); updateTabs(); }); tabButtons.push(b); x += 150; });
  stepButton = createButton('Step ▶'); stepButton.position(x + 6, drawHeight + 8); stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(x + 70, drawHeight + 8); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(x + 124, drawHeight + 8); resetButton.mousePressed(() => { stage = 0; });

  mtu1Slider = createSlider(1500, 9000, 9000, 100); mtu1Slider.position(sliderLeftMargin, drawHeight + 44);
  mtu2Slider = createSlider(576, 4000, 1500, 4); mtu2Slider.position(sliderLeftMargin, drawHeight + 72);
  mtu3Slider = createSlider(296, 1500, 576, 4); mtu3Slider.position(sliderLeftMargin, drawHeight + 100);
  [mtu1Slider, mtu2Slider, mtu3Slider].forEach(s => { s.size(canvasWidth - sliderLeftMargin - margin); s.input(rebuild); });

  rebuild(); updateTabs();
  describe('A four-thousand-byte packet crossing three links with decreasing ' +
    'MTUs, comparing IPv4 in-transit fragmentation, IPv4 DF=1 path-MTU ' +
    'discovery, and IPv6 source-based fragmentation.', LABEL);
}
function updateTabs() { tabButtons.forEach((b, i) => b.style('font-weight', i === mode ? '700' : '400')); }
function mtus() { return [mtu1Slider.value(), mtu2Slider.value(), mtu3Slider.value()]; }
function fragCount(mtu) { return Math.ceil(PACKET_BYTES / (mtu - 20)); }

function rebuild() {
  const M = mtus();
  if (mode === 0) {
    const n2 = fragCount(M[1]), n3 = fragCount(M[2]);
    scenes = [
      { desc: 'Original ' + PACKET_BYTES + '-byte packet at the sender.', boxes: [{ li: 0, n: 1, frac: 0.0 }], frags: 1, icmp: 0 },
      { desc: 'Travels Link 1 (MTU ' + M[0] + ') — fits whole.', boxes: [{ li: 0, n: 1, frac: 0.5 }], frags: 1, icmp: 0 },
      { desc: 'R1 fragments to fit Link 2 (MTU ' + M[1] + ') → ' + n2 + ' fragments.', boxes: [{ li: 1, n: n2, frac: 0.2 }], frags: n2, icmp: 0 },
      { desc: 'Fragments cross Link 2 to R2.', boxes: [{ li: 1, n: n2, frac: 0.7 }], frags: n2, icmp: 0 },
      { desc: 'R2 re-fragments to fit Link 3 (MTU ' + M[2] + ') → ' + n3 + ' fragments.', boxes: [{ li: 2, n: n3, frac: 0.4 }], frags: n3, icmp: 0 },
      { desc: 'Receiver buffers all fragments and reassembles the ' + PACKET_BYTES + '-byte packet.', boxes: [{ li: 3, n: 1, frac: 0 }], frags: n3, icmp: 0, done: true }
    ];
  } else {
    const icmpv6 = mode === 2;
    const tag = icmpv6 ? 'ICMPv6 Packet Too Big' : 'ICMP Fragmentation Needed';
    const frag = icmpv6 ? 'source adds Fragment Ext. Header' : 'sender retries smaller';
    scenes = [
      { desc: 'Send ' + PACKET_BYTES + '-byte packet' + (mode === 1 ? ' with DF=1.' : '.'), boxes: [{ li: 0, n: 1, frac: 0.4 }], frags: 1, icmp: 0 },
      { desc: 'R1 cannot fit MTU ' + M[1] + ' → ' + tag + ' (MTU=' + M[1] + ').', boxes: [{ li: 0, n: 1, frac: 0.5 }], icmpLink: 1, frags: 1, icmp: 1 },
      { desc: frag + ' to ' + M[1] + ' bytes; crosses Link 2.', boxes: [{ li: 1, n: fragCount(M[1]), frac: 0.6 }], frags: 1, icmp: 1 },
      { desc: 'R2 cannot fit MTU ' + M[2] + ' → ' + tag + ' (MTU=' + M[2] + ').', boxes: [{ li: 1, n: 1, frac: 0.6 }], icmpLink: 2, frags: 1, icmp: 2 },
      { desc: frag + ' to ' + M[2] + ' bytes; reaches the receiver. PMTU = ' + M[2] + '.', boxes: [{ li: 2, n: fragCount(M[2]), frac: 0.6 }], frags: 1, icmp: 2, done: true, pmtu: M[2] }
    ];
  }
  stage = 0; isPlaying = false; if (playButton) playButton.html('Play');
}

function nodeXs() { const w = canvasWidth - 2 * margin; return [margin + 30, margin + w * 0.36, margin + w * 0.66, margin + w - 30]; }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { frameAcc += 1; if (frameAcc > 45) { frameAcc = 0; if (stage < scenes.length - 1) stage++; else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Packet Fragmentation & Path-MTU Discovery', canvasWidth / 2, 6);

  const xs = nodeXs(); const pathY = 150; const M = mtus();
  const names = ['Sender', 'R1', 'R2', 'Receiver'];
  // links + MTU labels
  for (let i = 0; i < 3; i++) {
    stroke('#90a4ae'); strokeWeight(3); line(xs[i], pathY, xs[i + 1], pathY);
    noStroke(); fill('#37474f'); textAlign(CENTER, BOTTOM); textSize(12);
    text('Link ' + (i + 1) + '  MTU ' + M[i], (xs[i] + xs[i + 1]) / 2, pathY - 14);
  }
  for (let i = 0; i < 4; i++) {
    noStroke(); fill(i === 0 || i === 3 ? '#90a4ae' : SLATE);
    if (i === 0 || i === 3) { rectMode(CENTER); rect(xs[i], pathY, 28, 28, 4); rectMode(CORNER); }
    else { fill(SLATE); ellipse(xs[i], pathY, 30, 30); }
    fill('#263238'); textAlign(CENTER, TOP); textSize(11); text(names[i], xs[i], pathY + 18);
  }

  // current scene
  const sc = scenes[stage];
  drawScene(sc, xs, pathY);

  // description + counters
  noStroke(); fill(sc.done ? '#1b5e20' : '#263238'); textAlign(CENTER, TOP); textSize(14);
  text('Step ' + (stage + 1) + '/' + scenes.length + ': ' + sc.desc, canvasWidth / 2, 320, canvasWidth - 80, 60);
  fill('#37474f'); textAlign(LEFT, TOP); textSize(13);
  text('Fragments on the wire: ' + sc.frags, margin, 380);
  text('ICMP messages exchanged: ' + sc.icmp, margin, 402);
  if (sc.pmtu) { fill('#1565c0'); text('Discovered Path MTU: ' + sc.pmtu + ' bytes', margin, 424); }

  // slider labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('L1 MTU', 10, drawHeight + 54); text('L2 MTU', 10, drawHeight + 82); text('L3 MTU', 10, drawHeight + 110);
}

function drawScene(sc, xs, pathY) {
  for (const grp of sc.boxes) {
    const li = grp.li;
    if (li >= 3) { // at receiver: reassembled big packet
      drawPacketBox(xs[3], pathY - 50, 80, 22, AMBER, PACKET_BYTES + ' B reassembled');
      continue;
    }
    const x = lerp(xs[li], xs[li + 1], grp.frac);
    if (grp.n === 1) drawPacketBox(x, pathY - 46, 70, 22, AMBER, PACKET_BYTES + ' B');
    else {
      const shown = min(grp.n, 6);
      for (let k = 0; k < shown; k++) drawPacketBox(x + k * 26 - (shown - 1) * 13, pathY - 46, 22, 18, AMBER, '');
      noStroke(); fill('#5d4037'); textAlign(CENTER, BOTTOM); textSize(10);
      text(grp.n + ' frags', x, pathY - 50);
    }
  }
  // ICMP arrow back along a link
  if (sc.icmpLink !== undefined) {
    const li = sc.icmpLink; const x0 = xs[li + 1], x1 = xs[li];
    stroke(RED); strokeWeight(2.5);
    const ay = pathY + 40;
    line(x0, ay, x1, ay); fill(RED); noStroke(); triangle(x1, ay, x1 + 9, ay - 5, x1 + 9, ay + 5);
    noStroke(); fill(RED); textAlign(CENTER, TOP); textSize(11); text('ICMP "too big" →  back to source', (x0 + x1) / 2, ay + 4);
  }
}

function drawPacketBox(cx, cy, w, h, col, label) {
  noStroke(); fill(0, 0, 0, 25); rect(cx - w / 2 + 2, cy + 2, w, h, 3);
  fill(col); stroke('#c77f12'); strokeWeight(1); rectMode(CORNER); rect(cx - w / 2, cy, w, h, 3);
  if (label) { noStroke(); fill('#3e2723'); textAlign(CENTER, CENTER); textSize(10); text(label, cx, cy + h / 2); }
}

function doStep() { isPlaying = false; playButton.html('Play'); if (stage < scenes.length - 1) stage++; }
function togglePlay() { if (stage >= scenes.length - 1) stage = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); [mtu1Slider, mtu2Slider, mtu3Slider].forEach(s => s.size(canvasWidth - sliderLeftMargin - margin)); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
