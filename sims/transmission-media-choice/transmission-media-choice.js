// Choosing a Transmission Medium
// CANVAS_HEIGHT: 600
// Decision tree that recommends a transmission medium from deployment
// constraints (mobility, distance, EMI, cost). Bloom level: Apply.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const SLATE = '#546e7a';
const AMBER = '#F5A623';
let selectedId = 'q1';
let resetButton;

// staircase tree; nx/ny normalized within tree area
const tree = [
  { id: 'q1', parent: null, nx: 0.14, ny: 0.08, q: true, title: 'Need mobility?' },
  { id: 'wireless', parent: 'q1', branch: 'Yes', nx: 0.55, ny: 0.08, leaf: true, icon: 'antenna',
    title: 'Wireless', use: 'Phones, laptops, IoT',
    bw: 'up to ~1–10 Gbps (Wi-Fi 6/6E)', atten: 'high, environment-dependent',
    emi: 'susceptible to interference', cost: 'low — no cabling to pull' },
  { id: 'q2', parent: 'q1', branch: 'No', nx: 0.14, ny: 0.30, q: true, title: 'Distance > 1 km?' },
  { id: 'fiber', parent: 'q2', branch: 'Yes', nx: 0.55, ny: 0.30, leaf: true, icon: 'fiber',
    title: 'Fiber optic', use: 'Backbone, long-haul links',
    bw: '10–400+ Gbps', atten: '~0.2 dB/km (very low)',
    emi: 'immune (light, not electrical)', cost: '$$ install, $ per meter' },
  { id: 'q3', parent: 'q2', branch: 'No', nx: 0.14, ny: 0.52, q: true, title: 'Severe EMI\nenvironment?' },
  { id: 'emi', parent: 'q3', branch: 'Yes', nx: 0.55, ny: 0.52, leaf: true, icon: 'coax',
    title: 'Fiber or shielded TP / coax', use: 'Factory floor, near motors',
    bw: 'fiber best; STP/coax up to ~10 Gbps', atten: 'low (fiber) / moderate',
    emi: 'fiber immune; STP & coax shielded', cost: '$$ (shielding adds cost)' },
  { id: 'q4', parent: 'q3', branch: 'No', nx: 0.14, ny: 0.74, q: true, title: 'Cost-sensitive\nbulk install?' },
  { id: 'utp', parent: 'q4', branch: 'Yes', nx: 0.55, ny: 0.74, leaf: true, icon: 'twisted',
    title: 'Twisted pair (UTP)', use: 'Office LAN wiring',
    bw: '1–10 Gbps (Cat6/6a)', atten: 'higher — 100 m segment limit',
    emi: 'moderate (twisting cancels noise)', cost: '$ — cheapest to install' },
  { id: 'fiber2', parent: 'q4', branch: 'No', nx: 0.55, ny: 0.93, leaf: true, icon: 'fiber',
    title: 'Fiber (future-proofing)', use: 'New builds, expected growth',
    bw: '10–400+ Gbps headroom', atten: '~0.2 dB/km',
    emi: 'immune', cost: '$$ now, avoids re-cabling later' }
];

function nodeById(id) { return tree.find(n => n.id === id); }
function pathToRoot(id) { const a = []; let n = nodeById(id); while (n) { a.push(n.id); n = n.parent ? nodeById(n.parent) : null; } return a; }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  resetButton = createButton('Reset to root');
  resetButton.position(10, drawHeight + 10);
  resetButton.mousePressed(() => { selectedId = 'q1'; });
  describe('A decision tree for choosing a transmission medium based on ' +
    'mobility, distance, EMI environment, and cost, with a side panel of ' +
    'each medium\'s bandwidth, attenuation, EMI immunity, and cost.', LABEL);
}

function area() { const pw = min(290, canvasWidth * 0.33); return { tx: margin, tw: canvasWidth - pw - 3 * margin, px: canvasWidth - pw - margin, pw }; }
function pos(n, a) { return { x: a.tx + n.nx * a.tw, y: 50 + n.ny * (drawHeight - 90) }; }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  const a = area();
  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Choosing a Transmission Medium', a.tx + a.tw / 2, 6);

  const active = pathToRoot(selectedId);
  // edges
  for (const n of tree) {
    if (!n.parent) continue;
    const p = pos(n, a), pp = pos(nodeById(n.parent), a);
    const onPath = active.includes(n.id);
    stroke(onPath ? AMBER : '#b0bec5'); strokeWeight(onPath ? 3.5 : 1.5);
    line(pp.x, pp.y, p.x, p.y);
    // branch label
    noStroke(); fill(onPath ? '#c77f12' : '#90a4ae'); textAlign(CENTER, CENTER); textSize(11);
    text(n.branch, (pp.x + p.x) / 2, (pp.y + p.y) / 2 - 8);
  }
  for (const n of tree) drawNode(n, a, active);
  drawPanel(a);

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(13);
  text('Click a node to follow a path; hover a leaf for medium details.', 150, drawHeight + 25);
}

