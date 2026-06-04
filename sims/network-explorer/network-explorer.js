// Interactive Network Explorer
// CANVAS_HEIGHT: 552
// Click nodes and links in a small network to inspect their identifiers
// (MAC, IP, port) and role. Includes a Reset and a Quiz Me mode.
// Bloom levels: Remember (identify hosts vs. network nodes), Understand
// (which identifier belongs to which device), Apply (client vs. server ports).

// ---- Responsive canvas globals ----
let containerWidth;
let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 52;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

// Palette
const AMBER = '#F5A623';
const SLATE = '#546e7a';
const PURPLE = '#4a148c';

let resetButton, quizButton;
let selected = null;          // {kind:'node'|'link', ref}
let quizMode = false;
let quizFeedback = '';

// Nodes. nx/ny are normalized [0..1] within the topology region.
// role: 'host' (end system) or 'router' (network node).
const nodes = [
  { id: 'laptop',  label: 'Laptop',  type: 'host', glyph: 'laptop',
    nx: 0.08, ny: 0.18,
    ifaces: [{ name: 'wlan0', mac: 'a4:c3:f0:11:22:01', ip: '192.168.1.10' }],
    ports: ['ephemeral 50112 (client)'] },
  { id: 'phone',   label: 'Phone',   type: 'host', glyph: 'phone',
    nx: 0.08, ny: 0.45,
    ifaces: [{ name: 'wlan0', mac: 'a4:c3:f0:11:22:02', ip: '192.168.1.11' }],
    ports: ['ephemeral 50230 (client)'] },
  { id: 'tablet',  label: 'Tablet',  type: 'host', glyph: 'tablet',
    nx: 0.08, ny: 0.72,
    ifaces: [{ name: 'wlan0', mac: 'a4:c3:f0:11:22:03', ip: '192.168.1.12' }],
    ports: ['ephemeral 50341 (client)'] },
  { id: 'home',    label: 'Home Router', type: 'router', glyph: 'router',
    nx: 0.30, ny: 0.45,
    ifaces: [
      { name: 'lan',  mac: 'b8:27:eb:00:00:01', ip: '192.168.1.1' },
      { name: 'wan',  mac: 'b8:27:eb:00:00:02', ip: '203.0.113.5' }] },
  { id: 'isp1',    label: 'R-ISP-1', type: 'router', glyph: 'router',
    nx: 0.54, ny: 0.30,
    ifaces: [
      { name: 'if0', mac: '00:0c:29:aa:00:01', ip: '100.64.0.1' },
      { name: 'if1', mac: '00:0c:29:aa:00:02', ip: '100.64.0.2' }] },
  { id: 'isp2',    label: 'R-ISP-2', type: 'router', glyph: 'router',
    nx: 0.54, ny: 0.62,
    ifaces: [
      { name: 'if0', mac: '00:0c:29:bb:00:01', ip: '100.64.0.5' },
      { name: 'if1', mac: '00:0c:29:bb:00:02', ip: '100.64.0.6' }] },
  { id: 'server',  label: 'Web Server', type: 'host', glyph: 'server',
    nx: 0.84, ny: 0.45,
    ifaces: [
      { name: 'public',  mac: '00:1a:2b:3c:4d:5e', ip: '198.51.100.20' },
      { name: 'backend', mac: '00:1a:2b:3c:4d:5f', ip: '10.0.0.20' }],
    ports: ['80 (HTTP, listening)', '443 (HTTPS, listening)'] }
];

// Links. medium: 'wifi' (dashed amber) or 'wired' (slate). core: thicker.
const links = [
  { a: 'laptop', b: 'home', medium: 'wifi' },
  { a: 'phone',  b: 'home', medium: 'wifi' },
  { a: 'tablet', b: 'home', medium: 'wifi' },
  { a: 'home',   b: 'isp1', medium: 'wired' },
  { a: 'isp1',   b: 'isp2', medium: 'wired', core: true },
  { a: 'isp2',   b: 'server', medium: 'wired' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 10);
  resetButton.mousePressed(resetSelection);

  quizButton = createButton('Quiz Me');
  quizButton.position(80, drawHeight + 10);
  quizButton.mousePressed(toggleQuiz);

  describe('An interactive network diagram with three clients, a home ' +
    'router, two ISP routers, and a web server. Clicking any device or ' +
    'link shows its role and identifiers in a side panel.', LABEL);
}

