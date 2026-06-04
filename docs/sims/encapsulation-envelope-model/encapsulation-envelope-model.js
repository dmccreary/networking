// The Nesting Envelope Model
// CANVAS_HEIGHT: 490
// Encapsulation shown as concentric rectangles, one per layer, with a legend
// and a per-layer header-byte ruler. A TCP/UDP toggle changes the transport
// layer. Bloom levels: Remember and Understand.

let containerWidth;
let canvasWidth = 800;
let drawHeight = 440;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

let useUDP = false;
let transportButton;
let hoverLayer = -1;     // 0=Ethernet 1=IP 2=Transport 3=HTTP

// Layer rectangles, outermost (0) to innermost (3).
function layerData() {
  const transport = useUDP
    ? { name: 'UDP Datagram', tab: 'UDP', border: '#6a1b9a', bytes: 8,
        fields: ['Src Port', 'Dst Port', 'Length', 'Checksum'] }
    : { name: 'TCP Segment', tab: 'TCP', border: '#1976D2', bytes: 20,
        fields: ['Src Port', 'Dst Port', 'Seq', 'Ack', 'Flags', 'Window'] };
  return [
    { name: 'Ethernet Frame', border: '#5D4037', tab: 'Eth Hdr', trailer: 'FCS',
      bytes: 14, trailerBytes: 4,
      fields: ['Dst MAC', 'Src MAC', 'EtherType', 'FCS = CRC-32'] },
    { name: 'IP Packet', border: '#2e7d32', tab: 'IP Hdr', bytes: 20,
      fields: ['Version', 'TTL', 'Protocol', 'Src IP', 'Dst IP'] },
    transport,
    { name: 'HTTP Message', border: '#c77f12', fill: '#F5A623', bytes: 0,
      fields: ['Request line', 'Headers', 'Body'] }
  ];
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  transportButton = createButton('Switch to UDP');
  transportButton.position(10, drawHeight + 10);
  transportButton.mousePressed(toggleTransport);

  describe('Encapsulation drawn as four concentric rectangles: an Ethernet ' +
    'frame containing an IP packet containing a TCP segment containing an ' +
    'HTTP message, with a legend and a header-byte ruler.', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  const L = layerData();

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(20);
  text('Encapsulation: The Nesting Envelope Model', canvasWidth / 2, 8);

  const legendW = min(190, canvasWidth * 0.30);
  drawLegend(L, legendW);

  // Concentric rectangle area (right of legend, above ruler)
  const ax = legendW + 14;
  const ay = 44;
  const aw = canvasWidth - ax - margin;
  const ah = drawHeight - ay - 84;     // leave room for ruler

  hoverLayer = -1;
  const inset = Math.min(30, ah / 9);
  for (let i = 0; i < L.length; i++) {
    const x = ax + i * inset * 1.4;
    const y = ay + i * inset;
    const w = aw - i * inset * 2.8;
    const h = ah - i * inset * 2;
    drawLayerRect(L, i, x, y, w, h);
  }

  // Byte ruler below
  drawByteRuler(L, ax, drawHeight - 36, aw);

  // Tooltip
  if (hoverLayer >= 0) drawTooltip(L[hoverLayer]);

  noStroke(); fill('#455a64');
  textAlign(LEFT, CENTER); textSize(14);
  text('Transport: ' + (useUDP ? 'UDP (8-byte header)' : 'TCP (20-byte header)'),
       150, drawHeight + 25);
}

function drawLayerRect(L, i, x, y, w, h) {
  const d = L[i];
  const isInner = (i === L.length - 1);
  // hover test on the border band (within ~10px of edge), or whole inner rect
  if (overBorder(x, y, w, h, isInner)) hoverLayer = i;

  if (d.fill) { fill(d.fill); } else { noFill(); }
  stroke(d.border);
  strokeWeight(hoverLayer === i ? 4 : 2);
  rect(x, y, w, h, 6);

  noStroke();
  // layer name top-center inside its own band
  fill(d.border);
  textAlign(CENTER, TOP); textSize(13);
  if (!isInner) text(d.name, x + w / 2, y + 5);

  // header tab (left)
  if (d.tab) {
    fill(d.border);
    rect(x + 6, y + h / 2 - 11, 52, 22, 3);
    fill('white'); textSize(11); textAlign(CENTER, CENTER);
    text(d.tab, x + 32, y + h / 2);
  }
  // trailer tab (right) for Ethernet
  if (d.trailer) {
    fill(d.border);
    rect(x + w - 58, y + h / 2 - 11, 52, 22, 3);
    fill('white'); textSize(11); textAlign(CENTER, CENTER);
    text(d.trailer, x + w - 32, y + h / 2);
  }
  // innermost payload
  if (isInner) {
    fill('#3e2723'); textAlign(CENTER, CENTER); textSize(13);
    text('Application Payload', x + w / 2, y + h / 2 - 12);
    textFont('monospace'); textSize(12);
    text('GET /index.html HTTP/1.1', x + w / 2, y + h / 2 + 8);
    textFont('Arial');
  }
}

function overBorder(x, y, w, h, isInner) {
  if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) return false;
  if (isInner) return true;
  // near the border ring (within 14px) but not deep inside
  const nearLeft = mouseX < x + 16, nearRight = mouseX > x + w - 16;
  const nearTop = mouseY < y + 22, nearBottom = mouseY > y + h - 16;
  return nearLeft || nearRight || nearTop || nearBottom;
}

