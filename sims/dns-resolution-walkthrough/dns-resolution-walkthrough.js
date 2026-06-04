// DNS Resolution Walkthrough
// CANVAS_HEIGHT: 620
// Animates a recursive DNS resolution through the hierarchy with a resolver
// cache, DNSSEC verification, and a cache-poisoning attack.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 522;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;
let sliderLeftMargin = 250;

const AMBER = '#F5A623', SLATE = '#546e7a', GREEN = '#2e7d32', RED = '#e53935';
const nodes = ['Laptop', 'Recursive Resolver', 'Root', 'TLD Server (.com)', 'Authoritative (example.com)'];

// each event: {from, to, label, q (query=amber) or answer (slate), verify}
const events = [
  { from: 0, to: 1, label: 'A example.com?', q: true, note: 'cache miss' },
  { from: 1, to: 2, label: 'Where is .com?', q: true },
  { from: 2, to: 1, label: 'NS records for .com', q: false, verify: true, cache: { name: '.com NS', ttl: 172800 } },
  { from: 1, to: 3, label: 'Where is example.com?', q: true },
  { from: 3, to: 1, label: 'NS records for example.com', q: false, verify: true, cache: { name: 'example.com NS', ttl: 86400 } },
  { from: 1, to: 4, label: 'A example.com?', q: true },
  { from: 4, to: 1, label: '93.184.216.34', q: false, verify: true, cache: { name: 'example.com A', ttl: 300 } },
  { from: 1, to: 0, label: '93.184.216.34 (cached)', q: false }
];

let step = 0, isPlaying = false, frameAcc = 0;
let dnssec = false, poison = false;
let stepButton, playButton, resetButton, dnssecBtn, poisonBtn, speedSlider;
let cache = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 8); stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(80, drawHeight + 8); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 8); resetButton.mousePressed(reset);
  dnssecBtn = createButton('DNSSEC: OFF'); dnssecBtn.position(205, drawHeight + 8); dnssecBtn.mousePressed(() => { dnssec = !dnssec; dnssecBtn.html('DNSSEC: ' + (dnssec ? 'ON' : 'OFF')); reset(); });
  poisonBtn = createButton('Cache poisoning: OFF'); poisonBtn.position(310, drawHeight + 8); poisonBtn.mousePressed(() => { poison = !poison; poisonBtn.html('Cache poisoning: ' + (poison ? 'ON' : 'OFF')); reset(); });
  speedSlider = createSlider(1, 6, 2, 1); speedSlider.position(sliderLeftMargin, drawHeight + 50); speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  reset();
  describe('A DNS resolution animated from a laptop through a recursive ' +
    'resolver, the root, the .com TLD server, and the authoritative server, ' +
    'with a resolver cache, DNSSEC verification, and a cache-poisoning attack.', LABEL);
}

function reset() { step = 0; isPlaying = false; if (playButton) playButton.html('Play'); cache = []; }
function doStep() { isPlaying = false; playButton.html('Play'); if (step < events.length) { applyCache(step); step++; } }
function togglePlay() { if (step >= events.length) reset(); isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }
function applyCache(i) { const e = events[i]; if (e.cache && !cache.find(c => c.name === e.cache.name)) cache.push({ ...e.cache }); }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { frameAcc += speedSlider.value(); if (frameAcc > 50) { frameAcc = 0; if (step < events.length) { applyCache(step); step++; } else { isPlaying = false; playButton.html('Play'); } } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('DNS Resolution Walkthrough', canvasWidth / 2, 6);

  const colX = canvasWidth * 0.40;
  const top = 56, gap = (drawHeight - top - 70) / (nodes.length - 1);
  const ny = i => top + i * gap;

  // vertical spine
  stroke('#e0e0e0'); strokeWeight(2); line(colX, ny(0), colX, ny(nodes.length - 1));

  // events revealed
  for (let i = 0; i < min(step, events.length); i++) drawEvent(events[i], colX, ny, i);

  // nodes
  for (let i = 0; i < nodes.length; i++) drawNode(i, colX, ny(i));

  drawCache(colX + 220, 60);

  // status
  noStroke(); textAlign(LEFT, TOP); textSize(13);
  const last = events[min(step, events.length) - 1];
  fill('#37474f');
  text(step === 0 ? 'Press Step to start the lookup.' : 'Step ' + step + '/' + events.length + ': ' + (last ? last.label : ''), margin, drawHeight - 26);
  if (poison && step >= 4) { fill(dnssec ? GREEN : RED); text(dnssec ? '✓ DNSSEC signature invalid on forged reply — REJECTED.' : '✗ Forged reply accepted and cached (no DNSSEC)!', margin, drawHeight - 8); }

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13); text('Speed: ' + speedSlider.value(), 200, drawHeight + 60);
}

function drawNode(i, x, y) {
  noStroke(); fill(i === 0 ? '#90a4ae' : (i === 1 ? AMBER : SLATE)); stroke('#37474f'); strokeWeight(1.5);
  rectMode(CENTER); rect(x, y, 210, 34, 7); rectMode(CORNER);
  noStroke(); fill(i === 1 ? '#3e2723' : 'white'); textAlign(CENTER, CENTER); textSize(13); text(nodes[i], x, y);
}

function drawEvent(e, x, ny, i) {
  const y0 = ny(e.from), y1 = ny(e.to);
  const side = e.q ? 1 : -1;     // queries bow right, answers bow left
  const offset = 90 * side;
  stroke(e.q ? AMBER : SLATE); strokeWeight(2); noFill();
  const midY = (y0 + y1) / 2;
  beginShape(); vertex(x + side * 8, y0); bezierVertex(x + offset, y0, x + offset, y1, x + side * 8, y1); endShape();
  // arrowhead at destination
  noStroke(); fill(e.q ? AMBER : SLATE); const dir = y1 > y0 ? 1 : -1; triangle(x + side * 8, y1, x + side * 8 + 6, y1 - dir * 8, x + side * 8 - 6, y1 - dir * 8);
  // label
  noStroke(); fill('#263238'); textAlign(side > 0 ? LEFT : RIGHT, CENTER); textSize(10);
  let lbl = e.label;
  const poisoned = poison && i === 6;
  if (poisoned) { fill(RED); lbl = dnssec ? lbl + ' (forged ✗)' : '203.0.113.66 (forged!)'; }
  text(lbl + (e.verify && dnssec ? ' 🔑' : ''), x + offset + side * 6, midY, 150, 24);
  if (e.note) { fill('#c62828'); textSize(9); text(e.note, x + offset + side * 6, midY + 14); }
}

function drawCache(x, y) {
  const w = canvasWidth - x - margin - 6, h = 150;
  noStroke(); fill('#fffde7'); stroke('#fbc02d'); rect(x, y, w, h, 6);
  noStroke(); fill('#5d4037'); textAlign(LEFT, TOP); textSize(13); text('Resolver cache', x + 8, y + 6);
  textSize(11);
  if (!cache.length) { fill('#9e9e9e'); text('(empty — all cache misses)', x + 8, y + 28); return; }
  for (let i = 0; i < cache.length; i++) {
    const c = cache[i]; const yy = y + 28 + i * 26;
    fill('#37474f'); text(c.name, x + 8, yy);
    fill('#1565c0'); text('TTL ' + c.ttl + ' s', x + w - 90, yy);
  }
  fill('#607d8b'); textSize(10); text('A 2nd query for example.com is answered instantly from cache.', x + 8, y + h - 30, w - 16, 26);
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); speedSlider.size(canvasWidth - sliderLeftMargin - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
