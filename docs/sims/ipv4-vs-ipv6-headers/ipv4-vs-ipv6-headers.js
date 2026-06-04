// IPv4 vs. IPv6 Header Comparison
// CANVAS_HEIGHT: 580
// Side-by-side bit-grid of the IPv4 (20-byte) and IPv6 (40-byte) fixed headers
// with hover annotations, example values, and removed/new field markers.
// Bloom: Remember, Understand.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 540;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const A = '#F5A623', B = '#1976D2', PURPLE = '#4a148c';
let showValues = false, showRuler = false;
let valBtn, rulerBtn;
let hoverCell = null;

// IPv4 rows: each row = array of {name, bits, tag, ex, purpose, rfc}
const ipv4 = [
  [{ n: 'Version', b: 4, ex: '4', p: 'IP version number (4).', r: 'RFC 791' },
   { n: 'IHL', b: 4, tag: 'removed', ex: '5', p: 'Header length in 32-bit words. Removed in IPv6 (fixed-size header).', r: 'RFC 791' },
   { n: 'DSCP/ECN', b: 8, ex: '0', p: 'Differentiated services + congestion notification.', r: 'RFC 2474' },
   { n: 'Total Length', b: 16, ex: '4000', p: 'Total bytes of header + data.', r: 'RFC 791' }],
  [{ n: 'Identification', b: 16, tag: 'removed', ex: '0x1c46', p: 'Fragment group ID. Removed in IPv6 — no in-transit fragmentation.', r: 'RFC 791' },
   { n: 'Flags', b: 3, tag: 'removed', ex: 'DF', p: 'Fragmentation flags (DF/MF). Removed in IPv6.', r: 'RFC 791' },
   { n: 'Fragment Offset', b: 13, tag: 'removed', ex: '0', p: 'Position of this fragment. Removed in IPv6.', r: 'RFC 791' }],
  [{ n: 'TTL', b: 8, ex: '64', p: 'Time to live — hop count limit.', r: 'RFC 791' },
   { n: 'Protocol', b: 8, ex: '6 (TCP)', p: 'Upper-layer protocol number.', r: 'RFC 790' },
   { n: 'Header Checksum', b: 16, tag: 'removed', ex: '0x...', p: 'Header-only checksum. Removed in IPv6 (lower layers + L4 cover it).', r: 'RFC 791' }],
  [{ n: 'Source Address', b: 32, ex: '198.51.100.10', p: '32-bit IPv4 source address.', r: 'RFC 791' }],
  [{ n: 'Destination Address', b: 32, ex: '203.0.113.5', p: '32-bit IPv4 destination address.', r: 'RFC 791' }]
];
const ipv6 = [
  [{ n: 'Version', b: 4, ex: '6', p: 'IP version number (6).', r: 'RFC 8200' },
   { n: 'Traffic Class', b: 8, ex: '0', p: 'DSCP + ECN, as in IPv4.', r: 'RFC 8200' },
   { n: 'Flow Label', b: 20, tag: 'new', ex: '0x0', p: 'New in IPv6: labels a flow for QoS/ECMP handling.', r: 'RFC 6437' }],
  [{ n: 'Payload Length', b: 16, ex: '3980', p: 'Length of data after the fixed header.', r: 'RFC 8200' },
   { n: 'Next Header', b: 8, ex: '6 (TCP)', p: 'Type of the next header (like Protocol, also chains extension headers).', r: 'RFC 8200' },
   { n: 'Hop Limit', b: 8, ex: '64', p: 'Hop count limit (renamed TTL).', r: 'RFC 8200' }],
  [{ n: 'Source Address (128 bits)', b: 32, ex: '2001:db8::10', p: '128-bit IPv6 source address (shown over 4 rows).', r: 'RFC 8200' }],
  [{ n: 'Source Address (cont.)', b: 32, ex: '', p: '128-bit IPv6 source address.', r: 'RFC 8200' }],
  [{ n: 'Destination Address (128 bits)', b: 32, ex: '2001:db8::5', p: '128-bit IPv6 destination address (shown over 4 rows).', r: 'RFC 8200' }],
  [{ n: 'Destination Address (cont.)', b: 32, ex: '', p: '128-bit IPv6 destination address.', r: 'RFC 8200' }]
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  valBtn = createButton('Show example values'); valBtn.position(10, drawHeight + 8); valBtn.mousePressed(() => { showValues = !showValues; valBtn.html(showValues ? 'Hide example values' : 'Show example values'); });
  rulerBtn = createButton('Show byte ruler'); rulerBtn.position(180, drawHeight + 8); rulerBtn.mousePressed(() => { showRuler = !showRuler; rulerBtn.html(showRuler ? 'Hide byte ruler' : 'Show byte ruler'); });
  describe('A bit-grid comparison of the IPv4 and IPv6 fixed headers showing ' +
    'which fields were removed in IPv6 (IHL, Identification, Flags, Fragment ' +
    'Offset, Header Checksum) and which are new (Flow Label).', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(19);
  text('IPv4 vs. IPv6 Header Comparison', canvasWidth / 2, 4);

  hoverCell = null;
  const gw = canvasWidth - 2 * margin;
  drawHeader('IPv4 — 20-byte fixed header', ipv4, margin, 34, gw, A, 20);
  drawHeader('IPv6 — 40-byte fixed header', ipv6, margin, 250, gw, B, 22);

  if (hoverCell) drawCallout(hoverCell);

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Striped = removed in IPv6.  Green border = new in IPv6.  Hover a field for details.', 360, drawHeight + 20);
}

function drawHeader(title, rows, x, y, gw, base, rowH) {
  noStroke(); fill('#37474f'); textAlign(LEFT, BOTTOM); textSize(13); text(title, x, y - 2);
  let cy = y;
  for (const row of rows) {
    let cx = x;
    for (const cell of row) {
      const w = (cell.b / 32) * gw;
      const hot = mouseX >= cx && mouseX <= cx + w && mouseY >= cy && mouseY <= cy + rowH;
      if (hot) hoverCell = cell;
      // fill
      noStroke();
      if (cell.tag === 'removed') { fill('#b0bec5'); rect(cx, cy, w, rowH); drawStripes(cx, cy, w, rowH); }
      else fill(base), rect(cx, cy, w, rowH);
      // border
      noFill(); stroke(cell.tag === 'new' ? '#43a047' : (hot ? PURPLE : 'white')); strokeWeight(cell.tag === 'new' ? 3 : (hot ? 2.5 : 1));
      rect(cx, cy, w, rowH);
      // label
      noStroke(); fill(cell.tag === 'removed' ? '#37474f' : (base === A ? '#3e2723' : 'white'));
      textAlign(CENTER, CENTER); textSize(w < 70 ? 9 : 11);
      const lbl = showValues && cell.ex ? cell.ex : cell.n + ' (' + cell.b + ')';
      text(lbl, cx + w / 2, cy + rowH / 2, w - 2, rowH);
      cx += w;
    }
    if (showRuler) { noStroke(); fill('#90a4ae'); textAlign(LEFT, TOP); textSize(8); text('32 bits', x, cy + rowH + 1); }
    cy += rowH + (showRuler ? 11 : 2);
  }
}

function drawStripes(x, y, w, h) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();
  stroke('#90a4ae'); strokeWeight(1);
  for (let i = -h; i < w; i += 7) line(x + i, y + h, x + i + h, y);
  drawingContext.restore();
}

function drawCallout(cell) {
  const w = 300;
  const x = constrain(mouseX + 12, margin, canvasWidth - w - margin);
  const y = constrain(mouseY + 12, 30, drawHeight - 96);
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 248); rect(x, y, w, 86, 8);
  noStroke(); fill(PURPLE); textAlign(LEFT, TOP); textSize(13);
  text(cell.n + '  (' + cell.b + ' bits)' + (cell.tag === 'removed' ? '  — removed in IPv6' : cell.tag === 'new' ? '  — new in IPv6' : ''), x + 10, y + 8, w - 20, 30);
  fill('#263238'); textSize(11); wrapText(cell.p, x + 10, y + 36, w - 20, 14);
  fill('#607d8b'); textSize(10); text(cell.r + (cell.ex ? '   e.g. ' + cell.ex : ''), x + 10, y + 70);
}
function wrapText(s, x, y, w, lh) { const words = s.split(' '); let line = ''; for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (textWidth(t) > w && line) { text(line, x, y); y += lh; line = wd; } else line = t; } if (line) text(line, x, y); return y; }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