function drawLegend(L, legendW) {
  const rows = [
    { layer: 'Application', unit: 'message', size: 'variable', i: 3 },
    { layer: 'Transport', unit: useUDP ? 'datagram' : 'segment',
      size: useUDP ? '8-byte UDP header' : '20-byte TCP header', i: 2 },
    { layer: 'Network', unit: 'packet', size: '20-byte IPv4 header', i: 1 },
    { layer: 'Link', unit: 'frame', size: '14-byte Ethernet + 4-byte FCS', i: 0 }
  ];
  noStroke(); fill('black');
  textAlign(LEFT, TOP); textSize(14);
  text('Layer / Data Unit / Header', margin, 46);
  let y = 70;
  for (const r of rows) {
    const hot = hoverLayer === r.i;
    if (hot) { fill(255, 245, 220); rect(margin - 4, y - 3, legendW, 46, 4); }
    fill(L[r.i].border); rect(margin, y, 8, 38, 2);
    fill('black'); textSize(13); textAlign(LEFT, TOP);
    text(r.layer + ' — ' + r.unit, margin + 14, y);
    fill('#546e7a'); textSize(11);
    text(r.size, margin + 14, y + 18, legendW - 18, 24);
    y += 50;
  }
}

function drawByteRuler(L, x, y, w) {
  // running total of header bytes: Eth 14 + IP 20 + Transport(20/8) + FCS 4
  const segs = [
    { label: 'Eth 14', bytes: 14, color: '#5D4037' },
    { label: 'IP 20', bytes: 20, color: '#2e7d32' },
    { label: useUDP ? 'UDP 8' : 'TCP 20', bytes: useUDP ? 8 : 20,
      color: useUDP ? '#6a1b9a' : '#1976D2' },
    { label: 'FCS 4', bytes: 4, color: '#8d6e63' }
  ];
  const total = segs.reduce((s, e) => s + e.bytes, 0);
  noStroke(); fill('black'); textAlign(LEFT, BOTTOM); textSize(12);
  text('Header overhead: ' + total + ' bytes', x, y - 4);
  let cx = x;
  const barW = w;
  for (const s of segs) {
    const sw = (s.bytes / total) * barW;
    fill(s.color); rect(cx, y, sw, 22);
    fill('white'); textAlign(CENTER, CENTER); textSize(11);
    if (sw > 34) text(s.label, cx + sw / 2, y + 11);
    cx += sw;
  }
}

function drawTooltip(d) {
  const lines = d.fields;
  const w = 220;
  const x = constrain(mouseX + 12, margin, canvasWidth - w - margin);
  const hgt = 26 + lines.length * 16;
  const y = constrain(mouseY + 12, 44, drawHeight - hgt - 40);
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 245);
  rect(x, y, w, hgt, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(13);
  text(d.name + ' fields:', x + 10, y + 7);
  fill('#37474f'); textSize(11);
  for (let i = 0; i < lines.length; i++) text('• ' + lines[i], x + 10, y + 26 + i * 16);
}

function toggleTransport() {
  useUDP = !useUDP;
  transportButton.html(useUDP ? 'Switch to TCP' : 'Switch to UDP');
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