function nodePos(n) {
  const topoW = canvasWidth * 0.60;
  return { x: 10 + n.nx * (topoW - 20), y: 44 + n.ny * (drawHeight - 80) };
}

function nodeById(id) { return nodes.find(n => n.id === id); }

function draw() {
  updateCanvasSize();

  // Backgrounds
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const panelX = canvasWidth * 0.62;

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Network Explorer', (canvasWidth * 0.62) / 2, 10);

  // Links
  for (const lk of links) drawLink(lk);
  // Nodes
  for (const n of nodes) drawNode(n);

  // Side panel
  drawPanel(panelX);

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text(quizMode ? 'Quiz mode: click the answer' : 'Click a device or link to inspect it',
       150, drawHeight + 26);
}

function drawLink(lk) {
  const pa = nodePos(nodeById(lk.a));
  const pb = nodePos(nodeById(lk.b));
  const isSel = selected && selected.kind === 'link' && selected.ref === lk;
  if (isSel) { stroke(PURPLE); strokeWeight(5); }
  else if (lk.medium === 'wifi') { stroke(AMBER); strokeWeight(2); }
  else { stroke(SLATE); strokeWeight(lk.core ? 4 : 3); }

  if (lk.medium === 'wifi') drawDashedLine(pa.x, pa.y, pb.x, pb.y);
  else line(pa.x, pa.y, pb.x, pb.y);
}

function drawDashedLine(x1, y1, x2, y2) {
  const d = dist(x1, y1, x2, y2);
  const steps = max(1, floor(d / 10));
  for (let i = 0; i < steps; i += 2) {
    const t1 = i / steps, t2 = min(1, (i + 1) / steps);
    line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
  }
}

function drawNode(n) {
  const p = nodePos(n);
  const isSel = selected && selected.kind === 'node' && selected.ref === n;
  push();
  translate(p.x, p.y);
  if (isSel) { stroke(PURPLE); strokeWeight(4); } else { stroke('#37474f'); strokeWeight(1.5); }
  if (n.type === 'router') {
    fill(SLATE);
    polygonHex(0, 0, 24);
  } else {
    fill(AMBER);
    circle(0, 0, 46);
  }
  // glyph hint (simple)
  noStroke();
  fill(n.type === 'router' ? 'white' : '#5D4037');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(glyphChar(n.glyph), 0, -1);
  pop();

  // label below
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  text(n.label, p.x, p.y + 26);
}

function glyphChar(g) {
  if (g === 'router') return 'R';
  if (g === 'server') return 'S';
  return 'H';
}

function polygonHex(cx, cy, r) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    const a = PI / 6 + i * PI / 3;
    vertex(cx + r * cos(a), cy + r * sin(a));
  }
  endShape(CLOSE);
}

