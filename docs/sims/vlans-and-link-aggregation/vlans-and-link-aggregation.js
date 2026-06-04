// VLANs and Link Aggregation Together
// CANVAS_HEIGHT: 620
// Trace frames across two switches joined by a 4-port LAG, with VLAN access
// ports, an 802.1Q trunk, and a router for inter-VLAN routing.
// Bloom: Understand, Apply, Analyze.

let containerWidth;
let canvasWidth = 980;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const VCOL = { 10: '#F5A623', 20: '#1976D2', 30: '#2e7d32' };
const SLATE = '#546e7a';

const hosts = [
  { id: 'H1', vlan: 10, sw: 'S1' }, { id: 'H2', vlan: 20, sw: 'S1' },
  { id: 'H3', vlan: 10, sw: 'S1' }, { id: 'H4', vlan: 30, sw: 'S1' },
  { id: 'H5', vlan: 10, sw: 'S2' }, { id: 'H6', vlan: 20, sw: 'S2' },
  { id: 'H7', vlan: 30, sw: 'S2' }, { id: 'H8', vlan: 10, sw: 'S2' }
];
let lagMembers = [true, true, true, true];   // 4 LAG links; false = disabled
let vlanVisible = { 10: true, 20: true, 30: true };

let srcSelect, dstSelect, sendButton, bcastButton, lagButton;
let vlanChecks = {};
let frames = [];     // active animated frames

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  srcSelect = createSelect(); srcSelect.position(60, drawHeight + 10); hosts.forEach(h => srcSelect.option(h.id)); srcSelect.selected('H1');
  dstSelect = createSelect(); dstSelect.position(190, drawHeight + 10); hosts.forEach(h => dstSelect.option(h.id)); dstSelect.selected('H5');
  sendButton = createButton('Send frame'); sendButton.position(320, drawHeight + 10); sendButton.mousePressed(() => sendFrame(srcSelect.value(), dstSelect.value()));
  bcastButton = createButton('Send broadcast'); bcastButton.position(420, drawHeight + 10); bcastButton.mousePressed(sendBroadcast);
  lagButton = createButton('Disable LAG member'); lagButton.position(10, drawHeight + 46); lagButton.mousePressed(toggleLagMember);
  let x = 170;
  [10, 20, 30].forEach(v => { const cb = createCheckbox(' VLAN ' + v, true); cb.position(x, drawHeight + 48); cb.changed(() => vlanVisible[v] = cb.checked()); vlanChecks[v] = cb; x += 100; });

  describe('A two-switch enterprise topology with VLAN access ports, an ' +
    '802.1Q trunk, a 4-port link-aggregation bundle, and a router for ' +
    'inter-VLAN routing. Frames can be traced hop by hop.', LABEL);
}

function hostById(id) { return hosts.find(h => h.id === id); }
function P(nx, ny) { return { x: margin + nx * (canvasWidth - 2 * margin), y: 60 + ny * (drawHeight - 120) }; }
function S1() { return P(0.34, 0.55); }
function S2() { return P(0.66, 0.55); }
function RT() { return P(0.34, 0.12); }
function hostPos(h) {
  const left = ['H1', 'H2', 'H3', 'H4'], right = ['H5', 'H6', 'H7', 'H8'];
  const ys = [0.26, 0.44, 0.64, 0.82];
  if (left.includes(h.id)) return P(0.06, ys[left.indexOf(h.id)]);
  return P(0.94, ys[right.indexOf(h.id)]);
}
function lagLineY(i, base) { return base + (i - 1.5) * 9; }

