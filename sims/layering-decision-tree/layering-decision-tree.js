// Layering Decision Tree
// CANVAS_HEIGHT: 632
// Interactive decision tree that recommends a transport-layer protocol for a
// new application based on what it sends and its service-model needs.
// Bloom levels: Apply, Evaluate.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 582;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const SLATE = '#546e7a';
const AMBER = '#F5A623';

let showApps = false;
let appsButton, resetButton;
let selectedId = 'root';

// Tree nodes. nx is normalized [0..1] within the tree area; level sets y.
const tree = [
  { id: 'root', parent: null, level: 0, nx: 0.5,
    title: 'What does your\napplication send?',
    rationale: 'Start with the data pattern. The transport service you need ' +
      'follows from how the application produces and consumes data.' },

  { id: 'q1', parent: 'root', level: 1, nx: 0.18,
    title: 'Short\nrequest/response\n→ Loss tolerable?',
    rationale: 'Request/response exchanges are short. Whether you can tolerate ' +
      'loss decides between reliable TCP and lightweight UDP.' },
  { id: 'q2', parent: 'root', level: 1, nx: 0.5,
    title: 'Continuous stream\n→ Latency or\ncorrectness?',
    rationale: 'A continuous stream forces a trade-off: minimize delay, or ' +
      'guarantee every byte arrives in order.' },
  { id: 'q3', parent: 'root', level: 1, nx: 0.82,
    title: 'One-to-many\n→ Controlled or\npublic network?',
    rationale: 'Delivering to many receivers depends on whether you control ' +
      'the network path (so you can use multicast) or must cross the Internet.' },

  { id: 'l1', parent: 'q1', level: 2, nx: 0.10, leaf: true, rec: 'TCP',
    title: 'Loss NOT tolerable',
    rationale: 'Choose TCP: connection-oriented, reliable, ordered. The ' +
      'end-to-end principle puts reliability in the endpoints, not the network.',
    apps: ['Web (HTTPS)', 'Email (SMTP)'] },
  { id: 'l2', parent: 'q1', level: 2, nx: 0.27, leaf: true, rec: 'UDP',
    title: 'Loss tolerable',
    rationale: 'Choose UDP: connectionless and best-effort. Skipping setup and ' +
      'retransmission keeps each tiny exchange fast and stateless.',
    apps: ['DNS query', 'NTP time sync'] },
  { id: 'l3', parent: 'q2', level: 2, nx: 0.42, leaf: true, rec: 'UDP / QUIC + FEC',
    title: 'Latency matters most',
    rationale: 'Choose UDP or QUIC with application-level FEC. A late packet is ' +
      'useless for live media, so the app handles loss rather than waiting.',
    apps: ['Zoom', 'FaceTime'] },
  { id: 'l4', parent: 'q2', level: 2, nx: 0.59, leaf: true, rec: 'TCP',
    title: 'Correctness matters most',
    rationale: 'Choose TCP: every byte must arrive in order. Buffering hides ' +
      'jitter when a few seconds of startup delay is acceptable.',
    apps: ['Netflix (DASH)', 'Spotify download'] },
  { id: 'l5', parent: 'q3', level: 2, nx: 0.74, leaf: true, rec: 'Multicast',
    title: 'Controlled network',
    rationale: 'Use IP multicast: the network replicates one packet to a group, ' +
      'saving bandwidth — feasible only where you control the routers.',
    apps: ['IPTV', 'Trading-floor feeds'] },
  { id: 'l6', parent: 'q3', level: 2, nx: 0.91, leaf: true, rec: 'Unicast / Anycast',
    title: 'Public Internet',
    rationale: 'Use unicast with server-side replication, or anycast to reach ' +
      'the nearest of many identical servers. Multicast rarely crosses the Internet.',
    apps: ['CDN video', 'DNS root (anycast)'] }
];

function nodeById(id) { return tree.find(n => n.id === id); }
function pathToRoot(id) {
  const ids = []; let n = nodeById(id);
  while (n) { ids.push(n.id); n = n.parent ? nodeById(n.parent) : null; }
  return ids;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  appsButton = createButton('Show example apps');
  appsButton.position(10, drawHeight + 10);
  appsButton.mousePressed(() => { showApps = !showApps;
    appsButton.html(showApps ? 'Hide example apps' : 'Show example apps'); });

  resetButton = createButton('Reset to root');
  resetButton.position(170, drawHeight + 10);
  resetButton.mousePressed(() => { selectedId = 'root'; });

  describe('An interactive decision tree for choosing a transport protocol. ' +
    'Clicking a node highlights the path from the root question to that node ' +
    'and shows a rationale referencing the end-to-end principle.', LABEL);
}

