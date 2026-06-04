// Token Bucket vs. Leaky Bucket
// CANVAS_HEIGHT: 590
// Two traffic-shaping algorithms process the SAME input stream side by side so
// students can compare burst handling. Leaky bucket emits at a constant rate;
// token bucket lets bursts through while tokens last.
// Bloom levels: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 455;
let controlHeight = 135;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;
let sliderLeftMargin = 210;

let drainSlider, tokenSlider, capSlider;
let playButton, resetButton, dropsButton;
let smoothBtn, burstyBtn, stressBtn;
let showDrops = true;
let isPlaying = false;

let simTime = 0;          // seconds
const CYCLE = 6;          // seconds per arrival cycle
let preset = 'bursty';

// simulation state
let leakQueue = [];       // packets waiting in leaky bucket
let leakAcc = 0;          // fractional drain accumulator
let leakDrops = 0;
let tokens = 0;
let tokenQueue = [];      // packets waiting for a token
let tokenDrops = 0;
let arrivalsCons = 0;     // index of next arrival to process
let leakOut = [];         // emission times
let tokenOut = [];
let lastFlash = { leak: 0, token: 0 }; // drop flash times

function arrivalSchedule() {
  // returns array of arrival times (s) within one CYCLE
  if (preset === 'smooth') {
    const a = []; for (let t = 0; t < CYCLE; t += 0.45) a.push(t); return a;
  }
  if (preset === 'stress') {
    const a = []; for (let t = 0; t < CYCLE; t += 0.12) a.push(t); return a;
  }
  // bursty (default): 5 @0, 10 @2, 3 @3
  const a = [];
  for (let i = 0; i < 5; i++) a.push(0.0 + i * 0.05);
  for (let i = 0; i < 10; i++) a.push(2.0 + i * 0.05);
  for (let i = 0; i < 3; i++) a.push(3.0 + i * 0.05);
  return a;
}
let schedule = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  drainSlider = createSlider(1, 10, 3, 1);
  tokenSlider = createSlider(1, 10, 3, 1);
  capSlider = createSlider(2, 20, 8, 1);
  [drainSlider, tokenSlider, capSlider].forEach((s, i) => {
    s.position(sliderLeftMargin, drawHeight + 10 + i * 28);
    s.size(canvasWidth - sliderLeftMargin - margin);
  });

  playButton = createButton('Play'); playButton.position(10, drawHeight + 98); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(70, drawHeight + 98); resetButton.mousePressed(doReset);
  dropsButton = createButton('Drops: ON'); dropsButton.position(135, drawHeight + 98);
  dropsButton.mousePressed(() => { showDrops = !showDrops; dropsButton.html(showDrops ? 'Drops: ON' : 'Drops: OFF'); });
  smoothBtn = createButton('Smooth'); smoothBtn.position(230, drawHeight + 98); smoothBtn.mousePressed(() => setPreset('smooth'));
  burstyBtn = createButton('Bursty'); burstyBtn.position(300, drawHeight + 98); burstyBtn.mousePressed(() => setPreset('bursty'));
  stressBtn = createButton('Stress'); stressBtn.position(367, drawHeight + 98); stressBtn.mousePressed(() => setPreset('stress'));

  schedule = arrivalSchedule();
  describe('Side-by-side animation of a leaky bucket and a token bucket ' +
    'processing the same input. The leaky bucket smooths output to a constant ' +
    'rate; the token bucket allows bursts through while tokens are available.', LABEL);
}

function setPreset(p) { preset = p; doReset(); }
function doReset() {
  simTime = 0; leakQueue = []; leakAcc = 0; leakDrops = 0;
  tokens = capSlider.value(); tokenQueue = []; tokenDrops = 0;
  arrivalsCons = 0; leakOut = []; tokenOut = [];
  schedule = arrivalSchedule(); isPlaying = false; playButton.html('Play');
}
function togglePlay() { isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }

function step(dt) {
  const cap = capSlider.value();
  const prevCycle = floor(simTime / CYCLE);
  simTime += dt;
  const cycleBase = floor(simTime / CYCLE) * CYCLE;
  if (floor(simTime / CYCLE) !== prevCycle) arrivalsCons = 0; // new cycle, replay schedule

  // process arrivals due
  const localT = simTime - cycleBase;
  while (arrivalsCons < schedule.length && schedule[arrivalsCons] <= localT) {
    // packet arrives to both buckets
    // leaky
    if (leakQueue.length < cap) leakQueue.push({ t: simTime });
    else { leakDrops++; lastFlash.leak = simTime; }
    // token
    if (tokens >= 1) { tokens -= 1; tokenOut.push(simTime); }
    else if (tokenQueue.length < cap) tokenQueue.push({ t: simTime });
    else { tokenDrops++; lastFlash.token = simTime; }
    arrivalsCons++;
  }

  // leaky drains at constant rate
  leakAcc += drainSlider.value() * dt;
  while (leakAcc >= 1 && leakQueue.length > 0) { leakQueue.shift(); leakOut.push(simTime); leakAcc -= 1; }
  if (leakQueue.length === 0) leakAcc = min(leakAcc, 1);

  // token generation
  tokens = min(cap, tokens + tokenSlider.value() * dt);
  while (tokenQueue.length > 0 && tokens >= 1) { tokens -= 1; tokenQueue.shift(); tokenOut.push(simTime); }

  // trim old outputs (keep ~ last 8s)
  const cutoff = simTime - 8;
  while (leakOut.length && leakOut[0] < cutoff) leakOut.shift();
  while (tokenOut.length && tokenOut[0] < cutoff) tokenOut.shift();
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) step(deltaTime / 1000);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Token Bucket vs. Leaky Bucket', canvasWidth / 2, 6);

  const halfW = canvasWidth / 2;
  drawLeaky(0, halfW);
  drawToken(halfW, halfW);

  // divider
  stroke('#cfd8dc'); strokeWeight(1); line(halfW, 36, halfW, drawHeight - 96);

  drawStrips(drawHeight - 92);

  // slider labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Leaky drain rate: ' + drainSlider.value() + ' pkt/s', 10, drawHeight + 18);
  text('Token fill rate: ' + tokenSlider.value() + ' tok/s', 10, drawHeight + 46);
  text('Bucket capacity: ' + capSlider.value(), 10, drawHeight + 74);
}