function drawNode(n, a, active) {
  const p = pos(n, a), onPath = active.includes(n.id);
  const dim = active.length > 1 && !onPath;
  const w = n.leaf ? 190 : 130, h = n.leaf ? 40 : 46;
  rectMode(CENTER);
  if (dim) fill(207, 216, 220, 130); else fill(n.leaf ? AMBER : SLATE);
  stroke(onPath ? '#c77f12' : '#37474f'); strokeWeight(onPath ? 3 : 1.5);
  rect(p.x, p.y, w, h, 8); rectMode(CORNER);
  noStroke(); fill(dim ? '#90a4ae' : (n.leaf ? '#3e2723' : 'white'));
  textAlign(CENTER, CENTER); textSize(n.leaf ? 12 : 12);
  if (n.leaf && n.icon) drawIcon(n.icon, p.x - w / 2 + 16, p.y, dim);
  text(n.title, p.x + (n.leaf ? 10 : 0), p.y, w - (n.leaf ? 30 : 10), h);
  n._box = { x: p.x - w / 2, y: p.y - h / 2, w, h };
}

function drawIcon(kind, x, y, dim) {
  push(); stroke(dim ? '#90a4ae' : '#3e2723'); strokeWeight(1.5); noFill();
  if (kind === 'fiber') { line(x - 6, y, x + 6, y); fill(dim ? '#90a4ae' : '#3e2723'); noStroke(); circle(x + 6, y, 4); }
  else if (kind === 'twisted') { for (let i = -6; i < 6; i += 3) { arc(x + i, y - 2, 3, 4, PI, TWO_PI); arc(x + i + 1.5, y + 2, 3, 4, 0, PI); } }
  else if (kind === 'coax') { circle(x, y, 12); fill(dim ? '#90a4ae' : '#3e2723'); noStroke(); circle(x, y, 4); }
  else if (kind === 'antenna') { line(x, y + 6, x, y - 4); line(x, y - 4, x - 4, y - 8); line(x, y - 4, x + 4, y - 8); }
  pop();
}

function drawPanel(a) {
  // panel reflects hovered leaf, else selected leaf, else prompt
  let n = null;
  for (const t of tree) if (t.leaf && t._box && inBox(t._box)) { n = t; break; }
  if (!n) { const s = nodeById(selectedId); if (s && s.leaf) n = s; }
  const px = a.px, py = 50, pw = a.pw, ph = drawHeight - 70;
  stroke('#b0bec5'); strokeWeight(1); fill(255, 255, 255, 246); rect(px, py, pw, ph, 8);
  let y = py + 12; const x = px + 12;
  noStroke(); textAlign(LEFT, TOP);
  if (!n) { fill('#607d8b'); textSize(14); wrapText('Hover or select a leaf to compare medium properties.', x, y, pw - 24, 20); return; }
  fill('#c77f12'); textSize(16); y = wrapText(n.title, x, y, pw - 24, 20) + 4;
  fill('#263238'); textSize(12);
  y = row('Typical use', n.use, x, y, pw - 24);
  y = row('Bandwidth', n.bw, x, y, pw - 24);
  y = row('Attenuation', n.atten, x, y, pw - 24);
  y = row('EMI immunity', n.emi, x, y, pw - 24);
  y = row('Cost / meter', n.cost, x, y, pw - 24);
}
function row(t, b, x, y, w) { fill('#607d8b'); textSize(11); text(t.toUpperCase(), x, y); y += 13; fill('#263238'); textSize(12); y = wrapText(b, x, y, w, 15); return y + 7; }
function inBox(b) { return mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h; }

function wrapText(str, x, y, w, lh) {
  const words = str.split(' '); let line = '';
  for (const word of words) { const test = line ? line + ' ' + word : word; if (textWidth(test) > w && line) { text(line, x, y); y += lh; line = word; } else line = test; }
  if (line) { text(line, x, y); y += lh; } return y;
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const n of tree) if (n._box && inBox(n._box)) { selectedId = n.id; return; }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
