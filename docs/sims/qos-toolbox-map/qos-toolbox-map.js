// The QoS Toolbox
// CANVAS_HEIGHT: 540
// Places each QoS mechanism on an end-to-end path so students see which act at
// the edge, which in the core, and which are end-to-end signaling.
// Bloom level: Analyze.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const AMBER = '#F5A623';
let showNeutrality = false;
let neutralityButton;
let selected = -1;

// path nodes
const path = [
  { label: 'Sender',   kind: 'host' },
  { label: 'Edge R',   kind: 'edge' },
  { label: 'Core R1',  kind: 'core' },
  { label: 'Core R2',  kind: 'core' },
  { label: 'Edge R',   kind: 'edge' },
  { label: 'Receiver', kind: 'host' }
];

// mechanisms: attach[] = node indices, above = draw above path, color,
// state = 'stateful'|'stateless', neutrality flag
const mechs = [
  { name: 'Admission Control', attach: [1], above: true, color: '#5D4037',
    state: 'stateful', flag: true,
    purpose: 'Decides whether to accept a new flow given current commitments.',
    limits: 'Needs per-flow state and signaling; hard to scale on the Internet.',
    deploy: 'Enterprise voice/video gateways; IntServ domains.' },
  { name: 'Token / Leaky Bucket Shaping', attach: [1], above: true, color: '#1976D2',
    state: 'stateless', flag: false,
    purpose: 'Smooths or polices a flow to a contracted rate at ingress.',
    limits: 'Only shapes locally; says nothing about the core path.',
    deploy: 'Ingress edge of an ISP or campus network.' },
  { name: 'DSCP Marking (DiffServ)', attach: [1, 4], above: false, color: AMBER,
    state: 'stateless', flag: true,
    purpose: 'Marks each packet with a class so routers can treat it differently.',
    limits: 'Marks can be ignored or rewritten across domains; trust boundary issues.',
    deploy: 'Mark on entry, classify on exit at both edge routers.' },
  { name: 'Per-Class Queues', attach: [2, 3], above: true, color: '#2e7d32',
    state: 'stateless', flag: false,
    purpose: 'Separate queues per traffic class give priority classes lower delay.',
    limits: 'Coarse-grained; starvation risk for low-priority classes.',
    deploy: 'Core router output ports.' },
  { name: 'Fair Queuing / WFQ', attach: [2, 3], above: false, color: '#00897b',
    state: 'stateless', flag: false,
    purpose: 'Approximates per-flow fairness without per-flow reservations.',
    limits: 'More state/computation than FIFO; still per-packet, not guaranteed.',
    deploy: 'Core and edge router output scheduling.' },
  { name: 'RSVP Signaling (IntServ)', attach: [0, 5], above: false, color: '#6a1b9a',
    state: 'stateful', flag: false, signaling: true,
    purpose: 'End-to-end reservation of bandwidth/delay along the path.',
    limits: 'Per-flow state at every router — does not scale to the Internet core.',
    deploy: 'Small controlled domains needing hard guarantees.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  neutralityButton = createButton('Show net-neutrality flags');
  neutralityButton.position(10, drawHeight + 10);
  neutralityButton.mousePressed(() => { showNeutrality = !showNeutrality;
    neutralityButton.html(showNeutrality ? 'Hide net-neutrality flags' : 'Show net-neutrality flags'); });
  describe('A swimlane infographic showing six QoS mechanisms attached to an ' +
    'end-to-end path, grouped by where they act (edge, core, end-to-end) and ' +
    'whether they require per-flow state.', LABEL);
}

function nodeX(i) {
  const x0 = margin + 60, x1 = canvasWidth - panelW() - 60;
  return lerp(x0, x1, i / (path.length - 1));
}
function panelW() { return selected >= 0 ? min(250, canvasWidth * 0.30) : 0; }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('The QoS Toolbox: Where Each Mechanism Acts', (canvasWidth - panelW()) / 2, 6);

  const pathY = drawHeight * 0.46;

  // path line with chevrons
  stroke(AMBER); strokeWeight(6);
  line(nodeX(0), pathY, nodeX(path.length - 1), pathY);
  noStroke(); fill(AMBER);
  for (let i = 0; i < path.length - 1; i++) {
    const mx = (nodeX(i) + nodeX(i + 1)) / 2;
    triangle(mx + 6, pathY, mx - 4, pathY - 6, mx - 4, pathY + 6);
  }

  // nodes
  for (let i = 0; i < path.length; i++) drawNode(i, pathY);

  // mechanism callouts (above and below)
  let upY = pathY - 64, dnY = pathY + 70;
  for (let m = 0; m < mechs.length; m++) {
    const mech = mechs[m];
    const cx = mech.attach.reduce((s, ai) => s + nodeX(ai), 0) / mech.attach.length;
    const cy = mech.above ? upY : dnY;
    // connectors
    stroke(mech.color); strokeWeight(selected === m ? 3 : 1);
    for (const ai of mech.attach) line(nodeX(ai), pathY + (mech.above ? -10 : 10), cx, cy + (mech.above ? 22 : 0));
    drawCallout(m, cx, cy);
    if (mech.above) upY -= 0; else dnY += 0;
  }

  // cost legend
  noStroke(); fill('#37474f'); textAlign(LEFT, TOP); textSize(12);
  text('Per-flow state required (stateful): RSVP/IntServ, Admission Control', margin, drawHeight - 40);
  text('Stateless — per-packet only: DiffServ marking, Per-Class Queues, Fair Queuing', margin, drawHeight - 22);

  if (selected >= 0) drawSidebar();

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Click a mechanism for details.', 250, drawHeight + 25);
}