function sendFrame(srcId, dstId) {
  if (srcId === dstId) return;
  const seg = buildPath(srcId, dstId);
  if (seg.length) frames.push({ seg, prog: 0, srcId, dstId });
}
function sendBroadcast() {
  const src = hostById(srcSelect.value());
  hosts.forEach(h => { if (h.id !== src.id && h.vlan === src.vlan) sendFrame(src.id, h.id); });
}
function toggleLagMember() {
  // disable the first enabled member, or re-enable all if all but one disabled
  const enabled = lagMembers.filter(Boolean).length;
  if (enabled <= 1) { lagMembers = [true, true, true, true]; lagButton.html('Disable LAG member'); }
  else { const i = lagMembers.indexOf(true); lagMembers[i] = false; lagButton.html('Disable LAG member (' + (enabled - 1) + '/4 up)'); }
}

function buildPath(srcId, dstId) {
  const src = hostById(srcId), dst = hostById(dstId);
  const s1 = S1(), s2 = S2(), r = RT();
  const sp = hostPos(src), dp = hostPos(dst);
  const srcSw = src.sw, dstSw = dst.sw;
  const interVlan = src.vlan !== dst.vlan;
  const segs = [];
  const add = (a, b, vlan, tagged, lagIdx) => segs.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, vlan, tagged: !!tagged, lagIdx: (lagIdx === undefined ? -1 : lagIdx) });

  // access link host -> its switch (untagged, source vlan)
  add(sp, srcSw === 'S1' ? s1 : s2, src.vlan, false);
  let curVlan = src.vlan;
  let cur = srcSw;

  if (interVlan) {
    // must reach router R (attached to S1 via trunk). Get to S1 first.
    if (cur === 'S2') { add(s2, s1, curVlan, true, lagPick(srcId, dstId)); cur = 'S1'; }
    add(s1, r, curVlan, true);           // trunk up to router (tagged)
    // router rewrites VLAN tag to destination VLAN
    add(r, s1, dst.vlan, true);          // back down trunk, now dst vlan
    curVlan = dst.vlan;
  }
  // now at S1 (or srcSw if intra-vlan); reach destination switch
  if (dstSw !== cur && !interVlan) {
    // intra-VLAN cross-switch over LAG trunk
    add(cur === 'S1' ? s1 : s2, dstSw === 'S1' ? s1 : s2, curVlan, true, lagPick(srcId, dstId));
    cur = dstSw;
  } else if (dstSw !== cur && interVlan) {
    // after router we're at S1; if dst on S2 cross the LAG
    if (dstSw === 'S2') { add(s1, s2, curVlan, true, lagPick(srcId, dstId)); cur = 'S2'; }
  }
  // egress access link switch -> dst host (untagged)
  add(dstSw === 'S1' ? s1 : s2, dp, dst.vlan, false);
  return segs;
}

