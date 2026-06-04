// BSS and ESS Topology (Wi-Fi Roaming)
// CANVAS_HEIGHT: 596
// Three APs share one SSID (an ESS); each is its own BSS. Drag the client
// through the floor plan to trigger roaming handoffs. Bloom: Understand,
// Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 498;
let controlHeight = 98;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623', SLATE = '#546e7a', GREEN = '#43a047', RED = '#e53935';

const aps = [
  { id: 'AP-1', bssid: '00:11:22:aa:bb:01', nx: 0.18 },
  { id: 'AP-2', bssid: '00:11:22:aa:bb:02', nx: 0.50 },
  { id: 'AP-3', bssid: '00:11:22:aa:bb:03', nx: 0.82 }
];
let client = { x: 0, y: 0, init: false };
let dragging = false;
let currentAP = 0;
let handoff = { active: false, t: 0, from: 0, to: 0 };

let autoWalk = false, slowHandoff = false, showBackbone = false;
let walkBtn, slowBtn, backboneBtn, speedSlider;
let walkDir = 1;
let sliderLeftMargin = 150;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  walkBtn = createButton('Auto-walk: off'); walkBtn.position(10, drawHeight + 8); walkBtn.mousePressed(() => { autoWalk = !autoWalk; walkBtn.html(autoWalk ? 'Auto-walk: on' : 'Auto-walk: off'); });
  slowBtn = createButton('Slow handoff: off'); slowBtn.position(125, drawHeight + 8); slowBtn.mousePressed(() => { slowHandoff = !slowHandoff; slowBtn.html(slowHandoff ? 'Slow handoff: on' : 'Slow handoff: off'); });
  backboneBtn = createButton('Show wired backbone'); backboneBtn.position(265, drawHeight + 8); backboneBtn.mousePressed(() => { showBackbone = !showBackbone; backboneBtn.html(showBackbone ? 'Hide wired backbone' : 'Show wired backbone'); });
  speedSlider = createSlider(1, 6, 2, 1); speedSlider.position(sliderLeftMargin, drawHeight + 50); speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  describe('A three-access-point Wi-Fi floor plan where a draggable client ' +
    'associates with the strongest AP and performs a roaming handoff when it ' +
    'crosses into another AP region. All APs share one SSID, forming an ESS.', LABEL);
}

function floorRect() { return { x: margin, y: 70, w: canvasWidth - 2 * margin, h: drawHeight - 150 }; }
function apPos(ap) { const f = floorRect(); return { x: f.x + ap.nx * f.w, y: f.y + f.h * 0.42 }; }
function wallXs() { const f = floorRect(); return [f.x + f.w / 3, f.x + 2 * f.w / 3]; }

function wallsBetween(ax, bx) { return wallXs().filter(wx => (wx > min(ax, bx) && wx < max(ax, bx))).length; }
function rssi(ap) {
  const p = apPos(ap); const d = dist(client.x, client.y, p.x, p.y);
  const walls = wallsBetween(client.x, p.x);
  return -40 - 20 * Math.log10(max(d, 8) / 40) - 14 * walls;   // dBm
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const f = floorRect();
  if (!client.init) { client.x = f.x + f.w * 0.18; client.y = f.y + f.h * 0.72; client.init = true; }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('BSS, ESS, and Roaming  —  SSID "Office_Wi-Fi"', canvasWidth / 2, 8);

  // signal regions
  for (let i = 0; i < aps.length; i++) {
    const p = apPos(aps[i]);
    noStroke();
    for (let r = 4; r >= 1; r--) { fill(245, 166, 35, 12 * r); circle(p.x, p.y, f.w * 0.20 * r / 2); }
  }

  // floor plan walls
  noStroke(); fill('#eceff1'); rect(f.x, f.y, f.w, f.h); noFill(); stroke('#90a4ae'); strokeWeight(2); rect(f.x, f.y, f.w, f.h);
  for (const wx of wallXs()) { stroke('#9e9e9e'); strokeWeight(8); line(wx, f.y, wx, f.y + f.h); }

  // backbone
  if (showBackbone) {
    const sw = { x: f.x + f.w / 2, y: f.y - 30 };
    stroke(SLATE); strokeWeight(2);
    for (const ap of aps) { const p = apPos(ap); line(p.x, p.y, sw.x, sw.y); }
    noStroke(); fill(SLATE); rectMode(CENTER); rect(sw.x, sw.y, 70, 22, 5); rectMode(CORNER); fill('white'); textAlign(CENTER, CENTER); textSize(11); text('Switch', sw.x, sw.y);
  }

  // APs
  let best = 0, bestR = -999;
  for (let i = 0; i < aps.length; i++) { const r = rssi(aps[i]); if (r > bestR) { bestR = r; best = i; } }
  for (let i = 0; i < aps.length; i++) drawAP(aps[i], i, i === currentAP);

  // roaming detection
  if (best !== currentAP && !handoff.active) { handoff = { active: true, t: 0, from: currentAP, to: best }; }
  if (handoff.active) {
    handoff.t += 0.02 / (slowHandoff ? 2.2 : 1);
    if (handoff.t >= 1) { currentAP = handoff.to; handoff.active = false; }
  }

  // auto-walk
  if (autoWalk) {
    client.x += walkDir * speedSlider.value() * 0.6;
    if (client.x > f.x + f.w * 0.9) walkDir = -1; if (client.x < f.x + f.w * 0.1) walkDir = 1;
  }

  drawClient();
  drawRSSIMeter(f);

  // status
  noStroke(); textAlign(LEFT, TOP); textSize(13);
  if (handoff.active) { fill(RED); text('Roaming: ' + aps[handoff.from].id + ' → ' + aps[handoff.to].id + '  (probe → assoc → brief drop → reassoc)', margin, f.y + f.h + 8); }
  else { fill('#1b5e20'); text('Associated with ' + aps[currentAP].id + '  (BSSID ' + aps[currentAP].bssid + ')', margin, f.y + f.h + 8); }

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13); text('Walk speed: ' + speedSlider.value(), 10, drawHeight + 60);
}

