// Encapsulation Walkthrough
// CANVAS_HEIGHT: 600
// Step/Play/Reset animation of an HTTP request being encapsulated down the
// sender stack, traveling across the wire, and being decapsulated up the
// receiver stack. Bloom levels: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 960;
let drawHeight = 505;
let controlHeight = 95;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

// Controls
let stepButton, playButton, resetButton, speedSlider, udpCheckbox, bytesCheckbox;
let sliderLeftMargin = 250;

// State
let step = 0;            // 0..9
let isPlaying = false;
let frameAcc = 0;
let travelProgress = 0;  // 0..1 for the wire-travel step (step 5)
const MAX_STEP = 9;

// Layer bands (amber gradient), top to bottom
const layerNames = ['Application', 'Transport', 'Network', 'Link'];
const layerShades = ['#FBE3B3', '#F8CE7E', '#F5B84A', '#E89A1C'];

let hoverSeg = null;     // segment under the mouse this frame
let segRects = [];       // {x,y,w,h,seg} collected each frame

function seg(t, v, c, b, fields) { return { t, v, c, b, fields }; }
function segHTTP() { return seg('HTTP', 'GET /index.html', '#F5A623', 'var',
  ['Request line: GET /index.html', 'Host, User-Agent headers']); }
function segTCP() { return seg('TCP', 'src 50112 → dst 443', '#1976D2', '20 B',
  ['Src/Dst ports', 'Seq & Ack numbers', 'Flags, Window']); }
function segUDP() { return seg('UDP', 'src 50112 → dst 443', '#6a1b9a', '8 B',
  ['Src/Dst ports', 'Length', 'Checksum']); }
function segIP() { return seg('IP', '192.0.2.10 → 198.51.100.5', '#2e7d32', '20 B',
  ['TTL, Protocol', 'Src/Dst IP address']); }
function segEth() { return seg('Eth', 'MAC → MAC', '#5D4037', '14 B',
  ['Dst MAC, Src MAC', 'EtherType']); }
function segFCS() { return seg('FCS', 'CRC-32', '#8d6e63', '4 B', ['Frame check (CRC-32)']); }

function transportSeg() { return udpCheckbox && udpCheckbox.checked() ? segUDP() : segTCP(); }

