// CIDR Subnet Calculator
// CANVAS_HEIGHT: 560
// Enter a CIDR block and a subnet prefix; see the subnets as colored bands on
// an address-space ruler, plus a bit-level network/host split.
// Bloom: Apply, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 450;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const NETBIT = '#1a237e', HOSTBIT = '#fff59d', AMBER = '#F5A623', SLATE = '#90a4ae', RED = '#e53935';

let cidrInput, prefixSelect, maskToggle;
let showMask = false;
let parentIp = 0, parentPrefix = 24, newPrefix = 26, valid = true;
let hoverSubnet = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  cidrInput = createInput('198.51.100.0/24'); cidrInput.position(70, drawHeight + 10); cidrInput.size(170); cidrInput.input(parseCidr);
  prefixSelect = createSelect(); prefixSelect.position(360, drawHeight + 10);
  for (let p = 8; p <= 30; p++) prefixSelect.option('/' + p);
  prefixSelect.selected('/26'); prefixSelect.changed(() => { newPrefix = parseInt(prefixSelect.value().slice(1)); });
  maskToggle = createButton('Show dotted-decimal mask'); maskToggle.position(10, drawHeight + 46); maskToggle.mousePressed(() => { showMask = !showMask; maskToggle.html(showMask ? 'Hide dotted-decimal mask' : 'Show dotted-decimal mask'); });
  parseCidr();
  describe('A CIDR subnet calculator: a parent block is divided into equal ' +
    'subnets shown as colored bands with network, broadcast, and host ranges, ' +
    'plus a binary network/host bit split.', LABEL);
}

function parseCidr() {
  const v = cidrInput.value().trim();
  const m = v.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  valid = false;
  if (!m) return;
  const oct = [+m[1], +m[2], +m[3], +m[4]]; const pfx = +m[5];
  if (oct.some(o => o > 255) || pfx > 32) return;
  parentPrefix = pfx;
  parentIp = ((oct[0] << 24) | (oct[1] << 16) | (oct[2] << 8) | oct[3]) >>> 0;
  parentIp = (parentIp & maskInt(pfx)) >>> 0;   // normalize to network
  valid = true;
  // ensure newPrefix >= parentPrefix
  if (newPrefix < parentPrefix) { newPrefix = parentPrefix; prefixSelect.selected('/' + newPrefix); }
}
function maskInt(p) { return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0; }
function intToIp(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('CIDR Subnet Calculator', canvasWidth / 2, 6);

  if (!valid) { noStroke(); fill(RED); textAlign(CENTER, CENTER); textSize(16); text('Enter a valid CIDR block, e.g. 198.51.100.0/24', canvasWidth / 2, drawHeight / 2); drawControlsLabels(); return; }
  if (newPrefix < parentPrefix) newPrefix = parentPrefix;

  const np = max(newPrefix, parentPrefix);
  const numSubnets = Math.pow(2, np - parentPrefix);
  const subnetSize = Math.pow(2, 32 - np);

  // ruler
  const rx = margin, ry = 70, rw = canvasWidth - 2 * margin, rh = 30;
  noStroke(); fill('#eceff1'); rect(rx, ry, rw, rh, 4);
  noStroke(); fill('#37474f'); textAlign(LEFT, BOTTOM); textSize(12);
  text('Address space of ' + intToIp(parentIp) + '/' + parentPrefix + (showMask ? '   mask ' + intToIp(maskInt(parentPrefix)) : '') + '   (' + numSubnets + ' subnets of /' + np + ')', rx, ry - 4);

  const showN = min(numSubnets, 64);
  hoverSubnet = -1;
  for (let i = 0; i < showN; i++) {
    const x = rx + (i / numSubnets) * rw, w = (1 / numSubnets) * rw;
    fill(i % 2 ? SLATE : AMBER); noStroke(); rect(x, ry, max(1, w), rh);
    if (mouseX >= x && mouseX < x + w && mouseY >= ry && mouseY <= ry + rh) hoverSubnet = i;
  }
  // bands breakdown (first up to 8)
  const bands = min(numSubnets, 8);
  const by = 120, bh = (drawHeight - by - 150) / bands;
  for (let i = 0; i < bands; i++) {
    const net = (parentIp + i * subnetSize) >>> 0;
    drawBand(i, net, subnetSize, np, rx, by + i * bh, rw, bh - 4);
  }
  if (numSubnets > bands) { noStroke(); fill('#607d8b'); textAlign(LEFT, TOP); textSize(12); text('… ' + (numSubnets - bands) + ' more subnets', rx, by + bands * bh); }

  // binary bit split for first subnet
  drawBitSplit(rx, drawHeight - 56, rw, np);

  if (hoverSubnet >= 0) drawSubnetTooltip(hoverSubnet, subnetSize, np);
  drawControlsLabels();
}