function lagPick(srcId, dstId) {
  const enabled = []; lagMembers.forEach((up, i) => { if (up) enabled.push(i); });
  if (!enabled.length) return 0;
  const h = (parseInt(srcId.slice(1)) * 31 + parseInt(dstId.slice(1)) * 17) % enabled.length;
  return enabled[h];
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('VLANs and Link Aggregation', canvasWidth / 2, 8);

  const s1 = S1(), s2 = S2(), r = RT();

  // LAG bundle (4 parallel lines)
  for (let i = 0; i < 4; i++) {
    const y1 = lagLineY(i, s1.y), y2 = lagLineY(i, s2.y);
    stroke(lagMembers[i] ? '#90a4ae' : '#e0e0e0'); strokeWeight(lagMembers[i] ? 2 : 1);
    if (lagMembers[i]) line(s1.x, y1, s2.x, y2); else drawDashed(s1.x, y1, s2.x, y2);
  }
  noStroke(); fill('#607d8b'); textAlign(CENTER, BOTTOM); textSize(11);
  text('4-port LAG (802.1Q trunk)', (s1.x + s2.x) / 2, s1.y - 16);

  // trunk S1 -> Router (thick dashed)
  stroke(SLATE); strokeWeight(3); drawDashed(s1.x, s1.y, r.x, r.y);
  noStroke(); fill('#607d8b'); textAlign(LEFT, CENTER); textSize(10); text('trunk: VLANs 10,20,30', r.x + 36, (r.y + s1.y) / 2);

  // access links host->switch
  for (const h of hosts) {
    const hp = hostPos(h), sw = h.sw === 'S1' ? s1 : s2;
    stroke(vlanVisible[h.vlan] ? VCOL[h.vlan] : '#e0e0e0'); strokeWeight(2); line(hp.x, hp.y, sw.x, sw.y);
  }

  // nodes
  drawBox(r, 'R', '#37474f', 'white', 'router');
  drawBox(s1, 'S1', SLATE, 'white', 'switch');
  drawBox(s2, 'S2', SLATE, 'white', 'switch');
  for (const h of hosts) drawHost(h);

  // animate frames
  for (let k = frames.length - 1; k >= 0; k--) {
    const f = frames[k];
    f.prog += 0.012;
    drawFrame(f);
    if (f.prog >= f.seg.length) frames.splice(k, 1);
  }

  // legend
  noStroke(); textAlign(LEFT, CENTER); textSize(11);
  let lx = margin, ly = drawHeight - 16;
  [10, 20, 30].forEach(v => { fill(VCOL[v]); rect(lx, ly - 6, 12, 12); fill('#37474f'); text('VLAN ' + v, lx + 16, ly); lx += 90; });

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('From', 10, drawHeight + 20); text('to', 168, drawHeight + 20);
  fill('#455a64'); textSize(11); text('Click a host to send from it. Inter-VLAN flows route through R.', 470, drawHeight + 56);
}

function drawBox(p, label, fillc, txtc, kind) {
  noStroke(); fill(fillc); stroke('#37474f'); strokeWeight(1.5); rectMode(CENTER);
  rect(p.x, p.y, 50, 34, kind === 'router' ? 17 : 6); rectMode(CORNER);
  noStroke(); fill(txtc); textAlign(CENTER, CENTER); textSize(14); text(label, p.x, p.y);
}
function drawHost(h) {
  const p = hostPos(h), dim = !vlanVisible[h.vlan];
  noStroke(); fill(dim ? '#e0e0e0' : VCOL[h.vlan]); stroke('#37474f'); strokeWeight(1); rectMode(CENTER);
  rect(p.x, p.y, 44, 28, 5); rectMode(CORNER);
  noStroke(); fill(dim ? '#9e9e9e' : (h.vlan === 10 ? '#3e2723' : 'white')); textAlign(CENTER, CENTER); textSize(11);
  text(h.id, p.x, p.y - 4); textSize(8); text('VLAN ' + h.vlan, p.x, p.y + 8);
}

function drawFrame(f) {
  const idx = constrain(floor(f.prog), 0, f.seg.length - 1);
  const seg = f.seg[idx]; const local = f.prog - idx;
  const x = lerp(seg.x0, seg.x1, local), y = lerp(seg.y0, seg.y1, local);
  if (!vlanVisible[seg.vlan]) return;
  // highlight chosen LAG member
  if (seg.lagIdx >= 0) { stroke(VCOL[seg.vlan]); strokeWeight(4); const y1 = lagLineY(seg.lagIdx, S1().y), y2 = lagLineY(seg.lagIdx, S2().y); line(S1().x, y1, S2().x, y2); }
  noStroke(); fill(VCOL[seg.vlan]); stroke('#263238'); strokeWeight(1); rectMode(CENTER); rect(x, y, 18, 14, 3); rectMode(CORNER);
  if (seg.tagged) { noStroke(); fill('#4a148c'); rectMode(CENTER); rect(x, y - 14, 26, 11, 2); rectMode(CORNER); fill('white'); textAlign(CENTER, CENTER); textSize(7); text('802.1Q', x, y - 14); }
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 10); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const h of hosts) { const p = hostPos(h); if (abs(mouseX - p.x) < 22 && abs(mouseY - p.y) < 16) { srcSelect.selected(h.id); sendFrame(h.id, dstSelect.value()); return; } }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