function treeArea() {
  const panelW = min(280, canvasWidth * 0.32);
  return { tx: margin, tw: canvasWidth - panelW - 3 * margin, px: canvasWidth - panelW - margin, pw: panelW };
}

function nodePos(n, area) {
  const ys = [60, 230, 430];
  return { x: area.tx + n.nx * area.tw, y: ys[n.level] };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  const area = treeArea();
  text('Transport Protocol Decision Tree', area.tx + area.tw / 2, 6);

  const active = pathToRoot(selectedId);

  // Edges
  for (const n of tree) {
    if (!n.parent) continue;
    const p = nodePos(n, area), pp = nodePos(nodeById(n.parent), area);
    const onPath = active.includes(n.id);
    stroke(onPath ? AMBER : '#b0bec5');
    strokeWeight(onPath ? 4 : 1.5);
    line(pp.x, pp.y + 24, p.x, p.y - 24);
  }
  // Nodes
  for (const n of tree) drawNode(n, area, active);

  // Side panel
  drawPanel(area);

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(13);
  text('Click a node to choose a path.', 320, drawHeight + 25);
}

function drawNode(n, area, active) {
  const p = nodePos(n, area);
  const onPath = active.includes(n.id);
  const dim = active.length > 1 && !onPath;
  const w = n.level === 0 ? 150 : (n.leaf ? 118 : 130);
  const h = n.leaf ? 64 : 54;
  rectMode(CENTER);
  if (dim) { fill(176, 190, 197, 110); } else { fill(n.leaf ? '#455a64' : SLATE); }
  stroke(onPath ? AMBER : '#37474f'); strokeWeight(onPath ? 3 : 1.5);
  rect(p.x, p.y, w, h, 8);
  rectMode(CORNER);

  noStroke(); fill(dim ? '#cfd8dc' : 'white');
  textAlign(CENTER, CENTER); textSize(n.level === 0 ? 12 : 11);
  text(n.title, p.x, p.y - (n.leaf ? 8 : 0), w - 8, h);

  if (n.leaf) {
    noStroke(); fill(dim ? '#b0bec5' : AMBER);
    textSize(12); textStyle(BOLD);
    text('→ ' + n.rec, p.x, p.y + 16);
    textStyle(NORMAL);
    if (showApps && !dim) {
      fill('#1b5e20'); textSize(9.5);
      text(n.apps.join(' · '), p.x, p.y + h / 2 + 9, w + 20, 14);
    }
  }
}

function drawPanel(area) {
  const px = area.px, py = 50, pw = area.pw, ph = drawHeight - 70;
  stroke('#b0bec5'); strokeWeight(1); fill(255, 255, 255, 245);
  rect(px, py, pw, ph, 8);
  const n = nodeById(selectedId);
  noStroke(); textAlign(LEFT, TOP);
  let y = py + 12; const x = px + 12;
  fill('black'); textSize(15);
  y = wrapText(n.title.replace(/\n/g, ' '), x, y, pw - 24, 20) + 6;
  if (n.leaf) {
    fill('white'); stroke(AMBER); strokeWeight(1);
    rect(x, y, pw - 24, 26, 5); noStroke();
    fill('#c77f12'); textSize(14); textStyle(BOLD);
    text('Recommended: ' + n.rec, x + 8, y + 6); textStyle(NORMAL);
    y += 36;
  }
  fill('#37474f'); textSize(13);
  y = wrapText(n.rationale, x, y, pw - 24, 18) + 8;
  fill('#607d8b'); textSize(12);
  y = wrapText('Service-model dimensions: connection-oriented vs. ' +
    'connectionless · reliable vs. best-effort · stateful vs. stateless · ' +
    'addressing scope.', x, y, pw - 24, 16);
  if (n.leaf && showApps) {
    y += 8; fill('#1b5e20'); textSize(13);
    wrapText('Example apps: ' + n.apps.join(', '), x, y, pw - 24, 17);
  }
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) { text(line, x, y); y += lh; line = word; }
    else line = test;
  }
  if (line) { text(line, x, y); y += lh; }
  return y;
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const area = treeArea();
  for (const n of tree) {
    const p = nodePos(n, area);
    const w = n.level === 0 ? 150 : 130, h = 64;
    if (abs(mouseX - p.x) <= w / 2 && abs(mouseY - p.y) <= h / 2) {
      selectedId = n.id; return;
    }
  }
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