function drawBand(i, net, size, np, x, y, w, h) {
  const bcast = (net + size - 1) >>> 0;
  noStroke(); fill(i % 2 ? '#eceff1' : '#fff8e1'); stroke('#cfd8dc'); rect(x, y, w, h, 4);
  noStroke(); fill('#263238'); textAlign(LEFT, CENTER); textSize(12);
  const usable = size >= 2 ? size - 2 : size;
  const firstH = size >= 2 ? intToIp((net + 1) >>> 0) : intToIp(net);
  const lastH = size >= 2 ? intToIp((bcast - 1) >>> 0) : intToIp(bcast);
  fill(RED); text('net ' + intToIp(net) + '/' + np, x + 8, y + h / 2);
  fill('#263238'); text('bcast ' + intToIp(bcast), x + w * 0.30, y + h / 2);
  fill('#1b5e20'); text('hosts ' + firstH + ' – ' + lastH, x + w * 0.55, y + h / 2);
  fill('#37474f'); textAlign(RIGHT, CENTER); text(usable + ' usable', x + w - 8, y + h / 2);
}

function drawBitSplit(x, y, w, np) {
  const bits = 32, bw = w / bits;
  noStroke(); fill('#37474f'); textAlign(LEFT, BOTTOM); textSize(12); text('Bit split (network / host):', x, y - 4);
  for (let i = 0; i < bits; i++) {
    const isNet = i < np;
    fill(isNet ? NETBIT : HOSTBIT); stroke('white'); rect(x + i * bw, y, bw, 22);
    noStroke(); fill(isNet ? 'white' : '#5d4037'); textAlign(CENTER, CENTER); textSize(9); text((parentIp >>> (31 - i)) & 1, x + i * bw + bw / 2, y + 11);
    fill('white');
    if (i === 7 || i === 15 || i === 23) { stroke('#90a4ae'); strokeWeight(1); line(x + (i + 1) * bw, y - 2, x + (i + 1) * bw, y + 24); }
  }
  // slash marker
  stroke(RED); strokeWeight(2); line(x + np * bw, y - 4, x + np * bw, y + 26);
  noStroke(); fill(RED); textAlign(CENTER, BOTTOM); textSize(10); text('/' + np, x + np * bw, y - 4);
}

function drawSubnetTooltip(i, size, np) {
  const net = (parentIp + i * size) >>> 0, bcast = (net + size - 1) >>> 0;
  const w = 230, x = constrain(mouseX + 12, margin, canvasWidth - w - margin), y = 104;
  stroke('#37474f'); fill(255, 255, 255, 248); rect(x, y, w, 60, 6);
  noStroke(); fill('#263238'); textAlign(LEFT, TOP); textSize(11);
  text('Subnet ' + i + ': ' + intToIp(net) + '/' + np, x + 8, y + 6);
  text('first ' + intToIp((net + 1) >>> 0) + '  last ' + intToIp((bcast - 1) >>> 0), x + 8, y + 24);
  text('usable hosts: ' + (size >= 2 ? size - 2 : size), x + 8, y + 42);
}

function drawControlsLabels() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('CIDR:', 10, drawHeight + 20); text('Subnet prefix:', 255, drawHeight + 20);
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