function drawLeaky(x0, w) {
  const cap = capSlider.value();
  const cx = x0 + w * 0.42, top = 54, bh = 220, bw = 90;
  noStroke(); fill('#1976D2'); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text('Leaky Bucket', x0 + w / 2, 34); textStyle(NORMAL);
  // bucket walls
  stroke('#546e7a'); strokeWeight(3); noFill();
  line(cx - bw / 2, top, cx - bw / 2, top + bh);
  line(cx + bw / 2, top, cx + bw / 2, top + bh);
  line(cx - bw / 2, top + bh, cx - 12, top + bh);
  line(cx + bw / 2, top + bh, cx + 12, top + bh);
  // water level
  const lvl = constrain(leakQueue.length / cap, 0, 1);
  noStroke(); fill('#90caf9'); rect(cx - bw / 2 + 3, top + bh - lvl * (bh - 6) - 3, bw - 6, lvl * (bh - 6));
  fill('#0d47a1'); textAlign(CENTER, CENTER); textSize(12); text(leakQueue.length + ' queued', cx, top + bh - 14);
  // constant-rate output drip
  fill('#1976D2'); circle(cx, top + bh + 14, 8);
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(10); text('constant-rate output', cx, top + bh + 22);
  // dropped channel
  if (showDrops) {
    const flash = simTime - lastFlash.leak < 0.3;
    fill(flash ? '#e53935' : '#ef9a9a'); textAlign(LEFT, TOP); textSize(12);
    text('Dropped: ' + leakDrops, x0 + 12, top);
  }
}

function drawToken(x0, w) {
  const cap = capSlider.value();
  const cx = x0 + w * 0.42, top = 54, bh = 220, bw = 90;
  noStroke(); fill('#2e7d32'); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text('Token Bucket', x0 + w / 2, 34); textStyle(NORMAL);
  stroke('#546e7a'); strokeWeight(3); noFill();
  line(cx - bw / 2, top, cx - bw / 2, top + bh);
  line(cx + bw / 2, top, cx + bw / 2, top + bh);
  line(cx - bw / 2, top + bh, cx + bw / 2, top + bh);
  // tokens as green circles
  const nTok = floor(tokens);
  noStroke();
  for (let i = 0; i < nTok; i++) {
    const col = i % 5, row = floor(i / 5);
    fill('#43a047'); circle(cx - bw / 2 + 14 + col * 16, top + bh - 14 - row * 16, 11);
  }
  fill('#1b5e20'); textAlign(CENTER, TOP); textSize(11); text(nTok + ' tokens', cx, top - 2);
  // waiting queue
  if (tokenQueue.length) { fill('#ff8f00'); textAlign(CENTER, BOTTOM); textSize(11); text(tokenQueue.length + ' waiting', cx, top + bh + 26); }
  fill('#2e7d32'); textAlign(CENTER, TOP); textSize(10); text('burst-preserving output', cx, top + bh + 4);
  if (showDrops) {
    const flash = simTime - lastFlash.token < 0.3;
    fill(flash ? '#e53935' : '#ef9a9a'); textAlign(LEFT, TOP); textSize(12);
    text('Dropped: ' + tokenDrops, x0 + 12, top);
  }
}

function drawStrips(y) {
  // sliding window [simTime-8, simTime]
  const x0 = margin, x1 = canvasWidth - margin, w = x1 - x0;
  const t0 = simTime - 8, t1 = simTime;
  const toX = t => lerp(x0, x1, (t - t0) / (t1 - t0 + 0.0001));
  noStroke(); fill('#263238'); textAlign(LEFT, BOTTOM); textSize(12);
  text('Output timelines (last 8 s)  —  leaky = evenly spaced, token = bursty', x0, y - 2);
  // leaky strip
  stroke('#cfd8dc'); line(x0, y + 14, x1, y + 14);
  noStroke(); fill('#1976D2'); for (const t of leakOut) rect(toX(t) - 2, y + 6, 4, 16);
  fill('#1976D2'); textAlign(RIGHT, CENTER); textSize(10); text('leaky', x1, y + 2);
  // token strip
  stroke('#cfd8dc'); line(x0, y + 46, x1, y + 46);
  noStroke(); fill('#2e7d32'); for (const t of tokenOut) rect(toX(t) - 2, y + 38, 4, 16);
  fill('#2e7d32'); textAlign(RIGHT, CENTER); textSize(10); text('token', x1, y + 34);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  [drainSlider, tokenSlider, capSlider].forEach(s => s.size(canvasWidth - sliderLeftMargin - margin));
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
