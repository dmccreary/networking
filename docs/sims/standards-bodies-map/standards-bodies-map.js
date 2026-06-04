// Standards Bodies and What They Govern
// CANVAS_HEIGHT: 540
// Infographic mapping four standards bodies (IETF, IEEE, ISO, ICANN) to the
// layers of the protocol stack they govern.
// Bloom level: Understand.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// Layer bands, top to bottom, with the data unit at each layer.
const layers = [
  { name: 'Application', unit: 'message',           shade: '#FBE3B3' },
  { name: 'Transport',   unit: 'segment / datagram', shade: '#F8CE7E' },
  { name: 'Network',     unit: 'packet',             shade: '#F5B84A' },
  { name: 'Link',        unit: 'frame',              shade: '#E89A1C' },
  { name: 'Physical',    unit: 'bit',                shade: '#C77F12' }
];

// Standards bodies. spanTop/spanBottom index into layers[].
const bodies = [
  { key: 'IETF',  color: '#1976D2', spanTop: 0, spanBottom: 2,
    examples: ['RFC 791 (IPv4)', 'RFC 9114 (HTTP/3)', 'RFC 9293 (TCP)'] },
  { key: 'IEEE',  color: '#5D4037', spanTop: 3, spanBottom: 4,
    examples: ['802.3 (Ethernet)', '802.11 (Wi-Fi)'] },
  { key: 'ISO',   color: '#546e7a', spanTop: 0, spanBottom: 4, vertical: true,
    examples: ['ISO/IEC 7498 (OSI reference model)', 'Shared vocabulary'] }
];
const icann = { color: '#2e7d32',
  examples: ['.com domain registry', 'port-number registry', 'IP address allocation'] };

let hover = null;   // {type:'body'|'band'|'icann', idx}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  describe('Infographic of five protocol-layer bands with badges showing ' +
    'that IETF governs the top three layers, IEEE the bottom two, ISO ' +
    'provides the OSI vocabulary across all layers, and ICANN manages names ' +
    'numbers and ports across all layers.', LABEL);
}

function bandGeom() {
  const top = 86;
  const h = (drawHeight - top - 16) / layers.length;
  return { top, h };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(20);
  text('Standards Bodies and What They Govern', canvasWidth / 2, 8);

  // ICANN floating badge near top
  const icannW = min(420, canvasWidth - 2 * margin);
  const icannX = canvasWidth / 2 - icannW / 2;
  drawBadge(icannX, 40, icannW, 26, icann.color, 'ICANN — names, numbers, ports (all layers)', 13);

  const { top, h } = bandGeom();
  const bodyX = canvasWidth * 0.58;
  const isoX = canvasWidth - 34;
  const bodyW = isoX - bodyX - 10;

  // Layer bands
  hover = null;
  for (let i = 0; i < layers.length; i++) {
    const y = top + i * h;
    noStroke(); fill(layers[i].shade);
    rect(0, y, canvasWidth, h);
    stroke('#90a4ae'); strokeWeight(1); line(0, y, canvasWidth, y);
    noStroke(); fill('#3e2723');
    textAlign(LEFT, CENTER); textSize(16);
    text(layers[i].name, margin, y + h / 2);
    if (mouseX < bodyX - 4 && overRect(0, y, canvasWidth, h)) hover = { type: 'band', idx: i };
  }

  // IETF + IEEE badges
  for (let i = 0; i < 2; i++) {
    const b = bodies[i];
    const y0 = top + b.spanTop * h + 4;
    const y1 = top + (b.spanBottom + 1) * h - 4;
    drawBadge(bodyX, y0, bodyW, y1 - y0, b.color, b.key, 18);
    if (overRect(bodyX, y0, bodyW, y1 - y0)) hover = { type: 'body', idx: i };
  }

  // ISO vertical badge (all bands)
  const isoY0 = top + 4, isoY1 = top + layers.length * h - 4;
  drawVerticalBadge(isoX, isoY0, 26, isoY1 - isoY0, bodies[2].color, 'ISO — OSI model');
  if (overRect(isoX, isoY0, 26, isoY1 - isoY0)) hover = { type: 'body', idx: 2 };

  // ICANN hover
  if (overRect(icannX, 40, icannW, 26)) hover = { type: 'icann' };

  if (hover) drawCallout();

  noStroke(); fill('#455a64');
  textAlign(LEFT, CENTER); textSize(14);
  text('Hover a band or a badge to learn more.', margin, drawHeight + controlHeight / 2);
}

function drawBadge(x, y, w, h, col, label, ts) {
  noStroke(); fill(col); rect(x, y, w, h, 6);
  fill('white'); textAlign(CENTER, CENTER); textSize(ts);
  text(label, x + w / 2, y + h / 2);
}

function drawVerticalBadge(x, y, w, h, col, label) {
  noStroke(); fill(col); rect(x, y, w, h, 6);
  push();
  translate(x + w / 2, y + h / 2);
  rotate(-HALF_PI);
  fill('white'); textAlign(CENTER, CENTER); textSize(13);
  text(label, 0, 0);
  pop();
}

function drawCallout() {
  let lines = [];
  let titleStr = '';
  if (hover.type === 'band') {
    titleStr = layers[hover.idx].name + ' layer';
    lines = ['Data unit: ' + layers[hover.idx].unit];
  } else if (hover.type === 'icann') {
    titleStr = 'ICANN';
    lines = icann.examples.slice();
  } else {
    const b = bodies[hover.idx];
    titleStr = b.key;
    lines = b.examples.slice();
  }
  const w = 280;
  const x = constrain(mouseX + 12, margin, canvasWidth - w - margin);
  const hgt = 26 + lines.length * 18;
  const y = constrain(mouseY + 12, 40, drawHeight - hgt - 4);
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 245);
  rect(x, y, w, hgt, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(14);
  text(titleStr, x + 10, y + 8);
  fill('#37474f'); textSize(12);
  for (let i = 0; i < lines.length; i++) text('• ' + lines[i], x + 10, y + 28 + i * 18);
}

function overRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

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