function drawNode(i, pathY) {
  const n = path[i], x = nodeX(i);
  const highlight = selected >= 0 && mechs[selected].attach.includes(i);
  if (n.kind === 'host') {
    noStroke(); fill('#90a4ae'); rectMode(CENTER); rect(x, pathY, 26, 26, 4); rectMode(CORNER);
  } else {
    const col = n.kind === 'core' ? '#37474f' : SLATEcolor();
    drawHex(x, pathY, 17, col, highlight);
    if (n.kind === 'edge') {
      noStroke(); fill('#c77f12'); textAlign(CENTER, CENTER); textSize(8);
      // border badge
      fill('#ffe0b2'); rect(x - 16, pathY - 24, 32, 12, 3);
      fill('#bf6a00'); text('border', x, pathY - 18);
    }
  }
  noStroke(); fill('#263238'); textAlign(CENTER, TOP); textSize(11);
  text(n.label, x, pathY + 18);
}
function SLATEcolor() { return '#607d8b'; }
function drawHex(cx, cy, r, col, hot) {
  stroke(hot ? AMBER : '#263238'); strokeWeight(hot ? 3 : 1); fill(col);
  beginShape();
  for (let i = 0; i < 6; i++) { const a = PI / 6 + i * PI / 3; vertex(cx + r * cos(a), cy + r * sin(a)); }
  endShape(CLOSE);
}

function drawCallout(m, cx, cy) {
  const mech = mechs[m];
  const w = 132, h = 34;
  const x = constrain(cx - w / 2, 2, canvasWidth - panelW() - w - 2);
  rectMode(CORNER);
  stroke(selected === m ? AMBER : mech.color); strokeWeight(selected === m ? 3 : 1.5);
  fill(red(color(mech.color)), green(color(mech.color)), blue(color(mech.color)), 40);
  rect(x, cy, w, h, 6);
  noStroke(); fill('#263238'); textAlign(CENTER, CENTER); textSize(9.5);
  text(mech.name, x + w / 2, cy + h / 2, w - 6, h);
  mech._box = { x, y: cy, w, h };
  if (showNeutrality && mech.flag) {
    fill('#c62828'); noStroke(); textAlign(LEFT, TOP); textSize(13);
    text('⚑', x + w - 14, cy + 1);
  }
  if (mech.signaling) {
    noStroke(); fill('#6a1b9a'); textAlign(CENTER, TOP); textSize(8);
    text('(out-of-band signaling)', x + w / 2, cy + h + 1);
  }
}

function drawSidebar() {
  const mech = mechs[selected];
  const pw = panelW(), px = canvasWidth - pw - margin, py = 40, ph = drawHeight - 60;
  stroke('#b0bec5'); strokeWeight(1); fill(255, 255, 255, 248);
  rect(px, py, pw, ph, 8);
  let y = py + 12; const x = px + 12;
  noStroke(); fill(mech.color); textAlign(LEFT, TOP); textSize(15);
  y = wrapText(mech.name, x, y, pw - 24, 19) + 4;
  fill('#263238'); textSize(12);
  y = label('Purpose', mech.purpose, x, y, pw - 24);
  y = label('Limitations', mech.limits, x, y, pw - 24);
  y = label('Typical deployment', mech.deploy, x, y, pw - 24);
  y = label('State', mech.state === 'stateful' ? 'Per-flow state required' : 'Stateless (per-packet)', x, y, pw - 24);
}
function label(t, body, x, y, w) {
  fill('#607d8b'); textSize(11); text(t.toUpperCase(), x, y); y += 14;
  fill('#263238'); textSize(12); y = wrapText(body, x, y, w, 15); return y + 8;
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' '); let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) { text(line, x, y); y += lh; line = word; } else line = test;
  }
  if (line) { text(line, x, y); y += lh; } return y;
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (let m = 0; m < mechs.length; m++) {
    const b = mechs[m]._box;
    if (b && mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      selected = (selected === m) ? -1 : m; return;
    }
  }
  selected = -1;
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