function drawPanel(panelX) {
  const px = panelX, py = 40, pw = canvasWidth - panelX - margin, ph = drawHeight - 56;
  noStroke();
  fill(255, 255, 255, 240);
  stroke('#b0bec5');
  strokeWeight(1);
  rect(px, py, pw, ph, 8);

  noStroke();
  textAlign(LEFT, TOP);
  let y = py + 12;
  const x = px + 12;

  if (quizMode) {
    fill(PURPLE);
    textSize(15);
    y = wrapText('Which element here is a network node but not a host?', x, y, pw - 24, 19);
    y += 8;
    fill('#1b5e20');
    textSize(14);
    y = wrapText(quizFeedback || 'Click an element to answer.', x, y, pw - 24, 18);
    return;
  }

  if (!selected) {
    fill('#607d8b');
    textSize(15);
    wrapText('Click an element to inspect its role and identifiers.', x, y, pw - 24, 20);
    return;
  }

  if (selected.kind === 'link') {
    const lk = selected.ref;
    const na = nodeById(lk.a), nb = nodeById(lk.b);
    fill('black'); textSize(16);
    text('Communication Link', x, y); y += 26;
    fill('#37474f'); textSize(13);
    y = wrapText('Type: ' + (lk.medium === 'wifi' ? 'Wireless (Wi-Fi)' : 'Wired Ethernet') +
                 (lk.core ? ' — core link' : ''), x, y, pw - 24, 18);
    y += 6;
    y = wrapText('Connects: ' + na.label + '  ↔  ' + nb.label, x, y, pw - 24, 18);
    y += 6;
    y = wrapText('A link carries frames between two interfaces. It has no IP ' +
                 'or port of its own.', x, y, pw - 24, 18);
    return;
  }

  // node
  const n = selected.ref;
  fill('black'); textSize(16);
  let role;
  if (n.type === 'router') role = 'Role: Network Node (Router)';
  else if (n.id === 'server') role = 'Role: End System (Host, Server)';
  else role = 'Role: End System (Host, Client)';
  y = wrapText(role, x, y, pw - 24, 22); y += 6;

  fill('#37474f'); textSize(13);
  for (const f of n.ifaces) {
    y = wrapText('• ' + f.name + ' — MAC ' + f.mac, x, y, pw - 24, 17);
    y = wrapText('      IP ' + f.ip, x, y, pw - 24, 17);
  }
  y += 4;
  if (n.type === 'router') {
    fill('#b71c1c');
    y = wrapText('No port numbers — routers forward packets and don\'t run ' +
                 'user applications.', x, y, pw - 24, 17);
  } else {
    fill('#0d47a1');
    y = wrapText('Ports:', x, y, pw - 24, 17);
    for (const pt of n.ports) y = wrapText('   ' + pt, x, y, pw - 24, 17);
  }
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) {
      text(line, x, y); y += lh; line = word;
    } else { line = test; }
  }
  if (line) { text(line, x, y); y += lh; }
  return y;
}

function mousePressed() {
  if (mouseY > drawHeight) return;     // clicks in control area handled by buttons
  // node hit test first
  for (const n of nodes) {
    const p = nodePos(n);
    if (dist(mouseX, mouseY, p.x, p.y) <= 26) {
      handleSelect({ kind: 'node', ref: n });
      return;
    }
  }
  // link hit test
  for (const lk of links) {
    const pa = nodePos(nodeById(lk.a));
    const pb = nodePos(nodeById(lk.b));
    if (distToSegment(mouseX, mouseY, pa.x, pa.y, pb.x, pb.y) <= 7) {
      handleSelect({ kind: 'link', ref: lk });
      return;
    }
  }
}

function handleSelect(sel) {
  if (quizMode) {
    if (sel.kind === 'node' && sel.ref.type === 'router') {
      quizFeedback = '✓ Correct! ' + sel.ref.label + ' is a router (network ' +
        'node), which forwards packets but is not an end-system host.';
    } else {
      const what = sel.kind === 'link' ? 'A link' : (sel.ref.label + ' is a host/end system');
      quizFeedback = '✗ Not quite. ' + what + '. Try a router (R-ISP-1, ' +
        'R-ISP-2, or the Home Router).';
    }
    selected = sel;
  } else {
    selected = sel;
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = constrain(t, 0, 1);
  return dist(px, py, x1 + t * dx, y1 + t * dy);
}

function resetSelection() {
  selected = null;
  quizMode = false;
  quizFeedback = '';
  quizButton.html('Quiz Me');
}

function toggleQuiz() {
  quizMode = !quizMode;
  selected = null;
  quizFeedback = '';
  quizButton.html(quizMode ? 'Exit Quiz' : 'Quiz Me');
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