// Returns {side, layerIdx, segs, label} for the current step (null = idle)
function currentPDU() {
  const T = transportSeg();
  switch (step) {
    case 1: return { side: 'L', layer: 0, segs: [segHTTP()], note: 'HTTP message created' };
    case 2: return { side: 'L', layer: 1, segs: [T, segHTTP()], note: 'Transport header added → segment' };
    case 3: return { side: 'L', layer: 2, segs: [segIP(), T, segHTTP()], note: 'IP header added → packet' };
    case 4: return { side: 'L', layer: 3, segs: [segEth(), segIP(), T, segHTTP(), segFCS()], note: 'Link header + FCS → frame' };
    case 5: return { side: 'W', layer: 3, segs: [segEth(), segIP(), T, segHTTP(), segFCS()], note: 'Frame travels on the wire' };
    case 6: return { side: 'R', layer: 3, segs: [segIP(), T, segHTTP()], note: 'Link strips Eth + FCS' };
    case 7: return { side: 'R', layer: 2, segs: [T, segHTTP()], note: 'Network strips IP header' };
    case 8: return { side: 'R', layer: 1, segs: [segHTTP()], note: 'Transport strips its header' };
    case 9: return { side: 'R', layer: 0, segs: [segHTTP()], note: 'Delivered to the application' };
    default: return null;
  }
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step ▶');
  stepButton.position(10, drawHeight + 10);
  stepButton.mousePressed(doStep);

  playButton = createButton('Play');
  playButton.position(80, drawHeight + 10);
  playButton.mousePressed(togglePlay);

  resetButton = createButton('Reset');
  resetButton.position(140, drawHeight + 10);
  resetButton.mousePressed(doReset);

  speedSlider = createSlider(0.5, 4, 1, 0.5);
  speedSlider.position(sliderLeftMargin, drawHeight + 12);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  udpCheckbox = createCheckbox(' Use UDP', false);
  udpCheckbox.position(10, drawHeight + 50);

  bytesCheckbox = createCheckbox(' Show byte counts', false);
  bytesCheckbox.position(110, drawHeight + 50);

  describe('Animated walkthrough of encapsulation. A message is wrapped by ' +
    'transport, network, and link headers on the sender, travels across the ' +
    'wire as a frame, and is unwrapped layer by layer at the receiver.', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(20);
  text('Encapsulation Walkthrough', canvasWidth / 2, 6);

  const top = 40;
  const bandH = (drawHeight - top - 24) / 4;
  const thirdW = canvasWidth / 3;

  // Layer bands + column dividers
  for (let i = 0; i < 4; i++) {
    const y = top + i * bandH;
    noStroke(); fill(layerShades[i]); rect(0, y, canvasWidth, bandH);
    stroke('#cfae6a'); strokeWeight(1); line(0, y, canvasWidth, y);
    noStroke(); fill('#5d4037'); textAlign(LEFT, TOP); textSize(12);
    text(layerNames[i], 6, y + 4);
  }
  // Sender / Receiver / Wire headers
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(14);
  text('Sender', thirdW / 2, top + 2);
  text('Receiver', thirdW * 2 + thirdW / 2, top + 2);

  // Wire at the Link band
  const linkY = top + 3 * bandH + bandH / 2;
  stroke('#90a4ae'); strokeWeight(3);
  line(thirdW + 6, linkY, thirdW * 2 - 6, linkY);
  noStroke(); fill('#607d8b'); textAlign(CENTER, BOTTOM); textSize(12);
  text('Communication Link', thirdW * 1.5, linkY - 8);

  // Advance animation
  updateAnimation();

  // Draw current PDU
  segRects = [];
  hoverSeg = null;
  const pdu = currentPDU();
  if (pdu) {
    const colCx = pdu.side === 'L' ? thirdW / 2
      : pdu.side === 'R' ? thirdW * 2.5
      : lerp(thirdW + 6, thirdW * 2 - 6, travelProgress);
    const cy = pdu.side === 'W' ? linkY : top + pdu.layer * bandH + bandH / 2;
    const maxW = (pdu.side === 'W') ? thirdW - 20 : thirdW - 24;
    // highlight active band
    if (pdu.side !== 'W') {
      noStroke(); fill(255, 255, 255, 90);
      const bx = pdu.side === 'L' ? 0 : thirdW * 2;
      rect(bx, top + pdu.layer * bandH, thirdW, bandH);
    }
    drawPDU(colCx, cy, pdu.segs, maxW, pdu.side === 'R' && step === 9);
    if (pdu.side === 'W') drawTwinkle(thirdW + 6, thirdW * 2 - 6, linkY);
  }

  // Tooltip for hovered segment
  if (hoverSeg) drawSegTooltip(hoverSeg);

  // Step indicator + note
  noStroke(); fill('#263238'); textAlign(CENTER, BOTTOM); textSize(14);
  const note = pdu ? pdu.note : 'Press Step or Play to begin';
  text('Step ' + step + ' / ' + MAX_STEP + '  —  ' + note, canvasWidth / 2, drawHeight - 6);

  // Control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(defaultTextSize);
  text('Speed: ' + speedSlider.value() + '×', 200, drawHeight + 20);
}

function updateAnimation() {
  if (!isPlaying) return;
  const sp = speedSlider.value();
  if (step === 0) { step = 1; frameAcc = 0; return; }
  if (step === 5) {
    travelProgress += 0.012 * sp;
    if (travelProgress >= 1) { travelProgress = 1; advance(); }
    return;
  }
  frameAcc += sp;
  if (frameAcc >= 42) { frameAcc = 0; advance(); }
}

function advance() {
  if (step >= MAX_STEP) { isPlaying = false; playButton.html('Play'); return; }
  step++;
  if (step === 5) travelProgress = 0;
}

function drawPDU(cx, cy, segs, maxW, delivered) {
  // base widths
  const baseW = segs.map(s => s.t === 'HTTP' ? 1.6 : (s.t === 'FCS' ? 0.7 : 1.0));
  const unit = constrain(maxW / baseW.reduce((a, b) => a + b, 0), 30, 78);
  const widths = baseW.map(b => b * unit);
  const totalW = widths.reduce((a, b) => a + b, 0);
  const h = 40;
  let x = cx - totalW / 2;
  const y = cy - h / 2;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i], w = widths[i];
    // shadow
    noStroke(); fill(0, 0, 0, 30); rect(x + 2, y + 3, w, h, 4);
    fill(s.c); stroke('white'); strokeWeight(1); rect(x, y, w, h, 4);
    noStroke(); fill(s.t === 'HTTP' ? '#3e2723' : 'white');
    textAlign(CENTER, CENTER); textSize(12);
    text(s.t, x + w / 2, y + (bytesCheckbox && bytesCheckbox.checked() ? h / 2 - 7 : h / 2 - 2));
    if (bytesCheckbox && bytesCheckbox.checked()) {
      textSize(10); text(s.b, x + w / 2, y + h / 2 + 9);
    }
    segRects.push({ x, y, w, h, seg: s });
    if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) hoverSeg = s;
    x += w;
  }
  if (delivered) {
    noStroke(); fill('#1b5e20'); textAlign(CENTER, TOP); textSize(13);
    text('✓ Delivered', cx, y + h + 4);
  }
}

function drawTwinkle(x0, x1, y) {
  noStroke();
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const bx = lerp(x0, x1, t);
    const on = ((frameCount + i * 3) % 14) < 7;
    fill(on ? '#1976D2' : '#bbdefb');
    circle(bx, y + 16, 4);
  }
}

function drawSegTooltip(s) {
  const w = 220;
  const x = constrain(mouseX + 12, margin, canvasWidth - w - margin);
  const hgt = 28 + s.fields.length * 16;
  const y = constrain(mouseY + 12, 40, drawHeight - hgt - 30);
  stroke('#37474f'); strokeWeight(1); fill(255, 255, 255, 245);
  rect(x, y, w, hgt, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(13);
  text(s.t + ' header — ' + s.v, x + 10, y + 7, w - 20, 20);
  fill('#37474f'); textSize(11);
  for (let i = 0; i < s.fields.length; i++) text('• ' + s.fields[i], x + 10, y + 28 + i * 16);
}

function doStep() {
  isPlaying = false; playButton.html('Play');
  if (step >= MAX_STEP) return;
  if (step === 5) { travelProgress = 1; }
  step++;
  if (step === 5) travelProgress = 1;  // manual step shows frame arrived
}

function togglePlay() {
  if (step >= MAX_STEP) doReset();
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
}

function doReset() {
  step = 0; isPlaying = false; frameAcc = 0; travelProgress = 0;
  playButton.html('Play');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
