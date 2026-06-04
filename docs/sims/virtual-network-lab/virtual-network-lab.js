// Network Lab Topology with Namespaces and netem
// CANVAS_HEIGHT: 600
// A Linux virtual network lab (4 namespaces, 2 bridges, veth pairs). Apply tc
// netem impairments to interfaces and watch RTT, loss, and throughput change.
// Bloom: Understand, Apply, Analyze.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 478;
let controlHeight = 122;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;
let sliderLeftMargin = 250;

const AMBER = '#F5A623', SLATE = '#546e7a', RED = '#e53935', BLUE = '#1976d2';

// impairable interfaces along the path
const IFACES = ['client→br0', 'router→br1', 'br1→east', 'br1→west'];
let impair = {};  // iface -> {lat, loss}
IFACES.forEach(i => impair[i] = { lat: 0, loss: 0 });

let target = 'server-east', testType = 'idle';
let targetSelect, ifaceSelect, latSlider, lossSlider, showCmd = false;
let pingBtn, iperfBtn, httpBtn, resetBtn, cmdBtn;
let packets = [];
let spawnAcc = 0, delivered = 0, sent = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  targetSelect = createSelect(); targetSelect.position(70, drawHeight + 8); ['server-east', 'server-west'].forEach(o => targetSelect.option(o)); targetSelect.changed(() => { target = targetSelect.value(); });
  ifaceSelect = createSelect(); ifaceSelect.position(300, drawHeight + 8); IFACES.forEach(o => ifaceSelect.option(o)); ifaceSelect.changed(loadIface);
  latSlider = createSlider(0, 500, 0, 10); latSlider.position(sliderLeftMargin, drawHeight + 40); latSlider.size(canvasWidth - sliderLeftMargin - margin); latSlider.input(storeIface);
  lossSlider = createSlider(0, 10, 0, 1); lossSlider.position(sliderLeftMargin, drawHeight + 66); lossSlider.size(canvasWidth - sliderLeftMargin - margin); lossSlider.input(storeIface);
  pingBtn = createButton('ping'); pingBtn.position(10, drawHeight + 92); pingBtn.mousePressed(() => testType = 'ping');
  iperfBtn = createButton('iperf'); iperfBtn.position(60, drawHeight + 92); iperfBtn.mousePressed(() => testType = 'iperf');
  httpBtn = createButton('http GET'); httpBtn.position(115, drawHeight + 92); httpBtn.mousePressed(() => testType = 'http');
  resetBtn = createButton('Reset impairments'); resetBtn.position(190, drawHeight + 92); resetBtn.mousePressed(() => { IFACES.forEach(i => impair[i] = { lat: 0, loss: 0 }); loadIface(); });
  cmdBtn = createButton('Show command line'); cmdBtn.position(340, drawHeight + 92); cmdBtn.mousePressed(() => { showCmd = !showCmd; cmdBtn.html(showCmd ? 'Hide command line' : 'Show command line'); });
  describe('A Linux virtual network lab with four namespaces (client, router, ' +
    'server-east, server-west) joined by two bridges and veth pairs, where tc ' +
    'netem impairments on each interface change observed RTT, loss, and throughput.', LABEL);
}
function loadIface() { const im = impair[ifaceSelect.value()]; latSlider.value(im.lat); lossSlider.value(im.loss); }
function storeIface() { impair[ifaceSelect.value()] = { lat: latSlider.value(), loss: lossSlider.value() }; }

function P(nx, ny) { return { x: margin + nx * (canvasWidth - 2 * margin), y: 50 + ny * (drawHeight - 110) }; }
const NODES = {
  client: () => P(0.06, 0.5), br0: () => P(0.28, 0.5), router: () => P(0.5, 0.5),
  br1: () => P(0.72, 0.5), 'server-east': () => P(0.94, 0.28), 'server-west': () => P(0.94, 0.72)
};
function pathNodes() { return ['client', 'br0', 'router', 'br1', target]; }
function pathIfaces() { return ['client→br0', 'router→br1', target === 'server-east' ? 'br1→east' : 'br1→west']; }

function metrics() {
  const ifs = pathIfaces();
  let lat = 0, lossProd = 1;
  ifs.forEach(i => { lat += impair[i].lat; lossProd *= (1 - impair[i].loss / 100); });
  const loss = (1 - lossProd) * 100;
  const rtt = 2 * (5 + lat);          // base 5ms each way + latencies
  const thru = 1000 * lossProd / (1 + lat / 40);   // Mbps rough
  return { lat, loss, rtt, thru };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Virtual Network Lab (namespaces + tc netem)', canvasWidth / 2, 6);

  // host container
  noStroke(); fill(245, 247, 250); stroke('#cfd8dc'); rect(margin, 40, canvasWidth - 2 * margin, drawHeight - 150, 8);
  noStroke(); fill('#90a4ae'); textAlign(LEFT, TOP); textSize(11); text('single Linux host', margin + 8, 44);

  // veth edges
  drawEdge('client', 'br0'); drawEdge('br0', 'router'); drawEdge('router', 'br1');
  drawEdge('br1', 'server-east'); drawEdge('br1', 'server-west');

  // nodes
  drawNs('client', 'client'); drawNs('router', 'router'); drawNs('server-east', 'server-east'); drawNs('server-west', 'server-west');
  drawBridge('br0'); drawBridge('br1');

  // impairment badges
  for (const i of IFACES) if (impair[i].lat > 0 || impair[i].loss > 0) drawBadge(i);

  // packets
  if (testType !== 'idle') { spawnAcc += 1; const m = metrics(); if (spawnAcc > 14) { spawnAcc = 0; spawnPacket(m); } }
  updatePackets();

  drawStats();
  if (showCmd) drawCommands();

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Target:', 10, drawHeight + 18); text('Impair iface:', 200, drawHeight + 18);
  text('Latency: ' + latSlider.value() + ' ms', 10, drawHeight + 50);
  text('Loss: ' + lossSlider.value() + ' %', 10, drawHeight + 76);
}

