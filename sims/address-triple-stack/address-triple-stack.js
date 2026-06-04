// The Three Identifiers Across the Protocol Stack
// CANVAS_HEIGHT: 510
// An infographic MicroSim. Three stacked bands map the three lower-layer
// identifiers (port, IP address, MAC address) to the layers they belong to.
// Bloom level: Understand — students explain why three identifiers are used
// together and which question each one answers.

// ---- Responsive canvas globals (required MicroSim pattern) ----
let containerWidth;
let canvasWidth = 800;
let drawHeight = 460;     // three bands + title live here
let controlHeight = 50;   // one row of controls
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// ---- Application state ----
let showIPv6 = false;     // toggled by the button
let ipToggleButton;
let hoverBand = -1;       // which band the mouse is over (-1 = none)

// Band definitions (top to bottom). Brand palette from the book style guide.
const bands = [
  {
    layer: 'Transport Layer',
    idName: 'port number',
    color: '#F5A623',      // honey amber
    question: 'Which application?',
    value: '443',
    second: '80  (HTTP)',
    detail: 'A 16-bit port number (0–65535) names which application or ' +
            'service on a host should receive the data. 443 is HTTPS.'
  },
  {
    layer: 'Network Layer',
    idName: 'IP address',
    color: '#1976D2',      // signal blue
    question: 'Which host on the Internet?',
    value: '192.0.2.10',   // replaced at runtime when showIPv6 is true
    second: '10.0.0.5',
    detail: 'An IP address identifies a host interface anywhere on the ' +
            'Internet, so routers can forward packets toward it.'
  },
  {
    layer: 'Link Layer',
    idName: 'MAC address',
    color: '#5D4037',      // deep hive brown
    question: 'Which neighbor on this link?',
    value: 'f0:18:98:01:23:45',
    second: '02:42:ac:11:00:02',
    detail: 'A 48-bit MAC address identifies a network interface on the ' +
            'local link. It only has meaning to directly-connected neighbors.'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  ipToggleButton = createButton('Show IPv6 address');
  ipToggleButton.position(10, drawHeight + 10);
  ipToggleButton.mousePressed(toggleIPVersion);

  describe('Infographic of three stacked bands showing the transport-layer ' +
    'port number, the network-layer IP address, and the link-layer MAC ' +
    'address, with a button to switch the IP address between IPv4 and IPv6.',
    LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region background + control region background (required standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Three Identifiers, Three Questions', canvasWidth / 2, 10);

  // Which band is the mouse over?
  hoverBand = -1;
  const bandTop = 48;
  const bandH = (drawHeight - bandTop - margin) / bands.length;
  for (let i = 0; i < bands.length; i++) {
    const y = bandTop + i * bandH;
    if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= y && mouseY < y + bandH) {
      hoverBand = i;
    }
  }

  // Draw the three bands
  for (let i = 0; i < bands.length; i++) {
    drawBand(i, bandTop + i * bandH, bandH);
  }

  // Hover callout (drawn last so it sits on top)
  if (hoverBand >= 0) {
    drawCallout(hoverBand, bandTop + hoverBand * bandH, bandH);
  }

  // Control label
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Network band shows: ' + (showIPv6 ? 'IPv6' : 'IPv4'),
       170, drawHeight + 25);
}

function drawBand(i, y, h) {
  const b = bands[i];
  // Band fill
  noStroke();
  fill(b.color);
  rect(0, y, canvasWidth, h);
  // 1px slate separator between bands
  stroke('#cfd8dc');
  strokeWeight(1);
  line(0, y, canvasWidth, y);

  // Left: white layer label + plain-English question
  noStroke();
  fill('white');
  textAlign(LEFT, TOP);
  textSize(18);
  text(b.layer, margin, y + 14);
  textSize(14);
  text('(' + b.idName + ')', margin, y + 38);
  textSize(16);
  text(b.question, margin, y + h - 30);

  // Right: example value in large monospace
  let val = b.value;
  if (i === 1) val = showIPv6 ? '2001:db8::1' : '192.0.2.10';
  textFont('monospace');
  textSize(26);
  textAlign(RIGHT, CENTER);
  fill('white');
  text(val, canvasWidth - margin, y + h / 2);
  textFont('Arial');
}

function drawCallout(i, y, h) {
  const b = bands[i];
  const cw = min(360, canvasWidth - 2 * margin);
  const cx = canvasWidth / 2 - cw / 2;
  const cy = y + h / 2 - 36;
  noStroke();
  fill(255, 255, 255, 235);
  stroke('#455a64');
  strokeWeight(1);
  rect(cx, cy, cw, 72, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text(b.detail, cx + 12, cy + 10, cw - 24, 44);
  fill('#455a64');
  textSize(13);
  text('Another example: ' + b.second, cx + 12, cy + 52);
}

function toggleIPVersion() {
  showIPv6 = !showIPv6;
  ipToggleButton.html(showIPv6 ? 'Show IPv4 address' : 'Show IPv6 address');
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