function drawAP(ap, i, assoc) {
  const p = apPos(ap);
  noStroke(); fill(AMBER); stroke(assoc ? GREEN : '#c77f12'); strokeWeight(assoc ? 3 : 1.5);
  rectMode(CENTER); rect(p.x, p.y, 56, 30, 6); rectMode(CORNER);
  // antenna
  stroke('#c77f12'); strokeWeight(2); line(p.x, p.y - 15, p.x, p.y - 24); noStroke(); fill('#c77f12'); circle(p.x, p.y - 25, 5);
  fill('#3e2723'); textAlign(CENTER, CENTER); textSize(12); text(ap.id, p.x, p.y);
  // hover BSSID
  if (dist(mouseX, mouseY, p.x, p.y) < 30) { noStroke(); fill(255, 255, 255, 245); stroke('#37474f'); rect(p.x + 16, p.y - 40, 150, 20, 4); noStroke(); fill('#263238'); textAlign(LEFT, CENTER); textSize(11); text('BSSID ' + ap.bssid, p.x + 22, p.y - 30); }
}

function drawClient() {
  const blink = handoff.active && (frameCount % 20 < 10);
  noStroke(); fill(blink ? '#ffcdd2' : '#eceff1'); stroke(blink ? RED : '#37474f'); strokeWeight(2);
  rectMode(CENTER); rect(client.x, client.y, 34, 22, 3); rect(client.x, client.y + 13, 44, 4, 1); rectMode(CORNER);
  noStroke(); fill(handoff.active ? RED : GREEN); circle(client.x + 14, client.y - 8, 6);
  fill('#37474f'); textAlign(CENTER, TOP); textSize(10); text('client', client.x, client.y + 18);
  // link to current AP
  const p = apPos(aps[currentAP]); stroke(handoff.active ? RED : GREEN); strokeWeight(1.5); drawDashed(client.x, client.y, p.x, p.y);
}

function drawRSSIMeter(f) {
  const mx = f.x + f.w - 150, my = f.y + 10;
  noStroke(); fill(255, 255, 255, 235); stroke('#b0bec5'); rect(mx, my, 140, 78, 6);
  noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(11); text('RSSI to client (dBm)', mx + 8, my + 4);
  for (let i = 0; i < aps.length; i++) {
    const r = rssi(aps[i]); const frac = constrain((r + 95) / 55, 0, 1);
    const y = my + 22 + i * 17;
    fill('#37474f'); text(aps[i].id, mx + 8, y - 2);
    fill('#cfd8dc'); rect(mx + 48, y, 70, 10, 2);
    fill(i === currentAP ? GREEN : AMBER); rect(mx + 48, y, 70 * frac, 10, 2);
    fill('#546e7a'); textAlign(RIGHT, TOP); textSize(9); text(r.toFixed(0), mx + 134, y); textAlign(LEFT, TOP);
  }
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 9); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function mousePressed() { if (dist(mouseX, mouseY, client.x, client.y) < 26) dragging = true; }
function mouseDragged() { if (dragging) { const f = floorRect(); client.x = constrain(mouseX, f.x + 6, f.x + f.w - 6); client.y = constrain(mouseY, f.y + 6, f.y + f.h - 6); } }
function mouseReleased() { dragging = false; }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); speedSlider.size(canvasWidth - sliderLeftMargin - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