function drawEdge(a, b) { const pa = NODES[a](), pb = NODES[b](); stroke(AMBER); strokeWeight(1.5); drawDashed(pa.x, pa.y, pb.x, pb.y); }
function drawNs(key, label) { const p = NODES[key](); noStroke(); fill(SLATE); stroke('#37474f'); strokeWeight(1.5); rectMode(CENTER); rect(p.x, p.y, 92, 40, 7); rectMode(CORNER); noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(11); text(label, p.x, p.y - 5); textSize(8); text('netns', p.x, p.y + 9); }
function drawBridge(key) { const p = NODES[key](); stroke('#455a64'); strokeWeight(1.5); fill('#90a4ae'); beginShape(); for (let i = 0; i < 6; i++) { const a = PI / 6 + i * PI / 3; vertex(p.x + 22 * cos(a), p.y + 22 * sin(a)); } endShape(CLOSE); noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(11); text(key, p.x, p.y); }

function drawBadge(iface) {
  // place badge near the relevant edge midpoint
  const map = { 'client→br0': ['client', 'br0'], 'router→br1': ['router', 'br1'], 'br1→east': ['br1', 'server-east'], 'br1→west': ['br1', 'server-west'] };
  const [a, b] = map[iface]; const pa = NODES[a](), pb = NODES[b]();
  const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2 - 14;
  const im = impair[iface];
  const col = im.loss > 0 ? RED : BLUE;
  noStroke(); fill(col); rectMode(CENTER); rect(mx, my, 70, 16, 3); rectMode(CORNER);
  fill('white'); textAlign(CENTER, CENTER); textSize(9); text((im.lat ? im.lat + 'ms ' : '') + (im.loss ? im.loss + '%' : ''), mx, my);
}

function spawnPacket(m) {
  sent++;
  const dropped = random(100) < m.loss;
  packets.push({ t: 0, speed: 0.02 / (1 + m.lat / 80), dropped, dropAt: random(0.3, 0.9) });
}
function updatePackets() {
  const nodes = pathNodes().map(k => NODES[k]());
  for (let k = packets.length - 1; k >= 0; k--) {
    const p = packets[k]; p.t += p.speed;
    if (p.dropped && p.t >= p.dropAt) { // show drop then remove
      const pos = along(nodes, p.dropAt); noStroke(); fill(RED); textAlign(CENTER, CENTER); textSize(14); text('✗', pos.x, pos.y - 10); packets.splice(k, 1); continue;
    }
    if (p.t >= 1) { delivered++; packets.splice(k, 1); continue; }
    const pos = along(nodes, p.t); noStroke(); fill(p.dropped ? '#ef9a9a' : AMBER); circle(pos.x, pos.y, 8);
  }
}
function along(nodes, t) {
  const segs = nodes.length - 1; const ft = constrain(t, 0, 0.999) * segs; const i = floor(ft); const local = ft - i;
  return { x: lerp(nodes[i].x, nodes[i + 1].x, local), y: lerp(nodes[i].y, nodes[i + 1].y, local) };
}

function drawStats() {
  const m = metrics(); const x = margin, y = drawHeight - 100;
  noStroke(); fill(255, 255, 255, 235); stroke('#b0bec5'); rect(x, y, 250, 86, 6);
  noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(12); text('Client observes (' + (testType === 'idle' ? 'idle' : testType) + ' → ' + target + ')', x + 8, y + 6);
  fill(BLUE); text('RTT: ' + m.rtt.toFixed(0) + ' ms', x + 8, y + 26);
  fill(RED); text('Loss: ' + m.loss.toFixed(1) + ' %', x + 8, y + 44);
  fill('#1b5e20'); text('Throughput: ' + m.thru.toFixed(0) + ' Mbps', x + 8, y + 62);
}

function drawCommands() {
  const x = canvasWidth - 360 - margin, y = drawHeight - 110;
  noStroke(); fill('#263238'); rect(x, y, 360, 96, 6);
  noStroke(); fill('#a5d6a7'); textFont('monospace'); textAlign(LEFT, TOP); textSize(10);
  const im = impair[ifaceSelect.value()];
  const lines = [
    'ip netns add client; ip netns add router',
    'ip link add veth0 type veth peer name veth1',
    'ip link set veth0 netns client; ... ; ip link set up',
    'ip link add name br0 type bridge',
    'tc qdisc add dev ' + ifaceSelect.value().split('→')[0] + ' root netem \\',
    '   delay ' + im.lat + 'ms loss ' + im.loss + '%'
  ];
  for (let i = 0; i < lines.length; i++) text(lines[i], x + 8, y + 6 + i * 14);
  textFont('Arial');
}

function drawDashed(x1, y1, x2, y2) { const d = dist(x1, y1, x2, y2), steps = floor(d / 9); for (let i = 0; i < steps; i += 2) { const t1 = i / steps, t2 = min(1, (i + 1) / steps); line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2)); } }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); latSlider.size(canvasWidth - sliderLeftMargin - margin); lossSlider.size(canvasWidth - sliderLeftMargin - margin); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
