// The Four Addressing Scopes
// CANVAS_HEIGHT: 636
// Four quadrants (unicast, multicast, broadcast, anycast) share one topology.
// The selected scope animates a packet from sender through a router to the
// receiver(s) the scope rule selects. Bloom levels: Remember, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 540;
let controlHeight = 96;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const AMBER = '#F5A623';
const SLATE = '#546e7a';
const GREEN = '#43a047';
const DIM = '#b0bec5';

// scope definitions; lit() returns set of receiver indices (0..5) that light up
const scopes = [
  { key: 'Unicast', rule: 'One sender → one receiver', color: AMBER,
    lit: () => [2], members: [2] },
  { key: 'Multicast', rule: 'One sender → a group (subset)', color: '#1976D2',
    lit: () => [1, 3, 5], members: [1, 3, 5] },
  { key: 'Broadcast', rule: 'One sender → all on the link', color: '#6a1b9a',
    lit: () => [0, 1, 2, 3, 4, 5], members: [0, 1, 2, 3, 4, 5] },
  { key: 'Anycast', rule: 'One sender → nearest of many', color: '#00897b',
    lit: (alt) => (alt ? [4] : [0]), members: [0, 2, 4] }
];

let active = 0;          // active scope index
let t = 0;               // timeline 0..1 for the active animation
let isPlaying = false;
let anycastAlt = false;

let tabButtons = [];
let stepButton, playButton, resetButton, sourceButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: tabs
  let x = 10;
  for (let i = 0; i < scopes.length; i++) {
    const b = createButton(scopes[i].key);
    b.position(x, drawHeight + 8);
    b.mousePressed(() => selectScope(i));
    tabButtons.push(b);
    x += 90;
  }
  // Row 2: controls
  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 50);
  stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(80, drawHeight + 50);
  playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 50);
  resetButton.mousePressed(doReset);
  sourceButton = createButton('Anycast source: A'); sourceButton.position(205, drawHeight + 50);
  sourceButton.mousePressed(() => { anycastAlt = !anycastAlt;
    sourceButton.html('Anycast source: ' + (anycastAlt ? 'B' : 'A')); if (active === 3) doReset(); });

  describe('Four quadrants compare unicast, multicast, broadcast, and anycast ' +
    'delivery. The selected scope animates a packet from a sender through a ' +
    'router to the receivers that scope reaches.', LABEL);
  updateTabStyles();
}

function selectScope(i) { active = i; doReset(); updateTabStyles(); }
function updateTabStyles() {
  for (let i = 0; i < tabButtons.length; i++)
    tabButtons[i].style('font-weight', i === active ? '700' : '400');
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('The Four Addressing Scopes', canvasWidth / 2, 6);

  // advance animation
  if (isPlaying) {
    t += 0.006;
    if (t >= 1) { t = 1; isPlaying = false; playButton.html('Play'); }
  }

  const qw = canvasWidth / 2;
  const qTop = 36;
  const qh = (drawHeight - qTop) / 2;
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = floor(i / 2);
    drawQuadrant(i, col * qw, qTop + row * qh, qw, qh);
  }

  // control labels
  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Active: ' + scopes[active].key + '  ·  ' + scopes[active].rule, 360, drawHeight + 62);
}

function drawQuadrant(i, qx, qy, qw, qh) {
  const s = scopes[i];
  const isActive = i === active;
  // panel border
  stroke(isActive ? s.color : '#cfd8dc'); strokeWeight(isActive ? 3 : 1);
  noFill(); rect(qx + 4, qy + 4, qw - 8, qh - 8, 8);

  // label
  noStroke(); fill(isActive ? s.color : '#78909c');
  textAlign(LEFT, TOP); textSize(15); textStyle(BOLD);
  text(s.key, qx + 14, qy + 10); textStyle(NORMAL);
  fill('#607d8b'); textSize(10.5);
  text(s.rule, qx + 14, qy + 30, qw - 28, 14);

  // topology coordinates
  const sx = qx + qw * 0.13, sy = qy + qh * 0.55;
  const rx = qx + qw * 0.42, ry = qy + qh * 0.55;
  const recX = qx + qw * 0.82;
  const recYs = [];
  for (let k = 0; k < 6; k++) recYs.push(qy + qh * (0.18 + k * 0.13));

  const litSet = isActive ? s.lit(anycastAlt) : [];
  const arrived = isActive && t >= 0.95;

  // links
  stroke('#cfd8dc'); strokeWeight(1.5);
  line(sx, sy, rx, ry);
  for (let k = 0; k < 6; k++) line(rx, ry, recX, recYs[k]);

  // anycast member rings
  if (i === 3) {
    noFill(); stroke('#00897b'); strokeWeight(1.5);
    for (const m of s.members) circle(recX, recYs[m], 26);
  }

  // receivers
  for (let k = 0; k < 6; k++) {
    const on = arrived && litSet.includes(k);
    noStroke(); fill(on ? GREEN : DIM);
    circle(recX, recYs[k], 18);
    fill(on ? 'white' : '#607d8b'); textAlign(CENTER, CENTER); textSize(10);
    text(k + 1, recX, recYs[k]);
  }

  // router (octagon) and sender (hexagon)
  drawPoly(rx, ry, 16, 8, SLATE);
  drawPoly(sx, sy, 15, 6, AMBER);
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(9);
  text('sender', sx, sy + 18); text('router', rx, ry + 18);

  // animated packets (only active quadrant)
  if (isActive && t > 0) {
    fill(s.color); noStroke();
    if (t < 0.45) {
      const p = t / 0.45;
      circle(lerp(sx, rx, p), lerp(sy, ry, p), 10);
    } else {
      const p = (t - 0.45) / 0.55;
      const targets = s.lit(anycastAlt);
      for (const k of targets) circle(lerp(rx, recX, p), lerp(ry, recYs[k], p), 10);
    }
  }
}

function drawPoly(cx, cy, r, n, col) {
  noStroke(); fill(col);
  beginShape();
  for (let i = 0; i < n; i++) {
    const a = -HALF_PI + i * TWO_PI / n + PI / n;
    vertex(cx + r * cos(a), cy + r * sin(a));
  }
  endShape(CLOSE);
}

function doStep() {
  isPlaying = false; playButton.html('Play');
  if (t < 0.45) t = 0.45; else t = 1;
}
function togglePlay() {
  if (t >= 1) t = 0;
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
}
function doReset() { t = 0; isPlaying = false; playButton.html('Play'); }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
