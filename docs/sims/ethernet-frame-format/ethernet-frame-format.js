// Ethernet Frame Format
// CANVAS_HEIGHT: 480
// Interactive byte-level layout of an Ethernet frame with hoverable field
// annotations and toggles for 802.1Q tag, padding, and jumbo frames.
// Bloom: Remember, Understand.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const PURPLE = '#4a148c';
let addTag = false, showPad = false, jumbo = false;
let tagButton, padButton, jumboButton;
let hoverField = -1;

function fields() {
  const f = [
    { name: 'Preamble', bytes: 7, color: '#cfd8dc', val: '0x55 ×7', desc: 'Seven bytes of alternating 1010… that let the receiver synchronize its clock to the incoming bit stream.', ref: 'IEEE 802.3 §3.2.1' },
    { name: 'SFD', bytes: 1, color: '#90a4ae', val: '0xD5', desc: 'Start Frame Delimiter (10101011). Its final two 1-bits mark the end of the preamble and the start of the frame.', ref: 'IEEE 802.3 §3.2.2' },
    { name: 'Dest MAC', bytes: 6, color: '#F5A623', val: 'ff:ff:ff:ff:ff:ff', desc: 'Destination hardware address. May be a unicast, multicast, or the all-ones broadcast address.', ref: 'IEEE 802.3 §3.2.3' },
    { name: 'Src MAC', bytes: 6, color: '#F5A623', val: 'f0:18:98:01:23:45', desc: 'Source hardware address — the MAC of the sending interface (always unicast).', ref: 'IEEE 802.3 §3.2.3' }
  ];
  if (addTag) f.push({ name: '802.1Q Tag', bytes: 4, color: '#6a1b9a', val: '0x8100 + VID', desc: 'Optional VLAN tag: 0x8100 TPID plus priority and a 12-bit VLAN ID. Inserted between Source MAC and EtherType.', ref: 'IEEE 802.1Q' });
  f.push({ name: 'EtherType', bytes: 2, color: '#2e7d32', val: '0x0800 (IPv4)', desc: 'Indicates the upper-layer protocol (0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP). Values below 0x0600 mean length instead.', ref: 'IEEE 802.3 §3.2.6' });
  f.push({ name: 'Payload', bytes: jumbo ? 9000 : 1500, minB: 46, color: '#90caf9', variable: true, val: jumbo ? '46–9000 B' : '46–1500 B', desc: 'The encapsulated upper-layer data. Minimum 46 bytes (padded if shorter); standard maximum 1500 (MTU).', ref: 'IEEE 802.3 §3.2.7' });
  f.push({ name: 'FCS', bytes: 4, color: '#5D4037', val: 'CRC-32', desc: 'Frame Check Sequence: a CRC-32 over the frame so the receiver can detect transmission errors.', ref: 'IEEE 802.3 §3.2.8' });
  return f;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  tagButton = createButton('Add 802.1Q tag'); tagButton.position(10, drawHeight + 10);
  tagButton.mousePressed(() => { addTag = !addTag; tagButton.html(addTag ? 'Remove 802.1Q tag' : 'Add 802.1Q tag'); });
  padButton = createButton('Show pad bytes'); padButton.position(150, drawHeight + 10);
  padButton.mousePressed(() => { showPad = !showPad; padButton.html(showPad ? 'Hide pad bytes' : 'Show pad bytes'); });
  jumboButton = createButton('Jumbo frame'); jumboButton.position(280, drawHeight + 10);
  jumboButton.mousePressed(() => { jumbo = !jumbo; jumboButton.html(jumbo ? 'Standard frame' : 'Jumbo frame'); });
  describe('A color-coded byte-level diagram of an Ethernet frame: preamble, ' +
    'SFD, destination and source MAC, optional VLAN tag, EtherType, payload, ' +
    'and FCS, with hover annotations for each field.', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Ethernet Frame Format', canvasWidth / 2, 8);

  const F = fields();
  // width allocation: fixed-byte fields scaled; payload absorbs remainder with a break
  const unit = 7;   // px per byte for fixed fields
  let fixedW = 0; F.forEach(f => { if (!f.variable) fixedW += min(f.bytes * unit, 70); });
  const avail = canvasWidth - 2 * margin;
  const payW = max(120, avail - fixedW - 4 * F.length);
  const y = 130, h = 90;

  let x = margin;
  hoverField = -1;
  for (let i = 0; i < F.length; i++) {
    const f = F[i];
    const w = f.variable ? payW : min(f.bytes * unit, 70);
    const hot = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
    if (hot) hoverField = i;
    // shadow + block
    noStroke(); fill(0, 0, 0, 25); rect(x + 2, y + 3, w, h, 6);
    fill(f.color); stroke(hot ? PURPLE : '#78909c'); strokeWeight(hot ? 2.5 : 1);
    rect(x, y, w, h, 6);
    // label above
    noStroke(); fill('#37474f'); textAlign(CENTER, BOTTOM); textSize(11);
    text(f.name, x + w / 2, y - 14, w + 30, 14);
    textSize(10); fill('#90a4ae'); text(f.variable ? f.val : f.bytes + ' B', x + w / 2, y - 2);
    // value inside
    noStroke(); fill(f.color === '#90caf9' || f.color === '#F5A623' || f.color === '#cfd8dc' ? '#263238' : 'white');
    textAlign(CENTER, CENTER); textSize(9);
    if (f.variable) {
      text('payload\n' + f.val, x + w / 2, y + h / 2);
      // break marks
      stroke('#37474f'); strokeWeight(1.5); line(x + w * 0.5 - 6, y, x + w * 0.5 - 2, y + 10); line(x + w * 0.5 + 2, y + h - 10, x + w * 0.5 + 6, y + h);
      if (showPad) { noStroke(); fill('#e53935'); textSize(8); text('(pad to 46 B if short)', x + w / 2, y + h - 10); }
    } else text(f.val, x + w / 2, y + h / 2, w - 4, h);
    x += w + 4;
  }

  // byte ruler note
  noStroke(); fill('#546e7a'); textFont('monospace'); textAlign(LEFT, TOP); textSize(11);
  text('Byte offsets 0 .. ' + (jumbo ? '9021' : '1521') + (addTag ? '  (+4 with VLAN tag)' : ''), margin, 250);
  textFont('Arial');

  if (hoverField >= 0) drawCallout(F[hoverField]);

  noStroke(); fill('#455a64'); textAlign(LEFT, CENTER); textSize(12);
  text('Hover a field for details.', 410, drawHeight + 25);
}

function drawCallout(f) {
  const w = 320;
  const x = constrain(mouseX + 12, margin, canvasWidth - w - margin);
  const y = constrain(mouseY + 12, 40, drawHeight - 110);
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 248); rect(x, y, w, 96, 8);
  noStroke(); fill(PURPLE); textAlign(LEFT, TOP); textSize(13); text(f.name + '  (' + (f.variable ? f.val : f.bytes + ' bytes') + ')', x + 10, y + 8);
  fill('#263238'); textSize(11); wrapText(f.desc, x + 10, y + 28, w - 20, 14);
  fill('#607d8b'); textSize(10); text(f.ref, x + 10, y + 80);
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' '); let line = '';
  for (const word of words) { const t = line ? line + ' ' + word : word; if (textWidth(t) > w && line) { text(line, x, y); y += lh; line = word; } else line = t; }
  if (line) text(line, x, y); return y;
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
